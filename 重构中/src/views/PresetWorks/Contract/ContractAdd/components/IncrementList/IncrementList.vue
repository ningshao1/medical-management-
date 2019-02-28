<template>
    <div class="increment-list">
        <div
                v-for="(item, index) in items"
                class="increment-list-row flex"
                :key="index"
        >
            <div v-for="name in slots" :key="name" class="increment-list-col flex-grow-lazy-1 flex-basis-0">
                <slot :name="name" :item="item" :index="index"></slot>
            </div>
            <div class="increment-list-col align-self-end mb-6">
                <el-button @click="del(index)" type="default" size="suit" circle class="p-2">
                    <i class="el-icon-close"></i>
                </el-button>
            </div>
        </div>
        <div>
            <el-button @click="add">{{buttonText}}</el-button>
        </div>
    </div>
</template>

<script>
    import {isValid} from '@/utils';
    export default {
        name: "increment-list",
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            buttonText: {
                type: String,
                default: '新增'
            },
            slots: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                items: [],
            };
        },
        watch: {
            items: {
                deep: true,
                immediate: true,
                handler(items) {
                    if (items.length === 0) {
                        this.add();
                    } else {
                        const newItems = items.filter(
                            item => Object.values(item).some(isValid)
                        );

                        this.$emit('input', newItems);
                        this.isInternalChange = true;
                    }
                }
            },
            value: {
                immediate: true,
                handler(value) {
                    if (this.isInternalChange) {
                        this.isInternalChange = false;
                    } else {
                        this.items = value;
                    }
                }
            }
        },

        methods: {
            add() {
                this.items.push({});
            },
            del(index) {
                this.items.splice(index, 1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .increment-list {
        &-row{
            margin: 0 -10px 10px;
        }
        &-col{
            padding: 0 10px;
        }
    }
</style>