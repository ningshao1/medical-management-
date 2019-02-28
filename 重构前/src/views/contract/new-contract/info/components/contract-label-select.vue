<template>
    <div class="contract-label-select" v-clickoutside="closeLabelBox">
        <div class="label-content">
            <i-input
                    readonly
                    class="kld-input"
                    :disabled="disabled"
                    @on-focus="labelBoxShow = true"
                    :placeholder="placeholderText"
            ></i-input>
            <div class="label-list">
                <div class="asset-label" v-for="({id, labelName}, index) in selectedLabels" :key="id">
                    <span>{{labelName}}</span>
                    <Icon v-if="! disabled" @click.native="delLabel(index)" type="close"></Icon>
                </div>
            </div>
            <Icon type="arrow-down-b" class="label-down"></Icon>
        </div>
        <div class="label-box" v-show="labelBoxShow" style=" display:flex;flex-wrap: wrap;">
            <template v-if="labels.length > 0">
                <div class="box-label" v-for="({id, labelName}, index) in labels" @click="addLabel(index)" :key="id">
                    {{labelName}}
                </div>
            </template>
            <p v-else class="lh-26">暂无数据</p>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .contract-label-select {
        line-height: 1;
        .label-content {
            position: relative;
            cursor: pointer;
            .label-list {
                position: absolute;
                top: 0;
                left: 0;
                padding: 4px;
                .asset-label {
                    @height: 28px;
                    margin: 4px;
                    display: inline-flex;
                    align-items: center;
                    line-height: @height;
                    background-color: #76bdc1;
                    border-radius: 18px;
                    border: solid 1px #0c8399;
                    color: #ffffff;
                    >span{
                        font-size: 14px;
                        padding: 0 10px;
                    }
                    >i {
                        width: @height - 4px;
                        line-height: @height - 4px;
                        font-size: 16px;
                        background-color: rgba(69, 133, 137, 0.5);
                        opacity: 0.5;
                        border-radius: 50%;
                        text-align: center;
                    }
                }
            }
            .label-down {
                position: absolute;
                right: 10px;
                top: 0;
                line-height: 44px;
                font-size: 20px;
            }
        }
        .label-box {
            background-color: #f5f6fa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            display: flex;
            flex-wrap: wrap;
            padding: 5px;
            .box-label {
                margin: 5px;
                min-width: 70px;
                padding: 12px 10px;
                background-color: #76bdc1;
                border-radius: 18px;
                border: solid 1px #0c8399;
                color: #fff;
                text-align: center;
                cursor: pointer;
            }
        }
    }
</style>

<script>
    export default {
        name: "contract-label-select",
        props: {
            value: Array,
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: String,
            default() {
                return [];
            },
            max: {
                type: Number,
                default: Infinity
            }
        },
        data() {
            return {
                labelBoxShow: false,
                labels: [],
                selectedLabels: [],
            };
        },

        computed: {
            selectedProxy: {
                get() {
                    return this.selectedLabels;
                },
                set(selected) {
                    this.selectedLabels = selected;
                    this.$emit('input', selected.map(({id}) => id));
                    this.internalChange = true;
                }
            },

            placeholderText() {
                return this.selectedProxy.length > 0 ? undefined : this.placeholder;
            }
        },

        watch: {
            value: {
                immediate: true,
                handler(value) {
                    if (this.internalChange) {
                        this.internalChange = false;
                    } else {
                        const {labels} = this;
                        this.selectedLabels = value.reduce(
                            (result, id) => {
                                const label = labels.find(label => label.id === id);

                                if (label) {
                                    result.push(label);
                                }

                                return result;
                            },
                            []
                        );
                    }
                }
            }
        },

        created() {
            this.getLabels();
        },

        methods: {
            //获取标签列表
            async getLabels() {
                const {data} = await this.$axios.post('/labels/list/3');
                this.labels = data;
            },
            //删除图标
            delLabel(index) {
                this.selectedProxy.splice(index, 1);

                //为了触发setter
                this.selectedProxy = this.selectedProxy;
            },

            //添加图标
            addLabel(index) {
                const {selectedProxy: selected} = this;
                if (selected.length >= this.max) {
                    this.$Message.warning(`最多只能添加${this.max}个标签`);
                } else {
                    const label = this.labels[index];

                    if (! selected.includes(label)) {
                        selected.push(label);

                        //为了触发setter
                        this.selectedProxy = selected;
                    }
                }
            },
            closeLabelBox() {
                this.labelBoxShow = false;
            }
        }
    }
</script>