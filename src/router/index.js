import {createRouter, createWebHistory} from "vue-router";
import AppLayout from '../components/AppLayout.vue'
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Tasks from "../views/Tasks/Tasks.vue";
import Users from "../views/Users/Users.vue";
import UserTasks from "../views/UserTasks/UserTasks.vue";
import UserTaskView from "../views/UserTasks/UserTasksView.vue";
import RequestPassword from "../views/RequestPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import NotFound from "../views/NotFound.vue";
import store from "../store";
import Report from "../views/Reports/Report.vue";
import StatusReport from "../views/Reports/StatusReport.vue";
import UsersReport from "../views/Reports/UsersReport.vue";

const routes = [
  {
    path: '/',
    redirect: '/app'
  },
  {
    path: '/app',
    name: 'app',
    redirect: '/app/dashboard',
    component: AppLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'app.dashboard',
        component: Dashboard
      },
      {
        path: 'tasks',
        name: 'app.tasks',
        component: Tasks
      },
      {
        path: 'users',
        name: 'app.users',
        component: Users
      },
      {
        path: 'usertasks',
        name: 'app.usertasks',
        component: UserTasks
      },
      {
        path: 'usertasks/:id',
        name: 'app.usertasks.view',
        component: UserTaskView
      },
      {
        path: '/report',
        name: 'reports',
        component: Report,
        meta: {
          requiresAuth: true
        },
        children: [
          {
            path: 'status/:name',
            name: 'reports.status',
            component: StatusReport
          },
          {
            path: 'users/:id',
            name: 'reports.users',
            component: UsersReport
          }
        ]
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/request-password',
    name: 'requestPassword',
    component: RequestPassword,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/reset-password/:token',
    name: 'resetPassword',
    component: ResetPassword,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/:pathMatch(.*)',
    name: 'notfound',
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user.token) {
    next({name: 'login'})
  } else if (to.meta.requiresGuest && store.state.user.token) {
    next({name: 'app.dashboard'})
  } else {
    next();
  }

})

export default router;
