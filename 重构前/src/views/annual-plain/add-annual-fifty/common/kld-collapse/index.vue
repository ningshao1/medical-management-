<template>
    <div class="annual-fifty-Collapse">
        <div class='fifty-collapse'>
            <div class="header-wrap" @click="toggle" :style="details?'background-color:transparent;padding:0;':''">
                <div class="header-left" :style="details?'color:#f2740c':''">
                    <slot name="title">{{title}}</slot>
                </div>
                <div class="header-right">
                    <img :src="require('../../../../image/open.png')" alt="" :class="imgClass">
                </div>
                <slot name="extra-header"></slot>
            </div>
            <div class="content-wrap" :style="details?'padding:0;':''">
                <div :class="open?'content':'content hidden'" ref="kld-collapse-content">
                    <slot>
                        暂无内容
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "kld-collapse",
    data() {
        return {
            doToggle: false
        };
    },
    props: {
        open: {
            type: Boolean,
            default: false
        },
        details: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        }
    },
    computed: {
        imgClass() {
            return {
                "right-img-basic": true,
                open: !this.doToggle
            };
        }
    },
    watch: {
        // doToggle: console.log
        open: {
            handler() {
                this.doToggle = !this.open;
            },
            immediate: true
        }
    },
    methods: {
        next(jump) {
            jump();
        },
        toggle() {
            if (this.details) {
                return;
            }
            this.doToggle = !this.doToggle;
            $(this.$refs["kld-collapse-content"]).slideToggle();
        }
    }
};
</script>
<style lang="less" scoped>
.annual-fifty-Collapse {
    width: 100%;
    .fifty-collapse {
        width: 100%;
        padding-bottom: 10px;
        .costum-wrap {
            position: relative;
        }
        .header-wrap {
            .costum-wrap;
            padding: 0 15px;
            cursor: pointer;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #ededed;
            height: 60px;
            transition: background-color 0.2s;
            &:hover {
                background-color: #f2f2f2;
            }
            .header-left {
                font-size: 16px;
                color: #020e0f;
            }
            .header-right {
                .right-img-basic {
                    height: 16px;
                    width: 16px;
                    transform: rotateZ(0);
                    transition: transform 0.5s;
                }

                .open {
                    transform: rotateZ(180deg);
                }
            }
        }
        .content-wrap {
            .costum-wrap;
            .hidden {
                display: none;
            }
        }
    }
}
</style>

