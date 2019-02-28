import Vue from "vue";
import Router from "vue-router";
import bro_ from "@common/kld-broswer";
import index from "./views/index";
import {
    Message
}
from "iview";
import singerCenter from "./views/singerCenter/route.js";
import asset from "./views/asset/route.js"; //资产目录
import system from "./views/system/route";
// const countrytype = () => import('./common/country-type/index.vue');
//--------------------二期路由配置信息-----------------------------------------------
import QSHome from "./views/QualityControl/home/route.js"; //质控首页路由
import AssetsAcceptance from "./views/AssetsAcceptance/route"; //资产验收
import depreciation from "./views/depreciation-and-scrap/route"; //折旧报废
import ShiftManagement from "./views/ShiftManagement/route.js"; //交接班管理
import adjust from "./views/adjust/route";
import HomeRoute from "./views/home/route.js"; //首页路由
import annualPlain from "./views/annual-plain/route";
import benefitAnalysis from "./views/benefit-analysis/route.js"; //效益分析路由
import purchasePlain from "./views/purchase-plain/route";
import benefitAnalysisPrint from "./views/benefit-analysis/benefit-analysis-print/route.js"; //效益分析打印
import changeRemoteAddress from "./views/change-remote-address/route";
import emergency from './views/emergency/route';
import contract from './views/contract/new-contract/route';
import IoTManage from './views/IoT-manage/route';
import dataStatistics from './views/data-statistics/route';
// const home = () => import('./views/home/home1') //主页
const sign = () => import("./views/Sign/sign"); //登录页面
const supplier = () => import("./views/supplier/supplier");
const addSupplier = () => import("./views/supplier/addSupplier");
const supplierinfo = () => import("./views/supplier/supplierinfo");
const formManage = () => import("./views/formManage/formManage");
const uploadMessage = () => import("./views/formManage/uploadMessage");
const annualPlan = () => import("./views/yearPlan/annualPlan");
const addPlan = () => import("./views/yearPlan/addPlan/addPlan");
const printQR = () => import("./views/print-QR");
const testPage = () => import("./views/testPage/index.vue");

Vue.use(Router);
const router = new Router({
    routes: [{
            path: "/index",
            component: index,
            meta: {
                label: "首页"
            },
            children: [
                ...HomeRoute,
                ...asset,
                ...QSHome,
                ...AssetsAcceptance,
                ...depreciation,
                ...benefitAnalysis,
                ...ShiftManagement,
                ...adjust,
                ...singerCenter,
                ...annualPlain,
                ...purchasePlain,
                ...emergency,
                ...contract,
                ...IoTManage,
                ...dataStatistics,
                {
                    path: "supplier",
                    name: "supplier",
                    component: supplier
                },
                {
                    path: "supplierinfo",
                    name: "supplier-info",
                    component: supplierinfo
                },
                {
                    path: "supplier/addSupplier",
                    name: "add-supplier",
                    component: addSupplier
                },
                {
                    path: "formManage",
                    name: "form-manage",
                    component: formManage
                },
                {
                    path: "formManage/uploadMessage",
                    name: "form-manage-upload-message",
                    component: uploadMessage
                },
                {
                    path: "/annualPlan",
                    name: "annualPlan",
                    component: annualPlan,
                    meta: {
                        label: "年度计划列表",
                        limit: "ann:list"
                    }
                },

                {
                    path: "addPlan",
                    name: "addPlan",
                    component: addPlan,
                    meta: {
                        label: "新增年度计划",
                        limit: "ann:add"
                    }
                },
                {
                    path: "add-paln-detail/:id",
                    name: "paln-detail",
                    component: addPlan,
                    meta: {
                        label: "新增年度计划",
                        limit: "ann:add"
                    }
                },
                system
            ]
        },
        // {
        //     path: '/countrytype2605',
        //     name: 'countrytype',
        //     component: countrytype
        // },
        {
            path: "/sign",
            component: sign,
            meta: {
                requireAuth: true //表示不需要权限
            }
        },
        {
            path: "/",
            redirect: "/sign"
        },
        {
            path: "*",
            redirect: "/sign"
        },
        {
            path: "/print-new-QR",
            name: "print-new-QR",
            component: printQR,
            meta: {
                label: "打印二维码"
            }
        },
        ...benefitAnalysisPrint,
        ...changeRemoteAddress,
        {
            path: "/test-page",
            name: "testPage",
            component: testPage
        }
        // {
        //     path: '/initial', //初始化账号路径
        //     component: initial,
        //     children: [{
        //         path: 'one',
        //         component: initialOne
        //     },
        //     {
        //         path: 'two',
        //         component: initialTwo
        //     },
        //     {
        //         path: 'three',
        //         component: initialTree
        //     },
        //     {
        //         path: 'four',
        //         component: initialFour
        //     },
        //     {
        //         path: 'five',
        //         component: initialFive
        //     },
        //     {
        //         path: 'six',
        //         component: initialSix
        //     },
        //     {
        //         path: 'seven',
        //         component: initialSeven
        //     }
        //     ]
        // },
    ]
});
Message.config({
    top: 80,
    duration: 3
});
router.beforeEach((to, from, next) => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    to.meta.query = to.query;
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        if (localStorage.getItem("token")) {
            if (to.path === "/sign" || to.path === "") {
                next("/index/home");
                return;
            }
        }

        next();
    }
    else {
        if (localStorage.getItem("token")) {
            // 获取当前的token是否存在
            //只允许IE在资产目录使用打印功能
            if (
                bro_.broswer == "IE" &&
                (to.path !== "/index/asset/assetHome" &&
                    to.path !== "/index/asset/assetDetails")
            ) {
                Message.warning("对不起,IE浏览器只提供打印功能");
                return;
            }
            let limit = JSON.parse(localStorage.getItem("limit"));

            if (limit instanceof Array) {
                //用于排除没有设置和首页权限
                if (to.meta.limit !== undefined && to.meta.limit !== "") {
                    let temp = limit.findIndex(e => {
                        if (e instanceof Object) {
                            return e.plPermission == to.meta.limit;
                        }
                    });
                    if (temp === -1) {
                        Message.warning(`您没有权限进入${to.meta.label}页面`);
                        next("/index/home");
                        return;
                    }
                }
            }

            next();
        }
        else {
            next({
                path: "/sign",
                query: {} // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
        }
    }
});

export default router;