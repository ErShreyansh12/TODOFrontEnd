import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/admin/Dashboard'
import CreateTask from '@/pages/admin/CreateTask'
import TaskBoard from '@/pages/admin/TaskBoard'
import StaffDirectory from '@/pages/admin/StaffDirectory'
import Schedule from '@/pages/admin/Schedule'
import Broadcast from '@/pages/admin/Broadcast'
import CreateNotice from '@/pages/admin/CreateNotice'
import PrivateNotes from '@/pages/PrivateNotes'
import StaffDashboard from '@/pages/staff/StaffDashboard'
import StaffTaskBoard from '@/pages/staff/StaffTaskBoard'
import StaffProfile from '@/pages/staff/StaffProfile'
import NotFound from '@/pages/errors/NotFound'
import Unauthorized from '@/pages/errors/Unauthorized'
import ProtectedRoute from '@/routes/ProtectedRoute'
import RoleRoute from '@/routes/RoleRoute'
import { ROUTES } from '@/constants/routes'
import { Role } from '@/constants/roles'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.PRIVATE_NOTES} element={<PrivateNotes />} />

          <Route element={<RoleRoute allowedRoles={[Role.ADMIN]} />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ADMIN_TASKS_CREATE} element={<CreateTask />} />
            <Route path={ROUTES.ADMIN_TASK_BOARD} element={<TaskBoard />} />
            <Route path={ROUTES.ADMIN_STAFF} element={<StaffDirectory />} />
            <Route path={ROUTES.ADMIN_SCHEDULE} element={<Schedule />} />
            <Route path={ROUTES.ADMIN_BROADCAST} element={<Broadcast />} />
            <Route path={ROUTES.ADMIN_BROADCAST_CREATE} element={<CreateNotice />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[Role.STAFF]} />}>
            <Route path={ROUTES.STAFF_DASHBOARD} element={<StaffDashboard />} />
            <Route path={ROUTES.STAFF_TASK_BOARD} element={<StaffTaskBoard />} />
            <Route path={ROUTES.STAFF_PROFILE} element={<StaffProfile />} />
          </Route>
        </Route>
      </Route>

      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
