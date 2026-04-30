import { Link } from 'react-router-dom';
import { Star, FileCode, Clock } from 'lucide-react';
import LanguageBadge from './LanguageBadge';
import { formatDistanceToNow } from 'date-fns';
import { codeFileStore } from '@/api/codeFileStore';

export default function FileCard({ file, onStarToggle }) {
  const timeAgo = file.updated_date
    ? formatDistanceToNow(new Date(file.updated_date), { addSuffix: true })
    : '';

  const handleStar = async (e) => {
    e.preventDefault();
    await codeFileStore.update(file.id, { is_starred: !file.is_starred });
    onStarToggle?.();
  };

  return (
    <Link to={`/viewer/${file.id}`}>
      <div className="manga-panel bg-card p-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_hsl(var(--ink))] transition-all duration-150 group cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-ink flex-shrink-0" />
            <span className="font-jp font-bold text-sm text-ink truncate max-w-[140px]">{file.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LanguageBadge language={file.language} />
            <button
              onClick={handleStar}
              className="text-ink opacity-30 hover:opacity-100 transition-opacity"
            >
              <Star className={`w-3.5 h-3.5 ${file.is_starred ? 'fill-ink opacity-100' : ''}`} />
            </button>
          </div>
        </div>

        {file.description && (
          <p className="text-xs text-muted-foreground font-jp mb-2 line-clamp-2">{file.description}</p>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-ink/10">
          <div className="flex gap-1 flex-wrap">
            {file.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] font-manga tracking-wider bg-secondary border border-ink/30 px-1">
                #{tag}
              </span>
            ))}
          </div>
          {timeAgo && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              <span className="font-mono">{timeAgo}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
