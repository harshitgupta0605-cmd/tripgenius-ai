import React, { useEffect, useRef, useState } from 'react';
import { DayPlan, Activity } from '../../types/trip';
import L from 'leaflet';

interface ItineraryMapProps {
  days: DayPlan[];
  destination: string;
}

export const ItineraryMap: React.FC<ItineraryMapProps> = ({ days, destination }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');

  // Collect all valid coordinate points
  const points: { dayNumber: number; activity: Activity; lat: number; lng: number }[] = [];
  days.forEach((day) => {
    day.activities.forEach((act) => {
      if (act.latitude && act.longitude) {
        points.push({
          dayNumber: day.day_number,
          activity: act,
          lat: act.latitude,
          lng: act.longitude
        });
      }
    });
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center
      const defaultCenter: [number, number] = points.length > 0
        ? [points[0].lat, points[0].lng]
        : [26.9124, 75.7873]; // Jaipur fallback

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    // Render markers & polylines based on selected day filter
    if (mapInstanceRef.current && layerGroupRef.current) {
      const map = mapInstanceRef.current;
      const layerGroup = layerGroupRef.current;
      layerGroup.clearLayers();

      const filteredPoints = selectedDayFilter === 'all'
        ? points
        : points.filter((p) => p.dayNumber === selectedDayFilter);

      const dayColors: Record<number, string> = {
        1: '#0D9488', // Teal
        2: '#4F46E5', // Indigo
        3: '#EA580C', // Orange
        4: '#059669', // Emerald
        5: '#E11D48', // Rose
        6: '#8B5CF6'  // Purple
      };

      if (filteredPoints.length > 0) {
        const bounds = L.latLngBounds([]);

        // Group points by day to draw polylines for routes
        const pointsByDay: Record<number, L.LatLngExpression[]> = {};

        filteredPoints.forEach((pt, idx) => {
          const latLng: [number, number] = [pt.lat, pt.lng];
          bounds.extend(latLng);

          if (!pointsByDay[pt.dayNumber]) pointsByDay[pt.dayNumber] = [];
          pointsByDay[pt.dayNumber].push(latLng);

          const color = dayColors[pt.dayNumber] || '#0D9488';

          // Custom circular HTML marker
          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="background-color: ${color}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white;">
                ${idx + 1}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const popupContent = `
            <div style="font-family: inherit; min-width: 170px; padding: 2px;">
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${color};">
                Day ${pt.dayNumber} • ${pt.activity.time}
              </div>
              <h4 style="margin: 4px 0 2px; font-size: 13px; font-weight: 700; color: #0f172a;">
                ${pt.activity.title}
              </h4>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                ${pt.activity.location_name}
              </p>
              <div style="margin-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                <span style="font-weight: 600; color: #0d9488;">${pt.activity.currency} ${pt.activity.estimated_cost}</span>
                <span style="background: #f1f5f9; padding: 1px 6px; border-radius: 4px; text-transform: capitalize;">${pt.activity.category}</span>
              </div>
            </div>
          `;

          L.marker(latLng, { icon: customIcon })
            .bindPopup(popupContent)
            .addTo(layerGroup);
        });

        // Draw connecting route lines
        Object.entries(pointsByDay).forEach(([dayNumStr, pathCoords]) => {
          const color = dayColors[Number(dayNumStr)] || '#0D9488';
          if (pathCoords.length > 1) {
            L.polyline(pathCoords, {
              color: color,
              weight: 3.5,
              opacity: 0.75,
              dashArray: '6, 8'
            }).addTo(layerGroup);
          }
        });

        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
  }, [points.length, selectedDayFilter]);

  return (
    <div className="space-y-4">
      {/* Day Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-stone-200 dark:border-slate-700">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
            Filter Route:
          </span>
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedDayFilter === 'all'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-stone-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-stone-200'
            }`}
          >
            All Stops ({points.length})
          </button>
          {days.map((day) => (
            <button
              key={day.day_number}
              onClick={() => setSelectedDayFilter(day.day_number)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedDayFilter === day.day_number
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-stone-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-stone-200'
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-600" />
          <span>Interactive coordinates enabled</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-stone-200 dark:border-slate-700 shadow-sm bg-stone-100 dark:bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
