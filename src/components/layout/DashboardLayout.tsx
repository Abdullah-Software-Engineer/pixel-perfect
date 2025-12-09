import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumb?: string;
}

export function DashboardLayout({ children, title, breadcrumb }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-16">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>OTES™ Dashboard</span>
            {breadcrumb && (
              <>
                <span>/</span>
                <span>Home</span>
                <span>/</span>
                <span className="text-foreground">{breadcrumb}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
