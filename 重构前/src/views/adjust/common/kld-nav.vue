<template>
    <div class="kld-nav">
        <div class="kld-nav-title">{{title}}</div>
        <div class="kld-nav-items">
            <template v-if="router">
                <router-link
                        v-for="(data, index) in itemsProxy"
                        :to="data.to"
                        active-class="active"
                        :key="index"
                >{{data[titleKey]}}</router-link>
            </template>
            <template v-else>
                <a
                        v-for="data in itemsProxy"
                        href="javascript:"
                        :class="{'active': isCurrent(data)}"
                        @click="itemClick(data)"
                >{{data[titleKey]}}</a>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "kld-nav",
        props: {
            router: {
                type: Boolean,
                default: false
            },

            title: String,
            items: {
                type: Array,
                default: () => []
            },
            itemKey: {
                type: [String, Symbol],
                default: 'id'
            },
            titleKey: {
                type: [String, Symbol],
                default: 'title'
            },
            current: String
        },
        computed: {
            currentProxy: {
                get() {
                    return this.current;
                },
                set(data) {
                    this.$emit('update:current', data);
                }
            },

            itemsProxy() {
                return this.items.filter(({visible}) => visible !== false);
            }
        },

        methods: {
            itemClick(data) {
                this.currentProxy = data[this.itemKey];
                this.$emit('current-change', data);
            },
            isCurrent(item) {
                if (this.currentProxy) {
                    const {itemKey} = this;
                    return item[itemKey] === this.currentProxy;
                } else {
                    return false;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .kld-nav {
        font-size: 14px;
        background: rgb(250, 250, 250);
        border-radius: 3px;
        border: solid 1px #c8ced3;
        .kld-nav-title {
            padding: 15px;
            background-color: #eaeaea;
            border-bottom: solid 1px #c8ced3;
            color: #666666;
        }
        .kld-nav-items {
            >a {
                color: inherit;
                display: block;
                padding: 18px 15px;
                background: rgb(245, 246, 250);
                border-bottom: 1px solid rgba(2, 31, 57, 0.1);
                &.active {
                    border-left: 2px solid #01b0c7;
                    background: #fff;
                    color: #01b0c7;
                }
            }
        }
    }
</style>