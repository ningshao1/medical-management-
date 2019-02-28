<template>
    <div class="maintain">
        <Tabs type="card" v-model="tabKey">
            <TabPane label="一级保养" name='1' v-if="ViewLimit('pm:one:task')">
                <div style="background-color: #f3f4f5;">
                    <OneMaintain></OneMaintain>
                </div>
            </TabPane>
            <TabPane label="二级保养" name='2' v-if="ViewLimit('pm:two:task')">
                <div style="background-color: #f3f4f5;">
                    <Twomaintain></Twomaintain>
                </div>
            </TabPane>
            <TabPane label="三级保养" name='3' v-if="ViewLimit('pm:three:task')">
                <div style="background-color: #f3f4f5;">
                    <ThreeMaintain></ThreeMaintain>
                </div>
            </TabPane>
        </Tabs>
        <Button :disabled='tabKey!=="2"' style="margin-top: -5px;" :class="tabKey!=='2'?'disabledBtn':''" class='addTwoPlan kld-btn' icon="plus" @click='addTwoPlan' v-if="ViewLimit('pm:two:task:add')">二级保养任务</Button>
    </div>
</template>
<script>
import OneMaintain from "./Onemaintain/Onemaintain.vue";
import Twomaintain from "./Twomaintain/Twomaintain";
import ThreeMaintain from "./Threemaintain/Threemaintain.vue";
export default {
    data() {
        return {
            tabKey: this.$route.query.type ? this.$route.query.type : "1",
            list: null
        };
    },
    components: {
        OneMaintain,
        ThreeMaintain,
        Twomaintain
    },
    created() {
        this.checkLimit();
    },
    methods: {
        addTwoPlan() {
            this.$router.push({ name: "AddTwoMaintainTask" });
        },
        checkLimit() {
            if (
                !(
                    this.ViewLimit("pm:one:task") ||
                    this.ViewLimit("pm:two:task") ||
                    this.ViewLimit("pm:three:task")
                )
            ) {
                this.$router.push("/index/home");
                this.$Message.warning("您没有权限查看保养任务！");
            }
        }
    }
};
</script>
<style lang="less" scoped>
.maintain {
    position: relative;
    .addTwoPlan {
        position: absolute;
        right: 0;
        top: -60px;
        background-color: rgb(34, 161, 185);
        color: #fff;
        padding: 11px 9px;
        border: none;
    }
    .disabledBtn {
        background: #999;
    }
    .addTwoPlan:hover {
        color: #fff;
        border: none;
    }
}
</style>
