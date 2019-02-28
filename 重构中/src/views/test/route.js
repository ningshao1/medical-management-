const testPage = () => import("./test-page.vue");
const ck = () => import("./ck/ck.vue");
const cjx = () => import("./cjx/cjx.vue");
const zmn = () => import("./zmn/zmn.vue");

const route = [
    {
        path: "/test-page",
        name: "test-page",
        component: testPage,
        meta: {
            requireAuth: true //表示不需要权限
        },
        redirect:{name:'test-home'},
        children: [
            {
                path: "home",
                name: "test-home",
                component: {render:h=>h("div","测试主页")},
                meta: {
                    requireAuth: true, //表示不需要权限
                    abandonMenu:true//表示不出现在menu上
                }
            },
            {
                path: "ck",
                name: "ck",
                component: ck,
                meta: {
                    requireAuth: true //表示不需要权限
                }
            },
            {
                path: "cjx",
                name: "cjx",
                component: cjx,
                meta: {
                    requireAuth: true //表示不需要权限
                },
            },
            {
                path: "zmn",
                name: "zmn",
                component: zmn,
                meta: {
                    requireAuth: true //表示不需要权限
                }
            },
        ]
    }
];
export default (NODE_ENV === "production" ? [] : route);
