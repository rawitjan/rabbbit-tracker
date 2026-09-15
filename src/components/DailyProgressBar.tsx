import React from 'react';
import { Award, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyProgressBarProps {
  completedCount: number;
  totalCount: number;
  isToday: boolean;
}

export const DailyProgressBar: React.FC<DailyProgressBarProps> = ({
  completedCount,
  totalCount,
  isToday,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComplete = totalCount > 0 && completedCount === totalCount;

  const getMessage = () => {
    if (totalCount === 0) return 'Добавьте свою первую привычку, чтобы начать!';
    if (percentage === 100) {
      return isToday
        ? 'Отличная работа! Все привычки на сегодня выполнены 🎉'
        : 'Все привычки за этот день были успешно закрыты!';
    }
    if (percentage >= 70) {
      return 'Почти у цели! Осталось совсем немного до 100%.';
    }
    if (percentage >= 40) {
      return 'Хороший темп! Продолжайте в том же духе.';
    }
    if (percentage > 0) {
      return 'Первый шаг сделан! Главное — регулярность.';
    }
    return isToday ? 'Начните день с первой выполненной привычки!' : 'В этот день не было отметок.';
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Прогресс дня
            </span>
            <div className="text-sm font-medium text-stone-700 dark:text-stone-300">
              {getMessage()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {completedCount}
          </span>
          <span className="text-stone-400 text-sm font-medium">/{totalCount}</span>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full transition-colors ${
            isComplete
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-emerald-500'
          }`}
        />
      </div>
    </div>
  );
};
