import { useState, useMemo } from 'react';
import { useStorage } from '@/store';
import type { EcoEvent, EventType, PageKey } from '@/types';
import { Card, Button, Badge, EmptyState, SectionTitle } from '@/components/ui';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { FieldWrapper, TextInput, SelectInput, TextArea } from '@/components/Form';
import { useToasts } from '@/hooks/useToasts';
import { formatDate } from '@/utils';
import { Plus, Pencil, Trash2, CalendarDays, MapPin, Users, Check, Star } from 'lucide-react';

const EVENT_TYPES: EventType[] = ['Cultural Festival', 'Seminar', 'Sports Event', 'Workshop', 'Community Gathering', 'Conference', 'Other'];

interface EventsProps {
  onNavigate: (page: PageKey) => void;
}

interface FormState {
  name: string;
  type: EventType;
  venue: string;
  date: string;
  expectedAttendees: string;
  actualAttendees: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  type: 'Cultural Festival',
  venue: '',
  date: '',
  expectedAttendees: '',
  actualAttendees: '',
  description: '',
};

export function Events({ onNavigate }: EventsProps) {
  const { data, selectedEvent, selectEvent, addEvent, updateEvent, deleteEvent } = useStorage();
  const { success, error } = useToasts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<EcoEvent | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (event: EcoEvent) => {
    setEditingId(event.id);
    setForm({
      name: event.name,
      type: event.type,
      venue: event.venue,
      date: event.date,
      expectedAttendees: String(event.expectedAttendees),
      actualAttendees: event.actualAttendees !== null ? String(event.actualAttendees) : '',
      description: event.description,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Event name is required';
    if (!form.venue.trim()) e.venue = 'Venue is required';
    if (!form.date) e.date = 'Date is required';
    const expected = Number(form.expectedAttendees);
    if (!form.expectedAttendees || expected <= 0) e.expectedAttendees = 'Enter a positive number';
    if (form.actualAttendees && Number(form.actualAttendees) < 0) e.actualAttendees = 'Cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      error('Please fix the highlighted fields.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      type: form.type,
      venue: form.venue.trim(),
      date: form.date,
      expectedAttendees: Number(form.expectedAttendees),
      actualAttendees: form.actualAttendees ? Number(form.actualAttendees) : null,
      description: form.description.trim(),
    };
    if (editingId) {
      updateEvent(editingId, payload);
      success('Event updated successfully.');
    } else {
      const newEvent = addEvent(payload);
      selectEvent(newEvent.id);
      success('Event created and selected.');
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteEvent(deleteTarget.id);
    success(`"${deleteTarget.name}" has been deleted.`);
    setDeleteTarget(null);
  };

  const eventCount = data.events.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Event Management"
        subtitle={`${eventCount} event${eventCount !== 1 ? 's' : ''} · Create, edit, select, or delete events`}
        icon={<CalendarDays className="w-5 h-5" />}
        action={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Event</span>
          </Button>
        }
      />

      {data.events.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CalendarDays className="w-8 h-8" />}
            title="No events yet"
            message="Create your first event to start tracking its sustainability metrics."
            action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> Create Event</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.events.map((event) => {
            const isSelected = selectedEvent?.id === event.id;
            return (
              <Card
                key={event.id}
                className={`p-5 transition-all duration-200 hover:border-forest-500 ${isSelected ? 'ring-2 ring-emerald2-500/30 border-emerald2-600/30' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-white truncate">{event.name}</h3>
                      {event.isDemo && <Badge variant="demo">DEMO</Badge>}
                    </div>
                    <p className="text-xs text-gray-500">{event.type}</p>
                  </div>
                  {isSelected && <Badge variant="success"><Star className="w-3 h-3" /> Selected</Badge>}
                </div>

                <div className="space-y-1.5 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{event.actualAttendees !== null ? `${event.actualAttendees} (actual)` : `${event.expectedAttendees} (expected)`} attendees</span>
                  </div>
                </div>

                {event.description && (
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{event.description}</p>
                )}

                <div className="flex items-center gap-2">
                  {!isSelected && (
                    <Button variant="secondary" className="text-xs flex-1" onClick={() => { selectEvent(event.id); success(`Selected "${event.name}"`); }}>
                      <Check className="w-3.5 h-3.5" /> Select
                    </Button>
                  )}
                  <Button variant="ghost" className="text-xs" onClick={() => openEdit(event)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="text-xs text-red-400 hover:text-red-300" onClick={() => setDeleteTarget(event)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Event' : 'Create New Event'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Create Event'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FieldWrapper label="Event Name" required error={errors.name}>
            <TextInput value={form.name} error={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Annual Tech Fest 2026" />
          </FieldWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Event Type" required>
              <SelectInput value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </SelectInput>
            </FieldWrapper>
            <FieldWrapper label="Date" required error={errors.date}>
              <TextInput type="date" value={form.date} error={!!errors.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Venue" required error={errors.venue}>
            <TextInput value={form.venue} error={!!errors.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. College Main Auditorium" />
          </FieldWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Expected Attendees" required error={errors.expectedAttendees}>
              <TextInput type="number" min="0" value={form.expectedAttendees} error={!!errors.expectedAttendees} onChange={(e) => setForm({ ...form, expectedAttendees: e.target.value })} placeholder="500" />
            </FieldWrapper>
            <FieldWrapper label="Actual Attendees" error={errors.actualAttendees} hint="Leave blank if event hasn't happened yet">
              <TextInput type="number" min="0" value={form.actualAttendees} error={!!errors.actualAttendees} onChange={(e) => setForm({ ...form, actualAttendees: e.target.value })} placeholder="480" />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Description">
            <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the event..." />
          </FieldWrapper>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All waste and resource records for this event will also be deleted. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
