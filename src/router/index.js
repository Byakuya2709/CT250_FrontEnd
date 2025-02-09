import { createRouter, createWebHistory } from 'vue-router'; // Dùng createWebHistory
import HomeView from '../views/HomeView.vue';
import { jwtDecode } from 'jwt-decode';

const router = createRouter({
  history: createWebHistory(),  // Cấu hình sử dụng history mode
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      alias: ['/company/signup', '/artist/signup'],
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: "/login",
      name: "login",
      component: () => import('../views/LoginView.vue')
    },

    {
      path: '/media',
      name: 'media',
      component: () => import('../views/ImageUpload.vue')
    },
    {
      path: '/user/create',
      name: 'CreateUser',
      component: () => import('../views/CreateUserProfile.vue')
    },
    {
      path: '/company/create',
      name: 'CreateCompany',
      component: () => import('../views/CreateCompanyView.vue')
    },
    {
      path: '/artist/create',
      name: 'CreateArtist',
      component: () => import('../views/CreateArtistView.vue')
    },
   
    {
      path: '/users',
      name: 'User',
      component: () => import('../views/UserView.vue'),
      children: [
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('../views/UserView/UserProfile.vue'),
          alias: 'dashboard',
        },
      ],
    },
    {
      path: '/events',
      name: 'Events',
      component: () => import('../views/EventCreateView.vue'),
    },
    {
      path: '/events/:eventId/zone',
      name: 'CreateZone',
      component: () => import('../views/ZoneCreate.vue')
    },
    {
      path: '/events/:eventId',
      name: 'EventDetails',
      component: () => import('../views/EventView/EventDetail.vue'),
      children: [
        {
          path: 'booking',
          name: 'EventBooking',
          component: () => import('../views/EventView/EventBooking.vue'),
          meta: { modal: true }, // Đánh dấu route này là modal
        }
      ]
    },

    {
      path: '/events/all',
      name: 'ListEvents',
      component: () => import('../views/AllEventView.vue'),
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
        }
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

  if (to.meta.requiresAuth) {
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

export default router;
