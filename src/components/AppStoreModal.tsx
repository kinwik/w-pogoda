import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import appStoreIconImg from '../assets/images/app_store_icon_1790884765246.jpg';

interface AppStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppStoreModal: React.FC<AppStoreModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const xcodeCommands = [
    'npm run build',
    'npx cap add ios',
    'npx cap sync ios',
    'npx cap open ios',
  ];

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

        {/* Header with App Icon */}
        <div className="flex items-center gap-4">
          <img
            src={appStoreIconImg}
            alt="w pogoda App Store Icon"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-700 shadow-xl object-cover"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apple App Store Ready</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Публикация «w pogoda» в App Store
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Приложение полностью оптимизировано под iOS HIG, Dynamic Island, Safe Area и Retina.
            </p>
          </div>
        </div>

        {/* 2 Ways to Publish */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Method 1: Xcode & Capacitor */}
          <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Способ 1 · Официальный
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 rounded">
                Xcode / Mac
              </span>
            </div>
            <h3 className="font-semibold text-sm text-slate-100">Нативный проект iOS (Capacitor)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Создает проект в Xcode, подписывается вашим Apple Developer аккаунтом и отправляется в TestFlight.
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-mono">Команды в терминале:</span>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-cyan-300 space-y-1">
                {xcodeCommands.map((cmd, i) => (
                  <div key={cmd} className="flex items-center justify-between gap-2">
                    <span className="truncate">{cmd}</span>
                    <button
                      onClick={() => copyToClipboard(cmd, i)}
                      title="Скопировать команду"
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Method 2: PWABuilder */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Способ 2 · Без Mac
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded">
                  PWA Builder
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-100">Генерация .ipa без Xcode</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Сервис Microsoft & Apple WebKit упакует веб-манифест в официальный пакет для загрузки в App Store Connect.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://www.pwabuilder.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Открыть PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Master Assets Download */}
        <div className="border border-slate-800 bg-slate-950/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Иконка приложения (1024×1024 Master)</span>
            </div>
            <a
              href={appStoreIconImg}
              download="AppStore_Icon_1024.jpg"
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать иконку 1024px</span>
            </a>
          </div>
          <p className="text-xs text-slate-400">
            Иконка уже сохранена в проекте и подключена в <code className="text-cyan-300 font-mono">/manifest.json</code>, <code className="text-cyan-300 font-mono">apple-touch-icon</code> и конфигурации Capacitor.
          </p>
        </div>

        {/* Apple App Store Connect Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Чек-лист для прохождения модерации Apple:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Safe Area & Dynamic Island:</span>
                <p className="text-slate-400 text-[11px]">Интерфейс не перекрывается вырезом камеры и домашней полосой iPhone.</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Офлайн-устойчивость:</span>
                <p className="text-slate-400 text-[11px]">Приложение загружает резервные метеоданные без белых экранов.</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Конфиденциальность (Privacy):</span>
                <p className="text-slate-400 text-[11px]">Координаты используются только для расчета погоды (без продажи трекерам).</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Bundle Identifier:</span>
                <p className="text-slate-400 text-[11px]">Настроен <code className="text-cyan-300 font-mono">com.wpogoda.weather</code> в capacitor.config.ts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
