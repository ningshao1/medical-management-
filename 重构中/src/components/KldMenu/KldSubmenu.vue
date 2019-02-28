<template>
    <component
        :is="type"
        :index="submenu.index"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template
            slot="title"
            v-if="type===submenuCommon"
        >
            <slot
                name="menu-item"
                :item="submenu"
                :index="index"
            >

            </slot>
        </template>
        <template v-for="(v,i) of submenu.children">
            <kld-submenu
                v-if="(level<maxLevel)&&v.children&&v.children.length"
                :key="i"
                :submenu="v"
                :index="i"
                :max-level="maxLevel"
                :level="level+1"
                :type='submenuCommon'
                :menu-item-class="menuItemClass"
            >

                <template
                    slot="menu-item"
                    slot-scope="{item,index}"
                >
                    <slot
                        name="menu-item"
                        :item="item"
                        :index="index"
                    >

                    </slot>

                </template>

            </kld-submenu>

            <el-menu-item
                v-else
                :class="menuItemClass"
                :key="i"
                :index="v.index"
                :route="v.route"
            >
                <slot
                    name="menu-item"
                    :item="v"
                    :index="i"
                >

                </slot>
            </el-menu-item>

        </template>
    </component>
</template>
<script>
export default {
    name: "kld-submenu",
    // abstract:true,
    props: {
        type: {
            default: "el-menu"
        },
        submenu: {
            default() {
                return {};
            }
        },
        maxLevel: {
            default: 1
        },
        level: Number,
        index: [String, Number],
        menuItemClass: String
    },
    data() {
        return {
            submenuCommon: "el-submenu"
        };
    },
    computed: {},
    created() {},
    methods: {}
};
</script>
<style lang="less" scoped>
.kld-submenu-wrap {
}
</style>