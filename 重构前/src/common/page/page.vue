<template>
    <div class="kld-page-wrap">
        <Page :size="size"
              :total='total'
              :show-total="showTotal"
              :show-sizer='showSizer'
              :show-elevator='showElevator'
              :page-size='pageSize'
              :current.sync='insideCurrent'
              @on-change='on_change'
              @on-page-size-change='on_page_size_change'></Page>
    </div>
</template>
<style lang="less" scoped>
.kld-page-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<script>
export default {
    name: "kld-page",
    props: {
        size: String,
        //总条数
        total: {
            default: 1,
            type: Number
        },
        //控制是否可以切换每页显示的数量
        showSizer: {
            default: false,
            type: Boolean
        },
        //控制显示跳转的页面
        showElevator: {
            default: false,
            type: Boolean
        },
        showTotal: {
            type: Boolean,
            default: false
        },
        //每个页面的个数
        pageSize: {
            default: 10,
            type: Number
        },
        //当前页数
        current: {
            default: 1,
            type: Number
        },
        //自定义 style 样式
        styles: {
            type: Object
        },
        size: String
    },
    data() {
        return {
            list: null
        };
    },
    computed: {
        insideCurrent: {
            get() {
                return this.current;
            },
            set(current) {
                this.$emit("update:current", current);
            }
        }
    },
    methods: {
        //页码改变的回调，返回改变后的页码
        on_change(...arg) {
            this.$emit("on-change", ...arg);
        },
        on_page_size_change(...arg) {
            this.$emit("on-page-size-change", ...arg);
        }
    }
};
</script>