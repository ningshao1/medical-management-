<template>
    <div class="new-list">
        <kld-card class="list-card"
                  title='卫建委新闻动态'>
            <div slot='header'>
            </div>
            <el-tabs v-model='tabsName'>
                <el-tab-pane label="时政要闻"
                             name="1">
                    <div class="list-content">
                        <el-scrollbar :native='false'
                                      class="list-bar">
                            <ul v-if="newList['1'].length">
                                <li v-for="(item,i) in newList['1']"
                                    :key='i'><a :href="item.url"
                                       class="ellipsis"
                                       :title='item.title'>{{item.title}} </a>
                                    <span>{{item.newsTime?dayjs(item.newsTime).format('YYYY-MM-DD'):''}}</span>
                                </li>
                            </ul>
                            <div class="center"
                                 v-else>
                                暂无数据
                            </div>
                        </el-scrollbar>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="国务院文件"
                             name="2">
                    <div class="list-content">
                        <el-scrollbar :native='false'
                                      class="list-bar">
                            <ul v-if="newList['2'].length">
                                <li v-for="(item,i) in newList['2']"
                                    :key='i'><a :href="item.url"
                                       class="ellipsis"
                                       :title='item.title'>{{item.title}} </a>
                                    <span>{{dayjs(item.newsTime).format('YYYY-MM-DD')}}</span>
                                </li>
                            </ul>
                            <div class="center"
                                 v-else>
                                暂无数据
                            </div>
                        </el-scrollbar>

                    </div>
                </el-tab-pane>
                <el-tab-pane label="政务公开"
                             name="3">
                    <div class="list-content">
                        <el-scrollbar :native='false'
                                      class="list-bar">
                            <ul v-if="newList['3'].length">
                                <li v-for="(item,i) in newList['3']"
                                    :key='i'><a :href="item.url"
                                       class="ellipsis"
                                       :title='item.title'>{{item.title}} </a>
                                    <span>{{dayjs(item.newsTime).format('YYYY-MM-DD')}}</span>
                                </li>
                            </ul>
                            <div class="center"
                                 v-else>
                                暂无数据
                            </div>
                        </el-scrollbar>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="文档下载"
                             name="4">
                    <div class="list-content">
                        <el-scrollbar :native='false'
                                      class="list-bar">
                            <ul v-if="newList['4'].length">
                                <li v-for="(item,i) in newList['4']"
                                    :key='i'><a href="javascript:;"
                                       class="ellipsis"
                                       :title='item.fileName'
                                       @click="downDocFile(item.id)">{{item.fileName}} </a>
                                    <span @click="downDocFile(item.id)"
                                          class="downFile">下载文件</span>
                                </li>
                            </ul>
                            <div class="center"
                                 v-else>
                                暂无数据
                            </div>
                        </el-scrollbar>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div class="subject"
                 @click="jump">
                进入专题
            </div>
        </kld-card>
    </div>
</template>
<script>
import kldCard from "@c/KldCard";
import tabs from "@/element-ui/Tabs";
import tabPane from "@/element-ui/tabPane";
// import { tabPane } from "element-ui";
import sroll from "element-ui/lib/scrollbar";
import dayjs from "dayjs";
export default {
    name: "new-list",
    data() {
        return {
            tabsName: "1",
            newList: {
                "1": [],
                "2": [],
                "3": [],
                "4": []
            }
        };
    },

    methods: {
        dayjs,
        getTypeDate(nhfpcType, nhfpcTypeName) {
            this.$axios
                .get(`/nhfpcNews/getNews?nhfpcType=${nhfpcType}`)
                .then(({ data }) => {
                    this.newList[nhfpcType] = data;
                });
        },
        getDocFileList() {
            return this.$axios
                .post("/fileUplod/filelist", {
                    limit: 8,
                    offset: 0,
                    params: {
                        osid: this.$store.state.userInfo.osId
                    }
                })
                .then(({ data: { data } }) => {
                    if (!(data instanceof Array)) return;
                    this.newList["4"] = data.filter(v => v.type === 1);
                });
        },
        downDocFile(url) {
            this.$axios
                .get(`/fileUplod/` + url)
                .then(() => this.$message.success("下载成功"));
        },
        jump() {
            if (this.tabsName !== "4") window.open("http://www.nhfpc.gov.cn/");
        }
    },
    watch: {
        tabsName: {
            handler() {
                const data = {
                    "1": "currentAffairs",
                    "2": "documentOfSC",
                    "3": "gAffairs"
                };
                if (this.tabsName === "4") this.getDocFileList();
                else this.getTypeDate(this.tabsName, data[this.tabsName]);
            },
            immediate: true
        }
    },
    components: {
        [kldCard.name]: kldCard,
        [tabs.name]: tabs,
        [tabPane.name]: tabPane,
        [sroll.name]: sroll
    }
};
</script>

<style scoped lang="scss">
.new-list {
    margin-top: 20px;
    /deep/ .list-card {
        .el-card__header {
            display: none;
            // padding-bottom: 8px;
        }
        .kld-card__body {
            padding: 0px 20px 0px 18px !important;
        }
    }
}
.list-content {
    height: 230px;
    position: relative;
}
ul {
    padding: 0;
    margin: 0;
    > li {
        font-size: 14px;
        display: flex;
        padding-right: 20px;
        justify-content: space-between;
        height: 38px;
        line-height: 38px;
        a {
            width: 60%;
            display: inline-block;
            color: rgba(0, 0, 0, 0.65);
            &:hover {
                color: #4b74e0;
            }
        }
    }
    li:nth-of-type(2n) {
        background-color: rgba(75, 116, 224, 0.05);
    }
}
/deep/.list-bar {
    height: 100%;
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
}
.downFile {
    cursor: pointer;
    color: #4b74e0;
    &:active {
        opacity: 0.8;
    }
}
.subject {
    line-height: 40px;
    color: #4b74e0;
    font-size: 14px;
    cursor: pointer;
}
</style>
