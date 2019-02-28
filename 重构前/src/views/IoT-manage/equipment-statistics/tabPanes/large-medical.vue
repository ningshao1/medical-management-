<template>
    <div class="large-medical-list">
        <Form ref="large-medical-form"
              :model="search"
              class='large-medical-form'>
            <Row :gutter='5'>
                <i-col :span='6'>
                    <FormItem prop="dateRange">
                        <date-picker class="kld-date-picker"
                                     :editable="false"
                                     type='daterange'
                                     transfer
                                     placeholder="请选择时间范围"
                                     v-model="search.dateRange"></date-picker>
                    </FormItem>
                </i-col>
                <i-col :span='6'>
                    <FormItem prop="keyword">
                        <i-input class="kld-input"
                                 placeholder="资产编码/资产名称"
                                 v-model="search.keyword"></i-input>
                    </FormItem>
                </i-col>
            </Row>

        </Form>
    </div>
</template>
<script>
import mixins from "./mixins";
export default {
    name: "large-medical",
    mixins: [mixins],
    data() {
        return {};
    },
    created() {
        this.init();
        this.loadData();
    },
    methods: {
        init() {
            this.$parent.columns = [
                {
                    type: "selection",
                    width: 30,
                    align: "center"
                },
                {
                    title: "序号",
                    key: "index",
                    width: 50
                },
                {
                    title: "资产编码",
                    key: "assetCode",
                    render: this.headerEllipsis
                },
                {
                    title: "资产名称",
                    key: "assetName",
                    render: this.headerEllipsis
                },
                {
                    title: "品牌",
                    key: "brandName",
                    render: this.headerEllipsis
                },
                {
                    title: "型号",
                    key: "assetClass",
                    render: this.headerEllipsis
                },
                {
                    title: "所属科室",
                    key: "os_Name",
                    render: this.headerEllipsis
                },
                {
                    title: "开机时间(h)",
                    key: "kjtime"
                    // width: 85
                },
                {
                    title: "待机时间(h)",
                    key: "djtime"
                    // width: 85
                },
                {
                    title: "检查时间(h)",
                    key: "jctime"
                    // width: 85
                },
                {
                    title: "维修时间(h)",
                    key: "wxtime"
                    // width: 85
                },
                {
                    title: "用电量(kw·h)",
                    key: "kwh"
                    // width: 60
                },
                {
                    title: "检查数",
                    key: "jccount"
                    // width: 60
                },
                {
                    title: "开单数",
                    key: "kdcount"
                    // width: 60
                },
                {
                    title: "偏差率(%)",
                    key: "deviation_rate"
                    // width: 100
                }
            ];
        },
        async loadData(currentPage = 1) {
            this.$parent.loading = true;
            let { page, checkedMap } = this.$parent;
            page.current = currentPage;
            let { current, size } = page;
            let { departmentId, keyword } = this.search;

            try {
                let url = `/internetThings/IOTBigStatics`;
                let requestBody = {
                    offset: (current - 1) * size,
                    limit: size,
                    params: {
                        startTime: this.remoteDateRange[0],
                        endTime: this.remoteDateRange[1],
                        keyword: keyword || null
                    }
                };
                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post(url, requestBody);
                page.total = recordsTotal;
                this.$parent.listData = data.map((v, i) => {
                    return {
                        ...v,
                        index: (i + 1 + (current - 1) * size + "").padStart(
                            3,
                            "0"
                        ),
                        _checked: !!checkedMap[v.assetId]
                    };
                });
            } finally {
                this.$parent.loading = false;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.large-medical-list {
    width: 100%;
    height: 100%;
    padding: 20px;
    .large-medical-form {
        width: 100%;
        height: 100%;
    }
}
</style>


