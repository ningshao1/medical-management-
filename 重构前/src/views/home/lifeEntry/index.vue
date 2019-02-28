
<template>
    <div class="life-entry kld-box-effect">
        <div class="entry-title">
            <span>应急物资调用表</span>
            <!-- <span>查看更多</span> -->
            <router-link tag="span"
                         :to='{name:"emergency-list"}'>
                查看更多
            </router-link>
        </div>
        <div class="entry-content">
            <i-row>
                <i-col :span='24/lifeNumberData.length'
                       v-for="(item,i) in lifeNumberData"
                       :key='i'>
                    <router-link class="entry-number"
                                 :to='{name:"emergency-list",query:{id:item.assetTypeId}}'
                                 tag='div'>
                        <p>{{item.typeName+"待用"}}</p>
                        <span>
                            {{item.count}}
                        </span>
                    </router-link>
                </i-col>
            </i-row>
        </div>
    </div>
</template>
<script>
export default {
    name: "life-entry",
    data() {
        return {
            lifeNumberData: []
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$axios
                .post(`EmergencyMaterials/getLifeDetail`)
                .then(({ data }) => {
                    this.lifeNumberData = data;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.life-entry {
    padding: 10px 30px;
    height: 100%;
    .entry-title {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        > span:nth-of-type(1) {
            color: #333;
            font-size: 16px;
            position: relative;
            &::before {
                content: "";
                background: url("../image/应急物资.png") no-repeat;
                background-size: 100%;
                display: inline-block;
                width: 20px;
                height: 20px;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: -28px;
            }
        }
        > span:nth-of-type(2) {
            font-size: 14px;
            position: relative;
            color: #459ca2;
            cursor: pointer;
            &::after {
                content: "";
                background: url("../../../common/kld-learn-more/images/查看更多.png")
                    no-repeat;
                background-size: 100%;
                display: inline-block;
                width: 18px;
                height: 18px;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: -25px;
            }
        }
    }
    .entry-content {
        cursor: pointer;
        margin-top: 20px;
        text-align: center;
        .entry-number {
            font-size: 14px;
            border-right: 2px solid #000;
            cursor: pointer;
            > span {
                font-size: 16px;
                color: #e59b32;
            }
            &:active {
                opacity: 0.7;
            }
        }
        .entry-number:nth-last-of-type(1) {
            border-right: none;
        }
    }
}
</style>

