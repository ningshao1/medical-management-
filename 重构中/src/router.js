import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import homeRoute from './views/home/router'
import testPage from './views/test/route.js'; //测试页面
const Index = () => import("@/views/Index");
const sign = () => import("./views/sign/index.js");
import presetWorksRoutes from '@/views/PresetWorks/route';
import asseCatalog from '@/views/asset-catalog/route.js';
import system from '@/views/sytem-management/route';
import annualPlanRoute from '@/views/AnnualPlan/route';
Vue.use(Router);

const router = new Router({
    routes: [{
            path: "/sign",
            name: "sign",
            component: sign,
            meta: {
                requireAuth: true //表示不需要权限
            }
        },
        {
            path: "/index",
            name: "index",
            meta: {
                breadcrumbHide: true
            },
            component: Index,
            children: [
                ...homeRoute,
                ...presetWorksRoutes,
                ...asseCatalog,
                ...system,
                ...annualPlanRoute,
            ]
        },
        {
            path: '*',
            redirect: { name: "home" }
        },

        ...testPage
    ]
});
router.beforeEach((to, from, next) => {
    if (!store.state.limit && !(to.meta.requireAuth === true)) {
        next({
            name: "sign"
        });
    }
    else if (store.state.limit && to.name === "sign") {
        next({
            name: "home"
        });
    }
    else {
        next();
    }
});
export default router;