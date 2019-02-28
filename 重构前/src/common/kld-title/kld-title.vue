<template>
    <div :class="wrapClass">
        <img :src="imgUrl" alt="" v-if="imgUrl">{{label}}
        <div></div>
    </div>
</template>
<script>
export default {
    props:{
        label:'',
        imgUrl:'',
        container:{
            type:Boolean,
            default:true,
        }
    },
    computed:{
        wrapClass(){
            return {
                'kld-pageTips':true,
                "container":this.container,
                "container-fluid":!this.container
            }
        }
    }
    
}
</script>
<style lang="less" scoped>
.kld-pageTips {
    padding-top: 10px;
    font-size: 18px;
    color: #020e0f;
    div {
        margin: 10px 0 15px;
        width: 100%;
        height: 1px;
        background-color: #ccd2d7;
    }
    img {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-bottom: -3px;
        margin-right: 5px;
    }
}

</style>

