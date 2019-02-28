<template>
    <div class="kld-echarts-wrap"
         ref="kld-echarts-wrap">
        <div ref="kld-echarts"
             class="kld-echarts">

        </div>
        <div class="nodata-view"
             v-if="noData">
            <slot name="no-date-page">
                <div class='no-data'>
                    {{noDataText}}
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
import EleResize from "./element_resize";
import echarts from "./kld-custom-echarts"; //若需新图表 类型/功能 于该文件中自行添加
export default {
    name: "kld-echarts",
    data() {
        return {
            myChart: null,
            resizeTimer: null,
            echarts: echarts
        };
    },
    computed: {
        eDom() {
            return this.$refs["kld-echarts"];
        },
        eWrapDom() {
            return this.$refs["kld-echarts-wrap"];
        }
    },
    props: {
        //配置项
        option: {
            type: Object,
            required: false,
            default: {}
        },
        noData: {
            type: Boolean,
            default: false
        },
        noDataText: {
            type: String,
            default: "暂无数据"
        },
        //loading页面
        loading: {
            type: Boolean,
            default: false
        },
        //更精确的尺寸
        excuteSize: {
            type: Boolean,
            default: false
        },
        //根据容器自适应
        autoResize: {
            type: Boolean,
            default: false
        },
        //是否在resize时节流
        throttling: {
            type: [Boolean, Number],
            default: true
        },
        notMerge:{
            type:Boolean,
            default:false
        }
    },
    watch: {
        option: {
            //数据驱动
            handler(val) {
                this.setOption();
            }
        },
        loading: {
            //是否显示loading界面
            handler(val) {
                if (!this.myChart) return;
                val ? this.myChart.showLoading() : this.myChart.hideLoading();
            },
            immediate: true
        }
    },
    created() {
    },
    mounted() {
        this.initEcharts();
    },
    methods: {

        typeTransform(item) {
            if (item instanceof Array) {
                return item;
            }
            return item
                .split(",")
                .filter(v => v)
                .map(v => v.trim());
        },

        //echarts dom初始化
        initEcharts() {
            if (this.excuteSize) {
                this.getSize();
            }
            this.myChart = this.echarts.init(this.eDom);

            //事件注册
            this.initEvent();

            //运行配置参数
            this.setOption();
            //开启loading界面
            if (this.loading) {
                this.myChart.showLoading();
            }
            //开启resize事件
            if (this.autoResize) {
                this.onResize(this.resize());
                // this.resize();//TODO待定
            }
        },
        initEvent() {
            Object.keys(this.$listeners).forEach(eventName => {
                this.myChart.on(eventName, this.$listeners[eventName]);
            });
        },
        setOption(notMerge=this.notMerge) {
            if (this.myChart) {
                this.myChart.setOption(this.option, notMerge);
            }
        },
        getSize() {
            let domStyle = window.getComputedStyle(this.eWrapDom);
            this.eDom.style.width = parseInt(domStyle.width) + "px";
            this.eDom.style.height = parseInt(domStyle.height) + "px";
        },
        resize() {
            return this.throttling === false
                ? this.nativeResize
                : this.throttlingResize;
        },
        throttlingResize() {
            //节流

            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(
                () => {
                    this.nativeResize()
                },
                this.throttling === true ? 100 : this.throttling
            );
        },
        nativeResize() {
            //不节流
            if (this.excuteSize) {
                this.getSize();
            }
            this.myChart.resize();
            this.$emit('resized');
        },
        onResize(handler, context) {
            EleResize.on(this.eWrapDom, handler, context);
        },
        offResize(handler, context) {
            EleResize.off(this.eWrapDom, handler, context);
        }
    }
};
</script>

<style lang="less" scoped>
.kld-echarts-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    .kld-echarts {
        width: 100%;
        height: 100%;
    }
    .nodata-view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
