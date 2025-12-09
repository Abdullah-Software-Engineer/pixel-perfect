import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/site/site-001', icon: Building2, label: 'Site Details' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 z-50">
      <div className="mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
      
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-all group relative',
              isActive 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="absolute left-full ml-2 px-2 py-1 rounded bg-popover text-popover-foreground text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-border">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </aside>
  );
}
