const langConfig = {
  python: { label: 'PY', color: 'bg-ink text-paper' },
  javascript: { label: 'JS', color: 'bg-ink text-paper' },
  typescript: { label: 'TS', color: 'bg-ink text-paper' },
  c: { label: 'C', color: 'bg-ink text-paper' },
  cpp: { label: 'C++', color: 'bg-ink text-paper' },
  java: { label: 'JAVA', color: 'bg-ink text-paper' },
  go: { label: 'GO', color: 'bg-ink text-paper' },
  rust: { label: 'RS', color: 'bg-ink text-paper' },
  html: { label: 'HTML', color: 'bg-ink text-paper' },
  css: { label: 'CSS', color: 'bg-ink text-paper' },
  markdown: { label: 'MD', color: 'bg-ink text-paper' },
  json: { label: 'JSON', color: 'bg-ink text-paper' },
  yaml: { label: 'YAML', color: 'bg-ink text-paper' },
  shell: { label: 'SH', color: 'bg-ink text-paper' },
  other: { label: '???', color: 'bg-ink text-paper' },
};

export default function LanguageBadge({ language, size = 'sm' }) {
  const cfg = langConfig[language] || langConfig.other;
  return (
    <span
      className={`font-manga tracking-wider border border-ink ${cfg.color} ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      }`}
    >
      {cfg.label}
    </span>
  );
}