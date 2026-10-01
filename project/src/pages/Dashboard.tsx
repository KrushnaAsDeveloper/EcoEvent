import { useMemo } from 'react';
import { useStorage } from '@/store';
import { Card, StatCard, SectionTitle, EmptyState, Badge, Button } from '@/components/ui';
import { Trash2, Zap, Droplets, Users, Weight, Leaf, Lightbulb, CalendarDays, BarChart3, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import type { PageKey } from '@/types';
import {
  eventWasteRecords,
  eventResourceRecords,
  computeWasteSummary,
  computeResourceSummary,
  checklistCompletion,
  checklistByCategory,
  generateRecommendations,
  formatNumber,
  formatDate,
  hasDemoData,
} from '@/utils';

const WASTE_COLORS = { organic: '#84cc16', recyclable: '#10b981', general: '#6b7280' };
const RESOURCE_COLORS = { electricity: '#f59e0b', water: '#0ea5e9' };

interface DashboardProps {
  onNavigate: (page: PageKey) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { data, selectedEvent } = useStorage();

  const wasteRecords = useMemo(() => (selectedEvent ? eventWasteRecords(data.wasteRecords, selectedEvent.id) : []), [data.wasteRecords, selectedEvent]);
  const resourceRecords = useMemo(() => (selectedEvent ? eventResourceRecords(data.resourceRecords, selectedEvent.id) : []), [data.resourceRecords, selectedEvent]);
  const wasteSummary = useMemo(() => computeWasteSummary(wasteRecords, selectedEvent?.actualAttendees ?? selectedEvent?.expectedAttendees ?? null), [wasteRecords, selectedEvent]);
  const resourceSummary = useMemo(() => computeResourceSummary(resourceRecords), [resourceRecords]);
  const checklist = useMemo(() => checklistCompletion(data.checklist, selectedEvent?.id ?? null), [data.checklist, selectedEvent]);
  const checklistCats = useMemo(() => checklistByCategory(data.checklist, selectedEvent?.id ?? null), [data.checklist, selectedEvent]);
  const recommendations = useMemo(
    () => generateRecommendations(selectedEvent, wasteSummary, resourceSummary, checklist.percentage),
    [selectedEvent, wasteSummary, resourceSummary, checklist.percentage],
  );

  const showDemoIndicator = selectedEvent?.isDemo || hasDemoData(wasteRecords) || hasDemoData(resourceRecords);

  if (!selectedEvent) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={<CalendarDays className="w-8 h-8" />}
          title="No event selected"
          message="Create or select an event to view its sustainability dashboard."
          action={<Button onClick={() => onNavigate('events')}>Go to Events</Button>}
        />
      </div>
    );
  }

  const wastePieData = [
    { name: 'Organic', value: wasteSummary.totalOrganic },
    { name: 'Recyclable', value: wasteSummary.totalRecyclable },
    { name: 'General', value: wasteSummary.totalGeneral },
  ].filter((d) => d.value > 0);

  const resourceBarData = resourceRecords.map((r) => ({
    date: formatDate(r.recordDate),
    Electricity: r.electricityKwh,
    Water: r.waterLitres / 10,
  }));

  const checklistChartData = checklistCats.map((c) => ({
    name: c.category,
    percentage: c.percentage,
    fill: c.percentage >= 75 ? '#10b981' : c.percentage >= 50 ? '#f59e0b' : c.percentage >= 25 ? '#f97316' : '#ef4444',
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">{selectedEvent.name}</h2>
            {selectedEvent.isDemo && <Badge variant="demo">DEMO DATA</Badge>}
          </div>
          <p className="text-sm text-gray-400">
            {selectedEvent.type} · {formatDate(selectedEvent.date)} · {selectedEvent.venue}
          </p>
        </div>
        {showDemoIndicator && (
          <div className="flex items-center gap-2">
            <Badge variant="demo">DEMO DATA VISIBLE</Badge>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Attendees" value={formatNumber(selectedEvent.actualAttendees ?? selectedEvent.expectedAttendees)} icon={<Users className="w-4 h-4" />} subtext={selectedEvent.actualAttendees !== null ? 'Actual' : 'Expected'} />
        <StatCard label="Total Waste" value={formatNumber(wasteSummary.totalWaste)} unit="kg" icon={<Weight className="w-4 h-4" />} accent="amber" />
        <StatCard label="Waste/Attendee" value={formatNumber(wasteSummary.wastePerAttendee, 2)} unit="kg" icon={<TrendingUp className="w-4 h-4" />} accent="orange" />
        <StatCard label="Electricity" value={formatNumber(resourceSummary.totalElectricity)} unit="kWh" icon={<Zap className="w-4 h-4" />} accent="amber" subtext="Manually entered" />
        <StatCard label="Water" value={formatNumber(resourceSummary.totalWater)} unit="L" icon={<Droplets className="w-4 h-4" />} accent="sky" subtext="Manually entered" />
        <StatCard label="Checklist" value={`${checklist.percentage}`} unit="%" icon={<Leaf className="w-4 h-4" />} subtext={`${checklist.completed}/${checklist.total} done`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Waste composition */}
        <Card className="p-5">
          <SectionTitle title="Waste Composition" icon={<Trash2 className="w-5 h-5" />} />
          {wastePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={wastePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {wastePieData.map((entry) => {
                    const color = entry.name === 'Organic' ? WASTE_COLORS.organic : entry.name === 'Recyclable' ? WASTE_COLORS.recyclable : WASTE_COLORS.general;
                    return <Cell key={entry.name} fill={color} />;
                  })}
                </Pie>
                <Tooltip formatter={(v) => `${v} kg`} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No waste data recorded" onAction={() => onNavigate('waste')} actionLabel="Add Waste Data" />
          )}
        </Card>

        {/* Resource consumption */}
        <Card className="p-5">
          <SectionTitle title="Resource Consumption" icon={<BarChart3 className="w-5 h-5" />} />
          {resourceBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={resourceBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a4232" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, name) => (name === 'Water' ? `${(v as number) * 10} L` : `${v} kWh`)} />
                <Legend iconType="circle" />
                <Bar dataKey="Electricity" fill={RESOURCE_COLORS.electricity} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Water" fill={RESOURCE_COLORS.water} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No resource data recorded" onAction={() => onNavigate('resources')} actionLabel="Add Resource Data" />
          )}
        </Card>

        {/* Checklist progress */}
        <Card className="p-5">
          <SectionTitle title="Checklist Progress" icon={<Leaf className="w-5 h-5" />} />
          {checklist.total > 0 && (
            <ResponsiveContainer width="100%" height={240}>
              <RadialBarChart innerRadius="25%" outerRadius="90%" data={checklistChartData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: '#123325' }} dataKey="percentage" cornerRadius={6} />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} />
              </RadialBarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recommended actions */}
      <Card className="p-5">
        <SectionTitle title="Recommended Actions" subtitle="Suggestions based on the data entered for this event" icon={<Lightbulb className="w-5 h-5" />} />
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg bg-forest-900/40 border border-forest-600/30 animate-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="w-7 h-7 rounded-lg bg-emerald2-600/15 text-emerald2-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                {i + 1}
              </div>
              <p className="text-sm text-gray-300">{rec}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function EmptyChartState({ message, onAction, actionLabel }: { message: string; onAction: () => void; actionLabel: string }) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center">
      <p className="text-sm text-gray-500 mb-3">{message}</p>
      <Button variant="secondary" onClick={onAction} className="text-xs">{actionLabel}</Button>
    </div>
  );
}
