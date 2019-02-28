<template>
    <div class="contract-info-icon-wrap">
       
    </div>
</template>
<script>
export default {
    name: "contract-info-icon",
    components: {	},
    props: {
        
    },
    data() {
        return {

        }
    },
    computed: {

    },
    created() {

    },
    methods: {

    },
}
</script>
<style lang="less" scoped>
.contract-info-icon-wrap{
    // text-align: center;
    .avatar(@content){
        @length:24px;
        content:@content;
        font-size: 12px;
        display: inline-block;
        color: #5ba4c8;
        background-color: rgba(91, 164, 200, 0.2);
        width: @length;
        height: @length;
        line-height: @length;
        text-align: center;
        border-radius: 50%;

    }
    &::before{
        .avatar("合");
        margin-right: 10px;
    }
    &::after{
        .avatar("供")
    }

}
</style>