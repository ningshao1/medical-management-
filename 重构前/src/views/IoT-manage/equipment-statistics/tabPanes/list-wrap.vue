<template>
    <div class="equipment-statistics-list-wrap">
        <div class="search-wrap">
            <slot></slot>
        </div>
        <div class="list-wrap">
            <Table
            ref="table"
                class="list-table"
                @on-select-cancel="cancelItem"
                @on-selection-change="selectionChange"
                :columns="columns"
                :loading='loading'
                :data="listData"
            ></Table>
        </div>
        <div class="list-wrap-bottom">
            <div class="check-and-download">

                <Button
                    type="ghost"
                    @click="ckeckDownload"
                >
                    下载选中项
                </Button>
            </div>
            <div class="page-wrap">
                <kld-page
                    class="list-wrap-page"
                    :current="page.current"
                    :total="page.total"
                    :page-size="page.size"
                ></kld-page>
            </div>
        </div>
    </div>
</template>
<script>
import kldPage from "@common/page";
import qs from "qs";
let downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.setAttribute("download", filename || "");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export default {
    name: "equipment-statistics-list-wrap",
    components: { kldPage },
    data() {
        return {
            columns: [],
            listData: [],
            page: {
                current: 1,
                total: 0,
                size: 10
            },
            checkAll: false,
            loading: false,
            checkedMap: {},
            filename: {
                3: "生命支持类设备统计表",
                4: "大型医疗设备统计表"
            }
        };
    },
    props: {
        type: Number
    },
    created() {},
    methods: {
        selectionChange(selection) {
            console.log(selection)
            selection.forEach(item => {
                this.checkedMap[item.assetId] = item;
            });
            if (!selection.length) {
                this.listData.forEach(({ assetId }) => {
                    if (this.checkedMap[assetId]) {
                        this.$delete(this.checkedMap, assetId);
                    }
                });
            }
        },
        selectAll(status){
            if(this.$refs.table){
                this.$refs.table.selectAll(status);
            }
        },
        cancelItem(selection, { assetId }) {
            this.$delete(this.checkedMap, assetId);
        },
        ckeckDownload() {
            if (!Object.keys(this.checkedMap).length) {
                return this.$Message.warning("请先选择下载项！");
            }
            this.download();
        },
        async download() {
            const filename = this.filename[this.type];
            const dateRange = this.$slots.default[0].child.remoteDateRange;
            const request = {
                startTime: dateRange[0],
                endTime: dateRange[1],
                assetIds: Object.keys(this.checkedMap)
            };
            const { data } = await this.$axios.post(
                `/internetThings/exportIOTExcel/${this.type}`,
                request,
                {
                    responseType: "blob",
                    kldMeta: {
                        filename
                    }
                }
            );
            // let downloadUrl = URL.createObjectURL(data);

            // downloadFile(downloadUrl, this.filename[this.type]);
        }
    }
};
</script>
<style lang="less" scoped>
.equipment-statistics-list-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
    .search-wrap {
        width: 100%;
        position: relative;
    }
    @footer: 80px;
    .list-wrap {
        width: 100%;
        padding-bottom: @footer;
        /deep/.list-table {
            min-height: 300px;
            background-color: #f3f4f5;
            td,
            th {
                background-color: #f3f4f5;
            }
            .ivu-table-header {
                border-top: solid 1px #c8ced3;
                background-color: #e5e5e5;
                .ivu-checkbox-wrapper {
                    position: absolute;
                    bottom: -48px;
                    left: 20px;
                }
            }
            // .ivu-table-body {
            // }
            .ivu-table-cell {
                padding-right: 10px;
                padding-left: 10px;
            }
        }
    }
    .list-wrap-bottom {
        margin-top: -@footer;
        width: 100%;
        height: @footer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: rgba(235, 235, 235, 0.5);
        padding: 0 10px;
        .check-and-download {
            padding-left: 40px;
        }
    }
}
</style>


