import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SavedPlace } from '../types/trip';
import {
  Bookmark,
  Plus,
  Trash2,
  MapPin,
  CalendarPlus,
  Star,
  ExternalLink,
  Tag
} from 'lucide-react';

export const SavedPlaces: React.FC = () => {
  const { savedPlaces, toggleSavePlace, startPlanningForDestination } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Place Form
  const [newName, setNewName] = useState('');
  const [newDest, setNewDest] = useState('');
  const [newCategory, setNewCategory] = useState('Historic Landmark');
  const [newNotes, setNewNotes] = useState('');

  const categories = ['all', ...Array.from(new Set(savedPlaces.map((p) => p.category)))];

  const filtered = savedPlaces.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  const handleCreatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDest.trim()) return;

    toggleSavePlace({
      name: newName.trim(),
      destination: newDest.trim(),
      category: newCategory,
      notes: newNotes.trim()
    });

    setNewName('');
    setNewDest('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-teal-600" />
            <span>Saved Places & Bookmarks</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep track of favorite monuments, rooftop bars, viewpoints, and stepwells.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bookmark</span>
        </button>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Places Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No saved places found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Bookmark attractions while viewing an itinerary or click "Add Bookmark" to record dream destinations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((place) => (
            <div
              key={place.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {place.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {place.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleSavePlace(place)}
                    title="Remove from bookmarks"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>{place.destination}</span>
                </div>

                {place.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-stone-50 dark:bg-slate-700/40 p-3 rounded-xl border border-stone-100 dark:border-slate-700 italic">
                    "{place.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{place.rating || 4.8}</span>
                </span>

                <button
                  onClick={() => startPlanningForDestination(place.destination)}
                  className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Plan Trip Here</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Place Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Saved Place</h3>
            <form onSubmit={handleCreatePlace} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Place Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nahargarh Fort Sunset Point"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs bg-stone-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Destination City / Country *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur, India"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs bg-stone-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Historic Fort, Rooftop Cafe, Stepwell"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs bg-stone-50 dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Best light around 5:30 PM, cash only entry"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs bg-stone-50 dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                >
                  Save Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
