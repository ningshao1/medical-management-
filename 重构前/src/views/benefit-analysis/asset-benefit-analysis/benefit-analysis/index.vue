<template>
    <div class="benefit-analysis-toggle">
        <Tabs type="card" v-model="tabPaneIndex">
            <TabPane :label="v.label" v-for="(v,i) of tabPanes" :key='i' :class="{'is-hidden':tabPaneIndex!==i}">
                <component :active-pane='tabPaneIndex' :time-change-count='timeChangeCount' @timeChange='timeChange' :is="v.component" :toggleTabPane='toggleTabPane()'></component>
            </TabPane>
        </Tabs>
        <div class="goback-wrap">
            <Button class='kld-btn-default' @click='goback'>返回</Button>

        </div>
    </div>
</template>
<script>
import tabPanes from "../compontents/index";
export default {
    name: "benefit-analysis",
    data() {
        return {
            tabPanes,
            tabPaneIndex: 0,
            timeChangeCount: 0
        };
    },
    beforeCreate() {
        this.$store.commit("resetDateRange");
    },
    methods: {
        toggleTabPane() {
            return tabPaneIndex => {
                this.tabPaneIndex = tabPaneIndex;
            };
        },
        timeChange() {
            this.timeChangeCount++;
        },
        goback(){
            this.$router.go(-1)
        }
    }
};
</script>

<style lang="less" scoped>
.benefit-analysis-toggle {
    .is-hidden {
        max-height: 700px;
        overflow: hidden;
    }
    .goback-wrap{
        width:100%;
        height: 80px;
        padding: 0 15px;
        background-color: #fafafa;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
}
</style>
