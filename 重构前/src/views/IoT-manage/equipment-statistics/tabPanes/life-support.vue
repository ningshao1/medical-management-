<template>
    <div class='life-support-wrap'>
        <Form ref="life-support-form"
              :model="search"
              class='life-support-form'>
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
                                 placeholder="资产编码/资产名称/IP地址"
                                 v-model="search.keyword"></i-input>
                    </FormItem>
                </i-col>
                <i-col :span='6'>
                    <FormItem prop="departmentId">
                        <kld-dropdown-tree v-model="search.departmentId"
                                           :data='departmentTree'
                                           placeholder='选择科室'
                                           :props='{label:"osName"}'
                                           first-expand></kld-dropdown-tree>
                    </FormItem>
                </i-col>
            </Row>

        </Form>

    </div>
</template>
<script>
import mixins from "./mixins";
import kldDropdownTree from "@common/kld-dropdown-tree";

export default {
    name: "life-support",
    mixins: [mixins],
    components: { kldDropdownTree },
    data() {
        return {
            departmentTree: []
        };
    },
    created() {
        this.init();
        this.loadData();
        this.loadDepartements();
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
                    title: "资产位置",
                    key: "location"
                },
                {
                    title: "在用时间(h)",
                    key: "zyTime"
                    // width: 85
                },
                {
                    title: "待用时间",
                    key: "dyTime"
                    // width: 80
                },
                {
                    title: "维修时间",
                    key: "wxTime"
                    // width: 80
                },
                {
                    title: "在用率(%)",
                    key: "rate"
                    // width: 80
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
                let url = `/internetThings/IOTLifeStatics`;
                let requestBody = {
                    offset: (current - 1) * size,
                    limit: size,
                    params: {
                        startTime: this.remoteDateRange[0],
                        endTime: this.remoteDateRange[1],
                        departmentId: departmentId || null,
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
        },
        async loadDepartements() {
            const { data } = await this.$store.dispatch("loadDepartmentTree");
            this.departmentTree = [data];
        }
    }
};
</script>
<style lang="less">
.life-support-wrap {
    width: 100%;
    height: 100%;
    padding: 20px;
    .life-support-form {
        width: 100%;
        height: 100%;
    }
}
</style>

