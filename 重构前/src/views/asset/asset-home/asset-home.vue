<template>
    <div class="asset-home-wrap">
        <div class="top-button">
            <Button @click="$refs['print-type'].typeShow=true"
                    icon="printer"
                    class="kld-btn"
                    style="margin-right: 10px;"
                    v-if="ViewLimit('ass:print')">打印标签</Button>
            <Button @click="addAsset"
                    class="kld-btn"
                    icon="plus"
                    v-if="ViewLimit('ass:add')">新增资产</Button>
        </div>
        <i-form ref="asset-home-form"
                class='asset-home-form'
                :model='search'>
            <div class="search-bar">
                <i-row :gutter="15">
                    <i-col :span='6'>
                        <form-item prop='keyword'>
                            <i-input class='kld-input'
                                     v-model="search.keyword"
                                     placeholder="关键字:名称/型号/SN/编码/品牌"></i-input>

                        </form-item>
                    </i-col>
                    <i-col :span='6'>
                        <form-item prop='warrantyStatus'>
                            <Select class="kld-select"
                                    placeholder="保修状态"
                                    v-model="search.warrantyStatus">
                                <Option v-for="(item, i) in warrantyStatusList"
                                        :key='i'
                                        :value="item.value">{{item.label}}</Option>
                            </Select>

                        </form-item>
                    </i-col>
                    <i-col :span='6'>
                        <form-item prop='consummate'>
                            <Select class="kld-select"
                                    placeholder="信息完善状态"
                                    v-model="search.consummate">
                                <Option v-for="(item, i) in consummateList"
                                        :key='i'
                                        :value="item.value">{{item.label}}</Option>
                            </Select>

                        </form-item>
                    </i-col>
                    <i-col :span='6'>
                        <form-item prop='used'>
                            <Select class="kld-select"
                                    placeholder="资产状态"
                                    v-model="search.used">
                                <Option v-for="(item, i) in usedList"
                                        :key='i'
                                        :value="item.value">{{item.label}}</Option>
                            </Select>

                        </form-item>
                    </i-col>
                </i-row>
                <i-row :gutter="15">
                    <i-col :span='6'>
                        <form-item prop='pictureStatus'>
                            <Select class="kld-select"
                                    placeholder="有无设备图片"
                                    v-model="search.pictureStatus">
                                <Option v-for="(item, i) in pictureStatusList"
                                        :key='i'
                                        :value="item.value">{{item.label}}</Option>
                            </Select>

                        </form-item>
                    </i-col>
                    <i-col :span='6'>
                        <form-item prop='associate'>
                            <Select class="kld-select"
                                    placeholder="设备分类关联情况"
                                    v-model="search.associate">
                                <Option v-for="(item, i) in associateList"
                                        :key='i'
                                        :value="item.value">{{item.label}}</Option>
                            </Select>

                        </form-item>
                    </i-col>
                    <i-col :span='6'>
                        <form-item prop='assetLabelType'>
                            <Select class="kld-select"
                                    placeholder="设备标签粘贴情况"
                                    v-model="search.assetLabelType">
                                <Option v-for="(item, i) in assetLabelTypeList"
                                        :key='i'
                                        :value="item.value">{{item.label}}</Option>
                            </Select>

                        </form-item>
                    </i-col>
                </i-row>
                <div class="config-bar">
                    <i-button class='kld-btn-default'
                              @click="reset">重置</i-button>
                    <i-button class='kld-btn'
                              @click="searchList">搜索</i-button>
                </div>

            </div>
            <div class="asset-home-content">
                <div class="tree-slide">

                    <Tabs value="name1"
                          type="card"
                          class="select-trees">
                        <TabPane label="科室列表"
                                 name="name1"
                                 class="tree-wrap">
                            <form-item prop='departmentId'
                                       class="tree-form-item">
                                <kld-side-tree v-model="search.departmentId"
                                               ref="department-tree"
                                               placeholder="科室搜索"
                                               show-input
                                               :input-style="{top:'4px'}"
                                               :loading='departmentLoading'
                                               :props="{label:'osName'}"
                                               :data="departmentList"
                                               cancelable
                                               first-expand></kld-side-tree>
                            </form-item>
                        </TabPane>
                        <TabPane label="分类列表"
                                 name="name2"
                                 class="tree-wrap">
                            <form-item prop='assertTypeId'
                                       class="tree-form-item">
                                <kld-side-tree v-model="search.assertTypeId"
                                               placeholder="分类搜索"
                                               :loading='typeLoading'
                                               :input-style="{top:'4px'}"
                                               show-input
                                               :data="assetTypeList"
                                               code-prefix
                                               cancelable
                                               leaf-only></kld-side-tree>
                            </form-item>
                        </TabPane>
                    </Tabs>
                </div>
                <div class="table-list">
                    <asset-table :loading='tableLoading'
                                 :columns='assetColumns'
                                 @row-in-click="jumpDetail"
                                 :data='assetList'></asset-table>
                    <kld-page :current="page.current"
                              :page-size="page.size"
                              :total="page.total"
                              @on-change="loadList"></kld-page>
                </div>

            </div>

        </i-form>
        <print-type ref="print-type"></print-type>
    </div>
</template>
<script>
import kldSideTree from "@common/kld-side-tree";
import assetTable from "./asset-table";
import kldPage from "@common/page";
import printType from "../common/option-print-type/index";

