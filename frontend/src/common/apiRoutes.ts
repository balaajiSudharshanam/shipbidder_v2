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
    BY_ID_AWARD: (id: number) => `/${id}/award`,
  },
  Location: {
    BASE: '/api/locations',
  },
  Notification: {
    BASE: '/api/notifications',
    UNREAD_COUNT: '/unread-count',
    BY_ID_READ: (id: number) => `/${id}/read`,
    READ_ALL: '/read-all',
  },
} as const
