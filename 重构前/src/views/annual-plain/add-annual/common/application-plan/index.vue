<template>
    <div>
        <div class="detail-title" @click="show">
            <span>
                申请计划详情
            </span>
            <span>
                <img :src="require('../../../../image/open.png')" alt="" :class="toggle?judge?'rotateup':'rotateIn':''">
            </span>
        </div>
        <div class="detail-content">
            <slot>
                <oneDetail :detail='true'></oneDetail>
            </slot>
        </div>
        <div v-show="judge" class="detail-white">

        </div>
    </div>
</template>
<script>
import oneDetail from "../../one-step/index";
export default {
    name: "application-plan",
    data() {
        return {
            judge: true,
            toggle: false
        };
    },
    components: {
        oneDetail
    },
    methods: {
        show() {
            this.toggle = true;
            $(".detail-content").slideToggle();
            this.judge = !this.judge;
            console.log(this.judge);
        }
    }
};
</script>
<style lang="less" scoped>
@import url("../../common/base.less");
.detail-title {
    cursor: pointer;
    left: 0;
    height: 60px;
    background-color: #ededed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    color: #020e0f;
    font-size: 16px;
        &:hover{
        background:#f2f2f2;
    }
    span:nth-of-type(2) {
        width: 17px;
        img {
            width: 100%;
        }
    }
}

.detail-content {
    padding-top: 10px;
    display: none;
    overflow: hidden;
}
.detail-white {
    height: 10px;
    background: #fff;
}
</style>
