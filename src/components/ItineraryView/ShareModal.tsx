import React, { useState } from 'react';
import { TripRecord } from '../../types/trip';
import { X, Copy, Check, Printer, Share2, Lock, Globe, FileText } from 'lucide-react';

interface ShareModalProps {
  trip: TripRecord;
  isOpen: boolean;
  onClose: () => void;
  onTogglePublic: (isPublic: boolean) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  trip,
  isOpen,
  onClose,
  onTogglePublic
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isPublic, setIsPublic] = useState(trip.is_public || false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}?trip=${trip.id}&share=true`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySummary = () => {
    const lines = [
      `✈️ ${trip.title}`,
      `📍 Destination: ${trip.destination}`,
      `🗓️ Dates: ${trip.start_date} to ${trip.end_date} (${trip.itinerary_json.days.length} days)`,
      `👥 Travelers: ${trip.travelers} (${trip.trip_type})`,
      `💰 Total Budget: ${trip.currency} ${trip.itinerary_json.budget.estimated_total.toLocaleString()}`,
      '',
      'DAILY OVERVIEW:'
    ];

    trip.itinerary_json.days.forEach((day) => {
      lines.push(`Day ${day.day_number}: ${day.theme}`);
      day.activities.forEach((act) => {
        lines.push(`  • ${act.time} - ${act.title} (${act.location_name})`);
      });
      lines.push('');
    });

    lines.push('Generated with TripGenius AI');

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePublicToggle = () => {
    const nextVal = !isPublic;
    setIsPublic(nextVal);
    onTogglePublic(nextVal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Share & Export Itinerary
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Privacy & Public Share Link */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPublic ? (
                  <Globe className="w-4 h-4 text-teal-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isPublic ? 'Public Link Enabled' : 'Trip is Private'}
                </span>
              </div>
              <button
                onClick={handlePublicToggle}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                  isPublic
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    : 'bg-stone-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isPublic ? 'Make Private' : 'Enable Link'}
              </button>
            </div>

            {isPublic ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Only you can view this trip. Turn on Public Link to allow friends or family to see this itinerary.
              </p>
            )}
          </div>

          {/* Quick Actions: Copy Summary & Print to PDF */}
          <div className="space-y-2">
            <button
              onClick={handleCopySummary}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/50 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-white transition"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Copy Formatted Summary to Clipboard</span>
              </div>
              {copiedSummary ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Copied!
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              onClick={handlePrint}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/50 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-white transition"
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-indigo-600" />
                <span>Print or Save Itinerary as PDF</span>
              </div>
              <span className="text-[11px] text-slate-400">Print Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
