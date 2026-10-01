export type EventType =
  | 'Cultural Festival'
  | 'Seminar'
  | 'Sports Event'
  | 'Workshop'
  | 'Community Gathering'
  | 'Conference'
  | 'Other';

export interface EcoEvent {
  id: string;
  name: string;
  type: EventType;
  venue: string;
  date: string;
  expectedAttendees: number;
  actualAttendees: number | null;
  description: string;
  isDemo: boolean;
}

export type LeftoverFoodHandling =
  | 'Composted'
  | 'Donated'
  | 'Discarded'
  | 'Reused'
  | 'Not Applicable';

export interface WasteRecord {
  id: string;
  eventId: string;
  organicWaste: number;
  recyclableWaste: number;
  generalWaste: number;
  disposableCups: number;
  disposablePlates: number;
  leftoverFoodHandling: LeftoverFoodHandling;
  observationDate: string;
  notes: string;
  isDemo: boolean;
  createdAt: string;
}

export interface ResourceRecord {
  id: string;
  eventId: string;
  electricityKwh: number;
  waterLitres: number;
  recordDate: string;
  notes: string;
  isDemo: boolean;
  createdAt: string;
}

export type ChecklistCategory =
  | 'Waste Management'
  | 'Resource Conservation'
  | 'Sustainable Materials'
  | 'Community Awareness';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  label: string;
}

export interface ChecklistState {
  [eventId: string]: { [itemId: string]: boolean };
}

export type PageKey =
  | 'dashboard'
  | 'events'
  | 'waste'
  | 'resources'
  | 'checklist'
  | 'analytics'
  | 'guide'
  | 'about';

export interface AppData {
  events: EcoEvent[];
  wasteRecords: WasteRecord[];
  resourceRecords: ResourceRecord[];
  checklist: ChecklistState;
  selectedEventId: string | null;
  initialized: boolean;
}
