<template>
    <div class="maintain-count">
        <Tabs
            type="card"
        >
            <TabPane label="一级保养" >
                <one-maintain></one-maintain>
            </TabPane>
            <TabPane label="二级保养">
                <two-maintain></two-maintain>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import OneMaintain from './one-maintain';
    import TwoMaintain from './two-maintain';
    export default {
        name: "maintain-count",
        components: {
            OneMaintain,
            TwoMaintain
        }
    }
</script>

<style lang="less" scoped>
    .maintain-count {

    }
</style>