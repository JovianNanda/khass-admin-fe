export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'Dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'participants',
      displayName: 'Participants',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'transactions',
      displayName: 'Transactions',
      meta: {
        icon: 'payments',
      },
    },
    {
      name: 'theaters',
      displayName: 'Theaters',
      meta: {
        icon: 'theater_comedy',
      },
    },
    {
      name: 'bundles',
      displayName: 'Bundles',
      meta: {
        icon: 'local_activity',
      },
    },
    {
      name: 'payment',
      displayName: 'Cash Payment',
      meta: {
        icon: 'attach_money',
      },
    },
    {
      name: 'Attendance',
      displayName: 'Attendance',
      meta: {
        icon: 'qr_code_scanner',
      },
      children: [
        {
          name: 'attendance-list',
          displayName: 'Attendance List',
        },
        {
          name: 'scan-masuk',
          displayName: 'Scan-masuk',
        },
        {
          name: 'scan-keluar',
          displayName: 'Scan-keluar',
        },
      ],
    },
    {
      name: 'settings',
      displayName: 'Settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
