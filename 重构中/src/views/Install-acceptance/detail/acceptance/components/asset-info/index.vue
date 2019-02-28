<template>
    <div class="asset-info">
        <kld-card title="添加标签">
            <div slot='head-icon'
                 class="title">
                单台资产最多添加5个标签
            </div>
            <el-select v-model="assetInfo.labelIds"
                       multiple
                       placeholder="请选择标签"
                       :multiple-limit='5'
                       :disabled='disabled'>
                <el-option v-for="item in assetLabel"
                           :key="item.id"
                           :label="item.labelName"
                           :value="item.id">
                </el-option>
            </el-select>
        </kld-card>
        <kld-card title="文件上传">
            <div slot='head-icon'
                 class="title">
                支持上传最多5张图片或单个图片最大3M
            </div>
            <kld-upload :limit='5'
                        :maxSize='1024*3*1024'
                        :detail='disabled'
                        v-model="assetInfo.photos"
                        :accept='[".png", ".jpg", ".jpeg"]'></kld-upload>
        </kld-card>

    </div>
</template>

<script>
import upload from "@c/kld-upload";
import kldCard from "@/components/KldCard";
export default {
    name: "asset-info",
    props: {
        data: {
            type: Object
        },
        disabled: {
            type: Boolean
        }
    },
    data() {
        return {
            assetLabel: []
        };
    },
    components: {
        [upload.name]: upload,
        [kldCard.name]: kldCard
    },
    computed: {
        assetInfo: {
            get() {
                return this.data;
            },
            set(val) {
                this.$emit("update:data", val);
            }
        }
    },
    created() {
        this.getLabel();
    },
    methods: {
        async getLabel() {
            const { data } = await this.$axios.post(`labels/list/1`);
            this.assetLabel = data;
        }
    }
};
</script>

<style scoped lang="less">
.el-aside {
    width: 408px;
}

.title {
    color: rgba(0, 0, 0, 0.45);
}
</style>
