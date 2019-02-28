<template>
    <div>
        <el-tabs type="card"
                 v-model='type'>
            <el-tab-pane label="未验收资产"
                         name="0">
                <list :type='"0"'></list>
            </el-tab-pane>

            <el-tab-pane label="已验收资产"
                         name="1">
                <list :type='"1"'></list>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import Tabs from "@/element-ui/Tabs";
import TabPane from "@/element-ui/tabPane";
import list from "./list";
export default {
    data() {
        return {
            type: "0"
        };
    },
    components: {
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        [list.name]: list
    },
    created() {},
    methods: {}
};
</script>

<style scoped lang="less">
</style>
