const DB_NAME = 'brief-place-code-library';
const DB_VERSION = 1;
const STORE_NAME = 'codefiles';

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `file_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const openDb = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('created_date', 'created_date');
      store.createIndex('updated_date', 'updated_date');
      store.createIndex('language', 'language');
      store.createIndex('is_starred', 'is_starred');
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const runStoreRequest = async (mode, action) => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

const compareValues = (a, b) => {
  if (a === b) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  return a > b ? 1 : -1;
};

const sortRecords = (records, sortBy = '-updated_date') => {
  const descending = sortBy.startsWith('-');
  const field = descending ? sortBy.slice(1) : sortBy;

  return [...records].sort((a, b) => {
    const result = compareValues(a[field], b[field]);
    return descending ? -result : result;
  });
};

const matchesQuery = (record, query) => (
  Object.entries(query).every(([key, value]) => record[key] === value)
);

export const codeFileStore = {
  async list(sortBy = '-updated_date', limit = 200) {
    const records = await runStoreRequest('readonly', (store) => store.getAll());
    return sortRecords(records, sortBy).slice(0, limit);
  },

  async filter(query = {}, sortBy = '-updated_date', limit = 200) {
    const records = await runStoreRequest('readonly', (store) => store.getAll());
    return sortRecords(records.filter((record) => matchesQuery(record, query)), sortBy).slice(0, limit);
  },

  async get(id) {
    return runStoreRequest('readonly', (store) => store.get(id));
  },

  async create(payload) {
    const now = new Date().toISOString();
    const record = {
      id: createId(),
      folder: 'root',
      description: '',
      tags: [],
      is_starred: false,
      created_date: now,
      updated_date: now,
      ...payload,
    };

    await runStoreRequest('readwrite', (store) => store.add(record));
    return record;
  },

  async update(id, patch) {
    const existing = await this.get(id);
    if (!existing) {
      throw new Error(`Code file not found: ${id}`);
    }

    const updated = {
      ...existing,
      ...patch,
      updated_date: new Date().toISOString(),
    };

    await runStoreRequest('readwrite', (store) => store.put(updated));
    return updated;
  },

  async delete(id) {
    await runStoreRequest('readwrite', (store) => store.delete(id));
  },

  createDownloadUrl(file) {
    if (!file?.blob) return null;
    return URL.createObjectURL(file.blob);
  },
};
