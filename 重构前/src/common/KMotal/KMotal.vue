<template>
    <div>
        <button @click="modal1=true">test</button>
        <Modal
        v-model="modal1"
        title="Common Modal dialog box title"
        @on-ok="ok"
        @on-cancel="cancel">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
    </Modal>
    </div>
</template>

<script>
export default {
    data(){
        return {
            modal1:false
        }
    },
    methods:{
        ok(){
            this.$Message.warning("hello");
        },
        cancel(){
            this.$Message.warning("mymy");
        }
    }
    
}
</script>

<style lang="less" scoped>

</style>
