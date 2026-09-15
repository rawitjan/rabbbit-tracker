/**
 * Formats a Date object as 'YYYY-MM-DD' in local time
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses 'YYYY-MM-DD' into a local Date
 */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns array of 7 dates for the week containing the reference date (Monday to Sunday)
 */
export function getWeekDays(referenceDate: Date): Date[] {
  const date = new Date(referenceDate);
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

/**
 * Russian abbreviations for days of the week starting with Monday
 */
export const RUSSIAN_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const RUSSIAN_MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const RUSSIAN_MONTH_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export function formatRussianDateHeader(date: Date): string {
  const day = date.getDate();
  const month = RUSSIAN_MONTH_GENITIVE[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDayLabel(date: Date): { dayName: string; dayNumber: number } {
  // 0 = Sunday -> index 6; 1 = Monday -> index 0
  const jsDay = date.getDay();
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
  return {
    dayName: RUSSIAN_DAY_NAMES[dayIndex],
    dayNumber: date.getDate(),
  };
}

/**
 * Calculates current streak and longest streak from completed dates
 */
export function calculateStreaks(completedDates: string[], referenceDate: Date = new Date()): {
  currentStreak: number;
  longestStreak: number;
  isCompletedToday: boolean;
} {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, isCompletedToday: false };
  }

  const dateSet = new Set(completedDates);
  const todayKey = formatDateKey(referenceDate);
  const isCompletedToday = dateSet.has(todayKey);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(referenceDate);

  // If not completed today, check if yesterday was completed
  if (!isCompletedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (dateSet.has(formatDateKey(checkDate))) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calculate longest streak
  const sortedDates = Array.from(dateSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedDates) {
    const curDate = parseDateKey(dStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = curDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = curDate;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    isCompletedToday,
  };
}

/**
 * Generates an array of past N dates ending today for matrix or heatmaps
 */
export function getRecentDates(count: number = 30, endDate: Date = new Date()): Date[] {
  const dates: Date[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }
  return dates;
}
