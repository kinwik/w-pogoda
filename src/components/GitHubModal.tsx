import React, { useState } from 'react';
import {
  X,
  Github,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Globe,
  Sparkles,
  Rocket,
} from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitPushScript = `git init
git add .
git commit -m "feat: w pogoda weather app"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/w-pogoda.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 p-5 sm:p-7 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with GitHub Icon */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-lg">
            <Github className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>GitHub Pages Ready</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Запуск сайта на GitHub Pages
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Бесплатный хостинг с HTTPS, автоматической сборкой и вашим персональным доменом.
            </p>
          </div>
        </div>

        {/* Ready configuration badge */}
        <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Всё уже настроено в проекте!</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            В проект добавлен файл автоматического деплоя <code className="text-cyan-300 font-mono">.github/workflows/deploy.yml</code>, а пути в <code className="text-cyan-300 font-mono">vite.config.ts</code> переведены в относительный режим (<code className="text-cyan-300 font-mono">base: './'</code>), поэтому картинки, шрифты и стили не сломаются на поддоменах GitHub.
          </p>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-semibold">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px]">1</span>
              <span>Создайте новый репозиторий на GitHub:</span>
            </div>
            <p className="text-xs text-slate-400 pl-7">
              Зайдите на <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300">github.com/new</a>, введите имя (например, <code className="text-slate-200 font-mono">w-pogoda</code>) и выберите <b>Public</b>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-semibold">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px]">2</span>
              <span>Отправьте код в репозиторий:</span>
            </div>
            <div className="relative pl-7">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                {gitPushScript}
              </pre>
              <button
                onClick={() => copyToClipboard(gitPushScript, 0)}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copiedIndex === 0 ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Скопировать команды</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-semibold">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px]">3</span>
              <span>Включите GitHub Pages в настройках репозитория:</span>
            </div>
            <div className="pl-7 space-y-1.5 text-xs text-slate-400">
              <p>
                1. В репозитории откройте вкладку <b>Settings</b> → слева выберите <b>Pages</b>.
              </p>
              <p>
                2. В пункте <b>Build and deployment → Source</b> выберите: <span className="text-cyan-300 font-semibold">GitHub Actions</span>.
              </p>
              <p>
                3. Всё! Через 1 минуту ваш сайт откроется по адресу: <code className="text-white font-mono bg-slate-950 px-1.5 py-0.5 rounded">https://ВАШ_ЛОГИН.github.io/w-pogoda/</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noreferrer noopener"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-medium text-white flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <span>Создать репозиторий на GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-sm font-medium transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
