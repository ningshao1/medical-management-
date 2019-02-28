const home = () => import('./index.vue');
export default [{
    path: 'home',
    name: 'home',
    component: home,
    meta: {
        label: "控制台"
    }
}];