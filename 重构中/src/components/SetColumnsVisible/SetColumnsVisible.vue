<template>
    <el-dialog
        :visible.sync="visibleProxy"
        :width="width"
        :title="title"
        @open="dialogOpen"
    >
        <el-checkbox-group v-model="selected">
            <el-row
                    v-for="(wrap, index) in transformItems"
                    :gutter="gutter"
                    :key="index"
                    :style="rowStyles"
            >
                <el-col
                        v-for="{label, value, disabled} in wrap"
                        :span="span"
                        :key="value"
                >
                    <el-checkbox :label="value" :disabled="disabled">{{label}}</el-checkbox>
                </el-col>
            </el-row>
        </el-checkbox-group>
        <template slot="footer">
            <el-button @click="dialogCancel" size="mini" type="default">取消</el-button>
            <el-button @click="dialogConfirm" size="mini">确定</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import KldCard from '@/components/KldCard';

    export default {
        name: "set-columns-visible",
        components: {
            KldCard
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: '600px'
            },
            title: {
                type: String,
                default: '自定义列表项'
            },
            span: {
                type: Number,
                default: 6
            },
            gutter: {
                type: Number,
                default: 20
            },
            items: {
                type: Array,
                default() {
                    return [];
                }
            },
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            cache: {
                type: Boolean,
                default: true
            },
            cacheName: String
        },

        data() {
            return {
                selected: [],
            };
        },

        computed: {
            visibleProxy: {
                get() {
                    return this.visible;
                },
                set(value) {
                    this.$emit('update:visible', value);
                }
            },
            valueProxy: {
                get() {
                    return this.value;
                },
                set(value) {
                    if (this.cache) {
                        this.setCache(value);
                    }
                    this.$emit('input', value)
                }
            },
            columnsAmount() {
                return Math.ceil(24 / this.span);
            },

            rowStyles() {
                return {
                    marginBottom: `${this.gutter}px`
                };
            },

            transformItems() {
                const {columnsAmount} = this;
                return this.items.reduce(
                    (result, item, index) => {
                        const resultIndex = Math.ceil((index + 1) / columnsAmount) - 1;
                        if (result[resultIndex]) {
                            result[resultIndex].push(item);
                        } else {
                            result[resultIndex] = [item];
                        }
                        return result;
                    },
                    []
                );
            },

            fullCacheName() {
                return `__visible_columns_${this.cacheName || this.$route.name}__`;
            }
        },
        created() {
            if (this.cache) {
                const data = this.getCache();
                if (data !== null) {
                    this.valueProxy = data;
                }
            }
        },
        methods: {
            dialogOpen() {
                this.selected = [...this.valueProxy];
            },
            dialogConfirm() {
                this.valueProxy = [...this.selected];
                this.visibleProxy = false;
            },
            dialogCancel() {
                this.visibleProxy = false;
            },

            setCache(value) {
                localStorage.setItem(this.fullCacheName, JSON.stringify(value));
            },
            getCache() {
                try {
                    return JSON.parse(localStorage.getItem(this.fullCacheName));
                } catch (e) {
                    return null;
                }
            }
        }
    }
</script>