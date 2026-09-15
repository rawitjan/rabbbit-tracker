import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, CheckSquare, Sparkles, FilterX } from 'lucide-react';
import { Habit, ViewMode, HabitFilter } from './types';
import { getInitialDefaultHabits } from './data/defaultHabits';
import { formatDateKey } from './utils/dateUtils';
import { Navbar } from './components/Navbar';
import { WeekStrip } from './components/WeekStrip';
import { DailyProgressBar } from './components/DailyProgressBar';
import { HabitCard } from './components/HabitCard';
import { HabitModal } from './components/HabitModal';
import { HabitWeeklyMatrix } from './components/HabitWeeklyMatrix';
import { StatsView } from './components/StatsView';
import { FilterBar } from './components/FilterBar';

const STORAGE_KEY = 'habit_tracker_data_v1';
const THEME_KEY = 'habit_tracker_theme';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark class to html document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  // Habits state
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved habits:', e);
    }
    return getInitialDefaultHabits();
  });

  // Save habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  }, [habits]);

  // View state
  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedDateKey = formatDateKey(selectedDate);
  const todayKey = formatDateKey(new Date());
  const isSelectedDateToday = selectedDateKey === todayKey;

  // Filter state
  const [filter, setFilter] = useState<HabitFilter>({
    category: 'all',
    timeOfDay: 'all',
    search: '',
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  // Toggle habit completion for a specific date
  const handleToggleHabit = (habitId: string, dateKey: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(dateKey);
        const newDates = exists
          ? h.completedDates.filter((d) => d !== dateKey)
          : [...h.completedDates, dateKey];
        return {
          ...h,
          completedDates: newDates,
        };
      })
    );
  };

  // Add or edit habit
  const handleSaveHabit = (
    habitData: Omit<Habit, 'id' | 'completedDates' | 'createdAt'> & { id?: string }
  ) => {
    if (habitData.id) {
      // Edit existing
      setHabits((prev) =>
        prev.map((h) => (h.id === habitData.id ? { ...h, ...habitData } : h))
      );
    } else {
      // Add new
      const newHabit: Habit = {
        ...habitData,
        id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        completedDates: [],
        createdAt: formatDateKey(new Date()),
      };
      setHabits((prev) => [newHabit, ...prev]);
    }
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту привычку?')) {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
    }
  };

  // Reset to default sample habits
  const handleResetData = () => {
    if (
      window.confirm(
        'Восстановить примеры привычек? Текущие изменения будут сброшены к исходным.'
      )
    ) {
      const defaults = getInitialDefaultHabits();
      setHabits(defaults);
      setSelectedDate(new Date());
    }
  };

  // Filtered habits for today view
  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      // Search
      if (
        filter.search &&
        !h.title.toLowerCase().includes(filter.search.toLowerCase()) &&
        !h.description?.toLowerCase().includes(filter.search.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (filter.category !== 'all' && h.category !== filter.category) {
        return false;
      }

      // Time of Day
      if (filter.timeOfDay !== 'all' && h.timeOfDay !== filter.timeOfDay) {
        return false;
      }

      return true;
    });
  }, [habits, filter]);

  // Stats for the selected day
  const completedTodayCount = habits.filter((h) =>
    h.completedDates.includes(selectedDateKey)
  ).length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenNewHabit={() => {
          setHabitToEdit(null);
          setIsModalOpen(true);
        }}
        onResetData={handleResetData}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TODAY VIEW */}
        {currentView === 'today' && (
          <div className="space-y-6">
            {/* Interactive Week Calendar Strip */}
            <WeekStrip
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              habits={habits}
            />

            {/* Daily Progress Card */}
            <DailyProgressBar
              completedCount={completedTodayCount}
              totalCount={habits.length}
              isToday={isSelectedDateToday}
            />

            {/* Filter and Search Bar */}
            <FilterBar filter={filter} onChangeFilter={setFilter} />

            {/* Habits List */}
            {filteredHabits.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      dateKey={selectedDateKey}
                      isToday={isSelectedDateToday}
                      onToggle={handleToggleHabit}
                      onEdit={(h) => {
                        setHabitToEdit(h);
                        setIsModalOpen(true);
                      }}
                      onDelete={handleDeleteHabit}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : habits.length === 0 ? (
              /* No habits at all */
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-10 text-center shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
                  У вас пока нет привычек
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-5">
                  Создайте свою первую полезную привычку или верните демонстрационный набор, чтобы начать отслеживать прогресс!
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setHabitToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Создать привычку
                  </button>
                  <button
                    onClick={handleResetData}
                    className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition-all"
                  >
                    Загрузить примеры
                  </button>
                </div>
              </div>
            ) : (
              /* No habits match filters */
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 text-center shadow-sm">
                <FilterX className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Привычки не найдены
                </h4>
                <p className="text-xs text-stone-400 max-w-xs mx-auto mb-4">
                  Попробуйте сбросить фильтры или изменить поисковый запрос
                </p>
                <button
                  onClick={() =>
                    setFilter({ category: 'all', timeOfDay: 'all', search: '' })
                  }
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        )}

        {/* MATRIX / GRID VIEW */}
        {currentView === 'matrix' && (
          <HabitWeeklyMatrix
            habits={habits}
            onToggleHabitDate={handleToggleHabit}
          />
        )}

        {/* ANALYTICS & STATS VIEW */}
        {currentView === 'analytics' && <StatsView habits={habits} />}
      </main>

      {/* Habit Create / Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        habitToEdit={habitToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setHabitToEdit(null);
        }}
        onSave={handleSaveHabit}
      />
    </div>
  );
}
