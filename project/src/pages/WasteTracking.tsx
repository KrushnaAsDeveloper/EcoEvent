import { useState, useMemo } from 'react';
import { useStorage } from '@/store';
import type { WasteRecord, LeftoverFoodHandling, PageKey } from '@/types';
import { Card, Button, Badge, EmptyState, SectionTitle, StatCard } from '@/components/ui';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { FieldWrapper, TextInput, SelectInput, TextArea } from '@/components/Form';
import { useToasts } from '@/hooks/useToasts';
import { eventWasteRecords, computeWasteSummary, formatDate, formatNumber } from '@/utils';
import { Trash2, Plus, Pencil, CalendarDays, Weight, Recycle, Users, CupSoda, Utensils, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const HANDLING_OPTIONS: LeftoverFoodHandling[] = ['Composted', 'Donated', 'Discarded', 'Reused', 'Not Applicable'];

interface FormState {
  organicWaste: string;
  recyclableWaste: string;
  generalWaste: string;
  disposableCups: string;
  disposablePlates: string;
  leftoverFoodHandling: LeftoverFoodHandling;
  observationDate: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  organicWaste: '',
  recyclableWaste: '',
  generalWaste: '',
  disposableCups: '',
  disposablePlates: '',
  leftoverFoodHandling: 'Composted',
  observationDate: '',
  notes: '',
};

interface WasteProps {
  onNavigate: (page: PageKey) => void;
}

export function WasteTracking({ onNavigate }: WasteProps) {
  const { data, selectedEvent, addWasteRecord, updateWasteRecord, deleteWasteRecord } = useStorage();
  const { success, error } = useToasts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<WasteRecord | null>(null);

  const wasteRecords = useMemo(
    () => (selectedEvent ? eventWasteRecords(data.wasteRecords, selectedEvent.id) : []),
    [data.wasteRecords, selectedEvent],
  );
  const summary = useMemo(
    () => computeWasteSummary(wasteRecords, selectedEvent?.actualAttendees ?? selectedEvent?.expectedAttendees ?? null),
    [wasteRecords, selectedEvent],
  );

  const chartData = wasteRecords.map((r) => ({
    date: formatDate(r.observationDate),
    Organic: r.organicWaste,
    Recyclable: r.recyclableWaste,
    General: r.generalWaste,
  }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (record: WasteRecord) => {
    setEditingId(record.id);
    setForm({
      organicWaste: String(record.organicWaste),
      recyclableWaste: String(record.recyclableWaste),
      generalWaste: String(record.generalWaste),
      disposableCups: String(record.disposableCups),
      disposablePlates: String(record.disposablePlates),
      leftoverFoodHandling: record.leftoverFoodHandling,
      observationDate: record.observationDate,
      notes: record.notes,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.observationDate) e.observationDate = 'Observation date is required';
    const numFields = ['organicWaste', 'recyclableWaste', 'generalWaste', 'disposableCups', 'disposablePlates'];
    for (const f of numFields) {
      const val = Number(form[f as keyof FormState]);
      if (form[f as keyof FormState] === '' || Number.isNaN(val) || val < 0) {
        e[f] = 'Enter a valid non-negative number';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      error('Please fix the highlighted fields.');
      return;
    }
    const payload = {
      eventId: selectedEvent!.id,
      organicWaste: Number(form.organicWaste),
      recyclableWaste: Number(form.recyclableWaste),
      generalWaste: Number(form.generalWaste),
      disposableCups: Number(form.disposableCups),
      disposablePlates: Number(form.disposablePlates),
      leftoverFoodHandling: form.leftoverFoodHandling,
      observationDate: form.observationDate,
      notes: form.notes.trim(),
    };
    if (editingId) {
      updateWasteRecord(editingId, payload);
      success('Waste record updated.');
    } else {
      addWasteRecord(payload);
      success('Waste record added.');
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteWasteRecord(deleteTarget.id);
    success('Waste record deleted.');
    setDeleteTarget(null);
  };

  if (!selectedEvent) {
    return (
      <EmptyState
        icon={<Trash2 className="w-8 h-8" />}
        title="No event selected"
        message="Select an event first to track its waste."
        action={<Button onClick={() => onNavigate('events')}>Go to Events</Button>}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Waste Tracking"
        subtitle={`Recording waste for: ${selectedEvent.name}`}
        icon={<Trash2 className="w-5 h-5" />}
        action={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Record</span>
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Waste" value={formatNumber(summary.totalWaste)} unit="kg" icon={<Weight className="w-4 h-4" />} />
        <StatCard label="Waste/Attendee" value={formatNumber(summary.wastePerAttendee, 2)} unit="kg" icon={<Users className="w-4 h-4" />} accent="orange" />
        <StatCard label="Recyclable" value={`${formatNumber(summary.recyclablePercentage, 0)}%`} icon={<Recycle className="w-4 h-4" />} accent="emerald" subtext={`${formatNumber(summary.totalRecyclable)} kg of ${formatNumber(summary.totalWaste)} kg`} />
        <StatCard label="Disposables" value={formatNumber(summary.disposableCups + summary.disposablePlates)} icon={<CupSoda className="w-4 h-4" />} accent="amber" subtext={`${summary.disposableCups} cups, ${summary.disposablePlates} plates`} />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="p-5">
          <SectionTitle title="Waste Over Time" subtitle="Breakdown by observation date" icon={<Weight className="w-5 h-5" />} />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a4232" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" kg" />
              <Tooltip formatter={(v) => `${v} kg`} />
              <Legend iconType="circle" />
              <Bar dataKey="Organic" stackId="a" fill="#84cc16" />
              <Bar dataKey="Recyclable" stackId="a" fill="#10b981" />
              <Bar dataKey="General" stackId="a" fill="#6b7280" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Records table */}
      <Card>
        <div className="px-5 py-4 border-b border-forest-600/50">
          <h3 className="text-sm font-semibold text-white">Recorded Entries ({wasteRecords.length})</h3>
        </div>
        {wasteRecords.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="No waste records yet"
            message="Add your first waste observation for this event."
            action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Record</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forest-600/50 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-right">Organic</th>
                  <th className="px-5 py-3 text-right">Recyclable</th>
                  <th className="px-5 py-3 text-right">General</th>
                  <th className="px-5 py-3 text-right">Cups</th>
                  <th className="px-5 py-3 text-right">Plates</th>
                  <th className="px-5 py-3 text-left">Food Handling</th>
                  <th className="px-5 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {wasteRecords.map((r) => (
                  <tr key={r.id} className="border-b border-forest-700/30 hover:bg-forest-700/20 transition-colors">
                    <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                        {formatDate(r.observationDate)}
                      </div>
                      {r.isDemo && <Badge variant="demo">DEMO</Badge>}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-300">{r.organicWaste} kg</td>
                    <td className="px-5 py-3 text-right text-gray-300">{r.recyclableWaste} kg</td>
                    <td className="px-5 py-3 text-right text-gray-300">{r.generalWaste} kg</td>
                    <td className="px-5 py-3 text-right text-gray-300">{r.disposableCups.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-gray-300">{r.disposablePlates.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-300 text-xs">{r.leftoverFoodHandling}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-emerald2-300 transition-colors" aria-label="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(r)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors" aria-label="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Waste Record' : 'Add Waste Record'}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Add Record'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FieldWrapper label="Organic Waste (kg)" required error={errors.organicWaste}>
              <TextInput type="number" min="0" step="0.1" value={form.organicWaste} error={!!errors.organicWaste} onChange={(e) => setForm({ ...form, organicWaste: e.target.value })} placeholder="0" />
            </FieldWrapper>
            <FieldWrapper label="Recyclable Waste (kg)" required error={errors.recyclableWaste}>
              <TextInput type="number" min="0" step="0.1" value={form.recyclableWaste} error={!!errors.recyclableWaste} onChange={(e) => setForm({ ...form, recyclableWaste: e.target.value })} placeholder="0" />
            </FieldWrapper>
            <FieldWrapper label="General Waste (kg)" required error={errors.generalWaste}>
              <TextInput type="number" min="0" step="0.1" value={form.generalWaste} error={!!errors.generalWaste} onChange={(e) => setForm({ ...form, generalWaste: e.target.value })} placeholder="0" />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Disposable Cups" required error={errors.disposableCups}>
              <TextInput type="number" min="0" value={form.disposableCups} error={!!errors.disposableCups} onChange={(e) => setForm({ ...form, disposableCups: e.target.value })} placeholder="0" />
            </FieldWrapper>
            <FieldWrapper label="Disposable Plates" required error={errors.disposablePlates}>
              <TextInput type="number" min="0" value={form.disposablePlates} error={!!errors.disposablePlates} onChange={(e) => setForm({ ...form, disposablePlates: e.target.value })} placeholder="0" />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Leftover Food Handling" required>
              <SelectInput value={form.leftoverFoodHandling} onChange={(e) => setForm({ ...form, leftoverFoodHandling: e.target.value as LeftoverFoodHandling })}>
                {HANDLING_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
              </SelectInput>
            </FieldWrapper>
            <FieldWrapper label="Observation Date" required error={errors.observationDate}>
              <TextInput type="date" value={form.observationDate} error={!!errors.observationDate} onChange={(e) => setForm({ ...form, observationDate: e.target.value })} />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Notes">
            <TextArea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional observations..." />
          </FieldWrapper>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Waste Record"
        message="Are you sure you want to delete this waste record? This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
