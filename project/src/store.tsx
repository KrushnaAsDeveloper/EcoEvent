import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type {
  AppData,
  ChecklistState,
  EcoEvent,
  ResourceRecord,
  WasteRecord,
} from '@/types';
import { DEMO_DATA, EMPTY_DATA } from '@/demoData';

const STORAGE_KEY = 'ecoevent-data-v1';

function loadFromStorage(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: AppData = {
        ...DEMO_DATA,
        selectedEventId: DEMO_DATA.events[0]?.id ?? null,
        initialized: true,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.initialized) {
      return {
        ...DEMO_DATA,
        selectedEventId: DEMO_DATA.events[0]?.id ?? null,
        initialized: true,
      };
    }
    return parsed;
  } catch {
    return {
      ...DEMO_DATA,
      selectedEventId: DEMO_DATA.events[0]?.id ?? null,
      initialized: true,
    };
  }
}

interface StorageContextValue {
  data: AppData;
  selectedEvent: EcoEvent | null;
  selectEvent: (id: string) => void;
  addEvent: (event: Omit<EcoEvent, 'id' | 'isDemo'>) => EcoEvent;
  updateEvent: (id: string, patch: Partial<Omit<EcoEvent, 'id' | 'isDemo'>>) => void;
  deleteEvent: (id: string) => void;
  addWasteRecord: (record: Omit<WasteRecord, 'id' | 'createdAt' | 'isDemo'>) => void;
  updateWasteRecord: (id: string, patch: Partial<Omit<WasteRecord, 'id' | 'createdAt' | 'isDemo'>>) => void;
  deleteWasteRecord: (id: string) => void;
  addResourceRecord: (record: Omit<ResourceRecord, 'id' | 'createdAt' | 'isDemo'>) => void;
  updateResourceRecord: (id: string, patch: Partial<Omit<ResourceRecord, 'id' | 'createdAt' | 'isDemo'>>) => void;
  deleteResourceRecord: (id: string) => void;
  toggleChecklistItem: (eventId: string, itemId: string, value: boolean) => void;
  resetDemoData: () => void;
  clearAllData: () => void;
}

const StorageContext = createContext<StorageContextValue | null>(null);

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function StorageProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadFromStorage());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  }, [data]);

  const selectedEvent = data.events.find((e) => e.id === data.selectedEventId) ?? null;

  const selectEvent = useCallback((id: string) => {
    setData((prev) => ({ ...prev, selectedEventId: id }));
  }, []);

  const addEvent = useCallback((event: Omit<EcoEvent, 'id' | 'isDemo'>): EcoEvent => {
    const newEvent: EcoEvent = { ...event, id: generateId('event'), isDemo: false };
    setData((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
      selectedEventId: prev.selectedEventId ?? newEvent.id,
    }));
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, patch: Partial<Omit<EcoEvent, 'id' | 'isDemo'>>) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setData((prev) => {
      const remaining = prev.events.filter((e) => e.id !== id);
      const newSelected = prev.selectedEventId === id ? remaining[0]?.id ?? null : prev.selectedEventId;
      const newChecklist: ChecklistState = { ...prev.checklist };
      delete newChecklist[id];
      return {
        ...prev,
        events: remaining,
        wasteRecords: prev.wasteRecords.filter((w) => w.eventId !== id),
        resourceRecords: prev.resourceRecords.filter((r) => r.eventId !== id),
        checklist: newChecklist,
        selectedEventId: newSelected,
      };
    });
  }, []);

  const addWasteRecord = useCallback((record: Omit<WasteRecord, 'id' | 'createdAt' | 'isDemo'>) => {
    const newRecord: WasteRecord = {
      ...record,
      id: generateId('waste'),
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, wasteRecords: [...prev.wasteRecords, newRecord] }));
  }, []);

  const updateWasteRecord = useCallback((id: string, patch: Partial<Omit<WasteRecord, 'id' | 'createdAt' | 'isDemo'>>) => {
    setData((prev) => ({
      ...prev,
      wasteRecords: prev.wasteRecords.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    }));
  }, []);

  const deleteWasteRecord = useCallback((id: string) => {
    setData((prev) => ({ ...prev, wasteRecords: prev.wasteRecords.filter((w) => w.id !== id) }));
  }, []);

  const addResourceRecord = useCallback((record: Omit<ResourceRecord, 'id' | 'createdAt' | 'isDemo'>) => {
    const newRecord: ResourceRecord = {
      ...record,
      id: generateId('res'),
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, resourceRecords: [...prev.resourceRecords, newRecord] }));
  }, []);

  const updateResourceRecord = useCallback((id: string, patch: Partial<Omit<ResourceRecord, 'id' | 'createdAt' | 'isDemo'>>) => {
    setData((prev) => ({
      ...prev,
      resourceRecords: prev.resourceRecords.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const deleteResourceRecord = useCallback((id: string) => {
    setData((prev) => ({ ...prev, resourceRecords: prev.resourceRecords.filter((r) => r.id !== id) }));
  }, []);

  const toggleChecklistItem = useCallback((eventId: string, itemId: string, value: boolean) => {
    setData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [eventId]: {
          ...(prev.checklist[eventId] ?? {}),
          [itemId]: value,
        },
      },
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    setData({
      ...DEMO_DATA,
      selectedEventId: DEMO_DATA.events[0]?.id ?? null,
      initialized: true,
    });
  }, []);

  const clearAllData = useCallback(() => {
    setData({
      ...EMPTY_DATA,
      selectedEventId: null,
      initialized: true,
    });
  }, []);

  const value: StorageContextValue = {
    data,
    selectedEvent,
    selectEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    addWasteRecord,
    updateWasteRecord,
    deleteWasteRecord,
    addResourceRecord,
    updateResourceRecord,
    deleteResourceRecord,
    toggleChecklistItem,
    resetDemoData,
    clearAllData,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorage(): StorageContextValue {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage must be used within StorageProvider');
  return ctx;
}
