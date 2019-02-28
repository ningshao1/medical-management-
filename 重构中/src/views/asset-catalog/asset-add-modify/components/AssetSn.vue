<template>
    <div class="asset-sn-wrap">
        <el-input
            v-model="currentValue"
            v-bind="$attrs"
            :disabled="isGetSN||disabled"
        ></el-input>
        <el-button
            class="asset-sn-btn"
            :loading="SNLoading"
            @click='getSN'
            v-bind="$attrs"
            :disabled='disabled'
        >
            随机序列号
        </el-button>
    </div>
</template>
<script>
import mixin from "../mixin.js";
export default {
    name: "asset-sn",
    components: {},
    mixins: [mixin],
    props: {
        disabled:{
            type:Boolean
        }
    },
    data() {
        return {
            SNLoading: false,
            isGetSN: false
        };
    },
    computed: {
        remoteUrl() {
            let getUrl = this.isAdd
                ? this.assetIdBySN
                    ? "?assetId=" + this.assetIdBySN
                    : ""
                : "?assetId=" + this.assetId;
            return `assets/getSN${getUrl}`;
        }
    },
    created() {},
    methods: {
        async getSN() {
            //获得随机序列号
            this.SNLoading = true;
            try {
                const { data } = await this.$axios.get(this.remoteUrl);
                this.currentValue = data.sn;
                this.assetIdBySN = data.assetId;
            } finally {
                this.SNLoading = false;
                this.isGetSN = true;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.asset-sn-wrap {
    display: inline-block;
    width: 100%;
    padding-right: 103px;
    position: relative;
    .asset-sn-btn {
        position: absolute;
        right: 0;
        bottom: 0;
    }
}
</style>