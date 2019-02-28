<template>
    <div class="test-wrap">

        <div class="news-information-wrap">
            <div  class="NI-header">

                <learn-more :title="'卫计委新闻动态'" :view="true" @learn-more="jump(officialNetwork)"></learn-more>
            </div>
            <section class="NI-content">
                <Tabs value="current-affairs" class="NI-tabs">
                    <TabPane v-for="(value,index) of tabPanes" :key="index" :label="value.label" :name="value.name" >
                        <!-- <table >
                            <tbody>
                                <tr v-for="(v,i) of value.list" :key="i" @click="jump(v.url)" class="news-line">
                                    <td class="textEllipsis" :title="v.content" :style="v.date?'':'width:95%'">
                                        {{v.content}}
                                    </td>
                                    <td :style="v.date?'':'width:5%'">{{v.date||''}}</td>
                                </tr>
                                <tr v-if="!value.list.length" class="news-none">
                                    <td class="textEllipsis"  style="width:95%">
                                        暂无讯息
                                    </td>
                                    <td style="width:5%"></td>
                                </tr>
                            </tbody>
                        </table> -->
                        <table >
                            <tbody>
                                <tr v-for="(v,i) of value.list" :key="i" @click="jump(v.url)" class="news-line">
                                    <td  :title="v.content" >
                                        <div class="td-div">
                                            <span class="textEllipsis td-span" :style="v.date?'':'width:95%'">{{v.content}}</span>
                                            <span class="td-span" :style="v.date?'':'width:5%'">{{v.date||''}}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="!value.list.length" class="news-none">
                                    <td class="textEllipsis"  >
                                         <div class="td-div">
                                            <span class="td-span" style="width:95%">暂无讯息</span>
                                            <span class="td-span" style="width:5%"></span>
                                         </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabPane>
                </Tabs>
            </section>
        </div>
    </div>
</template>

<script>
import learnMore from "@common/kld-learn-more";
export default {
    name: "news-information",
    components: { learnMore },
    data() {
        return {
            // learnMore:require('./static/image/查看更多.png'),
            currentAffairs: [
                //时政要闻
            ],
            documentOfSC: [
                //国务院文件
            ],
            gAffairs: [
                //政务公开
            ],
            officialNetwork: "http://www.nhc.gov.cn"
        };
    },
    computed: {
        tabPanes() {
            return [
                {
                    name: "current-affairs",
                    label: "时政要闻",
                    list: this.documentOfSC
                },
                {
                    name: "document-of-the-State-Council",
                    label: "国务院文件",
                    list: this.gAffairs
                },
                {
                    name: "open-government-affairs",
                    label: "政务公开",
                    list: this.currentAffairs
                }
            ];
        }
    },
    created() {
        this.getOriginDate();
    },
    methods: {
        getOriginDate() {
            this.getTypeDate(1, "currentAffairs");
            this.getTypeDate(2, "documentOfSC");
            this.getTypeDate(3, "gAffairs");
        },
        getTypeDate(nhfpcType, nhfpcTypeName) {
            this.$axios
                .get(`/nhfpcNews/getNews?nhfpcType=${nhfpcType}`)
                .then(res => {
                    if (res.data && res.data.length) {
                        this[nhfpcTypeName] = res.data.map(v => {
                            return {
                                ...v,
                                content: `${v.titlePrefix||""}${v.title}`,
                                date: v.newsTime
                                    ? this.$store.state.localeDate(+v.newsTime)
                                    : ""
                            };
                        });
                    } else {
                        this[nhfpcTypeName] = [
                            {
                                content: "暂无讯息",
                                date: this.$store.state.localeDate(new Date()),
                                link: ""
                            }
                        ];
                    }
                });
        },
        jump(url) {
            // console.log(url);
            if (url) {
                window.open(url);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.test-wrap {
    width: 100%;
    height: 100%;
}
.news-information-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    .NI-header {
        padding: 12px 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .NI-content {
        height: calc(~"100% - 55px");
        /deep/.NI-tabs {
            height: 100%;
            .ivu-tabs-nav {
                margin-left: 20px;
                .ivu-tabs-ink-bar {
                    background-color: #459ca2;
                }
                .ivu-tabs-tab {
                    color: #666666;
                    &:hover {
                        color: #459ca2;
                    }
                }
                .ivu-tabs-tab-active {
                    color: #459ca2;
                }
            }
            .ivu-tabs-content {
                height: calc(~"100% - 36px");
                .ivu-tabs-tabpane {
                    padding: 0 20px;
                    height: 100%;
                    overflow: auto;
                    box-shadow: none;
                    border-top: 1px solid #dce0e6;
                    background-color: transparent;
                    table {
                        width: 100%;
                        table-layout: fixed;
                        border-collapse: collapse;
                        tr {
                            cursor: pointer;
                            height: 40px;
                            td {
                                border-bottom: 1px solid #dddee1;
                                color: #666666;
                                font-size: 0;
                                .td-div{
                                    display: flex;
                                    height: 100%;
                                    width: 100%;
                                    align-items: center;
                                }
                                .td-span:first-child {
                                    width: 70%;
                                    font-size: 14px;
                                }
                                .td-span:last-child{
                                    font-size: 14px;
                                    width: 30%;
                                    min-width: 80px;
                                    text-align: right;
                                }
                            }
                            // td:first-child{
                            //     width: 70%;

                            // }
                            // td:last-child{
                            //     width: 30%;
                            //     min-width: 80px;
                            //     text-align: right;

                            // }
                        }
                        .news-line:hover td:first-child {
                            color: #01b0c7;
                        }
                        .news-line:active td:first-child {
                            color: darken(#01b0c7, -5%);
                        }
                        .news-none td {
                            border: none;
                        }
                    }
                    // table{
                    //     width: 100%;
                    //     table-layout: fixed;
                    //     border-collapse: collapse;
                    //     tr{
                    //         cursor: pointer;
                    //         height: 40px;
                    //         td{
                    //             font-size: 14px;
                    //             border-bottom: 1px solid #dddee1;
                    //             color: #666666;
                    //         }
                    //         td:first-child{
                    //             width: 70%;

                    //         }
                    //         td:last-child{
                    //             width: 30%;
                    //             min-width: 80px;
                    //             text-align: right;

                    //         }

                    //     }
                    //     .news-line:hover td:first-child{
                    //         color: #01b0c7;
                    //     }
                    //     .news-line:active td:first-child{
                    //         color:darken(#01b0c7,-5%);
                    //     }
                    //     .news-none td{
                    //         border:none;
                    //     }
                    // }
                }
            }
        }
    }
    .td-span {
        display: inline-block;
    }
}
</style>
