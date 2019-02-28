<template>
    <el-card
        v-bind="$attrs"
        :shadow='shadow'
        class="kld-card-wrap"
    >
        <div
            slot="header"
            class="kld-card__header"
            :class="headerClassName"
            :style="_headerStyle"
            v-if="!noheader"
        >

            <slot name="header">
                <div
                    class="kld-card-head"
                    slot="header"
                >
                    <div class="head-title-wrap">
                        <slot name="head-title">
                            <slot name="title-prefix-icon">

                                <div
                                    class="head-title-prefix"
                                    v-if="namePrefix"
                                >

                                </div>
                            </slot>

                            <slot name='title-text'>
                                <div class="head-title-content">
                                    {{title}}
                                </div>
                            </slot>
                        </slot>
                    </div>
                    <div class="head-icon-wrap">
                        <slot name="head-icon">
                            <template v-if="!noHeadIcon">

                                <template v-if="mode==='link'">
                                    <router-link
                                        :to="to"
                                        tag="span"
                                        class="head-icon-link"
                                    >
                                        查看更多
                                        <i class="el-icon-arrow-right head-icon-icon"></i>
                                    </router-link>
                                </template>
                                <template v-else-if="mode==='switch'">
                                    <el-switch
                                        v-bind="$attrs"
                                        v-on="$listeners"
                                        v-model="switchValue"
                                    ></el-switch>
                                </template>
                            </template>
                        </slot>
                    </div>
                </div>
            </slot>

        </div>
        <div
            class="kld-card__body"
            :class="bodyClassName"
            :style="_bodyStyle"
        >

            <slot></slot>
        </div>

    </el-card>
</template>
<script>
export default {
    name: "kld-card",
    props: {
        value: {
            default: false
        },
        namePrefix: {
            default: true
        },
        noheader: {
            type: Boolean,
            default: false
        },
        noHeadIcon: {
            type: Boolean,
            default: false
        },
        mode: {
            //modes:['link','switch']
            default: "link"
        },
        title: {
            default: "卡片名称"
        },
        to: {
            default() {
                return {};
            }
        },
        shadow: {
            default: "never"
        },
        headerStyle: {
            default() {
                return {};
            }
        },
        bodyStyle: {
            default() {
                return {};
            }
        },
        bodyClassName: {},
        headerClassName: {}
    },
    data() {
        return {
            baseStyle: {
                header: {
                    padding: "0 20px",
                    height: "52px"
                },
                body: {
                    padding: "0 20px 18px"
                }
            }
        };
    },
    computed: {
        switchValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        },
        noheaderStyle() {
            return {
                header: {
                    ...this.baseStyle.header,
                    ...{}
                },
                body: { ...this.baseStyle.body, ...{ padding: "18px 20px" } }
            };
        },
        _headerStyle() {
            return {
                ...(this.noheader
                    ? this.noheaderStyle.header
                    : this.baseStyle.header),
                ...this.headerStyle
            };
        },
        _bodyStyle() {
            return {
                ...(this.noheader
                    ? this.noheaderStyle.body
                    : this.baseStyle.body),
                ...this.bodyStyle
            };
        }
    },
    created() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
@import "@/styles/var.scss";

.kld-card-wrap {
    border-radius: 0;
    border: none;
    overflow: initial;
    /deep/.el-card__header {
        border-bottom: none;
        padding: 0;
    }
    /deep/.el-card__body {
        padding: 0;
    }
    .kld-card__header {
        .kld-card-head {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .head-title-wrap {
                display: flex;
                align-items: center;
                .head-title-prefix {
                    width: 2px;
                    height: 18px;
                    background-color: $color-primary;
                }
                .head-title-content {
                    padding: 0 5px;
                    font-size: 16px;
                    // font-weight: 600;
                    color: rgba(0, 0, 0, 0.85);
                }
            }

            .head-icon-wrap {
                .head-icon-link {
                    cursor: pointer;
                    color: $color-primary;
                    user-select: none;
                    &:active {
                        color: lighten($color-primary, 10%) !important;
                    }
                }
                .head-icon-icon {
                    border-radius: 50%;
                    background-color: $color-primary;
                    color: #fff;
                }
            }
        }
    }
    .kld-card__body {
    }
}
</style>