<template>
    <div class="four-step">
        <div class="four-step-center">
            <img :src="require('../../../../img/success.png')" alt="">
            <p>资产验收完成，并成功录入系统</p>
            <div>您可以进入资产目录，对设备进行更全面的管理。</div>
            <Button class="four-step-btn" @click="$router.go(-1)">返回列表</Button>
        </div>
    </div>
</template>
<script>
export default {
    name:'step4'
};
</script>
<style lang="less" scoped>
    .four-step{
        min-height: 600px;
        display: flex;
    }
    .four-step-center{
        display: inline-block;
        margin: auto;
        text-align: center;
        justify-content: center;
        align-items: center;
        >p{
            color: #333333;
            font-size: 22px;
            margin: 20px 0 8px 0;
        }
        >div{
            font-size: 14px;
            color: #999999;;
        
        }
        .four-step-btn{
          background-color: #e3e3e3;
          border: solid 1px #999999;
          margin: 30px 0;
          width: 120px;
          height: 45px;
        }
        
    }
</style>

