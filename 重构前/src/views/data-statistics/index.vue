<template>
    <page-wrap no-title>
        <div class="data-statistics">
            <div class="statistics-nav">
                <div class="task-total">
                    数据统计
                </div>
                <div class="task-list">
                    <ul v-for="(v,i) of kldRoute"
                        :key="'chiefList'+i">
                        <div class="caption">
                            <div>
                                <img :src="v.meta.imgUrl"
                                     alt=""
                                     style="width:100%;height:100%;">
                            </div>
                            <h3>{{v.meta.label}}</h3>
                        </div>
                        <router-link tag="li"
                                     v-for="(value,index) of v.children"
                                     :key="'v.children'+index"
                                     :to="{name:value.name}"
                                     :active-class='"clickRoute"'>
                            <div></div>
                            {{value.meta.label}}
                        </router-link>
                    </ul>
                </div>
            </div>
            <div class="statistics-content">
                <div class="title">
                    <img :src="$route.meta.imgUrl"
                         alt="">
                    <span>{{$route.meta.label}}</span></div>
                <router-view></router-view>
            </div>
        </div>
    </page-wrap>
</template>
<script>
import { PageWrap } from "@/components";
import kldRoute from "./route";
export default {
    components: { PageWrap },
    name: "data-statistics-wrap",
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.name === "data-statistics") {
                vm.jumpFirstPage();
            }
        });
    },
    beforeRouteUpdate(to, from, next) {
        if (to.name === "data-statistics") {
            this.jumpFirstPage();
            return;
        }
        next();
    },
    data() {
        return {
            statisticsNav: [
                {
                    title: "维修数据统计",
                    imgUrl: "",
                    children: [
                        {
                            limit: true,
                            page: "维修记录统计",
                            url: { name: "service-log" }
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        kldRoute() {
            return kldRoute[0].children
                .map(item => {
                    const { children } = item;

                    return {
                        ...item,
                        children: children.filter(({ meta }) => {
                            const { limit } = meta || {};
                            return !this.isDefined(limit) || limit;
                        })
                    };
                })
                .filter(({ children }) => children.length);
        },
        firstPage() {
            return this.kldRoute[0].children[0].name;
        }
    },

    methods: {
        isDefined(item) {
            return item !== undefined && item !== null;
        },
        jumpFirstPage() {
            this.$router.push({ name: this.firstPage });
        }
    }
};
</script>
<style lang="less" scoped>
.data-statistics {
    padding: 20px;
    @left: 14%;
    @center: 1%;
    @sameHeight: 905px;
    display: flex;
    justify-content: space-between;
    .title {
        padding: 5px 0;
        color: #020e0f;
        font-size: 20px;
        border-bottom: 1px solid #c8c7cc;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        > img {
            width: 20px;
            margin: 0 5px;
        }
    }
    .statistics-nav {
        margin-right: @center;
        width: @left;
        height: @sameHeight;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        box-sizing: border-box;

        .task-total {
            width: 100%;
            height: 42px;
            background-color: #459ca2;
            border-radius: 3px 3px 0px 0px;
            padding-left: 10px;

            font-size: 16px;
            line-height: 42px;
            color: #fafafa;
        }
        .task-list {
            ul {
                .caption {
                    display: flex;
                    align-items: center;
                    height: 42px;
                    background-color: rgba(208, 208, 208, 0.5);
                    div {
                        width: 18px;
                        height: 18px;
                        margin: 0 10px;
                    }
                    h3 {
                        font-size: 14px;
                        color: #020e0f;
                    }
                }
                li {
                    display: flex;
                    align-items: center;
                    height: 42px;
                    background-color: #fafafa;

                    font-size: 14px;
                    color: #666666;
                    cursor: pointer;
                    div {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background-color: #459ca2;
                        margin-left: 25px;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
    .statistics-content {
        width: 85%;
    }
    .clickRoute {
        color: #459ca2 !important;
    }
}
</style>
