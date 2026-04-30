import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Code2, FolderOpen, Settings, Sun, Moon, User, Zap } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

const navItems = [
  { path: '/', label: 'HOME', icon: Code2 },
  { path: '/files', label: 'FILES', icon: FolderOpen },
  { path: '/profile', label: 'PROFILE', icon: User },
  { path: '/diary', label: 'DIARY', icon: BookOpen },
];

export default function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const isSettings = location.pathname === '/settings';

  return (
    <aside className="w-16 md:w-52 flex-shrink-0 bg-card border-r-[3px] border-ink flex flex-col min-h-screen sticky top-0 h-screen z-40">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 px-3 py-4 border-b-[3px] border-ink group">
        <div className="w-8 h-8 bg-ink flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-paper" />
        </div>
        <span className="font-manga text-lg tracking-widest text-ink hidden md:block">
          BRIEF<span className="opacity-50">PLACE</span>
        </span>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1 p-2 pt-4">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 font-manga text-sm tracking-wider transition-all ${
                active
                  ? 'bg-ink text-paper'
                  : 'text-ink hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-2 pb-4 border-t-[3px] border-ink">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 font-manga text-sm tracking-wider transition-all ${
            isSettings
              ? 'bg-ink text-paper'
              : 'text-ink hover:bg-secondary'
          }`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="hidden md:inline">SETTINGS</span>
        </Link>

        {/* Quick theme toggle */}
        <button
          onClick={toggleTheme}
          className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 font-manga text-sm tracking-wider text-ink hover:bg-secondary transition-all"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Moon className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="hidden md:inline">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
        </button>
      </div>
    </aside>
  );
}
