<template>
    <div class="NAD-wrap" >
        <Tabs type="card" @on-click="toggle" v-model="page">
            <TabPane :label="v.label" v-for="(v,i) of tabPanes" :key="i" :style="`min-height:300px;position:relative;${i!=page||!v.loaded?'max-height:500px':''}`">
                <component :is="v.component" v-if="v.loadData||i==page" :loaded="checkLoading(i)" :jump="jump"></component>
                <Loading v-if="!v.loaded"></Loading>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import { tabPanes } from "./API.js";
export default {
    name: "asset-details",
    data() {
        return {
            tabPanes: tabPanes.call(this),
            page: 0,
            redDOt: {
                maintenance: false
            }
        };
    },
    created() {
        this.getOriginData();
        // setTimeout(()=>{
        //     this.redDOt.maintenance=true
        // },3000)
    },
    methods: {
        //获得初始数据
        getOriginData() {
            this.getRepairList();
        },
        //获得保修记录
        getRepairList() {
            this.$axios
                .post(`/faultReport/faultReportByAsId`, {
                    limit: 1,
                    offset: 0,
                    params: {
                        assetId: this.$route.params.id
                    }
                })
                .then(res => {
                    if (res.data.data.length && res.data.data[0].type == 1) {
                        this.redDOt.maintenance = true;
                    }
                });
        },
        toggle(index) {
            if (index === this.page) {
                return;
            }
            this.tabPanes[index].loaded = this.tabPanes[index].loadData;
        },
        checkLoading(i) {
            return (loadData = true) => {
                this.tabPanes[i].loaded = true;
                this.tabPanes[i].loadData = loadData;
                // this.$forceUpdate();
            };
        },
        jump(i) {
            this.page = i;
        }
    }
};
</script>

<style lang="less">
.NAD-wrap {
    .ivu-tabs-tab {
        width: auto !important;
    }
}
</style>
