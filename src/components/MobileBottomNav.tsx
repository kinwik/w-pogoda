import React from 'react';
import { Calendar, Clock, Compass, Menu, Umbrella } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onSelectSection,
  onOpenMobileMenu,
  isMobileMenuOpen,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 md:hidden pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 h-15 px-2 items-center">
        {/* Tab 1: 7-day forecast */}
        <button
          onClick={() => onSelectSection('week')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeSection === 'week' && !isMobileMenuOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">7 Дней</span>
        </button>

        {/* Tab 2: Hourly */}
        <button
          onClick={() => onSelectSection('hourly')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeSection === 'hourly' && !isMobileMenuOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Часы</span>
        </button>

        {/* Tab 3: Metrics */}
        <button
          onClick={() => onSelectSection('metrics')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeSection === 'metrics' && !isMobileMenuOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Барометр</span>
        </button>

        {/* Tab 4: Mobile Menu Trigger (Телефонное меню / Районы) */}
        <button
          onClick={onOpenMobileMenu}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            isMobileMenuOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Меню</span>
        </button>
      </div>
    </div>
  );
};
