import type { PageKey } from '@/types';
import { LayoutDashboard, CalendarDays, Trash2, Zap, CheckSquare, BarChart3, BookOpen, Info, Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  key: PageKey;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'waste', label: 'Waste Tracking', icon: Trash2 },
  { key: 'resources', label: 'Resource Monitoring', icon: Zap },
  { key: 'checklist', label: 'Green Checklist', icon: CheckSquare },
  { key: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { key: 'guide', label: 'Sustainability Guide', icon: BookOpen },
  { key: 'about', label: 'About Project', icon: Info },
];

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function Sidebar({ current, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: PageKey) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 w-10 h-10 rounded-lg bg-forest-700 border border-forest-600 flex items-center justify-center text-gray-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-forest-900 border-r border-forest-600/50 flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-forest-600/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald2-600/20 text-emerald2-400 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">EcoEvent</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Sustainability Mgmt</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-emerald2-600/15 text-emerald2-300 border border-emerald2-600/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-forest-700/50 border border-transparent'
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-forest-600/50">
          <p className="text-[10px] text-gray-600 leading-relaxed">
            CEP Project<br />
            Technologies for Sustainable Events
          </p>
        </div>
      </aside>
    </>
  );
}
