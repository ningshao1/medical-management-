<template>
    <div>
        <div class="content">
            <div class="nav-title">
                <div class="nav-line"></div>
                <ul>
                    <li @click='jump' style="cursor:pointer">首页
                    </li>
                    <li>
                        <span>></span>
                        系统管理
                    </li>
                    <li v-show="title">
                        <span>></span>
                        {{title}}
                    </li>
                </ul>

            </div>
            <div class="main">
                <div class="system-nav">
                    <h2> <img :src="xitong" alt="" style="vertical-align:middle;width:20px;margin-right: 5px;">系统管理</h2>
                    <ul>
                        <li v-if="item.show" v-for="(item,index) in newRote" :key="item.id" @click="obtainTitle(index)">

                            <img :src="item.img" style="display:inline-block;width:20px;margin-right:6px;vertical-align: middle" />
                            <router-link :to="item.list" active-class="click_lis">{{item.info}}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="system-content">
                    <router-view></router-view>
                </div>
            </div>
            <div style="padding-bottom:50px"></div>
            <div class="copy">
                Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
            </div>
        </div>

    </div>
</template>

<script>
var xitong = require("../../img/xitong.svg");
export default {
    data() {
        return {
            xitong: xitong,
            title: "",
            class_index: 0,
            rote: [
                {
                    list: { name: "system-label" },
                    info: "标签管理",
                    show: this.ViewLimit("system:label"),
                    img: require("./image/label.svg")
                },
                {
                    list: { name: "system-classification" },
                    info: "设备分类管理",
                    show: this.ViewLimit("org:type:list"),
                    img: require("./image/classification.svg")
                },
                {
                    list: { name: "system-declaration" },
                    info: "报单分配管理",
                    show: this.ViewLimit("system:fr:allot"),
                    img: require("./image/declaration.svg")
                },
                {
                    list: { name: "doctor-association-management" },
                    info: "医生关联管理",
                    show:this.ViewLimit("system:doctor"),
                    img: require("./image/医生关联管理.svg")
                },


                {
                    list: { name: "system-administration" },
                    info: "用户管理",
                    show: this.ViewLimit("system:user"),
                    img: require("./image/administration.svg")
                },
                {
                    list: { name: "system-role" },
                    info: "角色与权限",
                    show: this.ViewLimit("system:role"),
                    img: require("./image/role.svg")
                },
                {
                    list: { name: "system-department" },
                    info: "科室管理",
                    show: this.ViewLimit("system:org"),
                    img: require("./image/department.svg")
                },
                {
                    // list: { name: "system-brands" },
                    list: { name: "data-dictionary" },
                    info: "数据字典",
                    show: this.ViewLimit("bra:man"),
                    img: require("./image/brands.svg")
                },
                {
                    list: { name: "system-basic" },
                    info: "基础信息",
                    show: this.ViewLimit("system:mess"),
                    img: require("./image/basic.svg")
                }
            ],
            limit: JSON.parse(localStorage.getItem("limit"))
        };
    },
    created() {},
    computed: {
        newRote() {
            let temp = this.rote.filter(v => v.show);
            return temp;
        }
    },
    methods: {
        obtainTitle(index) {
            this.title = this.rote[index].info;
            this.class_index = index;
        },
        jump() {
            this.$router.push("/index/home");
        }
    },
    beforeRouteEnter(to, from, next) {
        if (from.name === null && to.name === "system") {
            next(v => {
                if (v.newRote.length > 0) {
                    next(v.newRote[0].list);
                }
            });
        } else if (from.name === null) {
            next();
        } else {
            next(v => {
                if (v.newRote.length > 0) {
                    next(v.newRote[0].list);
                }
            });
        }
    },
    beforeRouteUpdate(to, form, next) {
        if (this.newRote.length > 0) {
            if (to.name === "system" && form.name.indexOf("system-") !== -1) {
                return;
            } else {
                next();
            }
        } else {
            this.$Message.warning("对不起，该模块你没有任何权限");
        }
    }
};
</script>

<style scoped lang='less'>
.content {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    .nav-title {
        margin-top: 12px;
        display: flex;
        .nav-line {
            height: 16px;
            width: 4px;
            background-color: #76bdc1;
            display: inline-block;
        }

        li {
            margin-left: 6px;
            display: inline-block;
            font-size: 12px;
            color: #999999;
            position: relative;
            top: -3px;
        }
        li:last-child {
            color: #333333;
        }
        li:last-child span {
            color: #76bdc1;
        }
    }
    .main {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        .system-nav {
            width: 15%;
            height: 705px;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            h2 {
                font-size: 16px;
                font-weight: normal;
                // padding-top: 14px;
                line-height: 42px;
                padding-left: 10px;
                color: #333333;
                margin-bottom: 10px;
                background: #d7dfe0;
            }
            ul {
                margin-left: 30px;
                li {
                    font-size: 14px;
                    color: #666666;
                    margin-bottom: 26px;
                    padding-left: 3px;
                    // &:hover {
                    //     color: #01b0c7;
                    //     border-left: 2px solid #01b0c7;
                    //     cursor: pointer;
                    // }
                    a {
                        color: #666666;
                    }
                }
                .click_lis {
                    color: #01b0c7;
                    cursor: pointer;
                    font-weight: 500;
                }
            }
        }
        .system-content {
            width: 83%;
        }
    }

    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
        margin-bottom: 20px;
    }
    .cls-1 {
        color: red;
    }
}
</style>