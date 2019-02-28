<template>
    <kld-submenu
        :submenu="submenu"
        :max-level="maxLevel"
        :level="level"
        v-bind="$attrs"
        :menu-item-class="menuItemClass"
        v-on="$listeners"
        :collapse="collapse"
        :class="{
            'kld-menu-wrap':true,
            'kld-menu-expand-wrap':!collapse,
            'kld-menu-collapse-wrap':collapse,
        }"
    >
        <template
            slot="menu-item"
            slot-scope="{item,index}"
        >
            <slot
                :item="item"
                :index="index"
            >
                <div class='kld-menu-title'>
                    <i
                        class='title-prefix-icon'
                        :class="item.prefixIcon"
                        v-if="item.prefixIcon"
                    ></i>
                    <span slot="title">{{item.title}}</span>
                </div>

            </slot>

        </template>
    </kld-submenu>
</template>
<script>
import KldSubmenu from "./KldSubmenu.vue";
export default {
    name: "kld-menu",
    components: { KldSubmenu },
    props: {
        menu: {
            default() {
                return [];
            }
        },
        // menu: {
        //     default() {
        //         return {};
        //     }
        // },
        maxLevel: {
            default: 3
        },
        options: {
            default() {
                return {};
            }
        },
        collapse: {
            type: Boolean,
            default: false
        },
        menuItemClass: {
            default: "kld-menu-item"
        }
    },
    data() {
        return {
            level: 1,
            baseOptions: {
                indexKey: "name",
                title: "label",
                icon: "icon"
            }
        };
    },
    computed: {
        _menu(){
            return this.submenuFormat(this.menu);
        },
        submenu() {
            // const { children, ...info } = this.menu;
            return {
                index: "__",
                children: this._menu
            };
        },
        // submenu() {
        //     const { children, ...info } = this.menu;
        //     return {
        //         ...info,
        //         index: "__",
        //         children: this.submenuFormat(children)
        //     };
        // },
        _options() {
            return {
                ...this.baseOptions,
                ...this.options
            };
        }
    },
    created() {},
    methods: {
        submenuFormat(submenu) {
            return submenu
                .filter(item => item.meta && item.meta.limit !== false)
                .map(item => {
                    let { children, meta, ...info } = item;
                    meta = meta || {};
                    return {
                        ...info,
                        index: item[this._options.indexKey],
                        title: meta[this._options.title],
                        prefixIcon: meta[this._options.icon],
                        route: { name: item.name },
                        ...(children
                            ? { children: this.submenuFormat(children) }
                            : {})
                    };
                });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/var.scss";
.kld-menu-wrap {
    &.kld-menu-expand-wrap {
        /deep/.kld-menu-item.el-menu-item {
            border-left: 2px solid transparent;
            &.is-active {
                border-left: 2px solid $--color-primary;
                background-color: rgba(64, 117, 255, 0.1);
            }
        }
    }
    .kld-menu-title {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        > .title-prefix-icon {
            margin-right: 10px;
            font-size: 20px;
        }
    }
}
</style>