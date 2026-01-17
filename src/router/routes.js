const routes =[
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/add', component: () => import('pages/AddPage.vue') },
      { path: '/convert', component: () => import('pages/ConvertPage.vue') },
      { path: '/invest', component: () => import('pages/InvestPage.vue') }
    ]

  }
]
export default routes
