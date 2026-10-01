import { useState, useMemo } from 'react';
import { useStorage } from '@/store';
import type { ResourceRecord, PageKey } from '@/types';
import { Card, Button, Badge, EmptyState, SectionTitle, StatCard } from '@/components/ui';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { FieldWrapper, TextInput, TextArea } from '@/components/Form';
import { useToasts } from '@/hooks/useToasts';
import { eventResourceRecords, computeResourceSummary, formatDate, formatNumber } from '@/utils';
import { Zap, Droplets, Plus, Pencil, Trash2, CalendarDays, FileText, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FormState {
  electricityKwh: string;
  waterLitres: string;
  recordDate: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  electricityKwh: '',
  waterLitres: '',
  recordDate: '',
  notes: '',
};

interface ResourceProps {
  onNavigate: (page: PageKey) => void;
}

export function ResourceMonitoring({ onNavigate }: ResourceProps) {
  const { data, selectedEvent, addResourceRecord, updateResourceRecord, deleteResourceRecord } = useStorage();
  const { success, error } = useToasts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<ResourceRecord | null>(null);

  const resourceRecords = useMemo(
    () => (selectedEvent ? eventResourceRecords(data.resourceRecords, selectedEvent.id) : []),
    [data.resourceRecords, selectedEvent],
  );
  const summary = useMemo(() => computeResourceSummary(resourceRecords), [resourceRecords]);

  const chartData = resourceRecords.map((r) => ({
    date: formatDate(r.recordDate),
    Electricity: r.electricityKwh,
    Water: r.waterLitres,
  }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (record: ResourceRecord) => {
    setEditingId(record.id);
    setForm({
      electricityKwh: String(record.electricityKwh),
      waterLitres: String(record.waterLitres),
      recordDate: record.recordDate,
      notes: record.notes,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.recordDate) e.recordDate = 'Record date is required';
    const elec = Number(form.electricityKwh);
    const water = Number(form.waterLitres);
    if (form.electricityKwh === '' || Number.isNaN(elec) || elec < 0) e.electricityKwh = 'Enter a valid non-negative number';
    if (form.waterLitres === '' || Number.isNaN(water) || water < 0) e.waterLitres = 'Enter a valid non-negative number';
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
      electricityKwh: Number(form.electricityKwh),
      waterLitres: Number(form.waterLitres),
      recordDate: form.recordDate,
      notes: form.notes.trim(),
    };
    if (editingId) {
      updateResourceRecord(editingId, payload);
      success('Resource record updated.');
    } else {
      addResourceRecord(payload);
      success('Resource record added.');
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteResourceRecord(deleteTarget.id);
    success('Resource record deleted.');
    setDeleteTarget(null);
  };

  if (!selectedEvent) {
    return (
      <EmptyState
        icon={<Zap className="w-8 h-8" />}
        title="No event selected"
        message="Select an event first to monitor its resource consumption."
        action={<Button onClick={() => onNavigate('events')}>Go to Events</Button>}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Resource Monitoring"
        subtitle={`Recording resources for: ${selectedEvent.name}`}
        icon={<Zap className="w-5 h-5" />}
        action={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Record</span>
          </Button>
        }
      />

      {/* Manual entry notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
        <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sky-200">
          Resource values are <strong>manually entered</strong> by event organizers. They are not collected through IoT sensors or automated monitoring systems.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Electricity" value={formatNumber(summary.totalElectricity)} unit="kWh" icon={<Zap className="w-4 h-4" />} accent="amber" />
        <StatCard label="Total Water" value={formatNumber(summary.totalWater)} unit="L" icon={<Droplets className="w-4 h-4" />} accent="sky" />
        <StatCard label="Records" value={String(summary.count)} icon={<FileText className="w-4 h-4" />} subtext="data entries" />
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <SectionTitle title="Electricity Consumption" icon={<Zap className="w-5 h-5" />} />
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a4232" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" kWh" />
                <Tooltip formatter={(v) => `${v} kWh`} />
                <Line type="monotone" dataKey="Electricity" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5">
            <SectionTitle title="Water Consumption" icon={<Droplets className="w-5 h-5" />} />
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a4232" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" L" />
                <Tooltip formatter={(v) => `${v} L`} />
                <Line type="monotone" dataKey="Water" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Records table */}
      <Card>
        <div className="px-5 py-4 border-b border-forest-600/50">
          <h3 className="text-sm font-semibold text-white">Resource Records ({resourceRecords.length})</h3>
        </div>
        {resourceRecords.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="No resource records yet"
            message="Add your first resource consumption entry for this event."
            action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Record</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forest-600/50 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-right">Electricity</th>
                  <th className="px-5 py-3 text-right">Water</th>
                  <th className="px-5 py-3 text-left">Notes</th>
                  <th className="px-5 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {resourceRecords.map((r) => (
                  <tr key={r.id} className="border-b border-forest-700/30 hover:bg-forest-700/20 transition-colors">
                    <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                        {formatDate(r.recordDate)}
                      </div>
                      {r.isDemo && <Badge variant="demo">DEMO</Badge>}
                    </td>
                    <td className="px-5 py-3 text-right text-amber-300">{r.electricityKwh} kWh</td>
                    <td className="px-5 py-3 text-right text-sky-300">{r.waterLitres.toLocaleString()} L</td>
                    <td className="px-5 py-3 text-gray-400 text-xs max-w-xs truncate">{r.notes || '—'}</td>
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
        title={editingId ? 'Edit Resource Record' : 'Add Resource Record'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Add Record'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Electricity Consumption (kWh)" required error={errors.electricityKwh} hint="Manually entered value">
              <TextInput type="number" min="0" step="0.1" value={form.electricityKwh} error={!!errors.electricityKwh} onChange={(e) => setForm({ ...form, electricityKwh: e.target.value })} placeholder="e.g. 150" />
            </FieldWrapper>
            <FieldWrapper label="Water Consumption (litres)" required error={errors.waterLitres} hint="Manually entered value">
              <TextInput type="number" min="0" step="1" value={form.waterLitres} error={!!errors.waterLitres} onChange={(e) => setForm({ ...form, waterLitres: e.target.value })} placeholder="e.g. 800" />
            </FieldWrapper>
          </div>
          <FieldWrapper label="Record Date" required error={errors.recordDate}>
            <TextInput type="date" value={form.recordDate} error={!!errors.recordDate} onChange={(e) => setForm({ ...form, recordDate: e.target.value })} />
          </FieldWrapper>
          <FieldWrapper label="Notes">
            <TextArea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes about the recording..." />
          </FieldWrapper>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Resource Record"
        message="Are you sure you want to delete this resource record? This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
