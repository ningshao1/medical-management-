const Index = () => import("./index"),
    List = () => import("./list"),
    addPurchase = () => import("./add-purchase/index.vue"),
    pruchaseUnder=()=>import("./add-purchase/purchase-under/index.vue"),
    pruchaseUpper=()=>import("./add-purchase/purchase-upper/index.js"),
    pruchaseUpperImport=()=>import("./add-purchase/purchase-upper/purchase-upper-import.vue")
    ;
export default [
    {
        path: "purchase-plain",
        name: "purchase-plain",
        meta: {
            label: "采购计划"
        },
        component: Index,
        redirect: { name: "purchase-plain-list" },
        children: [
            {
                path: "list",
                name: "purchase-plain-list",
                meta: {
                    label: "采购计划列表",
                    limit: 'purchase:list',
                    breadcrumbHide: true
                },
                component: List
            },
            {
                path: "purchase-info",
                name: "add-purchase",
                component: addPurchase,
                meta: {
                    label: "采购计划详情"
                },
                children:[
                    {
                        path: "purchaseUnder/:id",
                        name: "purchase-under",
                        meta: {
                            label: "0-10万",
                            breadcrumbHide: true
                        },
                        component: pruchaseUnder
                    },
                    {
                        path: "pruchaseUpper/:id",
                        name: "purchase-upper",
                        meta: {
                            label: "10万以上",//国产
                            breadcrumbHide: true
                        },
                        component: pruchaseUpper
                    },
                    {
                        path: "pruchaseUpperImport/:id",
                        name: "purchase-upper-import",
                        meta: {
                            label: "10万以上",//进口
                            breadcrumbHide: true
                        },
                        component: pruchaseUpperImport
                    },
                ]
            }
        ]
    }
];
