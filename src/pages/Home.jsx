import { codeFileStore } from '@/api/codeFileStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UploadZone from '@/components/manga/UploadZone';
import FileCard from '@/components/manga/FileCard';
import MangaPanel from '@/components/manga/MangaPanel';
import { Star, Clock, Zap, TrendingUp } from 'lucide-react';

export default function Home() {
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['codefiles'],
    queryFn: () => codeFileStore.list('-updated_date', 50),
  });

  const starredFiles = files.filter(f => f.is_starred);
  const recentFiles = files.slice(0, 8);

  const langStats = files.reduce((acc, f) => {
    acc[f.language] = (acc[f.language] || 0) + 1;
    return acc;
  }, {});
  const topLangs = Object.entries(langStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Title Panel */}
        <div className="lg:col-span-2">
          <MangaPanel className="p-6 relative overflow-hidden min-h-[160px]">
            <div className="absolute inset-0 speed-lines pointer-events-none" />
            <div className="relative z-10">
              <div className="speech-bubble inline-block px-4 py-2 mb-4">
                <span className="font-manga text-sm tracking-widest">Upload a new scroll!</span>
              </div>
              <h1 className="font-manga text-5xl md:text-6xl tracking-wider text-ink leading-none mb-2">
                BRIEF<br /><span className="opacity-40">PLACE</span>
              </h1>
              <p className="font-jp text-sm text-muted-foreground">Your personal code archive</p>
            </div>
            <div className="absolute bottom-4 right-6 font-manga text-6xl text-ink opacity-[0.04] select-none">
              BOOM
            </div>
          </MangaPanel>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'TOTAL', value: files.length, icon: Zap, sub: 'total files' },
            { label: 'STARRED', value: starredFiles.length, icon: Star, sub: 'favorites' },
            { label: 'LANGUAGES', value: Object.keys(langStats).length, sub: 'languages' },
            { label: 'RECENT', value: recentFiles.length, sub: 'recent' },
          ].map(({ label, value, sub }) => (
            <MangaPanel key={label} className="p-3 flex flex-col items-center justify-center text-center gap-1" animate={false}>
              <span className="font-manga text-3xl text-ink">{value}</span>
              <span className="font-manga text-xs tracking-widest text-muted-foreground">{label}</span>
              <span className="font-jp text-[9px] text-muted-foreground opacity-60">{sub}</span>
            </MangaPanel>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-6 bg-ink" />
          <h2 className="font-manga text-xl tracking-widest">UPLOAD SCROLL</h2>
          <span className="font-jp text-xs text-muted-foreground">drag & drop or click to browse</span>
        </div>
        <UploadZone onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ['codefiles'] })} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Files */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-ink" />
            <h2 className="font-manga text-xl tracking-widest">RECENT SCROLLS</h2>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="manga-panel h-32 bg-secondary animate-pulse" />
              ))}
            </div>
          ) : recentFiles.length === 0 ? (
            <MangaPanel className="p-8 text-center">
              <p className="font-manga text-2xl tracking-widest text-muted-foreground mb-2">EMPTY...</p>
              <p className="font-jp text-sm text-muted-foreground">Drop a file to get started!</p>
            </MangaPanel>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentFiles.map(file => (
                <FileCard key={file.id} file={file} onStarToggle={() => queryClient.invalidateQueries({ queryKey: ['codefiles'] })} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Language Stats */}
          <MangaPanel className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-manga text-sm tracking-widest">LANGUAGES</span>
            </div>
            {topLangs.length === 0 ? (
              <p className="font-jp text-xs text-muted-foreground text-center py-2">no data yet</p>
            ) : (
              <div className="space-y-2">
                {topLangs.map(([lang, count]) => (
                  <div key={lang} className="flex items-center justify-between gap-2">
                    <span className="font-manga text-xs tracking-wider">{lang.toUpperCase()}</span>
                    <div className="flex-1 h-2 bg-secondary border border-ink/20 overflow-hidden">
                      <div
                        className="h-full bg-ink transition-all duration-500"
                        style={{ width: `${(count / files.length) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </MangaPanel>

          {/* Starred */}
          {starredFiles.length > 0 && (
            <MangaPanel className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-3.5 h-3.5" />
                <span className="font-manga text-sm tracking-widest">STARRED</span>
              </div>
              <div className="space-y-1.5">
                {starredFiles.slice(0, 5).map(f => (
                  <div key={f.id} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-ink rounded-full flex-shrink-0" />
                    <span className="font-jp text-xs truncate">{f.name}</span>
                  </div>
                ))}
              </div>
            </MangaPanel>
          )}
        </div>
      </div>
    </div>
  );
}
