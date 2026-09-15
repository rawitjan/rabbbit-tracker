import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, HabitCategory, HabitColor, TimeOfDay, TargetFrequency } from '../types';
import { DynamicIcon } from './DynamicIcon';
import {
  CATEGORY_CONFIG,
  COLOR_CONFIG,
  TIME_OF_DAY_CONFIG,
  AVAILABLE_ICONS,
} from '../data/defaultHabits';
import { formatDateKey } from '../utils/dateUtils';

interface HabitModalProps {
  isOpen: boolean;
  habitToEdit?: Habit | null;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'completedDates' | 'createdAt'> & { id?: string }) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  habitToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [color, setColor] = useState<HabitColor>('emerald');
  const [icon, setIcon] = useState('Sparkles');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('anytime');
  const [targetFrequency, setTargetFrequency] = useState<TargetFrequency>('daily');
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category);
      setColor(habitToEdit.color);
      setIcon(habitToEdit.icon);
      setTimeOfDay(habitToEdit.timeOfDay);
      setTargetFrequency(habitToEdit.targetFrequency);
    } else {
      setTitle('');
      setDescription('');
      setCategory('health');
      setColor('emerald');
      setIcon('Droplets');
      setTimeOfDay('anytime');
      setTargetFrequency('daily');
    }
    setError('');
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Пожалуйста, укажите название привычки');
      return;
    }

    onSave({
      ...(habitToEdit ? { id: habitToEdit.id } : {}),
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      color,
      icon,
      timeOfDay,
      targetFrequency,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {habitToEdit ? 'Редактировать привычку' : 'Новая привычка'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Название привычки *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Например: Выпивать 2л воды, Чтение 15 мин..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Описание или мотивация (необязательно)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Зачем это важно для вас?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                Категория
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_CONFIG) as HabitCategory[]).map((catKey) => {
                  const isSelected = category === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setCategory(catKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {CATEGORY_CONFIG[catKey].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Accent */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                Цвет карточки
              </label>
              <div className="flex items-center gap-2.5">
                {(Object.keys(COLOR_CONFIG) as HabitColor[]).map((cKey) => {
                  const isSelected = color === cKey;
                  const colorObj = COLOR_CONFIG[cKey];
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setColor(cKey)}
                      className={`w-7 h-7 rounded-full ${colorObj.bg} flex items-center justify-center transition-transform ${
                        isSelected ? 'ring-2 ring-offset-2 ring-stone-800 dark:ring-stone-200 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                Иконка
              </label>
              <div className="grid grid-cols-8 gap-2">
                {AVAILABLE_ICONS.map((iconName) => {
                  const isSelected = icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setIcon(iconName)}
                      className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                          : 'bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      <DynamicIcon name={iconName} className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time of Day & Frequency Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Time of Day */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  Время дня
                </label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="anytime">В любое время</option>
                  <option value="morning">Утро</option>
                  <option value="afternoon">День</option>
                  <option value="evening">Вечер</option>
                </select>
              </div>

              {/* Target Frequency */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  Регулярность
                </label>
                <select
                  value={targetFrequency}
                  onChange={(e) => setTargetFrequency(e.target.value as TargetFrequency)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="daily">Каждый день</option>
                  <option value="weekdays">Только по будням</option>
                  <option value="weekends">Только по выходным</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
              >
                {habitToEdit ? 'Сохранить изменения' : 'Создать привычку'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
