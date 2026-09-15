import React from 'react';
import { Plus, CheckSquare, Calendar, BarChart3, Sun, Moon, RotateCcw } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  onOpenNewHabit: () => void;
  onResetData: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  onOpenNewHabit,
  onResetData,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
              Трекер привычек
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-none">
              Ежедневный ритм и дисциплина
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="hidden sm:flex items-center bg-stone-100 dark:bg-stone-800/90 p-1 rounded-xl">
          <button
            onClick={() => onChangeView('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'today'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Сегодня
          </button>
          <button
            onClick={() => onChangeView('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'matrix'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Сетка недели
          </button>
          <button
            onClick={() => onChangeView('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'analytics'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Статистика
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isDark ? 'Светлая тема' : 'Темная тема'}
            aria-label="Переключить тему"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onResetData}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Восстановить примеры привычек"
            aria-label="Восстановить примеры"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNewHabit}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Новая привычка</span>
            <span className="xs:hidden">Добавить</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="sm:hidden flex items-center justify-around border-t border-stone-100 dark:border-stone-800/80 px-2 py-1.5 bg-stone-50 dark:bg-stone-900">
        <button
          onClick={() => onChangeView('today')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
            currentView === 'today'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Сегодня
        </button>
        <button
          onClick={() => onChangeView('matrix')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
            currentView === 'matrix'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Сетка
        </button>
        <button
          onClick={() => onChangeView('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
            currentView === 'analytics'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Статистика
        </button>
      </div>
    </header>
  );
};
