<template>
    <div>
        <kld-card class="supplies-list"
                  title='应急物资调用表'>
            <div class="list-content">
                <div class="total-number">待用总台数:</div>
                <div style="width:75%">
                    <el-row>
                        <el-col :span="8"
                                v-for="(item,i) in lifeEntryData"
                                :key='i'>
                            <div class="list-block"
                                 :class="{'no-border':i===lifeEntryData.length-1}">
                                <p>{{item.typeName}}</p>
                                <number-animate :end="item.count">

                                </number-animate>
                            </div>
                        </el-col>
                    </el-row>
                </div>

            </div>
        </kld-card>
    </div>
</template>

<script>
import kldCard from "@c/KldCard";
import numberAnimate from "@/components/kld-number-animate";
export default {
    name: "supplies-list",
    data() {
        return {
            lifeEntryData: []
        };
    },
    created() {
        this.getLifeDetail();
    },
    methods: {
        //应急物资入口数量
        getLifeDetail() {
            this.$axios
                .post(`EmergencyMaterials/getLifeDetail`)
                .then(({ data }) => {
                    this.lifeEntryData = data;
                });
        }
    },
    components: {
        [kldCard.name]: kldCard,
        [numberAnimate.name]: numberAnimate
    }
};
</script>

<style scoped lang="scss">
.supplies-list {
    height: 114px;
}
.total-number {
    width: 25%;
    font-weight: 600;
}
.list-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .list-block {
        text-align: center;
        border-right: 1px solid rgba(0, 0, 0, 0.12);

        p {
            margin: 0;
            margin-bottom: 5px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 15px;
            font-weight: 600;
        }
        span {
            color: #e7ae59;
            font-size: 20px;
        }

        &.no-border {
            border: none;
        }
    }
}
</style>
