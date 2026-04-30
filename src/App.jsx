import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { ThemeProvider } from '@/lib/ThemeContext';
import MangaLayout from '@/components/manga/MangaLayout';
import Home from '@/pages/Home';
import FileManager from '@/pages/FileManager';
import CodeViewer from '@/pages/CodeViewer';
import Profile from '@/pages/Profile';
import Diary from '@/pages/Diary';
import Settings from '@/pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MangaLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/files" element={<FileManager />} />
        <Route path="/viewer/:id" element={<CodeViewer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
