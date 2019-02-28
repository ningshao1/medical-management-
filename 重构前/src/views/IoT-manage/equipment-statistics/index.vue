<template>
    <div id="equipment-statistics-wrap">
        <Tabs v-model="current"
              type="card"
              class="equipment-statistics-tabs">
            <TabPane v-for="(v,i) of tabPanes"
                     :label="v.label"
                     :class="{'equipment-statistics-tabpane':true,
                     'equipment-statistics-tabpane-hidden':current!==i}"
                     :key="i">
                <list-wrap :type='v.type'>
                    <component :is="v.component"></component>
                </list-wrap>
            </TabPane>
        </Tabs>

    </div>
</template>


<script>
import tabPanes from "./tabPanes";
import listWrap from "./tabPanes/list-wrap";
export default {
    name: "equipment-statistics",
    components: { listWrap },
    data() {
        return {
            tabPanes,
            current: 0
        };
    }
};
</script>
<style lang="less" scoped>
#equipment-statistics-wrap {
    width: 100%;
    /deep/.equipment-statistics-tabs {
        .ivu-tabs-content {
            .equipment-statistics-tabpane {
                border: 1px solid #dddee1;
                background: #fafafa;
                box-shadow: none;
            }
            .equipment-statistics-tabpane-hidden {
                height: 0;
                overflow: hidden;
            }
        }
    }
}
</style>

