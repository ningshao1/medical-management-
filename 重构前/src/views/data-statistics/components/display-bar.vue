<template>
    <div class="display-bar">
        <div class="single-item"
             v-for="{name,value,unit} in data"
             :key='name'>
            <div class="item-name">
                {{name}}：
            </div>
            <div class="item-value">
                {{value}}
            </div>
            <div class="item-unit"
                 v-if="unit">
                {{unit}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "display-bar",
    props: {
        /**
         *
         * [
         *      {
         *          name:String
         *          value:String,Number
         *          unit:String,Boolean
         *      },
         *      ...
         * ]
         *
         */
        data: {
            type: Array,
            default() {
                return [
                ];
            }
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="less" scoped>
.display-bar {
    width: 100%;
    border: 1px solid #dddee1;
    display: flex;
    flex-wrap: wrap;
    border-radius: 3px;
    background-color: #fafafa;
    padding: 0 10px;
    .single-item {
        @text-color: #666;
        @value-color: #459ca2;
        height: 50px;
        display: flex;
        align-items: center;
        margin-right: 35px;
        color: #666;
        .item-name {
            
        }
        .item-value {
            
            padding: 0 2px 0 5px;
            color: @value-color;
            font-weight: 600;
        }
        .item-name {
            

        }
    }
}
</style>

