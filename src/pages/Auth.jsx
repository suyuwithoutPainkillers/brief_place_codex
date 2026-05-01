import { useState } from 'react';
import { LogIn, Mail, KeyRound, UserPlus } from 'lucide-react';
import MangaPanel from '@/components/manga/MangaPanel';
import { useAuth } from '@/lib/AuthContext';

export default function Auth() {
  const { authMessage, isSupabaseConfigured, signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState('');

  const isSignIn = mode === 'signin';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalMessage('');
    setIsSubmitting(true);

    try {
      if (isSignIn) {
        await signIn({ email, password });
      } else {
        await signUp({ email, password });
        setLocalMessage('Account request sent. If email confirmation is enabled, check your inbox.');
      }
    } catch (error) {
      setLocalMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <MangaPanel className="p-6">
          <div className="speech-bubble inline-block px-4 py-2 mb-5">
            <span className="font-manga text-sm tracking-widest">Cloud archive access</span>
          </div>

          <h1 className="font-manga text-5xl tracking-wider text-ink leading-none">
            BRIEF<br /><span className="opacity-40">PLACE</span>
          </h1>
          <p className="font-jp text-sm text-muted-foreground mt-2">
            Sign in to sync your code files across devices.
          </p>

          {!isSupabaseConfigured ? (
            <div className="mt-6 border-[2px] border-destructive p-4 bg-destructive/10">
              <p className="font-manga text-sm tracking-widest text-destructive">SUPABASE ENV MISSING</p>
              <p className="font-jp text-xs text-muted-foreground mt-2">
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel, then redeploy.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`manga-btn px-3 py-2 text-xs flex items-center justify-center gap-2 ${
                    isSignIn ? 'bg-ink text-paper' : 'bg-card text-ink'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`manga-btn px-3 py-2 text-xs flex items-center justify-center gap-2 ${
                    !isSignIn ? 'bg-ink text-paper' : 'bg-card text-ink'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  SIGN UP
                </button>
              </div>

              <label className="block">
                <span className="font-manga text-xs tracking-widest text-muted-foreground">EMAIL</span>
                <div className="mt-1 flex items-center gap-2 border-[2px] border-ink bg-card px-3 py-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="flex-1 bg-transparent font-jp text-sm outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="font-manga text-xs tracking-widest text-muted-foreground">PASSWORD</span>
                <div className="mt-1 flex items-center gap-2 border-[2px] border-ink bg-card px-3 py-2">
                  <KeyRound className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    className="flex-1 bg-transparent font-jp text-sm outline-none"
                    placeholder="At least 6 characters"
                  />
                </div>
              </label>

              {(localMessage || authMessage) && (
                <p className="font-jp text-xs text-muted-foreground border border-ink/20 p-3 bg-secondary">
                  {localMessage || authMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="manga-btn w-full bg-ink text-paper px-4 py-3 text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'WORKING...' : isSignIn ? 'ENTER ARCHIVE' : 'CREATE ACCOUNT'}
              </button>
            </form>
          )}
        </MangaPanel>
      </div>
    </div>
  );
}
