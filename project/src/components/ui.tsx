import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-emerald2-600 hover:bg-emerald2-500 text-white shadow-sm shadow-emerald2-900/30',
  secondary: 'bg-forest-700 hover:bg-forest-600 text-gray-200 border border-forest-600',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  ghost: 'text-gray-400 hover:text-white hover:bg-forest-700',
};

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald2-500/40 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-forest-800/80 border border-forest-600/50 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'demo' | 'success' | 'warning' | 'info' | 'neutral';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const styles: Record<string, string> = {
    demo: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    success: 'bg-emerald2-500/15 text-emerald2-300 border-emerald2-500/30',
    warning: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    neutral: 'bg-forest-600/30 text-gray-300 border-forest-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-forest-700/50 flex items-center justify-center text-emerald2-400 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-200 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionTitle({ title, subtitle, icon, action }: SectionTitleProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        {icon && <div className="w-10 h-10 rounded-xl bg-emerald2-600/15 text-emerald2-400 flex items-center justify-center flex-shrink-0">{icon}</div>}
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  subtext?: string;
  accent?: 'emerald' | 'sky' | 'amber' | 'orange' | 'neutral';
}

export function StatCard({ label, value, unit, icon, subtext, accent = 'emerald' }: StatCardProps) {
  const accents: Record<string, string> = {
    emerald: 'text-emerald2-400 bg-emerald2-600/10',
    sky: 'text-sky-400 bg-sky-600/10',
    amber: 'text-amber-400 bg-amber-600/10',
    orange: 'text-orange-400 bg-orange-600/10',
    neutral: 'text-gray-400 bg-forest-600/20',
  };
  return (
    <Card className="p-5 hover:border-forest-500 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accents[accent]}`}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </Card>
  );
}
