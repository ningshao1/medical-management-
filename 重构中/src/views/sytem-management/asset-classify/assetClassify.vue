<template>
    <div>
        <kld-card noheader>
            <div class="search"
                 v-load='downloadLoading'>
                <el-button size='mini'
                           @click="exportExcel">导出</el-button>
                <el-input class="asset-classify-input"
                          placeholder="请输入检索内容"
                          suffix-icon='el-icon-search'
                          v-model="inputValue"
                          @blur="searchTree"
                          @keyup.enter.native="enterHandler">
                </el-input>
            </div>
            <div class="classify-tree"
                 ref="parent-tree">
                <kld-tree :data='countryList'
                          leaf-only
                          code-prefix
                          ref="classify-tree"
                          class="KldTree">
                    <div slot="tree-item"
                         slot-scope="{ node, data }"
                         class="classify-tree-item">
                        <span class="item-name">{{node.label}}</span>
                        <div class="item-handler"
                             v-if="!data.lists">
                            <el-tag type="danger"
                                    class="classify-tag"
                                    v-if="data.type===0">
                                强检
                            </el-tag>
                            <el-tag v-else-if="data.type===1"
                                    class="classify-tag">
                                非强检
                            </el-tag>
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    <i class="el-icon-arrow-down el-icon-more"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="data.type !== 0"
                                                      @click.native="updateCountryType(data,0)">设为强制检定类型</el-dropdown-item>
                                    <el-dropdown-item v-if="data.type !== 1"
                                                      @click.native="updateCountryType(data,1)">设为非强制检定类型</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                        </div>
                    </div>
                </kld-tree>
            </div>
        </kld-card>
    </div>
</template>

<script>
import kldCard from "@c/KldCard";
import { confirm } from "@el";
import { KldTree } from "@c";
export default {
    data() {
        return {
            countryList: [],
            inputValue: "",
            downloadLoading: false
        };
    },
    components: {
        [kldCard.name]: kldCard,
        [KldTree.name]: KldTree
    },
    created() {
        this.getData();
    },
    watch: {},
    methods: {
        async getData() {
            this.downloadLoading = true;
            try {
                this.countryList = await this.$store.dispatch(
                    "loadCountryType",
                    true
                );
            } finally {
                this.downloadLoading = false;
            }
        },
        searchTree() {
            this.$refs["classify-tree"].filter(this.inputValue);
        },
        enterHandler(e) {
            const keys = this.$refs["classify-tree"].searchedKeys;
            if (keys && keys.length > 0) {
                this.$refs["classify-tree"].keyboardOperation(e);
            } else {
                this.searchTree();
            }
        },
        //修改国家分类的检定类型
        updateCountryType(typeData, type) {
            confirm({
                content:
                    typeData.type === null
                        ? "设置计量类型后，此分类将无法再修改为未计量类型\n是否继续修改分类计量类型？"
                        : "该分类下对应设备计量任务将会被清空，是否继续修改分类计量类型？",
                ok: async () => {
                    await this.$axios.put("/assetTypes/addTypeDetection", {
                        assetTypeId: typeData.id,
                        hosId: this.$store.state.userInfo.osId,
                        type
                    });
                    this.$message.success("修改国家分类类型成功");
                    this.$set(typeData, "type", type);
                }
            });
        },
        async exportExcel() {
            this.downloadLoading = true;
            try {
                await this.$axios.post("/assetTypes/downloadAssetTypes", null, {
                    responseType: "blob",
                    kldMeta: {
                        filename: "国家分类.xls"
                    }
                });
                this.$message.success("下载成功");
            } finally {
                this.downloadLoading = false;
            }
        }
    }
};
</script>

<style scoped lang="less">
.asset-classify-input {
    width: 300px;
    margin-left: 20px;
}
.classify-tree-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    > .item-handler {
        .tree-item-more {
        }
    }
    .classify-tag {
        margin-right: 30px;
    }
}
.search {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
/deep/.KldTree {
    max-height: 500px;
    overflow: auto;
    overflow-x: hidden;
    .kld-tree-item-node {
        width: 100%;
    }
    .el-tree-node__content {
        height: 45px;
    }
    .classify-tree-item {
        width: 100%;
    }
}
</style>
