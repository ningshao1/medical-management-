<template>
<div class="wrap row">
<p>
    {{title}}
</p>
</div>
    
</template>

<script>
export default {
    name:'kld-type',
    props:{
        title:{
            default:""
        }
    }
    
}
</script>

<style lang="less" scoped>
    .wrap{
        margin:15px 0 10px;
        p{
            font-size: 15px;
            color: #f2740c;
            border-bottom: 1px solid #e2e2e2;
            padding-bottom: 15px;
        }
    }
</style>
