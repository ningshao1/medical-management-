<template>
    <div class="bar">
        <div v-for="(item,i) in data"
             :key='i'
             class="item"
             :style="{width:100/(data.length-1)+'%'}"
             :class="className(item.type)">
            <span class="name">{{chooseCurrent === 5&&item.type===3?'已关闭':item.name}}</span>
            <i class="round">
                <span></span>
            </i>
        </div>
    </div>
</template>

<script>
export default {
    name: "progressBar",
    props: {
        data: {
            type: Array,
            required: true
        },
        current: 0
    },
    data() {
        return {};
    },
    computed: {
        chooseCurrent() {
            if (this.current !== 4) return this.current;
            else return 1;
        }
    },
    components: {},
    created() {},
    methods: {
        className(type) {
            const showRound =
                this.chooseCurrent === type ||
                (this.chooseCurrent === 5 && type === 3);
            return {
                current: this.chooseCurrent >= type + 1, //控制色条
                showRound: showRound, //控制色条
                backout: this.chooseCurrent === 5 && type === 2 //是否是撤销
            };
        }
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/var.scss";
$bar-bg: #d8e9ff;
.bar {
    display: flex;
    height: 40px;
    position: absolute;
    width: 100%;
    top: 23px;
    .item {
        height: 4px;
        background: #d8e9ff;
        position: relative;
        .name {
            position: absolute;
            top: 10px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 12px;
            transform: translateX(-30%);
        }
        .round {
            background: $bar-bg;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            text-align: center;
            position: absolute;
            top: -7px;
            line-height: 18px;
            display: none;
            > span {
                width: 11px;
                height: 11px;
                border-radius: 50%;
                background: #4999ff;
                display: inline-block;
            }
        }
        &.current {
            background: $color-primary;
            .name {
                color: $color-primary;
            }
        }
        &.showRound {
            .name {
                color: $color-primary;
            }
            .round {
                display: inline-block;
            }
        }
        &.backout {
            background: #ccc;
            & + .item {
                .name {
                    color: #ccc;
                }
                .round {
                    background: #ccc;
                    > span {
                        background: #999;
                    }
                }
            }
        }
        &:nth-last-of-type(1) {
            .name {
                left: -50px;
                white-space: nowrap;
                transform: translateX(0%);
            }
            .round {
                left: -27px;
            }
            width: 0px !important;
        }
        &:nth-of-type(1) {
            .name {
                transform: translateX(0%);
            }
        }
    }
}
</style>
