import React from 'react';
import { BudgetBreakdown } from '../../types/trip';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  DollarSign,
  Users
} from 'lucide-react';

interface BudgetPlannerProps {
  budget: BudgetBreakdown;
  currency: string;
  travelers: number;
  onUpdateBudget: (newBudget: BudgetBreakdown) => void;
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  budget,
  currency,
  travelers,
  onUpdateBudget
}) => {
  const total = budget.total_budget || 1;
  const estimated = budget.estimated_total || 0;
  const remaining = total - estimated;
  const isOverBudget = remaining < 0;
  const percentUsed = Math.min(100, Math.round((estimated / total) * 100));

  const perPersonTotal = Math.round(estimated / Math.max(1, travelers));

  const categories = [
    { key: 'accommodation', label: 'Accommodation', amount: budget.accommodation, color: 'bg-teal-500', barColor: '#14b8a6' },
    { key: 'food', label: 'Food & Dining', amount: budget.food, color: 'bg-emerald-500', barColor: '#10b981' },
    { key: 'activities', label: 'Sightseeing & Activities', amount: budget.activities, color: 'bg-indigo-500', barColor: '#6366f1' },
    { key: 'transportation', label: 'Intercity Transport / Flights', amount: budget.transportation, color: 'bg-amber-500', barColor: '#f59e0b' },
    { key: 'local_transport', label: 'Local Commute (Metros/Taxis)', amount: budget.local_transport, color: 'bg-cyan-500', barColor: '#06b6d4' },
    { key: 'miscellaneous', label: 'Emergency & Miscellaneous', amount: budget.miscellaneous, color: 'bg-slate-400', barColor: '#94a3b8' }
  ];

  const handleFieldChange = (key: keyof BudgetBreakdown, value: number) => {
    const updated = { ...budget, [key]: Math.max(0, value) };
    // Recalculate estimated_total
    updated.estimated_total = Math.round(
      (updated.accommodation +
        updated.food +
        updated.activities +
        updated.transportation +
        updated.local_transport +
        updated.miscellaneous) * 100
    ) / 100;
    onUpdateBudget(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Total vs Estimated vs Remaining */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Budget Limit</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {currency} {total.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Configured ceiling</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Estimated Total Cost</span>
          <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
            {currency} {estimated.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Sum of all planned items</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs space-y-1 ${
          isOverBudget
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
        }`}>
          <span className="text-xs font-semibold flex items-center justify-between">
            <span>Remaining Buffer</span>
            {isOverBudget ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </span>
          <div className="text-2xl font-extrabold">
            {isOverBudget ? `-${currency} ${Math.abs(remaining).toLocaleString()}` : `${currency} ${remaining.toLocaleString()}`}
          </div>
          <p className="text-[11px] opacity-80">
            {isOverBudget ? 'Over budget by ' + Math.abs(remaining) : 'Leftover unallocated funds'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Per-Person Share
          </span>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {currency} {perPersonTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Divided across {travelers} traveler{travelers > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-stone-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Budget Utilization ({percentUsed}%)</span>
          <span className={isOverBudget ? 'text-rose-600 font-extrabold' : 'text-teal-600 font-semibold'}>
            {isOverBudget ? 'Exceeds budget limit' : 'Within budget parameters'}
          </span>
        </div>

        {/* Stacked multi-color bar */}
        <div className="h-4 w-full bg-stone-100 dark:bg-slate-700 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((cat) => {
            const pct = Math.max(0, (cat.amount / (estimated || 1)) * 100);
            if (pct <= 0) return null;
            return (
              <div
                key={cat.key}
                style={{ width: `${pct}%`, backgroundColor: cat.barColor }}
                title={`${cat.label}: ${currency} ${cat.amount} (${Math.round(pct)}%)`}
                className="h-full transition-all duration-300"
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
              <span>{cat.label} ({Math.round((cat.amount / (estimated || 1)) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown Details & Editable Adjustments */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-stone-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-slate-700/80 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-teal-600" />
            <span>Category Breakdown & Adjustments</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Edit estimated totals directly to calibrate your trip plan
          </span>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-slate-700/80">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/50 dark:hover:bg-slate-700/20 transition"
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{cat.label}</h4>
                  <span className="text-[11px] text-slate-400">
                    {cat.key === 'activities' || cat.key === 'food'
                      ? 'Aggregated from day-by-day scheduled activities'
                      : 'Fixed category allocation'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={cat.amount}
                  onChange={(e) =>
                    handleFieldChange(cat.key as keyof BudgetBreakdown, Number(e.target.value) || 0)
                  }
                  className="w-28 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
