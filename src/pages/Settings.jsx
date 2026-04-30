import MangaPanel from '@/components/manga/MangaPanel';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="speech-bubble inline-block px-3 py-1.5 mb-3">
          <span className="font-manga text-sm tracking-widest">Customize your experience!</span>
        </div>
        <h1 className="font-manga text-4xl tracking-wider text-ink">SETTINGS</h1>
        <p className="font-jp text-sm text-muted-foreground mt-1">Manage app preferences</p>
      </div>

      <MangaPanel className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-6 bg-ink" />
          <span className="font-manga text-lg tracking-widest">THEME</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Light Mode */}
          <button
            onClick={() => setTheme('light')}
            className={`relative flex flex-col items-center gap-3 p-6 border-[3px] transition-all ${
              theme === 'light'
                ? 'border-ink bg-secondary shadow-[4px_4px_0px_hsl(var(--ink))]'
                : 'border-ink/30 hover:border-ink/60'
            }`}
          >
            <Sun className="w-8 h-8 text-ink" />
            <div className="text-center">
              <div className="font-manga text-base tracking-widest text-ink">LIGHT</div>
              <div className="font-jp text-xs text-muted-foreground mt-0.5">Bright mode</div>
            </div>
            {theme === 'light' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-ink" />
            )}
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => setTheme('dark')}
            className={`relative flex flex-col items-center gap-3 p-6 border-[3px] transition-all ${
              theme === 'dark'
                ? 'border-ink bg-secondary shadow-[4px_4px_0px_hsl(var(--ink))]'
                : 'border-ink/30 hover:border-ink/60'
            }`}
          >
            <Moon className="w-8 h-8 text-ink" />
            <div className="text-center">
              <div className="font-manga text-base tracking-widest text-ink">DARK</div>
              <div className="font-jp text-xs text-muted-foreground mt-0.5">Dark mode</div>
            </div>
            {theme === 'dark' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-ink" />
            )}
          </button>
        </div>
      </MangaPanel>
    </div>
  );
}
