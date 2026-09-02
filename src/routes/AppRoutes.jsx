import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/admin/Dashboard'
import CreateTask from '@/pages/admin/CreateTask'
import StaffDirectory from '@/pages/admin/StaffDirectory'
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
        <Route element={<RoleRoute allowedRoles={[Role.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ADMIN_TASKS_CREATE} element={<CreateTask />} />
            <Route path={ROUTES.ADMIN_STAFF} element={<StaffDirectory />} />
          </Route>
        </Route>
      </Route>

      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
