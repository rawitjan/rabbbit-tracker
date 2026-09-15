export type HabitCategory = 'health' | 'sport' | 'mind' | 'productivity' | 'lifestyle';

export type HabitColor = 'emerald' | 'sky' | 'amber' | 'rose' | 'violet' | 'indigo';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type TargetFrequency = 'daily' | 'weekdays' | 'weekends';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  icon: string;
  color: HabitColor;
  timeOfDay: TimeOfDay;
  targetFrequency: TargetFrequency;
  completedDates: string[]; // array of 'YYYY-MM-DD' strings
  createdAt: string;
  archived?: boolean;
}

export type ViewMode = 'today' | 'matrix' | 'analytics';

export interface HabitFilter {
  category: 'all' | HabitCategory;
  timeOfDay: 'all' | TimeOfDay;
  search: string;
}
