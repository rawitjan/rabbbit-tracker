import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Flame, MoreVertical, Edit2, Trash2, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { CATEGORY_CONFIG, COLOR_CONFIG, TIME_OF_DAY_CONFIG } from '../data/defaultHabits';
import { calculateStreaks } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  dateKey: string;
  isToday: boolean;
  onToggle: (habitId: string, dateKey: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  dateKey,
  isToday,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isCompleted = habit.completedDates.includes(dateKey);
  const { currentStreak, longestStreak } = calculateStreaks(habit.completedDates);

  const colorStyles = COLOR_CONFIG[habit.color] || COLOR_CONFIG.emerald;
  const categoryInfo = CATEGORY_CONFIG[habit.category] || CATEGORY_CONFIG.lifestyle;
  const timeInfo = TIME_OF_DAY_CONFIG[habit.timeOfDay] || TIME_OF_DAY_CONFIG.anytime;

  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isCompleted) {
      // Trigger subtle celebratory confetti from the button coordinates
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 32,
        spread: 55,
        origin: { x, y },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'],
        ticks: 200,
        gravity: 1.2,
        scalar: 0.8,
      });
    }
    onToggle(habit.id, dateKey);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'bg-stone-50/70 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800'
          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm hover:border-stone-300 dark:hover:border-stone-700'
      }`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-3">
        {/* Habit Icon */}
        <div
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
            isCompleted
              ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
              : `${colorStyles.lightBg} ${colorStyles.border} border`
          }`}
        >
          <DynamicIcon name={habit.icon} className="w-5 h-5" />
        </div>

        {/* Habit Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold text-base truncate transition-colors ${
                isCompleted
                  ? 'line-through text-stone-400 dark:text-stone-500'
                  : 'text-stone-900 dark:text-stone-100'
              }`}
            >
              {habit.title}
            </h3>

            {/* Streak Counter */}
            {currentStreak > 0 && (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50"
                title={`Текущая серия: ${currentStreak} дн. (Рекорд: ${longestStreak} дн.)`}
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{currentStreak} дн.</span>
              </span>
            )}
          </div>

          {habit.description && (
            <p
              className={`text-xs mt-0.5 truncate ${
                isCompleted
                  ? 'text-stone-400 dark:text-stone-600'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {habit.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500 dark:text-stone-400">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-medium">
              {categoryInfo.label}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {timeInfo.label}
            </span>
            {habit.targetFrequency !== 'daily' && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                {habit.targetFrequency === 'weekdays' ? 'По будням' : 'По выходным'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls: Complete button & dropdown menu */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Checkmark Button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleToggleClick}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
              : 'border-2 border-stone-300 dark:border-stone-700 text-transparent hover:border-emerald-500 hover:text-emerald-500/30'
          }`}
          aria-label={isCompleted ? 'Отмечено как выполненное' : 'Отметить как выполненное'}
          title={isCompleted ? 'Нажмите, чтобы отменить' : 'Нажмите, чтобы отметить'}
        >
          <Check className={`w-5 h-5 stroke-[2.5] ${isCompleted ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} />
        </motion.button>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Опции привычки"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1 w-36 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg py-1 z-30"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(habit);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/60 flex items-center gap-2 font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-stone-500" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(habit.id);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Удалить
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
