<template>
    <div class="acceptance-list">
        <Button v-if="checkLimit('acc:add')"
                style="margin-top: -5px;"
                class='kld-btn addAsset'
                icon="plus"
                @click='$router.push({name:"AddAccessptance"})'>新增资产验收</Button>
        <div style="margin-bottom:15px;">
            <div class="search kld-box-effect">
                <Row type="flex"
                     :gutter="10">
                    <i-col>
                        <Input v-model="search.keyword"
                               placeholder="关键字/上传人"
                               style="width:250px;margin-right:15px;"
                               icon="android-search" />
                    </i-col>
                    <i-col class="acceptance-brand">
                        <Select placeholder='请选择品牌'
                                v-model="search.brandId"
                                filterable
                                remote
                                :remote-method="remoteMethod"
                                :loading="loading"
                                class="brand-select kld-select"
                                style="width:200px">
                            <Option v-for="(option, index) in brandList"
                                    :value="option.value"
                                    :key="index">{{option.label}}</Option>
                        </Select>
                    </i-col>
                    <i-col>
                        <DatePicker v-model="sTime"
                                    @on-change='getStartTime'
                                    :editable="false"
                                    format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="选择开始时间"
                                    style="width: 200px"
                                    ></DatePicker>
                    </i-col>
                    <i-col>
                        <DatePicker v-model="eTime"
                                    @on-change='getEndTime'
                                    :editable="false"
                                    format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="选择结束时间"
                                    style="width: 200px"></DatePicker>
                    </i-col>
                    <i-col>
                        <Button class="kld-btn"
                                icon="android-search"
                                @click='searchBtn'>检索</Button>
                        <Button class="kld-btn"
                                @click='AccReset'>重置</Button>
                    </i-col>
                </Row>
            </div>
        </div>
        <div class='list-content'>
            <div class="list-tree">
                <div class="tree-content">
                    <kld-search-tree placeholder="科室名称搜索">
                        <kld-tree slot="tree"
                                  :data="sectionTreeData"
                                  :current.sync="search.departmentId"
                                  title-key="osName"
                                  children-key="lists"
                                  highlight-current
                                  first-expanded></kld-tree>
                    </kld-search-tree>
                </div>
            </div>
            <div class="maintain">
                <Tabs type="card">
                    <TabPane label="未验收资产">
                        <div style="background-color: #f3f4f5;">
                            <NoAsset :search='search'
                                     ref="NoAsset"></NoAsset>
                        </div>
                    </TabPane>
                    <TabPane label="已验收资产">
                        <div style="background-color: #f3f4f5;">
                            <alreadyAsset :search='search'
                                          ref="alreadyAsset"></alreadyAsset>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </div>
</template>
<script>
import alreadyAsset from "./already-asset/already-asset";
import NoAsset from "./no-asset/no-asset";
import KldTree from "@common/kld-tree";
import KldSearchTree from "@common/kld-search-tree";

export default {
    data() {
        return {
            loading: false,
            brandList: [], //品牌列表
            //搜索参数
            search: {
                departmentId: null,
                brandId: null,
                keyword: null,
                startTime: null,
                endTime: null
            },
            sTime: null, //开始时间
            eTime: null, //结束时间
            sectionTreeData: []
        };
    },
    components: {
        NoAsset,
        alreadyAsset,
        KldTree,
        KldSearchTree
    },
    created() {
        this.getSectionData();
    },
    methods: {
        getSectionData() {
            this.loadings = true;
            return this.$axios
                .get(`orgstruct/findAllTree/${this.$store.state.user_in.osId}`)
                .then(({ data }) => {
                    this.sectionTreeData = [data];
                });
        },
        AccReset() {
            this.search = {
                departmentId: null,
                brandId: null,
                keyword: null,
                startTime: null,
                endTime: null
            };
            this.sTime = "";
            this.eTime = "";
            this.$refs["NoAsset"].page.current = 1;
            this.$refs["alreadyAsset"].page.current = 1;
        },
        remoteMethod(query) {
            this.loading = true;
            // if (query !== "") {
            this.$axios
                .post(
                    `assertBrandcopys/${this.$store.state.user_in.osId}/list`,
                    {
                        limit: 100,
                        offset: 0,
                        params: {
                            keyword: query
                        }
                    }
                )
                .then(res => {
                    this.loading = false;
                    res.data.data.unshift({
                        brandId: "all", //id=>brandId
                        brandName: "全部"
                    });
                    let temp = res.data.data.map(item => {
                        return {
                            value: item.brandId, //id=>brandId
                            label: item.brandName
                        };
                    });
                    this.brandList = temp;
                })
                .catch(() => {
                    this.loading = false;
                    this.brandList = [];
                });
            // } else {
            //     this.brandList = [];
            // }
        },
        getBrand() {},
        //获取开始时间
        getStartTime(date) {
            this.search.startTime = date;
            if (this.search.endTime !== null && this.search.endTime !== "") {
                if (
                    date.split("-").join("") - 0 >
                    this.search.endTime.split("-").join("") - 0
                ) {
                    this.search.endTime = null;
                    this.eTime = null;
                    this.$Message.warning("开始时间不能大于结束时间");
                }
            }
        },
        //获取结束时间
        getEndTime(date) {
            this.search.endTime = date;
            if (
                this.search.startTime !== null &&
                this.search.startTime !== ""
            ) {
                if (
                    date.split("-").join("") - 0 <
                    this.search.startTime.split("-").join("") - 0
                ) {
                    this.search.endTime = null;
                    this.eTime = null;
                    this.$Message.warning("开始时间不能大于结束时间");
                }
            }
        },
        //点击树的节点
        clickTree(node) {
            if (node instanceof Array) {
                if (node.length > 0) {
                    this.search.departmentId = node[0].id;
                }
            }
        },
        //点击按钮
        searchBtn() {
            this.$refs.NoAsset.getList();
            this.$refs.alreadyAsset.getList();
        }
    }
};
</script>
<style lang="less" scoped>
.acceptance-list {
    position: relative;
    > .addAsset {
        position: absolute;
        right: 0;
        top: -60px;
    }
    /deep/.acceptance-brand {
        .ivu-select-single .ivu-select-input {
            height: 100%;
        }
    }
    .list-content {
        display: flex;
        min-height: 800px;

        .list-tree {
            padding: 5px 8px;
            margin-right: 12px;
            width: 20%;
            max-width: 300px;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            flex: 1;
            //padding-right: 0;

            .tree-content {
                overflow: auto;
                max-height: 900px;
                overflow-x: hidden;
            }
        }

        .maintain {
            position: relative;
            flex: 1;
            background: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            border-top: none;
        }
    }
}
/deep/.ivu-tabs {
    .ivu-tabs-tabpane {
        background: #fafafa;
    }
}
/deep/.brand-select {
}
</style>
