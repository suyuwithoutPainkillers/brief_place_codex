import { useQuery } from '@tanstack/react-query';
import { codeFileStore } from '@/api/codeFileStore';
import MangaPanel from '@/components/manga/MangaPanel';
import LanguageBadge from '@/components/manga/LanguageBadge';
import { Star, Code2, Zap, Trophy, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const { data: files = [] } = useQuery({
    queryKey: ['codefiles'],
    queryFn: () => codeFileStore.list('-created_date', 200),
  });

  const totalFiles = files.length;
  const starred = files.filter(f => f.is_starred).length;
  const totalSize = files.reduce((acc, f) => acc + (f.file_size || 0), 0);

  const langStats = files.reduce((acc, f) => {
    if (f.language) acc[f.language] = (acc[f.language] || 0) + 1;
    return acc;
  }, {});
  const sortedLangs = Object.entries(langStats).sort((a, b) => b[1] - a[1]);
  const topLang = sortedLangs[0]?.[0] || '—';

  const recentFiles = [...files].slice(0, 5);

  const achievements = [
    { label: 'FIRST SCROLL', icon: '📜', unlocked: totalFiles >= 1, desc: 'Upload your first file' },
    { label: 'COLLECTOR', icon: '📚', unlocked: totalFiles >= 10, desc: 'Collect 10 scrolls' },
    { label: 'ARCHIVIST', icon: '🏛️', unlocked: totalFiles >= 50, desc: 'Collect 50 scrolls' },
    { label: 'STAR CHASER', icon: '⭐', unlocked: starred >= 5, desc: 'Star 5 files' },
    { label: 'POLYGLOT', icon: '🌐', unlocked: Object.keys(langStats).length >= 5, desc: 'Use 5+ languages' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Character Card */}
        <MangaPanel className="lg:col-span-1 relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center p-8">
          <div className="absolute inset-0 halftone-bg pointer-events-none" />
          <div className="absolute inset-0 speed-lines pointer-events-none opacity-30" />

          {/* Avatar */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-28 h-28 border-[4px] border-ink bg-ink flex items-center justify-center relative"
              style={{ boxShadow: '6px 6px 0 hsl(var(--ink))' }}>
              {/* Manga character silhouette */}
              <div className="w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 80 80" className="w-full h-full fill-paper">
                  {/* Head */}
                  <ellipse cx="40" cy="22" rx="14" ry="16" />
                  {/* Hair */}
                  <path d="M26 18 Q28 6 40 8 Q52 6 54 18 Q50 10 40 12 Q30 10 26 18Z" />
                  {/* Body */}
                  <path d="M28 38 Q20 42 18 58 L62 58 Q60 42 52 38 Q46 36 40 36 Q34 36 28 38Z" />
                  {/* Collar/code detail */}
                  <rect x="36" y="42" width="8" height="10" rx="1" className="fill-ink" />
                  {/* Eyes */}
                  <ellipse cx="34" cy="22" rx="3" ry="4" className="fill-ink" />
                  <ellipse cx="46" cy="22" rx="3" ry="4" className="fill-ink" />
                  <ellipse cx="34" cy="22" rx="1.5" ry="2" className="fill-paper" />
                  <ellipse cx="46" cy="22" rx="1.5" ry="2" className="fill-paper" />
                  {/* Small sparkles */}
                  <text x="58" y="10" fontSize="8" className="fill-paper">✦</text>
                  <text x="14" y="16" fontSize="6" className="fill-paper">✦</text>
                </svg>
              </div>
            </div>

            <div className="text-center">
              <div className="speech-bubble px-4 py-2 mb-3">
                <span className="font-manga text-lg tracking-widest">DEV HERO</span>
              </div>
              <p className="font-jp text-sm text-muted-foreground">Solo Developer</p>
            </div>

            {/* Level */}
            <div className="flex items-center gap-2 font-manga text-xs tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              <span>LV.{Math.min(99, Math.floor(totalFiles / 5) + 1)}</span>
            </div>
          </div>
        </MangaPanel>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {[
            { label: 'TOTAL SCROLLS', value: totalFiles, sub: 'total files', icon: Code2 },
            { label: 'STARRED', value: starred, sub: 'favorites', icon: Star },
            { label: 'TOP LANGUAGE', value: topLang.toUpperCase(), sub: 'most used', icon: Trophy },
            { label: 'TOTAL SIZE', value: `${(totalSize / 1024 / 1024).toFixed(1)}MB`, sub: 'storage used', icon: Target },
          ].map(({ label, value, sub, icon: Icon }) => (
            <MangaPanel key={label} className="p-4 flex flex-col gap-2" animate={false}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="font-manga text-xs tracking-widest text-muted-foreground">{label}</span>
              </div>
              <span className="font-manga text-3xl text-ink leading-none">{value}</span>
              <span className="font-jp text-[10px] text-muted-foreground">{sub}</span>
            </MangaPanel>
          ))}

          {/* Language chart */}
          <MangaPanel className="col-span-2 p-4" animate={false}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-ink" />
              <span className="font-manga text-sm tracking-widest">LANGUAGE SKILLS</span>
            </div>
            <div className="flex items-end gap-2 h-16">
              {sortedLangs.slice(0, 8).map(([lang, count], i) => (
                <div key={lang} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full bg-ink transition-all"
                    style={{ height: `${(count / (sortedLangs[0]?.[1] || 1)) * 52}px` }}
                  />
                  <span className="font-manga text-[8px] tracking-wider text-muted-foreground">
                    {lang.slice(0, 3).toUpperCase()}
                  </span>
                </div>
              ))}
              {sortedLangs.length === 0 && (
                <span className="font-manga text-xs text-muted-foreground tracking-wider">NO DATA YET</span>
              )}
            </div>
          </MangaPanel>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <MangaPanel className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4" />
            <span className="font-manga text-lg tracking-widest">ACHIEVEMENTS</span>
            <span className="font-jp text-xs text-muted-foreground">unlock by using the app</span>
          </div>
          <div className="space-y-2">
            {achievements.map(({ label, icon, unlocked, desc }) => (
              <div
                key={label}
                className={`flex items-center gap-3 p-3 border transition-all ${
                  unlocked
                    ? 'border-ink bg-secondary'
                    : 'border-ink/20 opacity-40'
                }`}
              >
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                  <div className="font-manga text-sm tracking-wider">{label}</div>
                  <div className="font-jp text-[10px] text-muted-foreground">{desc}</div>
                </div>
                {unlocked && (
                  <div className="w-4 h-4 border-2 border-ink flex items-center justify-center">
                    <div className="w-2 h-2 bg-ink" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </MangaPanel>

        {/* Recent Activity */}
        <MangaPanel className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" />
            <span className="font-manga text-lg tracking-widest">ACTIVITY LOG</span>
            <span className="font-jp text-xs text-muted-foreground">recently added files</span>
          </div>
          {recentFiles.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-manga text-sm text-muted-foreground tracking-wider">NO FILES YET — UPLOAD YOUR FIRST SCROLL</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentFiles.map((file, i) => (
                <div key={file.id} className="flex items-center gap-3 py-2 border-b border-ink/10 last:border-0">
                  <div className="w-5 h-5 bg-ink flex items-center justify-center flex-shrink-0">
                    <span className="text-paper font-manga text-[10px]">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <LanguageBadge language={file.language} />
                      <span className="font-jp text-xs truncate">{file.name}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground flex-shrink-0">
                    {file.created_date
                      ? formatDistanceToNow(new Date(file.created_date), { addSuffix: true })
                      : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </MangaPanel>
      </div>
    </div>
  );
}
