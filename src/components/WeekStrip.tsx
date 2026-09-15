import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getWeekDays, formatDateKey, formatDayLabel, formatRussianDateHeader } from '../utils/dateUtils';
import { Habit } from '../types';

interface WeekStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  habits: Habit[];
}

export const WeekStrip: React.FC<WeekStripProps> = ({
  selectedDate,
  onSelectDate,
  habits,
}) => {
  const weekDays = getWeekDays(selectedDate);
  const todayKey = formatDateKey(new Date());
  const selectedKey = formatDateKey(selectedDate);

  const handlePrevWeek = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 7);
    onSelectDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    onSelectDate(next);
  };

  const handleGoToToday = () => {
    onSelectDate(new Date());
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
            {formatRussianDateHeader(selectedDate)}
          </h2>
          {selectedKey !== todayKey && (
            <button
              onClick={handleGoToToday}
              className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              Сегодня
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevWeek}
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            title="Предыдущая неделя"
            aria-label="Предыдущая неделя"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            title="Следующая неделя"
            aria-label="Следующая неделя"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dateKey = formatDateKey(day);
          const isSelected = dateKey === selectedKey;
          const isToday = dateKey === todayKey;
          const { dayName, dayNumber } = formatDayLabel(day);

          // Calculate completed habits on this day
          const totalHabits = habits.length;
          const completedOnThisDay = habits.filter((h) =>
            h.completedDates.includes(dateKey)
          ).length;
          const isAllDone = totalHabits > 0 && completedOnThisDay === totalHabits;
          const isPartial = completedOnThisDay > 0 && !isAllDone;

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(day)}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all relative ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : isToday
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100/70'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <span
                className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                  isSelected
                    ? 'text-emerald-100'
                    : isToday
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-stone-400 dark:text-stone-500'
                }`}
              >
                {dayName}
              </span>
              <span
                className={`text-base font-bold leading-none mb-1.5 ${
                  isSelected ? 'text-white' : ''
                }`}
              >
                {dayNumber}
              </span>

              {/* Progress indicator dot or count */}
              <div className="h-1.5 flex items-center justify-center">
                {isAllDone ? (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-emerald-500'
                    }`}
                  />
                ) : isPartial ? (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-200' : 'bg-amber-400'
                    }`}
                  />
                ) : (
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isSelected ? 'bg-emerald-400/50' : 'bg-stone-200 dark:bg-stone-700'
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
