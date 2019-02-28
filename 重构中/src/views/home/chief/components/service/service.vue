<template>
    <div>
        <el-col :span="12">
            <div class="home-number-amount">
                <div class="amount-img">
                    <div class="img-circle">
                        <i class="kld-icon-weixiuzhongshebei"></i>
                    </div>
                </div>
                <div class="amount-content">
                    <div class="content-number">
                        <div class="amount-number">
                            <number-animate :end='maintenanceCount'></number-animate>
                        </div>
                        <div class="amount-title">
                            正在维修中设备(台)
                        </div>
                    </div><img v-if="isDPI"
                         src="../../../img/维修中.png"
                         alt="">
                </div>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="home-number-amount blue">
                <div class="amount-img">
                    <div class="img-circle">
                        <i class="kld-icon-daijiedan"></i>
                    </div>
                </div>
                <div class="amount-content">
                    <div class="content-number">
                        <div class="amount-number">
                            <number-animate :end='orderCount'></number-animate>
                        </div>
                        <div class="amount-title">
                            待接单（单）
                        </div>
                    </div>
                    <img v-if="isDPI"
                         src="../../../img/待接单.png"
                         alt="">
                </div>
            </div>
        </el-col>
    </div>
</template>
<script>
import numberAnimate from "@/components/kld-number-animate";
export default {
    name: "kld-service",
    data() {
        return {
            isDPI: document.body.clientWidth >= 1440,
            maintenanceCount: 0,
            orderCount: 0,
            loading: true
        };
    },
    components: {
        [numberAnimate.name]: numberAnimate
    },
    created() {
        this.getTotal();
        this.contrast();
    },
    methods: {
        getTotal() {
            this.$axios
                .get(
                    `/statistical/faultReportCount/${
                        this.$store.state.userInfo.osId
                    }`
                )
                .then(({ data }) => {
                    const { maintenanceCount, orderCount } = data;
                    this.maintenanceCount = maintenanceCount;
                    this.orderCount = orderCount;
                    this.loading = false;
                });
        },
        contrast() {
            window.addEventListener("resize", () => {
                this.isDPI = document.body.clientWidth >= 1440;
            });
        }
    },
    beforeDestroy() {
        window.removeEventListener("resize", () => {
            this.isDPI = document.body.clientwidth >= 1440;
        });
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/var.scss";
$home-bg: #fff;
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
</style>


