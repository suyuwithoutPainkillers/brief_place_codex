import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { codeFileStore } from '@/api/codeFileStore';
import { Link } from 'react-router-dom';
import { Trash2, Star, FolderOpen, Search, Filter, Plus } from 'lucide-react';
import MangaPanel from '@/components/manga/MangaPanel';
import LanguageBadge from '@/components/manga/LanguageBadge';
import UploadZone from '@/components/manga/UploadZone';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const LANGS = ['all', 'python', 'javascript', 'typescript', 'c', 'cpp', 'java', 'go', 'rust', 'html', 'css', 'markdown', 'json', 'yaml', 'shell', 'other'];

export default function FileManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['codefiles'],
    queryFn: () => codeFileStore.list('-updated_date', 200),
  });

  const filtered = files.filter(f => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.description?.toLowerCase().includes(search.toLowerCase());
    const matchLang = langFilter === 'all' || f.language === langFilter;
    return matchSearch && matchLang;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scroll from local storage?')) return;

    setDeletingId(id);
    try {
      await codeFileStore.delete(id);
      queryClient.invalidateQueries({ queryKey: ['codefiles'] });
    } finally {
      setDeletingId(null);
    }
  };

  const handleStar = async (file) => {
    await codeFileStore.update(file.id, { is_starred: !file.is_starred });
    queryClient.invalidateQueries({ queryKey: ['codefiles'] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="speech-bubble inline-block px-3 py-1.5 mb-3">
            <span className="font-manga text-sm tracking-widest">Manage your scrolls!</span>
          </div>
          <h1 className="font-manga text-4xl tracking-wider text-ink">FILE MANAGER</h1>
          <p className="font-jp text-sm text-muted-foreground mt-1">Browse and organize all your code files</p>
        </div>
        <button
          onClick={() => setShowUpload(v => !v)}
          className="manga-btn bg-ink text-paper px-4 py-2 text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NEW SCROLL</span>
        </button>
      </div>

      {/* Upload Toggle */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <UploadZone onUploadComplete={() => {
              queryClient.invalidateQueries({ queryKey: ['codefiles'] });
              setShowUpload(false);
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <MangaPanel className="p-4 mb-6" animate={false}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 border-[2px] border-ink px-3 py-2 bg-background">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search scrolls..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent font-jp text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {/* Lang filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {LANGS.map(lang => (
                <button
                  key={lang}
                  onClick={() => setLangFilter(lang)}
                  className={`font-manga text-[10px] tracking-wider px-2 py-1 border border-ink transition-all ${
                    langFilter === lang ? 'bg-ink text-paper' : 'bg-card text-ink hover:bg-secondary'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </MangaPanel>

      {/* Count */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-ink" />
        <span className="font-manga text-sm tracking-wider">
          {filtered.length} SCROLLS
        </span>
        <span className="font-jp text-xs text-muted-foreground">found</span>
      </div>

      {/* File Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 manga-panel bg-secondary animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <MangaPanel className="py-16 text-center">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="font-manga text-xl tracking-widest text-muted-foreground">NO SCROLLS FOUND</p>
          <p className="font-jp text-sm text-muted-foreground mt-1">Try a different search or upload a new file</p>
        </MangaPanel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {filtered.map(file => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <MangaPanel className="p-4 flex flex-col gap-2" animate={false}>
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/viewer/${file.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <LanguageBadge language={file.language} />
                        <span className="font-jp font-bold text-sm truncate">{file.name}</span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => handleStar(file)} className="p-1 hover:bg-secondary transition-colors">
                        <Star className={`w-3.5 h-3.5 ${file.is_starred ? 'fill-ink' : ''} text-ink`} />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        disabled={deletingId === file.id}
                        className="p-1 hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>

                  {file.description && (
                    <p className="font-jp text-xs text-muted-foreground line-clamp-1">{file.description}</p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mt-auto pt-1 border-t border-ink/10">
                    <span>{file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : '—'}</span>
                    <span>
                      {file.updated_date
                        ? formatDistanceToNow(new Date(file.updated_date), { addSuffix: true })
                        : ''}
                    </span>
                  </div>
                </MangaPanel>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
