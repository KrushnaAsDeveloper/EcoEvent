import { useMemo } from 'react';
import { useStorage } from '@/store';
import type { ChecklistCategory, PageKey } from '@/types';
import { CHECKLIST_ITEMS } from '@/demoData';
import { Card, Button, EmptyState, SectionTitle, Badge } from '@/components/ui';
import { CheckSquare, Leaf, CalendarDays } from 'lucide-react';
import { checklistCompletion } from '@/utils';

const CATEGORIES: ChecklistCategory[] = ['Waste Management', 'Resource Conservation', 'Sustainable Materials', 'Community Awareness'];

const CATEGORY_ICONS: Record<ChecklistCategory, string> = {
  'Waste Management': 'recycle',
  'Resource Conservation': 'zap',
  'Sustainable Materials': 'leaf',
  'Community Awareness': 'users',
};

interface ChecklistProps {
  onNavigate: (page: PageKey) => void;
}

export function GreenChecklist({ onNavigate }: ChecklistProps) {
  const { data, selectedEvent, toggleChecklistItem } = useStorage();

  const completion = useMemo(
    () => checklistCompletion(data.checklist, selectedEvent?.id ?? null),
    [data.checklist, selectedEvent],
  );

  if (!selectedEvent) {
    return (
      <EmptyState
        icon={<CheckSquare className="w-8 h-8" />}
        title="No event selected"
        message="Select an event to view and complete its green checklist."
        action={<Button onClick={() => onNavigate('events')}>Go to Events</Button>}
      />
    );
  }

  const eventChecklist = data.checklist[selectedEvent.id] ?? {};

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Green Event Checklist"
        subtitle={`Sustainability actions for: ${selectedEvent.name}`}
        icon={<CheckSquare className="w-5 h-5" />}
      />

      {/* Progress bar */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Overall Completion</h3>
            <p className="text-xs text-gray-400 mt-0.5">{completion.completed} of {completion.total} actions completed</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-emerald2-400">{completion.percentage}%</span>
          </div>
        </div>
        <div className="h-3 rounded-full bg-forest-900/60 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald2-600 to-emerald2-400 rounded-full transition-all duration-500"
            style={{ width: `${completion.percentage}%` }}
          />
        </div>
      </Card>

      {/* Category cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CATEGORIES.map((category) => {
          const items = CHECKLIST_ITEMS.filter((i) => i.category === category);
          const completedCount = items.filter((i) => eventChecklist[i.id]).length;
          const pct = Math.round((completedCount / items.length) * 100);

          return (
            <Card key={category} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald2-600/15 text-emerald2-400 flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{category}</h3>
                    <p className="text-xs text-gray-500">{completedCount}/{items.length} completed</p>
                  </div>
                </div>
                <Badge variant={pct === 100 ? 'success' : pct >= 50 ? 'info' : 'neutral'}>{pct}%</Badge>
              </div>

              <div className="space-y-2">
                {items.map((item) => {
                  const checked = !!eventChecklist[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklistItem(selectedEvent.id, item.id, !checked)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                        checked
                          ? 'bg-emerald2-600/10 border border-emerald2-600/20'
                          : 'bg-forest-900/30 border border-forest-600/30 hover:border-forest-500'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                          checked ? 'bg-emerald2-500 text-white' : 'border-2 border-forest-500 text-transparent'
                        }`}
                      >
                        {checked && (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${checked ? 'text-emerald2-200' : 'text-gray-300'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="flex items-start gap-3">
          <CalendarDays className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            Checklist progress is saved automatically in your browser. Each event maintains its own checklist state. {CATEGORY_ICONS['Waste Management']}
          </p>
        </div>
      </Card>
    </div>
  );
}
