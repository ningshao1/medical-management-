<template>
    <div class="large-equipment-detail relative">
        <Loading v-if="pageLoading"></Loading>
        <Row :gutter="20">
            <i-col span="12">
                <asset-base-info :data="details" class="mb-20" />
                <asset-data-collection :data="details" />
            </i-col>
            <i-col span="12">
                <div class="p-0 kld-box-effect relative">
                    <Loading v-if="tableLoading"></Loading>
                    <kld-table :data="tableData"
                               :columns="tableColumns"
                               height="850" />
                </div>
            </i-col>
        </Row>
    </div>
</template>

<style lang="less" scoped>
.large-equipment-detail {
}
</style>

<script>
import {KldTable} from "@/components";
import AssetBaseInfo from "./asset-base-info";
import AssetDataCollection from "./asset-data-collection";
import list from "../common/list";
import merge from "@/common/no-expand-merge";
import moment from "moment";

export default {
    name: "large-equipment-detail",
    mixins: [list],
    components: {
        KldTable,
        AssetBaseInfo,
        AssetDataCollection
    },

    data() {
        return {
            searchData: {
                startTime: "",
                endTime: "",
                ip: ""
            },
            pageData: {
                pageSize: 1000000
            },
            pageLoading: false,
            details: {}
        };
    },

    computed: {
        tableUrl: () => "/internetThings/listCoupletByDay",
        tableColumns: () => [
            {
                title: "日期",
                key: "day"
            },
            {
                title: "开机时间(h)",
                key: "kjtime"
            },
            {
                title: "待机时间(h)",
                key: "djtime"
            },
            {
                title: "运行时间(h)",
                key: "yxtime"
            },
            {
                title: "度数(kw·h)",
                key: "kwh"
            },
            {
                title: "检查次数",
                key: "check"
            }
        ],
        assetId() {
            return this.$route.query.id;
        }
    },

    async created() {
        await this.getDetails();
        const { details, searchData } = this;
        searchData.ip = details.ip;
        searchData.startTime = moment()
            .set({ date: 1 })
            .format("YYYY-MM-DD 00:00:00");
        searchData.endTime = moment()
            .set({
                date: moment().date() - 1
            })
            // .set({ month: moment().month() + 1, date: 0 })
            .format("YYYY-MM-DD 23:59:59");
    },

    methods: {
        async getDetails() {
            this.pageLoading = true;
            try {
                const { data } = await this.$axios.post(
                    `/internetThings/getObjectByAssetId/${this.assetId}`
                );

                this.details = data;
            } finally {
                this.pageLoading = false;
            }
        }
    }
};
</script>