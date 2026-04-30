import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MangaLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 relative">
          {/* Decorative onomatopoeia */}
          <div className="fixed top-20 right-4 onomatopoeia rotate-12 pointer-events-none select-none hidden xl:block">
            WHOOSH
          </div>
          <div className="fixed bottom-20 right-4 onomatopoeia -rotate-6 pointer-events-none select-none hidden xl:block">
            ZZZZT
          </div>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t-[3px] border-ink bg-card py-3 px-4">
          <div className="flex items-center justify-between">
            <span className="font-manga text-xs text-muted-foreground tracking-widest">
              BRIEF PLACE — Personal Dev Library
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-ink opacity-20" />
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}