<template>
    <div>
        <div class="c_bar">
            <!-- <div :class='current<=i?"block":"block active_block"' v-for='(item,i) in data'> -->
            <div :class='{"block": current<i,"block b_color":current==i,"block active_block": current>i, "error": error && current===i}' v-for='(item,i) in data' :key='i'>
                <span class='content' v-if="error && current===i">
                    <Icon type="close-round"></Icon>
                </span>
                <span class='content' v-else-if="current<=i">{{i+1}}</span>
                <span class='content' v-if="current>i">
                    <Icon type="checkmark-round" color='white'></Icon>
                </span>
                <span class='active'>{{item}}</span>
                <span class='active'>·······</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "KldStep",
    props: {
        //step 内容
        data: {
            default: []
            //required: true
        },
        //第几步
        current: {
            default: 0
        },
        error: {
            type: Boolean,
            default: false
        }
    },
    datat() {
        return {
            list: {}
        };
    }
};
</script>
<style lang="less" scoped>
.c_bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px 0;
    height: 60px;
    //background-color: #fafafa;
    //box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);
    //border-radius: 3px;
    //border: solid 1px rgba(2, 31, 57, 0.1);
    align-items: center;
}
//默认样式
.block {
    overflow: hidden;
    line-height: 100px;
    color: #666;
    padding: 0 10px;
    color: #666666;
    font-size: 14px;
    span:nth-of-type(1) {
        width: 33px;
        height: 33px;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0px;
        letter-spacing: 0px;
        border: 1px solid #cccccc;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        line-height: 33px;
    }
    span:nth-of-type(2) {
        margin-left: 5px;
    }
    span:nth-of-type(3) {
        letter-spacing: 4px;
        margin-left: 20px;
        color: #ccc;
    }
}
.block:last-of-type {
    span:nth-of-type(3) {
        display: none;
    }
}
.b_color {
    color: #01b0c7;
    span:nth-of-type(1) {
        color: #01b0c7;
        border-color: #01b0c7;
    }
    span:nth-of-type(3) {
        color: #01b0c7;
    }
}
.error {
    @error: #ed3f14;
    color: @error;
    span:nth-of-type(1) {
        color: #fff;
        background: @error;
        border-color: @error;
    }
    span:nth-of-type(3) {
        color: @error;
    }
}
.active_block {
    color: #01b0c7;
    span:nth-of-type(1) {
        color: #fff;
        background: #01b0c7;
        border-color: #01b0c7;
    }
    span:nth-of-type(3) {
        color: #01b0c7;
    }
}
</style>
