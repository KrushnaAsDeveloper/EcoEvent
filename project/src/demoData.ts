import type { ChecklistItem, EcoEvent, WasteRecord, ResourceRecord } from './types';

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Waste Management
  { id: 'wm-1', category: 'Waste Management', label: 'Waste segregation bins available' },
  { id: 'wm-2', category: 'Waste Management', label: 'Recycling arrangements confirmed' },
  { id: 'wm-3', category: 'Waste Management', label: 'Food waste handling planned' },
  // Resource Conservation
  { id: 'rc-1', category: 'Resource Conservation', label: 'Energy-efficient lighting considered' },
  { id: 'rc-2', category: 'Resource Conservation', label: 'Electricity use monitored where possible' },
  { id: 'rc-3', category: 'Resource Conservation', label: 'Water refill stations available' },
  // Sustainable Materials
  { id: 'sm-1', category: 'Sustainable Materials', label: 'Reusable utensils encouraged' },
  { id: 'sm-2', category: 'Sustainable Materials', label: 'Single-use plastics reduced' },
  { id: 'sm-3', category: 'Sustainable Materials', label: 'Digital invitations used' },
  // Community Awareness
  { id: 'ca-1', category: 'Community Awareness', label: 'Sustainability instructions communicated' },
  { id: 'ca-2', category: 'Community Awareness', label: 'Volunteers informed about waste segregation' },
  { id: 'ca-3', category: 'Community Awareness', label: 'Attendees encouraged to participate' },
];

const DEMO_EVENT_1: EcoEvent = {
  id: 'demo-event-1',
  name: 'Spring Cultural Festival 2026',
  type: 'Cultural Festival',
  venue: 'College Main Ground',
  date: '2026-03-15',
  expectedAttendees: 500,
  actualAttendees: 480,
  description: 'Annual cultural festival featuring music, dance, and food stalls. Demo dataset for demonstration purposes.',
  isDemo: true,
};

const DEMO_EVENT_2: EcoEvent = {
  id: 'demo-event-2',
  name: 'Tech Seminar: Green Computing',
  type: 'Seminar',
  venue: 'Auditorium Block B',
  date: '2026-02-20',
  expectedAttendees: 120,
  actualAttendees: 115,
  description: 'Seminar on sustainable computing practices. Demo dataset for demonstration purposes.',
  isDemo: true,
};

const DEMO_WASTE_1: WasteRecord = {
  id: 'demo-waste-1',
  eventId: 'demo-event-1',
  organicWaste: 35,
  recyclableWaste: 22,
  generalWaste: 18,
  disposableCups: 420,
  disposablePlates: 350,
  leftoverFoodHandling: 'Composted',
  observationDate: '2026-03-15',
  notes: 'Recorded during the main day of the festival. Demo data.',
  isDemo: true,
  createdAt: '2026-03-16T10:00:00Z',
};

const DEMO_WASTE_2: WasteRecord = {
  id: 'demo-waste-2',
  eventId: 'demo-event-1',
  organicWaste: 12,
  recyclableWaste: 8,
  generalWaste: 6,
  disposableCups: 150,
  disposablePlates: 120,
  leftoverFoodHandling: 'Donated',
  observationDate: '2026-03-16',
  notes: 'Second day of the festival. Demo data.',
  isDemo: true,
  createdAt: '2026-03-17T10:00:00Z',
};

const DEMO_WASTE_3: WasteRecord = {
  id: 'demo-waste-3',
  eventId: 'demo-event-2',
  organicWaste: 4,
  recyclableWaste: 3,
  generalWaste: 2,
  disposableCups: 60,
  disposablePlates: 40,
  leftoverFoodHandling: 'Reused',
  observationDate: '2026-02-20',
  notes: 'Seminar day recording. Demo data.',
  isDemo: true,
  createdAt: '2026-02-21T10:00:00Z',
};

const DEMO_RESOURCE_1: ResourceRecord = {
  id: 'demo-res-1',
  eventId: 'demo-event-1',
  electricityKwh: 180,
  waterLitres: 1200,
  recordDate: '2026-03-15',
  notes: 'Sound system, lighting, and food stall water. Manually entered. Demo data.',
  isDemo: true,
  createdAt: '2026-03-16T10:00:00Z',
};

const DEMO_RESOURCE_2: ResourceRecord = {
  id: 'demo-res-2',
  eventId: 'demo-event-1',
  electricityKwh: 95,
  waterLitres: 600,
  recordDate: '2026-03-16',
  notes: 'Second day resource usage. Manually entered. Demo data.',
  isDemo: true,
  createdAt: '2026-03-17T10:00:00Z',
};

const DEMO_RESOURCE_3: ResourceRecord = {
  id: 'demo-res-3',
  eventId: 'demo-event-2',
  electricityKwh: 45,
  waterLitres: 200,
  recordDate: '2026-02-20',
  notes: 'Projector, AC, and washroom water. Manually entered. Demo data.',
  isDemo: true,
  createdAt: '2026-02-21T10:00:00Z',
};

const DEMO_CHECKLIST: Record<string, Record<string, boolean>> = {
  'demo-event-1': {
    'wm-1': true,
    'wm-2': true,
    'wm-3': true,
    'rc-1': true,
    'rc-2': true,
    'rc-3': false,
    'sm-1': false,
    'sm-2': true,
    'sm-3': true,
    'ca-1': true,
    'ca-2': true,
    'ca-3': false,
  },
  'demo-event-2': {
    'wm-1': true,
    'wm-2': false,
    'wm-3': true,
    'rc-1': true,
    'rc-2': true,
    'rc-3': false,
    'sm-1': true,
    'sm-2': true,
    'sm-3': true,
    'ca-1': false,
    'ca-2': false,
    'ca-3': true,
  },
};

export const DEMO_DATA = {
  events: [DEMO_EVENT_1, DEMO_EVENT_2],
  wasteRecords: [DEMO_WASTE_1, DEMO_WASTE_2, DEMO_WASTE_3],
  resourceRecords: [DEMO_RESOURCE_1, DEMO_RESOURCE_2, DEMO_RESOURCE_3],
  checklist: DEMO_CHECKLIST,
};

export const EMPTY_DATA = {
  events: [],
  wasteRecords: [],
  resourceRecords: [],
  checklist: {},
};
