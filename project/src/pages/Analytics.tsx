import { useMemo } from 'react';
import { useStorage } from '@/store';
import type { PageKey } from '@/types';
import { Card, Button, Badge, EmptyState, SectionTitle, StatCard } from '@/components/ui';
import { useToasts } from '@/hooks/useToasts';
import {
  eventWasteRecords,
  eventResourceRecords,
  computeWasteSummary,
  computeResourceSummary,
  checklistCompletion,
  checklistByCategory,
  generateRecommendations,
  formatDate,
  formatNumber,
  downloadCSV,
} from '@/utils';
import { BarChart3, Download, CalendarDays, Zap, Droplets, Recycle, Weight, FileText, Info } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const WASTE_COLORS = { organic: '#84cc16', recyclable: '#10b981', general: '#6b7280' };

interface AnalyticsProps {
  onNavigate: (page: PageKey) => void;
}

export function Analytics({ onNavigate }: AnalyticsProps) {
  const { data, selectedEvent } = useStorage();
  const { success } = useToasts();

  const wasteRecords = useMemo(
    () => (selectedEvent ? eventWasteRecords(data.wasteRecords, selectedEvent.id) : []),
    [data.wasteRecords, selectedEvent],
  );
  const resourceRecords = useMemo(
    () => (selectedEvent ? eventResourceRecords(data.resourceRecords, selectedEvent.id) : []),
    [data.resourceRecords, selectedEvent],
  );
  const wasteSummary = useMemo(
    () => computeWasteSummary(wasteRecords, selectedEvent?.actualAttendees ?? selectedEvent?.expectedAttendees ?? null),
    [wasteRecords, selectedEvent],
  );
  const resourceSummary = useMemo(() => computeResourceSummary(resourceRecords), [resourceRecords]);
  const checklist = useMemo(() => checklistCompletion(data.checklist, selectedEvent?.id ?? null), [data.checklist, selectedEvent]);
  const checklistCats = useMemo(() => checklistByCategory(data.checklist, selectedEvent?.id ?? null), [data.checklist, selectedEvent]);
  const recommendations = useMemo(
    () => generateRecommendations(selectedEvent, wasteSummary, resourceSummary, checklist.percentage),
    [selectedEvent, wasteSummary, resourceSummary, checklist.percentage],
  );

  const wastePieData = [
    { name: 'Organic', value: wasteSummary.totalOrganic },
    { name: 'Recyclable', value: wasteSummary.totalRecyclable },
    { name: 'General', value: wasteSummary.totalGeneral },
  ].filter((d) => d.value > 0);

  const wasteBarData = wasteRecords.map((r) => ({
    date: formatDate(r.observationDate),
    Organic: r.organicWaste,
    Recyclable: r.recyclableWaste,
    General: r.generalWaste,
  }));

  const resourceChart = resourceRecords.map((r) => ({
    date: formatDate(r.recordDate),
    Electricity: r.electricityKwh,
    Water: r.waterLitres,
  }));

  const checklistChartData = checklistCats.map((c) => ({
    name: c.category.replace(' ', '\n'),
    Completed: c.completed,
    Total: c.total,
  }));

  const handleExportCSV = () => {
    if (!selectedEvent) return;
    const rows: string[][] = [];
    rows.push(['EcoEvent — Sustainability Report']);
    rows.push(['Generated', new Date().toLocaleString()]);
    rows.push([]);
    rows.push(['EVENT DETAILS']);
    rows.push(['Event Name', selectedEvent.name]);
    rows.push(['Event Type', selectedEvent.type]);
    rows.push(['Venue', selectedEvent.venue]);
    rows.push(['Date', formatDate(selectedEvent.date)]);
    rows.push(['Expected Attendees', String(selectedEvent.expectedAttendees)]);
    rows.push(['Actual Attendees', selectedEvent.actualAttendees !== null ? String(selectedEvent.actualAttendees) : 'Not recorded']);
    rows.push(['Description', selectedEvent.description]);
    rows.push(['Is Demo Data', selectedEvent.isDemo ? 'Yes' : 'No']);
    rows.push([]);
    rows.push(['WASTE SUMMARY']);
    rows.push(['Total Waste (kg)', formatNumber(wasteSummary.totalWaste)]);
    rows.push(['Organic Waste (kg)', formatNumber(wasteSummary.totalOrganic)]);
    rows.push(['Recyclable Waste (kg)', formatNumber(wasteSummary.totalRecyclable)]);
    rows.push(['General Waste (kg)', formatNumber(wasteSummary.totalGeneral)]);
    rows.push(['Waste per Attendee (kg)', formatNumber(wasteSummary.wastePerAttendee, 2)]);
    rows.push(['Recyclable Percentage', `${formatNumber(wasteSummary.recyclablePercentage, 0)}%`]);
    rows.push(['Disposable Cups', String(wasteSummary.disposableCups)]);
    rows.push(['Disposable Plates', String(wasteSummary.disposablePlates)]);
    rows.push([]);
    rows.push(['RESOURCE SUMMARY']);
    rows.push(['Total Electricity (kWh)', formatNumber(resourceSummary.totalElectricity)]);
    rows.push(['Total Water (litres)', formatNumber(resourceSummary.totalWater)]);
    rows.push([]);
    rows.push(['CHECKLIST PROGRESS']);
    rows.push(['Completed Actions', `${checklist.completed}/${checklist.total}`]);
    rows.push(['Completion Percentage', `${checklist.percentage}%`]);
    checklistCats.forEach((c) => rows.push([c.category, `${c.completed}/${c.total} (${c.percentage}%)`]));
    rows.push([]);
    rows.push(['RECOMMENDATIONS']);
    recommendations.forEach((r, i) => rows.push([`${i + 1}`, r]));
    rows.push([]);
    rows.push(['WASTE RECORDS']);
    rows.push(['Date', 'Organic (kg)', 'Recyclable (kg)', 'General (kg)', 'Cups', 'Plates', 'Food Handling', 'Notes', 'Demo']);
    wasteRecords.forEach((r) => {
      rows.push([formatDate(r.observationDate), String(r.organicWaste), String(r.recyclableWaste), String(r.generalWaste), String(r.disposableCups), String(r.disposablePlates), r.leftoverFoodHandling, r.notes, r.isDemo ? 'Yes' : 'No']);
    });
    rows.push([]);
    rows.push(['RESOURCE RECORDS']);
    rows.push(['Date', 'Electricity (kWh)', 'Water (L)', 'Notes', 'Demo']);
    resourceRecords.forEach((r) => {
      rows.push([formatDate(r.recordDate), String(r.electricityKwh), String(r.waterLitres), r.notes, r.isDemo ? 'Yes' : 'No']);
    });

    downloadCSV(`ecoevent-report-${selectedEvent.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`, rows);
    success('Report exported as CSV.');
  };

  if (!selectedEvent) {
    return (
      <EmptyState
        icon={<BarChart3 className="w-8 h-8" />}
        title="No event selected"
        message="Select an event to view its analytics and export a report."
        action={<Button onClick={() => onNavigate('events')}>Go to Events</Button>}
      />
    );
  }

  const hasDemo = selectedEvent.isDemo || wasteRecords.some((r) => r.isDemo) || resourceRecords.some((r) => r.isDemo);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Analytics & Reports"
        subtitle={`Comprehensive view for: ${selectedEvent.name}`}
        icon={<BarChart3 className="w-5 h-5" />}
        action={
          <Button onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        }
      />

      {hasDemo && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-200">
            This event contains <strong>demo data</strong>. Demo entries are clearly labelled in the tables below. Distinguish your own data from the sample dataset when reviewing analytics.
          </p>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Waste" value={formatNumber(wasteSummary.totalWaste)} unit="kg" icon={<Weight className="w-4 h-4" />} />
        <StatCard label="Recyclable Rate" value={`${formatNumber(wasteSummary.recyclablePercentage, 0)}%`} icon={<Recycle className="w-4 h-4" />} accent="emerald" />
        <StatCard label="Electricity" value={formatNumber(resourceSummary.totalElectricity)} unit="kWh" icon={<Zap className="w-4 h-4" />} accent="amber" />
        <StatCard label="Water" value={formatNumber(resourceSummary.totalWater)} unit="L" icon={<Droplets className="w-4 h-4" />} accent="sky" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Waste composition pie */}
        <Card className="p-5">
          <SectionTitle title="Waste Composition" icon={<Recycle className="w-5 h-5" />} />
          {wastePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={wastePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(entry) => `${entry.name}: ${entry.value}kg`}>
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
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-500">No waste data</div>
          )}
        </Card>

        {/* Waste tracking bar */}
        <Card className="p-5">
          <SectionTitle title="Waste Tracking by Date" icon={<BarChart3 className="w-5 h-5" />} />
          {wasteBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={wasteBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a4232" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" kg" />
                <Tooltip formatter={(v) => `${v} kg`} />
                <Legend iconType="circle" />
                <Bar dataKey="Organic" fill="#84cc16" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Recyclable" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="General" fill="#6b7280" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-500">No waste data</div>
          )}
        </Card>

        {/* Electricity */}
        <Card className="p-5">
          <SectionTitle title="Electricity Consumption" icon={<Zap className="w-5 h-5" />} />
          {resourceChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={resourceChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a4232" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" kWh" />
                <Tooltip formatter={(v) => `${v} kWh`} />
                <Line type="monotone" dataKey="Electricity" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-500">No electricity data</div>
          )}
        </Card>

        {/* Water */}
        <Card className="p-5">
          <SectionTitle title="Water Consumption" icon={<Droplets className="w-5 h-5" />} />
          {resourceChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={resourceChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a4232" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" L" />
                <Tooltip formatter={(v) => `${v} L`} />
                <Line type="monotone" dataKey="Water" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-500">No water data</div>
          )}
        </Card>
      </div>

      {/* Checklist chart */}
      <Card className="p-5">
        <SectionTitle title="Checklist Completion by Category" icon={<FileText className="w-5 h-5" />} />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={checklistChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1a4232" />
            <XAxis type="number" domain={[0, 3]} tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={130} />
            <Tooltip />
            <Legend iconType="circle" />
            <Bar dataKey="Completed" fill="#10b981" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Total" fill="#22543f" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary report */}
      <Card className="p-5">
        <SectionTitle title="Summary Report" icon={<FileText className="w-5 h-5" />} />
        <div className="space-y-4">
          {/* Event details */}
          <div>
            <h4 className="text-xs font-semibold text-emerald2-400 uppercase tracking-wide mb-2">Event Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <ReportRow label="Name" value={selectedEvent.name} />
              <ReportRow label="Type" value={selectedEvent.type} />
              <ReportRow label="Venue" value={selectedEvent.venue} />
              <ReportRow label="Date" value={formatDate(selectedEvent.date)} />
              <ReportRow label="Expected Attendees" value={String(selectedEvent.expectedAttendees)} />
              <ReportRow label="Actual Attendees" value={selectedEvent.actualAttendees !== null ? String(selectedEvent.actualAttendees) : 'Not recorded'} />
            </div>
            {selectedEvent.isDemo && <div className="mt-2"><Badge variant="demo">DEMO EVENT</Badge></div>}
          </div>

          {/* Waste totals */}
          <div>
            <h4 className="text-xs font-semibold text-emerald2-400 uppercase tracking-wide mb-2">Recorded Waste Totals</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <ReportRow label="Total" value={`${formatNumber(wasteSummary.totalWaste)} kg`} />
              <ReportRow label="Organic" value={`${formatNumber(wasteSummary.totalOrganic)} kg`} />
              <ReportRow label="Recyclable" value={`${formatNumber(wasteSummary.totalRecyclable)} kg`} />
              <ReportRow label="General" value={`${formatNumber(wasteSummary.totalGeneral)} kg`} />
              <ReportRow label="Per Attendee" value={`${formatNumber(wasteSummary.wastePerAttendee, 2)} kg`} />
              <ReportRow label="Recyclable %" value={`${formatNumber(wasteSummary.recyclablePercentage, 0)}%`} />
              <ReportRow label="Cups" value={String(wasteSummary.disposableCups)} />
              <ReportRow label="Plates" value={String(wasteSummary.disposablePlates)} />
            </div>
          </div>

          {/* Resource data */}
          <div>
            <h4 className="text-xs font-semibold text-emerald2-400 uppercase tracking-wide mb-2">Resource Data</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <ReportRow label="Electricity" value={`${formatNumber(resourceSummary.totalElectricity)} kWh`} />
              <ReportRow label="Water" value={`${formatNumber(resourceSummary.totalWater)} litres`} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Values are manually entered, not IoT-sensed.</p>
          </div>

          {/* Checklist */}
          <div>
            <h4 className="text-xs font-semibold text-emerald2-400 uppercase tracking-wide mb-2">Sustainability Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <ReportRow label="Completed" value={`${checklist.completed}/${checklist.total}`} />
              <ReportRow label="Completion" value={`${checklist.percentage}%`} />
            </div>
            <div className="mt-2 space-y-1">
              {checklistCats.map((c) => (
                <div key={c.category} className="flex items-center justify-between text-xs text-gray-400">
                  <span>{c.category}</span>
                  <span>{c.completed}/{c.total} ({c.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-xs font-semibold text-emerald2-400 uppercase tracking-wide mb-2">Practical Recommendations</h4>
            <div className="space-y-1.5">
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald2-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-forest-900/30">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-gray-200 font-medium text-sm">{value}</span>
    </div>
  );
}
