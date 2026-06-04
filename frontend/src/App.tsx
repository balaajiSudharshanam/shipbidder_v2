import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppRoutes } from './common/appRoutes'
import { ToastProvider } from './common/context/ToastContext'
import { UserProvider } from './features/user/context/UserContext'
import DashboardRouter from './features/dashboard/pages/DashboardRouter'
import JobsPage from './features/jobs/pages/JobsPage'
import JobDetailPage from './features/jobs/pages/JobDetailPage'
import NotificationsPage from './features/notifications/pages/NotificationsPage'
import SelectRolePage from './features/user/pages/SelectRolePage'
import RegisterPage from './features/auth/pages/RegisterPage'
import LoginPage from './features/auth/pages/LoginPage'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
            <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
            <Route path={AppRoutes.SELECT_ROLE} element={<SelectRolePage />} />
            <Route path={AppRoutes.DASHBOARD} element={<DashboardRouter />} />
            <Route path={AppRoutes.JOBS} element={<JobsPage />} />
            <Route path={AppRoutes.JOB_DETAIL} element={<JobDetailPage />} />
            <Route path={AppRoutes.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path="*" element={<Navigate to={AppRoutes.DASHBOARD} replace />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
