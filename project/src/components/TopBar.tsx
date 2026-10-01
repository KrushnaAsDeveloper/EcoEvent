import type { EcoEvent, PageKey } from '@/types';
import { CalendarDays, ChevronDown, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStorage } from '@/store';
import { Badge } from '@/components/ui';
import { formatDate } from '@/utils';

const PAGE_TITLES: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  events: 'Event Management',
  waste: 'Waste Tracking',
  resources: 'Resource Monitoring',
  checklist: 'Green Event Checklist',
  analytics: 'Analytics & Reports',
  guide: 'Sustainability Guide',
  about: 'About Project',
};

interface TopBarProps {
  current: PageKey;
}

export function TopBar({ current }: TopBarProps) {
  const { data, selectedEvent, selectEvent } = useStorage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-forest-900/90 backdrop-blur-md border-b border-forest-600/50 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between gap-4 pl-12 md:pl-0">
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-white truncate">{PAGE_TITLES[current]}</h2>
          {selectedEvent && (
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="truncate">{formatDate(selectedEvent.date)}</span>
              <span className="text-gray-600">·</span>
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{selectedEvent.venue}</span>
            </div>
          )}
        </div>

        {/* Event selector */}
        <div className="relative flex-shrink-0" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-forest-700/60 border border-forest-600 hover:border-forest-500 transition-colors text-sm"
          >
            <div className="text-left min-w-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Selected Event</p>
              <p className="text-gray-200 font-medium truncate max-w-[140px] md:max-w-[200px]">
                {selectedEvent ? selectedEvent.name : 'No event'}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 bg-forest-800 border border-forest-600 rounded-xl shadow-2xl animate-slide-up overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                {data.events.length === 0 && (
                  <p className="px-4 py-6 text-sm text-gray-500 text-center">No events yet. Create one in the Events page.</p>
                )}
                {data.events.map((event: EcoEvent) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      selectEvent(event.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-forest-700/50 transition-colors border-b border-forest-700/30 last:border-0 ${
                      selectedEvent?.id === event.id ? 'bg-emerald2-600/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-200 truncate">{event.name}</span>
                      {event.isDemo && <Badge variant="demo">DEMO</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {formatDate(event.date)} · {event.venue}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
