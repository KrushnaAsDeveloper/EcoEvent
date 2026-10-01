import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const config: Record<ToastType, { icon: typeof CheckCircle2; color: string; bg: string; border: string }> = {
  success: { icon: CheckCircle2, color: 'text-emerald2-300', bg: 'bg-forest-800', border: 'border-emerald2-700/40' },
  error: { icon: XCircle, color: 'text-red-300', bg: 'bg-forest-800', border: 'border-red-700/40' },
  info: { icon: Info, color: 'text-sky-300', bg: 'bg-forest-800', border: 'border-sky-700/40' },
  warning: { icon: AlertTriangle, color: 'text-amber-300', bg: 'bg-forest-800', border: 'border-amber-700/40' },
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const c = config[toast.type];
        const Icon = c.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 ${c.bg} ${c.border} border rounded-xl px-4 py-3 shadow-lg animate-slide-up pointer-events-auto`}
          >
            <Icon className={`w-5 h-5 ${c.color} flex-shrink-0 mt-0.5`} />
            <p className="text-sm text-gray-200 flex-1">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children, toasts, onDismiss }: { children: ReactNode; toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onDismiss={onDismiss} />
    </>
  );
}
