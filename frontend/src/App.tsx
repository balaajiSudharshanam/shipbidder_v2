import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppRoutes } from './common/appRoutes'
import DashboardRouter from './features/dashboard/pages/DashboardRouter'
import SelectRolePage from './features/user/pages/SelectRolePage'
import RegisterPage from './features/auth/pages/RegisterPage'
import LoginPage from './features/auth/pages/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
        <Route path={AppRoutes.SELECT_ROLE} element={<SelectRolePage />} />
        <Route path={AppRoutes.DASHBOARD} element={<DashboardRouter />} />
        <Route path="*" element={<Navigate to={AppRoutes.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
