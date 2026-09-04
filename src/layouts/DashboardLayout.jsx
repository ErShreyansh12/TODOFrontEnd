import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/features/dashboard/components/Sidebar'
import MobileHeader from '@/features/dashboard/components/MobileHeader'

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-subtle">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
      />

      <main
        className={`relative flex h-screen flex-1 flex-col overflow-hidden transition-[margin] duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="mt-16 flex-1 overflow-y-auto p-margin-mobile md:mt-0 md:p-margin-desktop">
          <div className="mx-auto max-w-container-max space-y-margin-desktop">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
