<template>
    <div class="engineer-head">
        <el-col :span="8"
                v-for="(item,i) in headData"
                :key='i'>
            <div class="item">
                <div>
                    <number-animate :end='item.number'
                                    :styles="{
                        color:item.color
                    }"></number-animate>
                    <p>{{item.title}}</p>
                </div>
                <img :src="item.img"
                     alt=""
                     v-if="isDPI">
            </div>
        </el-col>

    </div>
</template>

<script>
import number from "@c/kld-number-animate";
export default {
    name: "engineerHead",
    data() {
        return {
            isDPI: document.body.clientWidth >= 1440,
            headData: [
                {
                    number: 0,
                    title: "待处理报单（单）",
                    img: require("./img/待处理报单.png"),
                    color: " #7ac7c4"
                },
                {
                    number: 0,
                    title: "待处理审批（单）",
                    img: require("./img/待处理审批.png"),
                    color: "#5aa0d5"
                },
                {
                    number: 0,
                    title: "本月质控任务（台）",
                    img: require("./img/本月质控任务.png"),
                    color: "#2994b2"
                }
            ]
        };
    },
    components: {
        [number.name]: number
    },
    created() {
        this.getCountData();
    },
    methods: {
        getCountData() {
            return this.$axios
                .get(
                    `/statistical/engineerCount/${
                        this.$store.state.userInfo.osId
                    }`
                )
                .then(
                    ({
                        data: { faultReportCount, approveCount, taskCount }
                    }) => {
                        this.headData[0].number = faultReportCount;
                        this.headData[1].number = approveCount;
                        this.headData[2].number = taskCount;
                    }
                );
        }
    }
};
</script>

<style scoped lang="less">
.engineer-head {
    .item {
        background-color: #ffffff;
        height: 114px;
        padding: 20px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
            font-size: 36px;
        }
        p {
            margin-top: 5px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 16px;
        }
        img {
            margin-top: 16px;
            width: 80px;
        }
    }
}
</style>
