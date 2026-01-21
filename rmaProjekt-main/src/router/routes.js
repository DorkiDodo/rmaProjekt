const routes =[
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/troskovi', component: () => import('pages/TroskoviPage.vue') },
      { path: '/convert', component: () => import('pages/ConvertPage.vue') }
    ]

  }
]
export default routes
