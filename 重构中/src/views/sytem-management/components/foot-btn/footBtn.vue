<template>
    <Portal to='action'>
        <div class="detail-btn">
            <div>
                <el-button class="next"
                           @click="save">{{btnText}}</el-button>
            </div>

        </div>
    </Portal>
</template>

<script>
import { Portal } from "@/components";
export default {
    props: {
        btnText: {
            type: String,
            default: "保存"
        }
    },
    name: "footBtn",
    data() {
        return {};
    },
    components: {
        Portal
    },
    created() {},
    methods: {
        save(e) {
            this.$emit("click", e);
        }
    }
};
</script>

<style scoped lang="less">
.detail-btn {
    background-color: #e5e7e8;
    height: 70px;
    bottom: 0;
    width: 100%;
    position: relative;
    right: 0;
    min-width: 1200px;
    > div {
        position: absolute;
        right: 410px;
        top: 20px;
    }
}
.next {
    height: 40px;
}
</style>