export default {
    name: "asset-home",
    beforeRouteEnter(to, from, next) {
        next(vue => {
            if (from.name === "asset-details" || from.name === "asset-config") {
                vue.loadList(vue.page.current);
            }
        });
    },
    components: { kldSideTree, assetTable, kldPage, printType },
    data() {
        return {
            search: {
                //关键字
                keyword: "",
                //保修状态
                warrantyStatus: "",
                //信息完善状态
                consummate: "",
                //资产状态
                used: "",
                //有无设备图片
                pictureStatus: "",
                //设备关联状态
                associate: "",
                //科室id
                departmentId: this.$store.state.user_in.osId,
                //设备分类Id
                assertTypeId: "",
                //资产标签粘贴
                assetLabelType: ""
            },
            warrantyStatusList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "1",
                    label: "保内"
                },
                {
                    value: "2",
                    label: "已出保"
                }
            ],
            consummateList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "1",
                    label: "完善"
                },
                {
                    value: "2",
                    label: "未完善"
                }
            ],
            usedList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "0",
                    label: "闲置"
                },
                {
                    value: "1",
                    label: "在用"
                },
                {
                    value: "3",
                    label: "备用机"
                },
                {
                    value: "4",
                    label: "待用"
                }
            ],
            pictureStatusList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "1",
                    label: "有设备图片"
                },
                {
                    value: "0",
                    label: "无设备图片"
                }
            ],
            associateList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "1",
                    label: "已关联"
                },
                {
                    value: "2",
                    label: "未关联"
                }
            ],
            assetLabelTypeList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: 1,
                    label: "已贴"
                },
                {
                    value: 2,
                    label: "未贴"
                }
            ],
            departmentList: [],
            assetTypeList: [],
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            departmentLoading: false,
            typeLoading: false,
            tableLoading: false,
            cancelToken: null,
            assetColumns: [
                {
                    key: "assetName",
                    label: "设备名称",
                    thStyle: {
                        "padding-left": "40px"
                    },
                    width: "35%"
                },
                {
                    key: "assetInfo",
                    label: "设备信息",
                    width: "20%"
                },
                {
                    key: "osName",
                    label: "所属科室",
                    width: "15"
                },
                {
                    key: "typeName",
                    label: "分类",
                    width: "15%"
                },
                {
                    key: "contractId",
                    label: "信息完善",
                    width: "200px"
                }
            ],
            assetList: []
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.user_in;
        },
        osId() {
            return this.userInfo.osId;
        }
    },
    created() {
        this.loadDepartment();
        this.loadType();
        this.loadList();
    },
    watch: {
        search: {
            handler(val) {
                this.loadList();
            },
            deep: true
        }
    },
    methods: {
        async loadDepartment() {
            this.departmentLoading = true;
            try {
                const { data } = await this.$store.dispatch(
                    "loadDepartmentTree"
                );
                this.departmentList = [data];
            } finally {
                this.departmentLoading = false;
            }
        },
        async loadType() {
            this.typeLoading = true;
            try {
                const data = await this.$store.dispatch("loadCountryType");
                this.assetTypeList = data;
            } finally {
                this.typeLoading = false;
            }
        },
        addAsset() {
            let departmentId = this.search.departmentId;
            if (departmentId && departmentId !== this.osId) {
                this.$router.push({
                    name: "add-asset",
                    params: { departmentId }
                });
            } else {
                this.$router.push({ name: "add-asset" });
            }
        },
        reset() {
            this.$refs["asset-home-form"].resetFields();
        },
        searchList() {},
        searchFormat(search) {
            let obj = {};
            for (let i in search) {
                obj[i] = search[i] === "" ? null : search[i];
            }
            return obj;
        },
        async loadList(page = 1) {
            if (this.cancelToken) {
                this.cancelToken();
            }
            this.tableLoading = true;
            try {
                this.page.current = page;
                const url = `assets/${this.osId}/list`;
                const requestBody = {
                    limit: this.page.size,
                    offset: this.page.size * (this.page.current - 1),
                    params: this.searchFormat(this.search)
                };
                const config = {
                    cancelToken: new this.$axios.CancelToken(c => {
                        this.cancelToken = c;
                    })
                };
                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post(url, requestBody, config);
                this.assetList = data || [];
                this.page.total = recordsTotal;
            } finally {
                this.tableLoading = false;
            }
        },
        jumpDetail(asset) {
            if (this.ViewLimit("ass:query")) {
                this.$router.push({
                    name: "asset-details",
                    params: { id: asset.id }
                });
            } else {
                this.$Message.error("你没有权限查看详情!");
            }
        }
    }
};
</script>
<style lang="less" scoped>
.asset-home-wrap {
    width: 100%;
    position: relative;
    .top-button {
        position: absolute;
        top: -65px;
        right: 0;
    }
    .asset-home-form {
        width: 100%;
        .search-bar {
            padding: 20px 200px 5px 20px;
            border-radius: 3px;
            background-color: rgb(250, 250, 250);
            border: 1px solid #dddee1;
            position: relative;
            .ivu-row {
                margin-bottom: 15px;
            }
            .config-bar {
                width: 150px;
                display: flex;
                justify-content: space-around;
                position: absolute;
                top: 20px;
                right: 22px;
            }
        }
        .asset-home-content {
            @slide: 300px;
            @cell: 10px;
            .border() {
                border: 1px solid #dddee1;
            }
            height: 910px;
            display: flex;
            margin-top: 20px;
            justify-content: space-between;

            .tree-slide {
                height: 100%;
                width: @slide;
                /deep/.select-trees {
                    height: 100%;
                    .tree-wrap{
                        background-color: #fafafa;
                    }
                    .ivu-tabs-content {
                        height: calc(100% - 55px);
                        .ivu-tabs-tabpane {
                            .border();
                        }
                        .tree-form-item {
                            height: 100%;
                            .ivu-form-item-content {
                                height: 100%;
                            }
                        }
                    }
                }
            }
            .table-list {
                background-color: #fafafa;
                height: 100%;
                overflow: auto;
                .border();
                width: calc(100% - @slide - @cell);
            }
        }
    }
}
</style>

