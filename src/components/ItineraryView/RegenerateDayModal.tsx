import React, { useState } from 'react';
import { Sparkles, RefreshCw, X, Loader2, AlertCircle } from 'lucide-react';

interface RegenerateDayModalProps {
  tripId: string;
  dayNumber: number;
  isOpen: boolean;
  destination: string;
  onClose: () => void;
  onSuccess: (updatedDay: any, fullItinerary: any) => void;
}

export const RegenerateDayModal: React.FC<RegenerateDayModalProps> = ({
  tripId,
  dayNumber,
  isOpen,
  destination,
  onClose,
  onSuccess
}) => {
  const [focusNotes, setFocusNotes] = useState('');
  const [excludePlaces, setExcludePlaces] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const excludes = excludePlaces
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`/api/trips/${tripId}/regenerate-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day_number: dayNumber,
          focus_notes: focusNotes.trim() || 'Provide a fresh sequence of balanced activities',
          exclude_places: excludes
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to regenerate Day ${dayNumber} (${response.status})`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Server error during regeneration');
      }

      onSuccess(data.updated_day, data.itinerary);
      onClose();
    } catch (err: any) {
      console.error('Day regeneration failed:', err);
      setError(err.message || 'Regeneration error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Regenerate Day {dayNumber}
              </h3>
              <span className="text-xs text-slate-500">Other days will remain unchanged</span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegenerate} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              What would you like to change for Day {dayNumber}?
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Focus on modern art galleries and local food, reduce steep hiking, prefer indoor activities due to rain..."
              value={focusNotes}
              onChange={(e) => setFocusNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Places or attractions to exclude (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Crowded markets, fort climb"
              value={excludePlaces}
              onChange={(e) => setExcludePlaces(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-stone-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-200/60 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">AI Planning Rule:</p>
            <p>
              Gemini will craft a replacement day matching your destination ({destination}), recalculate daily activity costs, and update the global budget.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Regenerating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Day {dayNumber}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
