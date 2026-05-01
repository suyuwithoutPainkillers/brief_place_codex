import { useState, useRef, useCallback } from 'react';
import { Upload, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { codeFileStore } from '@/api/codeFileStore';

const PREVIEW_LIMIT = 200000;
const STORED_CONTENT_LIMIT = 50000;
const TEXT_EXTENSIONS = new Set([
  'bash', 'c', 'cc', 'cpp', 'css', 'go', 'h', 'htm', 'html', 'java', 'js',
  'json', 'jsx', 'md', 'py', 'rs', 'sh', 'ts', 'tsx', 'txt', 'yaml', 'yml',
]);

const detectLanguage = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const map = {
    py: 'python', js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript',
    c: 'c', cpp: 'cpp', cc: 'cpp', h: 'c', java: 'java', go: 'go', rs: 'rust',
    html: 'html', htm: 'html', css: 'css', md: 'markdown', json: 'json',
    yaml: 'yaml', yml: 'yaml', sh: 'shell', bash: 'shell',
  };
  return map[ext] || 'other';
};

const isPreviewableText = (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  return file.type.startsWith('text') || file.type === 'application/json' || TEXT_EXTENSIONS.has(ext);
};

export default function UploadZone({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const fileInput = useRef(null);

  const processFiles = useCallback(async (files) => {
    if (!files.length) return;
    setUploading(true);
    setError('');

    try {
      for (const file of Array.from(files)) {
        setUploadStatus(`Saving ${file.name}...`);

        let content = '';
        if (file.size <= PREVIEW_LIMIT && isPreviewableText(file)) {
          content = await file.text();
        }

        await codeFileStore.create({
          name: file.name,
          language: detectLanguage(file.name),
          content: content.slice(0, STORED_CONTENT_LIMIT),
          file_size: file.size,
          file_type: file.type,
          blob: file,
          folder: 'root',
          is_starred: false,
        });
      }

      onUploadComplete?.();
    } catch (err) {
      console.error('File save failed:', err);
      setError(err.message || 'Could not save that file to your cloud archive.');
    } finally {
      setUploadStatus('');
      setUploading(false);
      if (fileInput.current) {
        fileInput.current.value = '';
      }
    }
  }, [onUploadComplete]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => !uploading && fileInput.current?.click()}
      className={`relative cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'bg-ink text-paper scale-[1.02]'
          : 'bg-card hover:bg-secondary'
      } border-[3px] border-dashed border-ink`}
      style={{ boxShadow: isDragging ? '8px 8px 0px hsl(var(--ink))' : '4px 4px 0px hsl(var(--ink))' }}
    >
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone-bg pointer-events-none" />

      <div className="relative flex flex-col items-center justify-center py-16 px-8 gap-4">
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 border-4 border-current animate-spin" style={{ borderTopColor: 'transparent' }} />
              <span className="font-manga text-lg tracking-widest">{uploadStatus}</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={`w-16 h-16 border-[3px] border-current flex items-center justify-center ${isDragging ? 'animate-bounce' : ''}`}>
                <Scroll className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="font-manga text-2xl tracking-widest mb-1">
                  {isDragging ? 'RELEASE!' : 'Drop your scroll here'}
                </p>
                <p className="font-jp text-xs opacity-60">
                  {isDragging ? 'Release to upload your file!' : 'Drag & drop files here — or click to browse'}
                </p>
              </div>
              <div className="flex items-center gap-2 font-manga text-xs tracking-wider opacity-40">
                <Upload className="w-3 h-3" />
                <span>SYNCED TO YOUR CLOUD ARCHIVE</span>
              </div>
              {error && (
                <p className="max-w-sm text-center font-jp text-xs text-destructive">
                  {error}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={fileInput}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => processFiles(e.target.files)}
      />
    </div>
  );
}
