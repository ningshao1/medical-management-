<template>
    <div class="classification relative">
        <div class="position-to-title">
            <div>
            </div>
        </div>
        <div class="content-title pb-10 mb-20 flex justify-content-between align-items-end">
            <h2>设备分类管理</h2>
            <Button @click="exportExcel"
                    :loading="downloadLoading"
                    class="kld-btn">导出</Button>
        </div>
        <div class="asset-type kld-box-effect">
            <div class="asset-type">
                <div class="contains-country-type">
                    <div class="asset-title">
                        <span>国家设备分类</span>
                    </div>
                    <div class="country-table-wrap"
                         style="position: relative;">
                        <kld-search-tree v-if="countryTypeTree&&countryTypeTree.length>0"
                                         placeholder="按分类名称搜索"
                                         select-class="kld-select"
                                         tree-wrap-styles="overflow-x: hidden">
                            <kld-tree slot="tree"
                                      :data='countryTypeTree'
                                      class="country-type-tree"
                                      title-key="typeName"
                                      children-key="lists">
                                <span class="custom-tree-node"
                                      slot-scope="{ node, data }">
                                    <span>
                                        {{numberToLocale(data.typeLevel)}}级分类
                                        <template v-if="data.typeCode">[{{data.typeCode}}]</template>
                                        {{node.label}}
                                    </span>

                                    <span v-if="node.isLeaf">
                                        <span v-if="data.type !== null"
                                              class="set-force">
                                            <template v-if="data.type === 0">强检</template>
                                            <template v-else>非强检</template>
                                        </span>
                                        <Dropdown placement="bottom-end"
                                                  @on-click="updateCountryType(data, $event)">
                                            <Button type="text">
                                                <Icon type="android-more-vertical"
                                                      size="20"></Icon>
                                            </Button>
                                            <DropdownMenu slot="list">
                                                <!--<DropdownItem v-if="data.type !== 0" :name="0">设置为未计量类型</DropdownItem>-->
                                                <DropdownItem v-if="data.type !== 0"
                                                              :name="0">设为强制检定类型</DropdownItem>
                                                <DropdownItem v-if="data.type !== 1"
                                                              :name="1">设为非强制检定类型</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </span>
                                </span>
                            </kld-tree>
                        </kld-search-tree>
                        <div v-else
                             class="no-data-img">
                            <img src="./image/no-data.png">
                            <p>暂无相关数据</p>
                        </div>
                        <Loading v-if="countryTypeTreeLoading"></Loading>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
@import "~@inspection-common/varible";

.classification {
    height: 705px;
    display: flex;
    flex-direction: column;

    .content-title {
        flex-shrink: 0;
        border-bottom: 1px solid #ccd2d7;

        h2 {
            font-size: 20px;
            font-weight: normal;
            color: #333333;
        }
    }

    .asset-type {
        flex-grow: 1;
        padding: 0;
        position: relative;
        height: 644px;

        .asset-title {
            padding: 0 20px;
            color: #666;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid @border-color;
            font-size: 14px;
        }

        .contains-country-type {
            position: absolute;
            left: 0;
            top: 0;
            /*padding-left: 321px;*/
            width: 100%;
            height: 100%;

            .asset-title {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .kld-btn {
                    width: 100px;
                    height: 40px;
                }
            }

            .country-table-wrap {
                padding: 20px;
                height: 594px;
                box-sizing: padding-box;
                overflow: auto;

                /deep/ .country-type-tree {
                    background-color: transparent;

                    .custom-tree-node {
                        font-size: 14px;
                        width: 100%;
                        height: 40px;
                        display: flex;
                        padding-right: 10px;
                        justify-content: space-between;
                        align-items: center;

                        .set-force,
                        .set-default {
                            padding: 3px 6px;
                            border: 1px solid;
                            transition: 0.2s;
                        }

                        .set-force {
                            color: #25b0ca;
                            border-color: #25b0ca4c;
                        }
                    }

                    /deep/ .searched-current {
                        .set-force {
                            color: #fff;
                            border-color: #fff;
                        }
                    }
                }

                .no-data-img {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;

                    img {
                        width: 156px;
                    }

                    p {
                        color: #a9a8a9;
                    }
                }
            }
        }
    }
}
</style>

<script>
import KldSearchTree from "@common/kld-search-tree";
import kldTree from "@common/kld-tree";
import { downloadFile, numberToLocale, kldConfirm as $Confirm } from "@/utils";

export default {
    name: "classification",
    components: {
        kldTree,
        KldSearchTree
    },
    data() {
        return {
            downloadLoading: false,
            countryTypeTreeLoading: false,
            countryTypeTree: []
        };
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    created() {
        this.getCountryTree();
    },
    methods: {
        numberToLocale,

        //获取国家分类树
        async getCountryTree() {
            this.countryTypeTreeLoading = true;
            try {
                this.countryTypeTree = await this.$store.dispatch(
                    "loadCountryType",
                    true
                );
            } finally {
                this.countryTypeTreeLoading = false;
            }
        },
        //修改国家分类的检定类型
        updateCountryType(typeData, type) {
            $Confirm({
                content:
                    typeData.type === null
                        ? "设置计量类型后，此分类将无法再修改为未计量类型<br>是否继续修改分类计量类型？"
                        : "该分类下对应设备计量任务将会被清空，是否继续修改分类计量类型？",
                ok: async () => {
                    await this.$axios.put("/assetTypes/addTypeDetection", {
                        assetTypeId: typeData.id,
                        hosId: this.user_in.osId,
                        type
                    });

                    this.$Message.success("修改国家分类类型成功");
                    this.$set(typeData, "type", type);
                }
            });
        },

        async exportExcel() {
            this.downloadLoading = true;
            try {
                const { data: blob } = await this.$axios.post(
                    "/assetTypes/downloadAssetTypes",
                    null,
                    { responseType: "blob" }
                );
                downloadFile(blob, "国家分类.xls");
            } finally {
                this.downloadLoading = false;
            }
        }
    }
};
</script>