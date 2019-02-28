<template>
    <div class="modal-asset">
        <a @click="assetShow=true"
           href="javascript:;">点击选择已有设备</a>
        <Modal title="选择资产"
               v-model="assetShow"
               class-name="vertical-center-modal one-step-modal move-up-modal"
               :styles='assetModalStyle'>
            <div class="one-step-modal-content">
                <div class='one-step-tree asset-tree'>
                    <div>
                        <i-input placeholder='请输入科室名'
                                 v-model="TreekeyWord"></i-input>
                        <kld-tree :data='treeData'
                                  first-expanded
                                  :current.sync="departmentId"
                                  :titleKey='"osName"'
                                  :childrenKey='"lists"'
                                  :filterNodeMethod='filterNodeMethod'
                                  ref='kld-tree'></kld-tree>
                    </div>
                </div>
                <div class='one-step-table'>
                    <div>
                        <Input icon="ios-search-strong"
                               placeholder="请输入设备名称"
                               style="width: 100%;"
                               v-model="keyword"></Input>
                    </div>
                    <div class="one-asset modal-div">
                        <table id='modal-table'
                               class='one-asset-table table-stripe '
                               style="table-layout:fixed;border-collapse:collapse"
                               border="1">
                            <tr>
                                <th>设备编码</th>
                                <th>设备名称</th>
                                <th>设备型号</th>
                                <th>设备品牌</th>
                            </tr>
                            <tr v-for='(item,i) in assetList'
                                :key='i'
                                @click='getAsset(item)'>
                                <td class="textEllipsis"
                                    :title='item.assetCode'>{{item.assetCode}} </td>
                                <td class="textEllipsis"
                                    :title='item.assetName'>{{item.assetName}}</td>
                                <td class="textEllipsis">{{item.assetClass}}</td>
                                <td class="textEllipsis">{{item.brandName}}</td>
                            </tr>
                        </table>
                        <div class='acceptance-tree-page'>
                            <kld-page :total='assetPage.total'
                                      :current.sync='assetPage.current'
                                      @on-change='getAseetList'></kld-Page>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import kldTree from "@common/kld-tree";
import page from "@common/page";
import pinyi from "@common/pinyin-match";
export default {
    props: ["osData"],
    name: "modal-asset",
    data() {
        return {
            assetShow: false,
            assetPage: {
                total: 10,
                current: 1,
                size: 10
            },
            assetList: [],
            TreekeyWord: "",
            keyword: "",
            departmentId: ""
        };
    },
    components: {
        [kldTree.name]: kldTree,
        [page.name]: page
    },
    computed: {
        treeData() {
            return this.osData;
        },
        assetModalStyle() {}
    },
    watch: {
        TreekeyWord(val) {
            this.$refs["kld-tree"].$refs.tree.filter(val);
        },
        keyword() {
            this.assetPage.current = 1;
            this.getAseetList();
        },
        departmentId() {
            this.assetPage.current = 1;
            this.getAseetList();
        }
    },
    created() {
        this.getAseetList();
    },
    methods: {
        getAsset(row) {
            this.$emit("clickRow", row);
            this.assetShow = false;
        },

        getAseetList() {
            this.$axios
                .post(`assets/${this.$store.state.user_in.osId}/list`, {
                    limit: this.assetPage.size,
                    offset: (this.assetPage.current - 1) * this.assetPage.size,
                    params: {
                        departmentId: this.departmentId,
                        keyword: this.keyword,
                        accStatus: "0"
                    }
                })
                .then(({ data }) => {
                    this.assetList = data.data;
                    this.assetPage.total = data.recordsTotal;
                });
        },
        filterNodeMethod(value, { osName }) {
            if (value == "" || value === null) {
                return true;
            } else {
                return pinyi(osName, value);
            }
            // console.log(data);
        }
    }
};
</script>
<style lang="less" scoped>
.modal-asset {
    display: inline-block;
}
/deep/.one-step-modal {
    .ivu-modal {
        width: 800px !important;
    }
}
.one-step-modal-content {
    display: flex;
    .one-step-tree {
        max-width: 250px;
        min-width: 200px;
        max-height: 500px;
        overflow-y: auto;
        flex: 1;
        width: 20%;
        margin-right: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        background: #fff;
        padding: 10px;
        padding-left: 0;
        padding-top: 0;
    }
    .asset-tree {
        padding-left: 8px;
        padding-top: 8px;
    }
    .one-step-table {
        background: #fafafa;
        flex: 1;
        width: 80%;
        padding: 10px;
        .kld-input {
            margin-bottom: 10px;
        }
    }
}
.one-asset {
    .one-asset-table {
        border: none;
        width: 100%;
        > tr {
            text-align: center;
            border-bottom: 1px solid #e2e2e2;
            cursor: pointer;
            > th {
                width: 25%;
                padding: 8px;
                font-size: 13px;
                color: #666;
                font-weight: 600;
                border: none;
            }

            > td {
                font-size: 13px;
                color: #666;
                font-size: 13px;
                padding: 8px;
                border: none;
            }
            > td:nth-of-type(4) {
                font-size: 13px;
                cursor: pointer;
            }
        }
    }
    .acceptance-tree-page {
        text-align: center;
        padding-top: 12px;
        background: #fafafa;
        margin-bottom: 10px;
    }
}
</style>

