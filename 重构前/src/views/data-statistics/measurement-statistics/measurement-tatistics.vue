<template>
    <div class="measurement-tatistics-wrap">
        <Tabs v-model="currentType"
              type="card">
            <TabPane v-for="{label,type,totalName} of cardList"
                     :key='type'
                     :label="label"
                     :name="type+''">
                <metering-page :page-info="{label,totalName,type}"></metering-page>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import meteringPage from "./metering-page.vue";
export default {
    name: "measurement-tatistics",
    components: { meteringPage },
    data() {
        return {
            listLoading: false,
            currentType: "0",
            cardList: [
                {
                    label: "正常计量（强检）",
                    type: 0,
                    totalName: "强检类总数"
                },
                {
                    label: "正常计量（非强检）",
                    type: 1,
                    totalName: "非强检类总数"
                },
                {
                    label: "低值计量",
                    type: 2,
                    totalName: "低值计量类总数"
                }
            ]
        };
    }
};
</script>

<style lang="less" scoped>
.measurement-tatistics-wrap {
    /deep/.ivu-tabs {
        .ivu-tabs-tabpane{
            box-shadow:none;
        }
        .ivu-tabs-tab {
            width: auto;
        }
        .ivu-tabs-tab-active {
            width: auto;
        }
    }
}
</style>


