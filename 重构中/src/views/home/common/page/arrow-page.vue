<template>
    <div class="arrow-page">
        <a href="javascript:;"
           :disabled="currentPage === 1"
           :class="{active: currentPage !== 1}"
           @click="pageClick(-1)"
           class="prev">
            <i class="el-icon-arrow-left"></i>
        </a>
        <span class="count">{{currentPage}}/{{totalPage}}</span>
        <a href="javascript:;"
           :disabled="currentPage === totalPage"
           :class="{active: currentPage !== totalPage}"
           @click="pageClick(1)"
           class="next">
            <i class="el-icon-arrow-right"></i>
        </a>
    </div>
</template>

<style lang="less" scoped>
@btn-color-default: #d0d0d0;
@btn-color-active: #666666;

.arrow-page {
    width: 120px;
    padding: 10px;
    font-size: 16px;
    line-height: 1;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    color: @btn-color-default;
    a {
        color: @btn-color-default;
    }
}

a.active,
.count {
    color: @btn-color-active;
}
</style>

<script>
export default {
    name: "arrow-page",
    props: {
        total: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 0
        },
        current: {
            type: Number,
            default: 1
        }
    },
    computed: {
        totalPage() {
            let totalPage = Math.ceil(this.total / this.pageSize);
            if (
                Number.isNaN(totalPage) ||
                !Number.isFinite(totalPage) ||
                totalPage < 1
            ) {
                return 1;
            } else {
                return totalPage;
            }
        },
        currentPage: {
            get() {
                return this.current;
            },
            set(val) {
                this.$emit("update:current", val);
                this.$emit("on-page-change", val);
            }
        }
    },
    methods: {
        pageClick(val) {
            const computed = this.currentPage + val;
            if (computed <= this.totalPage && computed >= 1) {
                this.currentPage = computed;
            }
        }
    }
};
</script>