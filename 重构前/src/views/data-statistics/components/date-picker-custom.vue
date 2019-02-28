<template>
    <div class="date-picker-custom">
        <date-picker v-model="date"></date-picker>
    </div>
</template>

<script>
export default {
    name:"date-picker-custom",
    data(){
        return {
            date
        }
    }
}
</script>
<style lang="less" scoped>
.date-picker-custom{

}
</style>

