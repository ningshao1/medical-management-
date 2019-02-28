<template>
    <div class="purchase-info">
        <div class="down-btn">
            <!-- <Button @click="$router.push({name:'purchase-under',params:{id:'112'}})">0-10万</Button>
            <Button @click="$router.push({name:'purchase-upper',params:{id:'113'}})">10万以上</Button> -->
            <Button class="purchase-btn"
                    type="primary"
                    @click="downArgument">下载论证设备详情</Button>
            <Button class="purchase-btn"
                    type="primary"
                    @click='downSkill'
                    :disabled='disabledSkill'>下载技术参数详情</Button>
        </div>
        <Tabs v-model='currentTab'>
            <TabPane label="采购记录">
                <router-view ref='view'></router-view>
            </TabPane>
            <TabPane label="修改记录">
                <modify-nodes :current="currentTab"></modify-nodes>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import modifyNodes from "./modify-nodes";
import { downloadUrl, word } from "./common/method/exportWord";
const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.setAttribute("download", filename || "");
    link.setAttribute("href", url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export default {
    name: "purchase-info",
    components: { modifyNodes },
    data() {
        return {
            currentTab: 0,
            disabledSkill: false
        };
    },
    methods: {
        downArgument() {
            if (this.$refs["view"].oldDetail.procurementState < 5) {
                this.$Message.warning("论证详情申请暂未通过无法下载");
                return;
            }
            const fileURL = this.$refs["view"].oldDetail.files;
            const demonstrationApprove = this.$refs["view"].oldDetail
                .demonstrationApprove;
            const downURLArrray = [];
            if (fileURL instanceof Array) {
                const Files = fileURL.filter(
                    v => v.type === 25 || v.type === 26
                );
                if (!(Files.length || demonstrationApprove)) {
                    this.$Message.warning("暂无文件下载");
                    return;
                }
                Files.map(v => {
                    downURLArrray.push(
                        this.$axios
                            .get(v.path, {
                                responseType: "blob"
                            })
                            .then(({ data }) => {
                                downloadFile(URL.createObjectURL(data), v.name);
                            })
                    );
                });
            }
            if (demonstrationApprove !== "" && demonstrationApprove !== null) {
                word(
                    this.$refs["view"].oldDetail.apAssetName + "详情文件",
                    demonstrationApprove
                );
            }
            Promise.all(downURLArrray).then(() => {
                this.$Message.success("下载成功");
            });
        },
        downSkill() {
            if (this.$refs["view"].oldDetail.procurementState < 8) {
                this.$Message.warning("技术申请暂未通过无法下载");
                return;
            }
            const fileURL = this.$refs["view"].oldDetail.files;
            const parameterApprove = this.$refs["view"].oldDetail
                .parameterApprove;
            const downURLArrray = [];
            if (fileURL instanceof Array) {
                const Files = fileURL.filter(
                    v => v.type === 27 || v.type === 28
                );
                if (!(Files.length || parameterApprove)) {
                    this.$Message.warning("暂无文件下载");
                    return;
                }
                Files.map(v => {
                    downURLArrray.push(
                        this.$axios
                            .get(v.path, {
                                responseType: "blob"
                            })
                            .then(({ data }) => {
                                downloadFile(URL.createObjectURL(data), v.name);
                            })
                    );
                });
            }
            if (parameterApprove !== "" && parameterApprove !== null) {
                word(
                    this.$refs["view"].oldDetail.apAssetName + "详情文件",
                    parameterApprove
                );
            }
            Promise.all(downURLArrray).then(() => {
                this.$Message.success("下载成功");
            });
        }
    },
    beforeDestroy() {
        this.$store.commit("ClearPlanDetail");
    }
};
</script>

<style lang="less" scoped>
.purchase-btn {
    width: 134px;
    height: 40px;
    padding: 6px 10px;
}
.purchase-info {
    position: relative;
    .down-btn {
        position: absolute;
        right: 0;
        top: -12px;
        z-index: 10;
    }
}
</style>
