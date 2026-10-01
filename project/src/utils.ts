import type { EcoEvent, ResourceRecord, WasteRecord, ChecklistState } from '@/types';
import { CHECKLIST_ITEMS } from '@/demoData';

export function formatNumber(n: number, decimals = 1): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return '0';
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function eventWasteRecords(all: WasteRecord[], eventId: string): WasteRecord[] {
  return all.filter((w) => w.eventId === eventId).sort((a, b) => a.observationDate.localeCompare(b.observationDate));
}

export function eventResourceRecords(all: ResourceRecord[], eventId: string): ResourceRecord[] {
  return all.filter((r) => r.eventId === eventId).sort((a, b) => a.recordDate.localeCompare(b.recordDate));
}

export interface WasteSummary {
  totalOrganic: number;
  totalRecyclable: number;
  totalGeneral: number;
  totalWaste: number;
  disposableCups: number;
  disposablePlates: number;
  wastePerAttendee: number;
  recyclablePercentage: number;
}

export function computeWasteSummary(records: WasteRecord[], attendees: number | null): WasteSummary {
  const totalOrganic = records.reduce((s, r) => s + r.organicWaste, 0);
  const totalRecyclable = records.reduce((s, r) => s + r.recyclableWaste, 0);
  const totalGeneral = records.reduce((s, r) => s + r.generalWaste, 0);
  const totalWaste = totalOrganic + totalRecyclable + totalGeneral;
  const disposableCups = records.reduce((s, r) => s + r.disposableCups, 0);
  const disposablePlates = records.reduce((s, r) => s + r.disposablePlates, 0);
  const wastePerAttendee = attendees && attendees > 0 ? totalWaste / attendees : 0;
  const recyclablePercentage = totalWaste > 0 ? (totalRecyclable / totalWaste) * 100 : 0;
  return { totalOrganic, totalRecyclable, totalGeneral, totalWaste, disposableCups, disposablePlates, wastePerAttendee, recyclablePercentage };
}

export interface ResourceSummary {
  totalElectricity: number;
  totalWater: number;
  count: number;
}

export function computeResourceSummary(records: ResourceRecord[]): ResourceSummary {
  const totalElectricity = records.reduce((s, r) => s + r.electricityKwh, 0);
  const totalWater = records.reduce((s, r) => s + r.waterLitres, 0);
  return { totalElectricity, totalWater, count: records.length };
}

export function checklistCompletion(checklist: ChecklistState, eventId: string | null): { completed: number; total: number; percentage: number } {
  const total = CHECKLIST_ITEMS.length;
  if (!eventId || !checklist[eventId]) return { completed: 0, total, percentage: 0 };
  const state = checklist[eventId];
  const completed = CHECKLIST_ITEMS.filter((item) => state[item.id]).length;
  return { completed, total, percentage: Math.round((completed / total) * 100) };
}

export function checklistByCategory(checklist: ChecklistState, eventId: string | null) {
  const categories = ['Waste Management', 'Resource Conservation', 'Sustainable Materials', 'Community Awareness'] as const;
  return categories.map((cat) => {
    const items = CHECKLIST_ITEMS.filter((i) => i.category === cat);
    const state = eventId ? checklist[eventId] ?? {} : {};
    const completed = items.filter((i) => state[i.id]).length;
    return { category: cat, completed, total: items.length, percentage: Math.round((completed / items.length) * 100) };
  });
}

export function hasDemoData(records: { isDemo: boolean }[]): boolean {
  return records.some((r) => r.isDemo);
}

export function generateRecommendations(
  event: EcoEvent | null,
  waste: WasteSummary,
  resources: ResourceSummary,
  checklistPct: number,
): string[] {
  const recs: string[] = [];

  if (waste.recyclablePercentage < 30 && waste.totalWaste > 0) {
    recs.push('Recyclable waste is below 30% of total waste. Improve segregation with clearly labeled bins for organic, recyclable, and general waste.');
  }
  if (waste.disposableCups > 200) {
    recs.push(`${waste.disposableCups.toLocaleString()} disposable cups recorded. Encourage attendees to bring reusable bottles and provide water refill stations.`);
  }
  if (waste.disposablePlates > 200) {
    recs.push(`${waste.disposablePlates.toLocaleString()} disposable plates recorded. Switch to reusable or compostable plates for future events.`);
  }
  if (waste.totalOrganic > 10) {
    recs.push('Significant organic waste detected. Partner with a local composter or arrange on-site composting.');
  }
  if (resources.totalElectricity > 150) {
    recs.push('Electricity consumption is high. Use LED lighting, natural daylight where possible, and turn off equipment when not in use.');
  }
  if (resources.totalWater > 800) {
    recs.push('Water consumption is notable. Fix leaks promptly, use water-efficient fixtures, and avoid single-use water bottles.');
  }
  if (checklistPct < 50) {
    recs.push(`Checklist completion is at ${checklistPct}%. Review the Green Event Checklist and complete more sustainability actions.`);
  } else if (checklistPct >= 80) {
    recs.push('Excellent sustainability preparation! Document your practices to share with other event organizers.');
  }
  if (event && event.actualAttendees !== null && event.expectedAttendees > 0) {
    const ratio = event.actualAttendees / event.expectedAttendees;
    if (ratio > 0.9) {
      recs.push('High attendance turnout. Plan food and resources carefully to minimize surplus and waste.');
    }
  }
  if (recs.length === 0) {
    recs.push('Add waste and resource data to receive tailored sustainability recommendations.');
  }
  return recs;
}

export function downloadCSV(filename: string, rows: string[][]): void {
  const csv = rows
    .map((row) => row.map((cell) => {
      const val = String(cell ?? '');
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
