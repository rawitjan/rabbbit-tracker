import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { COLOR_CONFIG } from '../data/defaultHabits';
import { getWeekDays, formatDateKey, formatDayLabel } from '../utils/dateUtils';

interface HabitWeeklyMatrixProps {
  habits: Habit[];
  onToggleHabitDate: (habitId: string, dateKey: string) => void;
}

export const HabitWeeklyMatrix: React.FC<HabitWeeklyMatrixProps> = ({
  habits,
  onToggleHabitDate,
}) => {
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());
  const weekDays = getWeekDays(referenceDate);
  const todayKey = formatDateKey(new Date());

  const handlePrevWeek = () => {
    const prev = new Date(referenceDate);
    prev.setDate(prev.getDate() - 7);
    setReferenceDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(referenceDate);
    next.setDate(next.getDate() + 7);
    setReferenceDate(next);
  };

  const handleCurrentWeek = () => {
    setReferenceDate(new Date());
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm overflow-hidden">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Сетка привычек на неделю
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Отмечайте выполнение привычек в любой день недели одним кликом
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCurrentWeek}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            Текущая неделя
          </button>
          <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              title="Предыдущая неделя"
              aria-label="Предыдущая неделя"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-stone-200 dark:bg-stone-700" />
            <button
              onClick={handleNextWeek}
              className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              title="Следующая неделя"
              aria-label="Следующая неделя"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table / Grid */}
      <div className="overflow-x-auto -mx-5 px-5 pb-2">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800">
              <th className="py-3 px-3 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 w-52">
                Привычка
              </th>
              {weekDays.map((day) => {
                const dateKey = formatDateKey(day);
                const isToday = dateKey === todayKey;
                const { dayName, dayNumber } = formatDayLabel(day);
                return (
                  <th
                    key={dateKey}
                    className={`py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider ${
                      isToday
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-t-lg'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    <div>{dayName}</div>
                    <div className="text-sm font-bold mt-0.5">{dayNumber}</div>
                  </th>
                );
              })}
              <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 w-20">
                Итог
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {habits.map((habit) => {
              const colorStyle = COLOR_CONFIG[habit.color] || COLOR_CONFIG.emerald;
              const completedCountInWeek = weekDays.filter((d) =>
                habit.completedDates.includes(formatDateKey(d))
              ).length;
              const weekRate = Math.round((completedCountInWeek / 7) * 100);

              return (
                <tr key={habit.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition-colors">
                  {/* Habit title & icon */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colorStyle.lightBg}`}
                      >
                        <DynamicIcon name={habit.icon} className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate max-w-[170px]" title={habit.title}>
                        {habit.title}
                      </span>
                    </div>
                  </td>

                  {/* Day cells */}
                  {weekDays.map((day) => {
                    const dateKey = formatDateKey(day);
                    const isCompleted = habit.completedDates.includes(dateKey);
                    const isToday = dateKey === todayKey;

                    return (
                      <td
                        key={dateKey}
                        className={`py-3 px-2 text-center ${
                          isToday ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                        }`}
                      >
                        <button
                          onClick={() => onToggleHabitDate(habit.id, dateKey)}
                          className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-all ${
                            isCompleted
                              ? `${colorStyle.bg} text-white shadow-xs hover:opacity-90 scale-105`
                              : 'border border-stone-200 dark:border-stone-700 text-stone-300 dark:text-stone-600 hover:border-emerald-400 hover:text-emerald-500'
                          }`}
                          title={`${habit.title}: ${dateKey} (${isCompleted ? 'Выполнено' : 'Не выполнено'})`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                          )}
                        </button>
                      </td>
                    );
                  })}

                  {/* Week result */}
                  <td className="py-3 px-3 text-center">
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                      {completedCountInWeek}/7
                    </span>
                    <div className="text-[10px] text-stone-400 dark:text-stone-500">
                      {weekRate}%
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Bottom Summary Row */}
            {habits.length > 0 && (
              <tr className="bg-stone-50/50 dark:bg-stone-800/40 font-medium">
                <td className="py-3 px-3 text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Всего за день
                </td>
                {weekDays.map((day) => {
                  const dateKey = formatDateKey(day);
                  const isToday = dateKey === todayKey;
                  const totalDone = habits.filter((h) =>
                    h.completedDates.includes(dateKey)
                  ).length;
                  const isAll = habits.length > 0 && totalDone === habits.length;

                  return (
                    <td
                      key={dateKey}
                      className={`py-3 px-2 text-center text-xs font-bold ${
                        isToday ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                      } ${isAll ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'}`}
                    >
                      {totalDone}
                    </td>
                  );
                })}
                <td className="py-3 px-3 text-center text-xs font-bold text-stone-700 dark:text-stone-300">
                  -
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
