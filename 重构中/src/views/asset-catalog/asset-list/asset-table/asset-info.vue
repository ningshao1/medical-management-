<template>
    <div class="full-width asset-info-wrap">
        <div class='full-width single-info'>
            <span class="info-title">
                {{title}}
            </span>
            <span class="info-content" v-ellipsis-tooltip='content'>
                {{isEmpty(content)?"--":content}}
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name: "asset-info",
    components: {},
    props: {
        title:String,
        content:{
            default:''
        }
    },
    data() {
        return {};
    },
    computed: {},
    created() {},
    methods: {
        isEmpty(item){
            return item===""||item===null||item===undefined
        }
    }
};
</script>
<style lang="less" scoped>
.asset-info-wrap {
    .single-info{
        display: flex;
        align-items: center;
        font-size: 12px;
        .info-content{
            flex: 1
        }

    }
}
</style>