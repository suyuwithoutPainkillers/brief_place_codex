import { Link, useLocation } from 'react-router-dom';
import MangaPanel from '@/components/manga/MangaPanel';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || 'home';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <MangaPanel className="max-w-md w-full p-8 text-center">
        <div className="speech-bubble inline-block px-4 py-2 mb-6">
          <span className="font-manga text-sm tracking-widest">Page lost in the archive</span>
        </div>
        <h1 className="font-manga text-7xl tracking-wider text-ink">404</h1>
        <p className="font-jp text-sm text-muted-foreground mt-3">
          The scroll named <span className="font-bold text-ink">{pageName}</span> could not be found.
        </p>
        <Link
          to="/"
          className="inline-flex mt-6 manga-btn bg-ink text-paper px-4 py-2 text-sm font-manga tracking-wider"
        >
          GO HOME
        </Link>
      </MangaPanel>
    </div>
  );
}
