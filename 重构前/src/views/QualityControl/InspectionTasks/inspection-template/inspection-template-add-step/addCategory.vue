<template>
    <div>
        <Modal v-model="show_" title="添加类别" class-name="vertical-center-modal Pcategory" width='1275px' @on-ok="ok">
            <div class="category">
                <div class="categoryLeft">
                    <table class="table-stripe" width="100%" border=1 style="table-layout: fixed; border-collapse:collapse; border: solid 1px rgba(2, 31, 57, 0.1);text-align: center;">
                        <tr style="height:52px;font-size:14px">
                            <th style="background:#eaeaea;width:30%">选择</th>
                            <th style="background:#eaeaea;width:70%">检查类别(点击查看)</th>
                        </tr>
                        <tr v-for="(item,i) in list_" :key='i' class="selelct-content">
                            <td>
                                <Checkbox v-model="item.value" @on-change='change($event,i,item)' class="checkbox-out">
                                </Checkbox>
                            </td>
                            <td :class='{textEllipsis:true,tdClick:typeIndex==i}' @click='typeClick(item,i)' :title="item.name" :ref="'ITtype'+i">{{item.name}}</td>
                        </tr>
                    </table>
                </div>
                <div class="categoryRight">
                    <div class="r_left r_wrap">
                        <div class='r_title'>
                            巡检项
                        </div>
                        <ul class='r_content'>
                            <!-- <template v-if="content.length"> -->
                                <li :class='{textEllipsis:true,clicked:clickedIndex==i}' :title='item.lName' v-for="(item,i) in content" :key='i' @click="examine(item,i)">
                                    {{i+1}}、{{item.lName}}
                                </li>
                            <!-- </template> -->
                            <!-- <li :class='{textEllipsis:true}' v-else>
                                    暂无巡检项
                            </li> -->
                        </ul>
                    </div>



                    <div class="r_right r_wrap">
                        <div class='r_title'>
                            巡检要素
                            <span>
                                * 所有检查项的评判结果分为二等：<span>合格、不合格</span>
                            </span>
                        </div>
                        <ul>
                            <!-- <template v-if="elements.length"> -->
                                <li class='textEllipsis' :title='item.eContent' v-for="(item,i) in elements" :key='i'>
                                    {{i+1}}、{{item.eContent}}
                                </li>
                            <!-- </template> -->
                            <!-- <li :class='{textEllipsis:true}' v-else>
                                暂无巡检要素
                            </li> -->
                        </ul>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    props: {
        //控制弹窗显示隐藏
        show: {
            type: Boolean,
            default: false
        },
        //检查类别的选项
        list: {
            type: Array,
            default() {
                return [];
            }
        },
        selectedData:{
             type:Array,
             default(){
                 return [];
             }
         },
    },
    data() {
        return {
            //检查项
            content: [],
            modal1: false,
            elements:[],
            typeIndex:-1,
            clickedIndex:0,
            // selectedData:[]
           
        };
    },
    watch:{
        content(data){
            this.clickedIndex=0;
            this.elements=data.length==0?[]:(data[0].pmElements||[]);
        },
        selectedData(){
           
        }

    },
    methods: {

        //点击checkbox触发的事件
        change(e, index, item) {
            if(e){
                this.$refs['ITtype'+index][0].click();
                this.selectedData.push(item);
                console.log(this.selectedData)
            }else{
                this.selectedData.splice(this.selectedData.findIndex(v=>v.id===item.id),1)
            }
        },
        typeClick(item,i){
            this.content=item.pmElementTypes;
            this.typeIndex=i;
        },
        //点击巡检项
        examine(item,i){
            this.elements=item.pmElements,
            this.clickedIndex=i;
        },
        //点击确定按钮触发的事件
        ok(e) {
            console.log(e)
            this.$emit("on-ok", [...this.selectedData]);
        }
    },
    computed: {
        show_: {
            get() {
                return this.show;
            },
            set(e) {
                // console.log(e);
                this.$emit("update:show", e);
            }
        },
        list_:{
            get(){
                  return this.list;
            },
            set(e){
                this.$emit("update:list");
            }
        }
    }
};
</script>
<style lang="less" scoped>
/deep/.Pcategory {
    .ivu-modal-footer{
        .ivu-btn-text{
            width: 75px;
            color: #fff;
            background-color: #a9a8a9;
        }
    }
}
.category {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    height: 450px;
    //左边部分
    .categoryLeft {
        width: 30%;
        margin-right: 15px;
        box-sizing: border-box;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        border-radius: 3px;
        border: solid 1px rgba(2,31,57,.1);
        border-top: none;
        table {
            width: 100.5%;

            td {
                font-size: 14px;
                color: #333333;
               height: 40px;
               line-height: 40px;
                cursor: pointer;
                .checkbox-out{
                    width:100%;
                    height:100%;
                }
            }
            .tdClick{
                background-color: #fafafa;
                color:#0c8399;
            }
        }
    }
    .categoryRight {
        width: 70%;
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-flow: row nowrap;
        .r_wrap{
            height: 100%;
            .r_title {
                width: 100%;
                border-radius: 3px 3px 0px 0px;
                border: solid 1px #c8ced3;
                color: #666666;
                font-size: 14px;
                padding: 15px;
                font-weight: 600;
                background-color: #eaeaea;
            }
        }
        .r_left{
            width:30%;
            .r_content {
                overflow: auto;
                height: 88.1%;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px #c8ced3;
                border-top: none;
                > li {
                    width: 100%;
                    padding: 15px 5px;
                    background-color: #f5f6fa;
                    border-bottom: solid 1px #c8ced3;

                    
                    font-size: 14px;
                    color: #666666;
                    cursor: pointer;
                }
                .clicked{
                    background-color: red;
                    color: #0c8399;
                    background-color: #fafafa;
                    border-left:4px solid #0c8399;
                }
            }
        }
        .r_right{
            width:70%;
            margin-left: -1px;
            .r_title{
                display: flex;
                justify-content: space-between;
                >span{

                    
                    font-size: 14px;
                    font-weight: normal;
                    color: rgb(12, 131, 250);
                    >span{
                        font-weight: bold;
                    }
                }
            }
            >ul{
                overflow: auto;
                height: 88.1%;
                padding: 0 15px;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px #c8ced3;
                border-top: none;
                > li {
                    padding: 15px 0px;
                    border-bottom: 1px solid #e2e2e2;
                    
                    font-size: 14px;
                    color: #666666;

                    
                }

            }
        }
    }
}
</style>
