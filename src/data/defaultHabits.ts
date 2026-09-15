import { Habit } from '../types';
import { formatDateKey } from '../utils/dateUtils';

export const CATEGORY_CONFIG = {
  health: { label: 'Здоровье', color: 'emerald' },
  sport: { label: 'Спорт', color: 'rose' },
  mind: { label: 'Разум', color: 'violet' },
  productivity: { label: 'Продуктивность', color: 'amber' },
  lifestyle: { label: 'Стиль жизни', color: 'sky' },
} as const;

export const COLOR_CONFIG = {
  emerald: {
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    ring: 'focus:ring-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:bg-emerald-600',
    activeBg: 'bg-emerald-500 text-white',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
  sky: {
    bg: 'bg-sky-500',
    lightBg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
    border: 'border-sky-200 dark:border-sky-800',
    ring: 'focus:ring-sky-400',
    text: 'text-sky-600 dark:text-sky-400',
    hover: 'hover:bg-sky-600',
    activeBg: 'bg-sky-500 text-white',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
  },
  amber: {
    bg: 'bg-amber-500',
    lightBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    ring: 'focus:ring-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:bg-amber-600',
    activeBg: 'bg-amber-500 text-white',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  },
  rose: {
    bg: 'bg-rose-500',
    lightBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
    ring: 'focus:ring-rose-400',
    text: 'text-rose-600 dark:text-rose-400',
    hover: 'hover:bg-rose-600',
    activeBg: 'bg-rose-500 text-white',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  },
  violet: {
    bg: 'bg-violet-500',
    lightBg: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800',
    ring: 'focus:ring-violet-400',
    text: 'text-violet-600 dark:text-violet-400',
    hover: 'hover:bg-violet-600',
    activeBg: 'bg-violet-500 text-white',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  },
  indigo: {
    bg: 'bg-indigo-500',
    lightBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
    ring: 'focus:ring-indigo-400',
    text: 'text-indigo-600 dark:text-indigo-400',
    hover: 'hover:bg-indigo-600',
    activeBg: 'bg-indigo-500 text-white',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
  },
};

export const TIME_OF_DAY_CONFIG = {
  morning: { label: 'Утро', icon: 'Sunrise' },
  afternoon: { label: 'День', icon: 'Sun' },
  evening: { label: 'Вечер', icon: 'Sunset' },
  anytime: { label: 'В любое время', icon: 'Clock' },
} as const;

export const AVAILABLE_ICONS = [
  'Droplets',
  'Flame',
  'BookOpen',
  'Sparkles',
  'Target',
  'Footprints',
  'Bed',
  'Apple',
  'Dumbbell',
  'Smile',
  'Heart',
  'Coffee',
  'Bike',
  'Brain',
  'Zap',
  'Sun',
];

export function getInitialDefaultHabits(): Habit[] {
  const today = new Date();
  
  const getDaysAgo = (days: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - days);
    return formatDateKey(d);
  };

  return [
    {
      id: 'habit-1',
      title: 'Пить 2 литра чистой воды',
      description: 'Поддержание водного баланса в течение дня',
      category: 'health',
      icon: 'Droplets',
      color: 'sky',
      timeOfDay: 'anytime',
      targetFrequency: 'daily',
      completedDates: [getDaysAgo(0), getDaysAgo(1), getDaysAgo(2), getDaysAgo(3), getDaysAgo(4)],
      createdAt: getDaysAgo(14),
    },
    {
      id: 'habit-2',
      title: 'Утренняя зарядка и растяжка',
      description: '15 минут для бодрости и здоровья суставов',
      category: 'sport',
      icon: 'Flame',
      color: 'rose',
      timeOfDay: 'morning',
      targetFrequency: 'daily',
      completedDates: [getDaysAgo(0), getDaysAgo(1), getDaysAgo(2), getDaysAgo(3)],
      createdAt: getDaysAgo(10),
    },
    {
      id: 'habit-3',
      title: 'Чтение книги (20 страниц)',
      description: 'Художественная литература или саморазвитие',
      category: 'mind',
      icon: 'BookOpen',
      color: 'amber',
      timeOfDay: 'evening',
      targetFrequency: 'daily',
      completedDates: [getDaysAgo(1), getDaysAgo(2), getDaysAgo(3), getDaysAgo(5)],
      createdAt: getDaysAgo(12),
    },
    {
      id: 'habit-4',
      title: 'Медитация и осознанное дыхание',
      description: '10 минут спокойствия и снижения стресса',
      category: 'mind',
      icon: 'Sparkles',
      color: 'violet',
      timeOfDay: 'morning',
      targetFrequency: 'daily',
      completedDates: [getDaysAgo(0), getDaysAgo(2), getDaysAgo(3)],
      createdAt: getDaysAgo(7),
    },
    {
      id: 'habit-5',
      title: 'Глубокий фокус-блок (90 минут)',
      description: 'Работа над ключевой задачей без отвлечений',
      category: 'productivity',
      icon: 'Target',
      color: 'emerald',
      timeOfDay: 'afternoon',
      targetFrequency: 'weekdays',
      completedDates: [getDaysAgo(1), getDaysAgo(2), getDaysAgo(3), getDaysAgo(4)],
      createdAt: getDaysAgo(14),
    },
    {
      id: 'habit-6',
      title: 'Вечерняя прогулка (8 000+ шагов)',
      description: 'Свежий воздух перед сном для крепкого отдыха',
      category: 'lifestyle',
      icon: 'Footprints',
      color: 'indigo',
      timeOfDay: 'evening',
      targetFrequency: 'daily',
      completedDates: [getDaysAgo(1), getDaysAgo(2), getDaysAgo(4)],
      createdAt: getDaysAgo(8),
    },
  ];
}
