import { createRouter, createWebHistory,createWebHashHistory  } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { jwtDecode } from 'jwt-decode';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/signup',
      name: 'Register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/ForgotPassword.vue')
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('../views/UserView.vue'),
      children: [
        {
          path: '',
          name: 'UserInfo',
          component: () => import('@/views/UserView/UserInfo.vue'),
          alias: 'profile',
        },
        {
          path: 'updateprofile',
          name: 'ChangeUserInfo',
          component: () => import('@/views/ChangeProfile.vue'),
        },

        {
          path: 'all-request',
          name: 'ListRequestUpdateTask',
          component: () => import('../views/UserView/ListRequestUpdateTask.vue')
        },
        {
          path: 'newtask',
          name: 'UserNewTask',
          component: () => import('../views/NewTask.vue')
        },
        {
          path: 'tasks',
          name: 'UserTasks',
          component: () => import('../views/UserView/ListTaskInGroup.vue')
        },
        {
          path: 'task/detail/:taskId',
          name: 'TaskInfo',
          component: () => import('../views/UserView/TaskInfo.vue')
        },
        {
          path: "/task/:id/update",
          name: "UpdateTaskByUser",
          component: () => import("@/views/UserView/UpdateTask.vue"),
        }
      ],
      meta: { requiresAuth: true, role: 'ROLE_EMPLOYEE' }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashBoard.vue'),
          alias: 'dashboard',
        },
        {
          path: 'manage/tasks',
          name: 'AdminTasks',
          component: () => import('../views/Tasks.vue')
        },
        {
          path: 'task/detail/:taskId',
          name: 'TaskDetail',
          component: () => import('../views/TaskDetail.vue')
        },
        {
          path: 'task/edit/:id',
          name: 'EditTask',
          component: () => import('../views/EditTask.vue')
        },
        {
          name: 'SetNewTask',
          path: 'newtask/:id?',
          component: () => import('../views/SetNewTask.vue')
        },
        {
          path: 'manage/employees',
          name: 'ManageUser',
          component: () => import('../views/ManageUser.vue')
        },
        {
          path: 'manage/groups',
          name: 'ManageGroup',
          component: () => import('../views/ManageGroups.vue')
        },
        {
          path: 'manage/group/new-group',
          name: 'NewGroup',
          component: () => import('../views/NewGroup.vue')
        },
        {
          path: 'manage/group/:id/add-user',
          name: 'AddToGroup',
          component: () => import('../views/AddToGroup.vue')
        },
        {
          path: 'manage/employee/:userId',
          name: 'UserProfile',
          component: () => import('../views/UserProfile.vue')
        },
        {
          path: 'manage/update-request',
          name: 'ManageUpdatedTask',
          component: () => import('../views/ManageUpdatedTask.vue')
        },
        {
          path: 'create/account',
          name: 'CreateAccount',
          component: () => import('../views/RegisterView.vue')
        },
      ],
      meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
    },
    // Catch-all route for 404 - Page Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
});

// Add navigation guard
router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    const hasReloaded = localStorage.getItem('loginPageReloaded');
    if (!hasReloaded) {
      // Set the flag before navigating to login and reload after a short delay
      localStorage.setItem('loginPageReloaded', 'true');
      next(); // Allow navigation to the login route
      setTimeout(() => {
        window.location.reload();
      }, 10); // Small delay to ensure navigation completes
    } else {
      next(); // Continue without reloading if already reloaded once
    }
  } else if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;

        // If the route requires ROLE_ADMIN and the user is not an admin, redirect to home
        if (to.path.startsWith('/admin') && role !== 'ROLE_ADMIN') {
          next({ name: 'home' });
        } else {
          // Allow access if the role matches the required role or if no specific role is required
          next();
        }
      } catch (error) {
        // If decoding the token fails, redirect to login
        next({ name: 'Login' });
      }
    } else {
      // If the user is not authenticated, redirect to login
      next({ name: 'Login' });
    }
  } else {
    // Allow access to routes that don't require authentication
    next();
  }
});
router.afterEach((to) => {
  if (to.name !== 'Login') {
    localStorage.removeItem('loginPageReloaded');
  }
});

export default router;
