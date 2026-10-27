import React, { useState } from 'react';
import { Activity, ActivityCategory } from '../../types/trip';
import { X, Clock, MapPin, DollarSign, Tag, FileText, Check } from 'lucide-react';

interface EditActivityModalProps {
  activity: Activity;
  dayNumber: number;
  isOpen: boolean;
  currency: string;
  onClose: () => void;
  onSave: (updatedActivity: Activity) => void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  activity,
  dayNumber,
  isOpen,
  currency,
  onClose,
  onSave
}) => {
  const [time, setTime] = useState(activity.time);
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [category, setCategory] = useState<ActivityCategory>(activity.category || 'sightseeing');
  const [duration, setDuration] = useState(activity.estimated_duration_minutes || 90);
  const [cost, setCost] = useState(activity.estimated_cost || 0);
  const [locationName, setLocationName] = useState(activity.location_name);
  const [customNotes, setCustomNotes] = useState(activity.custom_notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...activity,
      time,
      title,
      description,
      category,
      estimated_duration_minutes: Number(duration) || 60,
      estimated_cost: Number(cost) || 0,
      location_name: locationName,
      custom_notes: customNotes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Edit Activity (Day {dayNumber})
            </h3>
            <span className="text-xs text-slate-500">Fine-tune timings, costs, and details</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> Start Time
              </label>
              <input
                type="text"
                placeholder="09:30"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duration (mins)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 30)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Activity Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" /> Location / Venue
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-teal-600" /> Cost ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-teal-600" /> Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900 capitalize"
            >
              <option value="sightseeing">Sightseeing</option>
              <option value="culture">Culture & Heritage</option>
              <option value="food">Food & Dining</option>
              <option value="adventure">Adventure & Outdoors</option>
              <option value="relaxation">Relaxation & Scenic</option>
              <option value="shopping">Shopping & Markets</option>
              <option value="nightlife">Nightlife</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-teal-600" /> Custom Traveler Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Bring student ID for concession, dress modestly"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-slate-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
