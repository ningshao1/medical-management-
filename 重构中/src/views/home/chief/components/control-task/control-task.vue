<template>
    <div>

        <div class="control-task">
            <el-col :span="4">
                <div class="control-all">
                    <div class="task-title">
                        本月质控任务
                    </div>
                    <div class="control-number">
                        <h3>
                            本月质控总数(台)
                        </h3>
                        <p>
                            <number-animate :end='22'></number-animate>
                        </p>
                    </div>
                </div>
            </el-col>
            <el-col :span="20">

                <el-col :span='4'>
                    <div class="control-detail">
                        <div class="one-title">
                            一级保养(台)
                        </div>
                        <div class="one-finished">
                            <span>已做</span>
                            <div>
                                <number-animate :end='ControlData.oneLogs'></number-animate>
                            </div>
                        </div>
                        <div class="one-all">
                            <span>总数</span>
                            <div>
                                <number-animate :end='ControlData.oneCount'></number-animate>
                            </div>
                        </div>
                    </div>
                </el-col>

                <el-col :span='4'>
                    <div class="control-detail">
                        <div class="one-title">
                            二级保养(台)
                        </div>
                        <div class="one-finished">
                            <span>已做</span>
                            <div>
                                <number-animate :end='ControlData.maintenLogs'></number-animate>
                            </div>
                        </div>
                        <div class="one-all">
                            <span>总数</span>
                            <div>
                                <number-animate :end='ControlData.maintenCount'></number-animate>
                            </div>
                        </div>
                    </div>
                </el-col>

                <el-col :span='4'>
                    <div class="control-detail">
                        <div class="one-title">
                            三级保养(台)
                        </div>
                        <div class="one-finished">
                            <span>已做</span>
                            <div>
                                <number-animate :end='ControlData.threeLogs'></number-animate>
                            </div>
                        </div>

                    </div>
                </el-col>

                <el-col :span='4'>
                    <div class="control-detail">
                        <div class="one-title">
                            巡检任务(台)
                        </div>
                        <div class="one-finished">
                            <span>已做</span>
                            <div>
                                <number-animate :end='ControlData.inspLogs'></number-animate>
                            </div>
                        </div>
                        <div class="one-all">
                            <span>总数</span>
                            <div>
                                <number-animate :end='ControlData.inspCount'></number-animate>
                            </div>
                        </div>
                    </div>
                </el-col>

                <el-col :span='4'>
                    <div class="control-detail">
                        <div class="one-title">
                            计量(台)
                        </div>
                        <div class="one-finished">
                            <span>已做</span>
                            <div>
                                <number-animate :end='ControlData.measurLogs'></number-animate>
                            </div>
                        </div>
                        <div class="one-all">
                            <span>总数</span>
                            <div>
                                <number-animate :end='ControlData.measurCount'></number-animate>
                            </div>
                        </div>
                    </div>
                </el-col>

                <el-col :span='4'>
                    <div class="control-detail">
                        <div class="one-title">
                            不良事件（件）
                        </div>
                        <div class="one-finished">
                            <span>已做</span>
                            <div>
                                <number-animate :end='ControlData.monthEvent'></number-animate>
                            </div>
                        </div>
                        <div class="one-all">
                            <span>总数</span>
                            <div>
                                <number-animate :end='ControlData.eventCount'></number-animate>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-col>

        </div>
    </div>
</template>

<script>
import numberAnimate from "@/components/kld-number-animate";
export default {
    name: "control-task",
    data() {
        return {
            ControlData: {}
        };
    },
    created() {
        this.getControlData();
    },
    methods: {
        //质控数据
        getControlData() {
            this.$axios.get(`/statistical/monthPmCount`).then(({ data }) => {
                this.ControlData = data;
            });
        }
    },
    components: {
        [numberAnimate.name]: numberAnimate
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/var.scss";
$home-bg: #fff;
.control-task {
    background: $home-bg;
    padding: 0 20px;
    height: 190px;
    margin-top: 20px;
    overflow: hidden;
    .task-title {
        margin-top: 15px;
        padding-left: 10px;
        color: #020e0f;
        font-size: 16px;
        border-left: 2px solid $color-primary;
    }
    .control-all {
        position: relative;
        height: 174px;

        width: 100%;
        .control-number {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            h3,
            p {
                white-space: nowrap;
                text-align: center;
                color: rgba(0, 0, 0, 0.65);
                margin: 0;
            }
            > p {
                margin-top: 10px;
                color: rgba(0, 0, 0, 0.85);
                font-size: 40px;
            }
        }
    }
    .control-detail {
        text-align: right;
        height: 190px;
        padding: 60px 10px 20px 10px;
        box-sizing: border-box;
        .one-title {
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .one-finished,
        .one-all {
            color: rgba(0, 0, 0, 0.85);
            font-size: 25px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            > span {
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
                margin-right: 15px;
                display: none;
            }
        }
        .one-all {
            color: rgba(0, 0, 0, 0.45);
            font-size: 16px;
        }
        &:hover {
            cursor: pointer;
            background-color: rgba(87, 151, 245, 0.05);
            border-top: 3px solid $color-primary;
            .one-finished,
            .one-title,
            .one-all {
                color: $color-primary;
                > span {
                    display: block;
                }
            }
        }
    }
}
</style>
