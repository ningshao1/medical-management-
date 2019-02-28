<template>
    <Poptip trigger="hover"  placement='bottom'>
        <Icon type='ios-compose-outline' class="ios-compose-outline single-icon"></Icon>
        <div slot="content" class="kld-test-poptip-content">
            <Button type="info"  @click="configCode">
                编辑国家分类编码
            </Button>
            <br />
            <br />
            <Button type="info"  @click="configName">
                编辑国家分类名称
            </Button>
        </div>
    </Poptip>

</template>
<script>
export default {
    name:"kld-test-poptip",
    methods:{
        configCode(event){
            event.stopPropagation();
            this.$emit('config-code')
        },
        configName(event){
            event.stopPropagation();
            this.$emit('config-name')
        },

    }
    
}
</script>
<style lang="less" scoped>
.kld-test-poptip-content{
    
    p{
        font-size: 14px;
        &:hover{
            color:#075aad
        }
    }
}
</style>


