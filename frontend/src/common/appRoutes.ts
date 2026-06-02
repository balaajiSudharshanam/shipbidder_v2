export const AppRoutes = {
  LOGIN: '/login',
  REGISTER: '/register',
  SELECT_ROLE: '/select-role',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:id',
  jobDetail: (id: number) => `/jobs/${id}`,
} as const
