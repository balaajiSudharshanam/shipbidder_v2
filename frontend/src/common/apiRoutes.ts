export const ApiRoutes = {
  Auth: {
    BASE: '/api/auth',
    REGISTER: '/register',
    LOGIN: '/login',
  },
  User: {
    BASE: '/api/user',
    ME: '/me',
    UPDATE_ROLE: '/update-role',
  },
  Job: {
    BASE: '/api/jobs',
    BY_ID: (id: number) => `/${id}`,
    MY: '/my',
    IMAGES: (id: number) => `/${id}/images`,
    BIDS: '/bids',
    BIDS_MY: '/bids/my',
    BY_ID_BIDS: (id: number) => `/${id}/bids`,
  },
  Location: {
    BASE: '/api/locations',
  },
} as const
