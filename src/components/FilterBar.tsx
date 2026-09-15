import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { HabitCategory, HabitFilter, TimeOfDay } from '../types';
import { CATEGORY_CONFIG, TIME_OF_DAY_CONFIG } from '../data/defaultHabits';

interface FilterBarProps {
  filter: HabitFilter;
  onChangeFilter: (filter: HabitFilter) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filter, onChangeFilter }) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => onChangeFilter({ ...filter, search: e.target.value })}
          placeholder="Поиск по привычкам..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {/* Time of Day Filter */}
        <select
          value={filter.timeOfDay}
          onChange={(e) => onChangeFilter({ ...filter, timeOfDay: e.target.value as HabitFilter['timeOfDay'] })}
          className="text-xs px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        >
          <option value="all">Любое время дня</option>
          <option value="morning">Утро</option>
          <option value="afternoon">День</option>
          <option value="evening">Вечер</option>
          <option value="anytime">В течение дня</option>
        </select>

        {/* Category Filter */}
        <select
          value={filter.category}
          onChange={(e) => onChangeFilter({ ...filter, category: e.target.value as HabitFilter['category'] })}
          className="text-xs px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        >
          <option value="all">Все категории</option>
          {(Object.keys(CATEGORY_CONFIG) as HabitCategory[]).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_CONFIG[cat].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
