import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        children: [
            // ======================
            // DASHBOARD (LEVEL 1)
            // ======================
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/views/dashboard/Dashboard.vue'),
                meta: {
                    title: 'Dashboard',
                    icon: 'mdi:view-dashboard',
                    closable: false,
                    keepAlive: true,
                }
            },

            // ======================
            // SYSTEM (LEVEL 1 GROUP)
            // ======================
            {
                path: 'system',
                redirect: '/system/user/list',
                meta: {
                    title: 'System',
                    icon: 'mdi:cog'
                },
                children: [
                    // ======================
                    // USER (LEVEL 2 GROUP)
                    // ======================
                    {
                        path: 'user',
                        meta: {
                            title: 'User'
                        },
                        redirect: '/system/user/list',

                        children: [
                            // ======================
                            // USER LIST (LEVEL 3 PAGE)
                            // ======================
                            {
                                path: 'list',
                                name: 'user-list',
                                component: () => import('@/views/system/user/UserPage.vue'),
                                meta: {
                                    title: 'User List',
                                    closable: true,
                                    keepAlive: true,
                                    favorite: true
                                }
                            },

                            // ======================
                            // ROLE (LEVEL 3 PAGE)
                            // ======================
                            {
                                path: 'role',
                                name: 'role-list',
                                component: () => import('@/views/system/role/RolePage.vue'),
                                meta: {
                                    title: 'Role',
                                    closable: true,
                                    keepAlive: true
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
]