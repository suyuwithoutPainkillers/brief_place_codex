import MangaPanel from '@/components/manga/MangaPanel';
import { BookOpen } from 'lucide-react';

export default function Diary() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="speech-bubble inline-block px-3 py-1.5 mb-3">
          <span className="font-manga text-sm tracking-widest">Your dev journal!</span>
        </div>
        <h1 className="font-manga text-4xl tracking-wider text-ink">DIARY</h1>
        <p className="font-jp text-sm text-muted-foreground mt-1">Coming soon — your personal dev notes</p>
      </div>

      <MangaPanel className="py-20 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="font-manga text-2xl tracking-widest text-muted-foreground">COMING SOON</p>
        <p className="font-jp text-sm text-muted-foreground mt-2">The diary feature is on its way!</p>
      </MangaPanel>
    </div>
  );
}