import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { codeFileStore } from '@/api/codeFileStore';
import { ArrowLeft, Download, Star, Copy, Check, Edit2, Save, X } from 'lucide-react';
import MangaPanel from '@/components/manga/MangaPanel';
import LanguageBadge from '@/components/manga/LanguageBadge';
import { formatDistanceToNow } from 'date-fns';

export default function CodeViewer() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const { data: file, isLoading } = useQuery({
    queryKey: ['codefile', id],
    queryFn: () => codeFileStore.get(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!file?.blob) {
      setDownloadUrl('');
      return undefined;
    }

    const url = codeFileStore.createDownloadUrl(file);
    setDownloadUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleCopy = () => {
    if (file?.content) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStar = async () => {
    await codeFileStore.update(id, { is_starred: !file.is_starred });
    queryClient.invalidateQueries({ queryKey: ['codefile', id] });
    queryClient.invalidateQueries({ queryKey: ['codefiles'] });
  };

  const handleSaveDesc = async () => {
    await codeFileStore.update(id, { description: editDesc });
    queryClient.invalidateQueries({ queryKey: ['codefile', id] });
    setEditing(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="manga-panel h-96 bg-secondary animate-pulse" />
      </div>
    );
  }

  if (!file) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <MangaPanel className="py-16">
          <p className="font-manga text-3xl tracking-widest text-muted-foreground">404 — SCROLL NOT FOUND</p>

          <Link to="/" className="inline-block mt-4 manga-btn bg-ink text-paper px-4 py-2 text-sm font-manga tracking-wider">
            GO BACK
          </Link>
        </MangaPanel>
      </div>
    );
  }

  const lines = (file.content || '').split('\n');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/files" className="flex items-center gap-1.5 font-manga text-sm tracking-wider text-muted-foreground hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" />
          FILES
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-jp text-sm text-ink">{file.name}</span>
      </div>

      {/* File Header */}
      <MangaPanel className="p-5 mb-4 relative overflow-hidden">
        <div className="absolute inset-0 speed-lines pointer-events-none opacity-50" />
        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <LanguageBadge language={file.language} size="lg" />
              <h1 className="font-jp font-bold text-xl text-ink">{file.name}</h1>
            </div>

            {editing ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  autoFocus
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="flex-1 border-b-2 border-ink bg-transparent font-jp text-sm outline-none py-1"
                  placeholder="Add description..."
                />
                <button onClick={handleSaveDesc} className="p-1 hover:bg-secondary">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => setEditing(false)} className="p-1 hover:bg-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => { setEditDesc(file.description || ''); setEditing(true); }}
              >
                <p className="font-jp text-sm text-muted-foreground">
                  {file.description || <span className="italic opacity-50">Add description...</span>}
                </p>
                <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
              </div>
            )}

            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground font-mono">
              {file.file_size && <span>{(file.file_size / 1024).toFixed(1)} KB</span>}
              <span>·</span>
              <span>{lines.length} lines</span>
              {file.updated_date && (
                <>
                  <span>·</span>
                  <span>{formatDistanceToNow(new Date(file.updated_date), { addSuffix: true })}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleStar}
              className="manga-btn bg-card px-3 py-2 flex items-center gap-1.5 text-xs"
            >
              <Star className={`w-3.5 h-3.5 ${file.is_starred ? 'fill-ink' : ''}`} />
              <span className="font-manga tracking-wider">{file.is_starred ? 'STARRED' : 'STAR'}</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={!file.content}
              className="manga-btn bg-ink text-paper px-3 py-2 flex items-center gap-1.5 text-xs disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="font-manga tracking-wider">{copied ? 'COPIED!' : 'COPY'}</span>
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={file.name}
                className="manga-btn bg-card px-3 py-2 flex items-center gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="font-manga tracking-wider">DL</span>
              </a>
            )}
          </div>
        </div>
      </MangaPanel>

      {/* Code Panel */}
      {file.content ? (
        <MangaPanel className="overflow-hidden">
          {/* Code toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b-[2px] border-ink bg-secondary">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ink" />
              <div className="w-2 h-2 bg-ink opacity-40" />
              <div className="w-2 h-2 bg-ink opacity-20" />
            </div>
            <div className="speech-bubble px-3 py-1">
              <span className="font-manga text-xs tracking-widest">SOURCE CODE</span>
            </div>
            <span className="font-manga text-xs tracking-wider text-muted-foreground">{file.language?.toUpperCase()}</span>
          </div>

          {/* Lines */}
          <div className="overflow-auto max-h-[65vh] bg-card">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-secondary/50 group transition-colors">
                    <td className="select-none text-right pr-4 pl-3 py-0.5 text-[11px] font-mono text-muted-foreground border-r-[2px] border-ink/10 w-12 min-w-[3rem] align-top">
                      {idx + 1}
                    </td>
                    <td className="pl-4 pr-4 py-0.5 font-mono-code text-sm text-ink whitespace-pre align-top">
                      {line || ' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MangaPanel>
      ) : (
        <MangaPanel className="py-12 text-center">
          <div className="speech-bubble inline-block px-4 py-2 mb-3">
            <span className="font-manga text-sm tracking-widest">BINARY OR LARGE FILE</span>
          </div>
          <p className="font-jp text-sm text-muted-foreground">This file cannot be previewed — download to view</p>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={file.name}
              className="inline-flex items-center gap-2 mt-4 manga-btn bg-ink text-paper px-4 py-2 text-sm font-manga tracking-wider"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD FILE
            </a>
          )}
        </MangaPanel>
      )}

      {/* Tags */}
      {file.tags?.length > 0 && (
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {file.tags.map(tag => (
            <span key={tag} className="font-manga text-xs tracking-wider ink-border-sm px-2 py-0.5 bg-card">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
