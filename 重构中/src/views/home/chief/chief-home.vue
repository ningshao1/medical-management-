<template>
    <div class="kld-home">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-row :gutter="20">
                    <kld-service></kld-service>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <control-task></control-task>
                    </el-col>
                    <el-col :span="24">
                        <asset-data></asset-data>
                    </el-col>

                </el-row>
            </el-col>
            <el-col :span="8">
                <el-col :span="24">
                    <supplies-list></supplies-list>
                </el-col>
                <el-col :span="24">
                    <new-list></new-list>
                </el-col>

            </el-col>
        </el-row>
        <el-row :gutter="25">
            <el-col :span="24">
                <div style="padding-right:10px;">
                    <kld-life-support>

                    </kld-life-support>
                </div>
            </el-col>
            <el-col :span="24">
                <div style="padding-right:10px;">
                    <qs-control></qs-control>
                </div>
            </el-col>
            <div style="padding-right:10px;">
                <el-col :span="12">
                    <kld-brand-bar></kld-brand-bar>
                </el-col>
                <el-col :span="12">
                    <kld-asset-bar></kld-asset-bar>
                </el-col>
            </div>

        </el-row>

    </div>
</template>

<script>
import service from "./components/service";
import assetData from "./components/asset-data";
import task from "./components/control-task/index";
import supplies from "../common/supplies-list";
import newList from "../common/new-list/";
import kldBrandBar from "./components/asset-brand";
import kldAssetBar from "./components/big-asset";
import lifSuppot from "./components/life-support";
import QS from "./components/QS-control";
export default {
    data() {
        return {};
    },

    components: {
        [task.name]: task,
        [assetData.name]: assetData,
        [supplies.name]: supplies,
        [newList.name]: newList,
        [kldBrandBar.name]: kldBrandBar,
        [kldAssetBar.name]: kldAssetBar,
        [lifSuppot.name]: lifSuppot,
        [QS.name]: QS,
        [service.name]: service
    }

    // destroyed() {
    //     window.removeEventListener("resize", () => {
    //         this.isDPI = document.body.clientwidth >= 1440;
    //     });
    // }
};
</script>

<style scoped lang="scss">
@import "@/styles/var.scss";
$home-bg: #fff;
.kld-home {
    padding-bottom: 20px;
    .home-number-amount {
        background: $home-bg;
        padding: 20px 30px 20px 20px;
        display: flex;
        height: 114px;

        .amount-img {
            padding-right: 25px;
            border-right: 1px solid rgba(0, 0, 0, 0.12);
            .img-circle {
                border-radius: 50%;
                background: #ee6d4f;
                width: 64px;
                height: 64px;
                text-align: center;
                line-height: 64px;
                i {
                    font-size: 30px;
                    color: #fff;
                }
            }
        }
        .amount-content {
            padding-left: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            > img {
                width: 120px;
            }
            .content-number {
                .amount-number {
                    color: #ee6d4f;
                    font-size: 36px;
                }
                .amount-title {
                    color: rgba(0, 0, 0, 0.85);
                    font-size: 16px;
                    white-space: nowrap;
                }
            }
        }
        &.blue {
            .img-circle {
                background-color: $color-primary;
            }
            .content-number {
                .amount-number {
                    color: $color-primary;
                }
            }
        }
    }
}
</style>











