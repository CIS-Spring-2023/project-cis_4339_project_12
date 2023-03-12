import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/login.vue'
import HomePage from '../components/homePage.vue'
import IntakeForm from '../components/intakeForm.vue'
import FindClient from '../components/findClient.vue'
import UpdateClient from '../components/updateClient.vue'
import EventForm from '../components/eventForm.vue'
import FindEvents from '../components/findEvents.vue'
import EventDetails from '../components/eventDetails.vue'
import Services from '../components/services.vue'

// make all paths and names lowercase for consistency
const routes = [
  {
    path: '/',
    props: true,
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/intakeform',
    name: 'intakeform',
    
    component: IntakeForm
  },
  {
    path: '/findclient',
    name: 'findclient',
    
    component: FindClient
  },
  {
    path: '/updateclient/:id',
    name: 'updateclient',
    
    props: true,
    component: UpdateClient
  },
  {
    path: '/eventform',
    name: 'eventform',
    
    component: EventForm
  },
  {
    path: '/findevents',
    name: 'findevents',
    
    component: FindEvents
  },
  {
    path: '/eventdetails/:id',
    name: 'eventdetails',
    
    props: true,
    component: EventDetails
  },
  {
    path: '/services',
    name: 'services',
    
    props: true,
    component: Services
  }
]
 
const router = createRouter({
  history: createWebHistory(),
  routes
})
 
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = localStorage.getItem('user') // check if the user is authenticated
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
 
export default router
