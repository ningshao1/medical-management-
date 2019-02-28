
export default [{
    path: 'home',
    name: 'home',
    meta: {
        label: '首页'
    },
    component: () => import('./index.vue'),
    children: [
        {
            path: "/Chief-Home",
            name: 'Chief-Home',
            meta: {
                label: '科长首页'
            },
            component: () => import('./chief-home.vue')
        },
        {
            path: "/Engineer-Doctor-Home",
            name: 'Engineer-Doctor-Home',
            meta: {
                label: '工程师-医生-首页'
            },
            component: () => import('./engineer-doctor-home')
        }
    ]

}]