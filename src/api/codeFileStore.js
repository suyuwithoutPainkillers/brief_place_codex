import { requireSupabase } from '@/api/supabaseClient';

const BUCKET_NAME = 'code-files';

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `file_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const sanitizeFileName = (name) => (
  name
    .replace(/[\\/:*?"<>|#%{}^[\]`]/g, '-')
    .replace(/\s+/g, '_')
    .slice(0, 160) || 'code-file'
);

const parseSort = (sortBy = '-updated_date') => {
  const descending = sortBy.startsWith('-');
  return {
    ascending: !descending,
    field: descending ? sortBy.slice(1) : sortBy,
  };
};

const getCurrentUser = async (client) => {
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  if (!data.user) {
    throw new Error('You must be signed in to use cloud storage.');
  }
  return data.user;
};

const cleanPatch = (patch) => {
  const blocked = new Set(['blob', 'file_url', 'created_date', 'id', 'storage_path', 'user_id']);
  return Object.fromEntries(
    Object.entries(patch).filter(([key]) => !blocked.has(key))
  );
};

const runQuery = async (query) => {
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const codeFileStore = {
  async list(sortBy = '-updated_date', limit = 200) {
    const client = requireSupabase();
    const { field, ascending } = parseSort(sortBy);

    return runQuery(
      client
        .from('code_files')
        .select('*')
        .order(field, { ascending })
        .limit(limit)
    );
  },

  async filter(query = {}, sortBy = '-updated_date', limit = 200) {
    const client = requireSupabase();
    const { field, ascending } = parseSort(sortBy);

    let request = client
      .from('code_files')
      .select('*')
      .order(field, { ascending })
      .limit(limit);

    Object.entries(query).forEach(([key, value]) => {
      request = request.eq(key, value);
    });

    return runQuery(request);
  },

  async get(id) {
    const client = requireSupabase();
    return runQuery(
      client
        .from('code_files')
        .select('*')
        .eq('id', id)
        .maybeSingle()
    );
  },

  async create(payload) {
    const client = requireSupabase();
    const user = await getCurrentUser(client);
    const id = createId();
    const storagePath = payload.blob
      ? `${user.id}/${id}/${sanitizeFileName(payload.name)}`
      : null;

    if (payload.blob) {
      const { error: uploadError } = await client.storage
        .from(BUCKET_NAME)
        .upload(storagePath, payload.blob, {
          contentType: payload.file_type || payload.blob.type || 'application/octet-stream',
          upsert: false,
        });

      if (uploadError) throw uploadError;
    }

    const record = {
      id,
      user_id: user.id,
      name: payload.name,
      language: payload.language || 'other',
      content: payload.content || '',
      storage_path: storagePath,
      file_size: payload.file_size || 0,
      file_type: payload.file_type || payload.blob?.type || '',
      folder: payload.folder || 'root',
      description: payload.description || '',
      tags: payload.tags || [],
      is_starred: Boolean(payload.is_starred),
    };

    return runQuery(
      client
        .from('code_files')
        .insert(record)
        .select('*')
        .single()
    );
  },

  async update(id, patch) {
    const client = requireSupabase();

    return runQuery(
      client
        .from('code_files')
        .update(cleanPatch(patch))
        .eq('id', id)
        .select('*')
        .single()
    );
  },

  async delete(id) {
    const client = requireSupabase();
    const file = await this.get(id);

    if (file?.storage_path) {
      const { error: storageError } = await client.storage
        .from(BUCKET_NAME)
        .remove([file.storage_path]);

      if (storageError) throw storageError;
    }

    const { error } = await client
      .from('code_files')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async createDownloadUrl(file) {
    if (!file?.storage_path) return '';

    const client = requireSupabase();
    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .createSignedUrl(file.storage_path, 60 * 60);

    if (error) throw error;
    return data.signedUrl;
  },
};
