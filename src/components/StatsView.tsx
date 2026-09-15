import React from 'react';
import { Flame, Trophy, CheckCircle2, TrendingUp, Calendar, Zap, Lightbulb } from 'lucide-react';
import { Habit } from '../types';
import { getRecentDates, formatDateKey, calculateStreaks, RUSSIAN_DAY_NAMES } from '../utils/dateUtils';
import { DynamicIcon } from './DynamicIcon';
import { COLOR_CONFIG } from '../data/defaultHabits';

interface StatsViewProps {
  habits: Habit[];
}

export const StatsView: React.FC<StatsViewProps> = ({ habits }) => {
  // 60-day heatmap data
  const recentDays = getRecentDates(63); // 9 weeks
  const todayKey = formatDateKey(new Date());

  // Total completions across all habits
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);

  // Overall longest streak across all habits
  let allTimeLongestStreak = 0;
  let currentTopStreak = 0;
  let topHabitName = '-';

  habits.forEach((h) => {
    const { currentStreak, longestStreak } = calculateStreaks(h.completedDates);
    if (longestStreak > allTimeLongestStreak) {
      allTimeLongestStreak = longestStreak;
    }
    if (currentStreak > currentTopStreak) {
      currentTopStreak = currentStreak;
      topHabitName = h.title;
    }
  });

  // Calculate consistency in past 30 days
  const past30Days = recentDays.slice(-30);
  let totalPossibleChecks = past30Days.length * (habits.length || 1);
  let totalActualChecks = 0;
  past30Days.forEach((d) => {
    const k = formatDateKey(d);
    habits.forEach((h) => {
      if (h.completedDates.includes(k)) {
        totalActualChecks++;
      }
    });
  });
  const consistencyRate = habits.length > 0 ? Math.round((totalActualChecks / totalPossibleChecks) * 100) : 0;

  // Habit performance ranking
  const sortedHabits = [...habits].sort((a, b) => {
    return b.completedDates.length - a.completedDates.length;
  });

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Всего привычек</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {habits.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">В активном списке</div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Лучшая серия</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {allTimeLongestStreak} <span className="text-sm font-normal text-stone-500">дн.</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {currentTopStreak > 0 ? `Текущая: ${currentTopStreak} дн.` : 'Начните сегодня'}
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Всего выполнений</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {totalCompletions}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Отмеченных галочек</div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Дисциплина</span>
            <TrendingUp className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {consistencyRate}%
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">За последние 30 дней</div>
        </div>
      </div>

      {/* Activity Heatmap (GitHub-style) */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Карта активности (последние 9 недель)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Интенсивность выполнения привычек по дням
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <span>Меньше</span>
            <span className="w-3 h-3 rounded-xs bg-stone-100 dark:bg-stone-800" />
            <span className="w-3 h-3 rounded-xs bg-emerald-200 dark:bg-emerald-950" />
            <span className="w-3 h-3 rounded-xs bg-emerald-400 dark:bg-emerald-700" />
            <span className="w-3 h-3 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
            <span>Больше</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[500px]">
            {recentDays.map((d) => {
              const dateKey = formatDateKey(d);
              const isToday = dateKey === todayKey;
              const completedCount = habits.filter((h) =>
                h.completedDates.includes(dateKey)
              ).length;
              const ratio = habits.length > 0 ? completedCount / habits.length : 0;

              let colorClass = 'bg-stone-100 dark:bg-stone-800';
              if (ratio > 0.75) {
                colorClass = 'bg-emerald-600 text-white';
              } else if (ratio > 0.4) {
                colorClass = 'bg-emerald-400 dark:bg-emerald-600';
              } else if (ratio > 0) {
                colorClass = 'bg-emerald-200 dark:bg-emerald-900';
              }

              return (
                <div
                  key={dateKey}
                  className={`w-3.5 h-3.5 rounded-xs transition-all ${colorClass} ${
                    isToday ? 'ring-2 ring-emerald-500 ring-offset-1' : ''
                  }`}
                  title={`${dateKey}: ${completedCount} из ${habits.length} привычек`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Habit Ranking & Psychology Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Habit Ranking */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Рейтинг привычек по стабильности
          </h3>
          <div className="space-y-3">
            {sortedHabits.map((habit, idx) => {
              const { currentStreak, longestStreak } = calculateStreaks(habit.completedDates);
              const colorStyle = COLOR_CONFIG[habit.color] || COLOR_CONFIG.emerald;
              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-stone-400 w-4">
                      #{idx + 1}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colorStyle.lightBg}`}
                    >
                      <DynamicIcon name={habit.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[150px]">
                      {habit.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {habit.completedDates.length}
                      </span>
                      <span className="text-[10px] text-stone-400 ml-1">дн.</span>
                    </div>
                    {currentStreak > 0 && (
                      <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                        🔥 {currentStreak}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Habit Psychology Tips */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-500" />
              Советы по формированию привычек
            </h3>
            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                  1. Правило двух минут
                </span>
                Новая привычка должна занимать не более 2 минут в начале пути. Вместо «читать 30 страниц» начните с «прочитать одну страницу».
              </div>

              <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50">
                <span className="font-semibold text-sky-800 dark:text-sky-300 block mb-0.5">
                  2. Привязка привычек
                </span>
                Привязывайте новую привычку к уже существующему ритуалу: «Сразу после того, как сварю утренний кофе, я выпью стакан воды».
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
                <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-0.5">
                  3. Никогда не пропускайте дважды
                </span>
                Один пропуск — это случайность. Два пропуска подряд — начало формирования новой, нежелательной привычки.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
