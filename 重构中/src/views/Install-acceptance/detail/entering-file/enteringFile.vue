<template>
    <div>
        <Portal to="tips">
            <div v-once
                 class="title">
                <p> 验收文件录入提示</p>
                <div>
                    1、每个模块支持上传的文件类型不同，可点击对应模
                    块进行查看核对；

                </div>
                <div>
                    2、除了【安装验收报告文件】为必填项外，其余文件可在资产卡片中进行追加补充。
                </div>
            </div>
        </Portal>
        <entering-info class="entering-info"></entering-info>
        <install-upload-file ref="upload-file"></install-upload-file>
    </div>
</template>

<script>
import { Portal } from "@/components";
import enteringInfo from "./components/entering-info";
import enteringFile from "./components/upload-file";
export default {
    name: "enteringFile",

    data() {
        return {};
    },
    components: {
        Portal,
        [enteringInfo.name]: enteringInfo,
        [enteringFile.name]: enteringFile
    },
    created() {},
    methods: {
        next(callback) {
            this.$refs["upload-file"].next(callback);
        }
    }
};
</script>

<style scoped lang="less">
.title {
    > p {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        padding: 10px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        margin-bottom: 10px;
    }
    > div {
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
    }
}
.entering-info {
    margin-bottom: 20px;
}
</style>
