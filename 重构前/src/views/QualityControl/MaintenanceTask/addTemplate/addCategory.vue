<template>
    <div>
        <Modal v-model="show_" title="添加类别" class-name="vertical-center-modal Pcategory" width='1275px' @on-ok="ok">
            <div class="category">
                <div class="categoryLeft">
                    <table class='table-stripe' width="100%" border=1 style="border-collapse:collapse; border: solid 1px rgba(2, 31, 57, 0.1);text-align: center;table-layout:fixed">
                        <tr style="height:40px;background:#f4f4f4">
                            <th style="width:30%">选择</th>
                            <th style="width:70%">保养类别</th>
                        </tr>
                        <tr v-for="(item,i) in list_" :key='i' >
                            <td>
                                <Checkbox v-model="item.value" @on-change='change($event,i,item)'>
                                </Checkbox>
                            </td>
                            <td :title="item.name" :class="{'textEllipsis':true,'active-type':item.id===currentViewTypeId}" style="cursor:pointer;" @click="viewItem(i,item)">{{item.name}}</td>
                        </tr>
                    </table>
                </div>
                <div class="categoryLeft" style="margin-right:0;border-right:0;" id='MItem'>
                    <table class='maintainItem' width="100%" border=1 style="border-collapse:collapse; border: solid 1px rgba(2, 31, 57, 0.1);text-align: center;table-layout:fixed">
                        <tr style="height:40px;background:#f4f4f4">

                            <th style="width:100%">保养项</th>
                        </tr>
                        <tr v-for="(item,i) in newList" :key='i' @click="clickTr(item,i)" :class='TrIndex===i?"clickTr":""'>
                            <td class="textEllipsis" :title="item.lName">{{item.lName}}</td>
                        </tr>
                    </table>
                </div>
                <div class="categoryRight">
                    <div class='r_title' style="padding:9px 8px;color:rgb(73, 80, 96);font-size:14px">
                        保养要素
                        <div class='r_title-tip'>
                            * 所有检查项的评判结果分为二等：合格、不合格
                        </div>
                    </div>
                    <ul class='r_content'>
                        <li v-for="(item,i) in content" :key='i'>
                            <div class='textEllipsis' :title="item.eContent">
                                {{i+1}}、{{item.eContent}}
                            </div>
                        </li>
                    </ul>
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
        }
    },
    data() {
        return {
            //检查项
            content: [],
            modal1: false,
            newList: [], //保养项
            TrIndex: 0,
            currentViewTypeId:''
        };
    },
    methods: {
        //点击checkbox触发的事件
        change(e, index, item) {
            //勾选才出发请求
            if (e) {
                 this.currentViewTypeId=item.id
                this.newList = item.pmElementTypes;
                this.content = item.pmElementTypes[0].pmElements;
            }
            //筛选所有被选中checkbox
            let temp = this.list.filter(e => {
                return e.value == true;
            });
            this.$emit("on-change", {
                value: e,
                index: index,
                allTrue: temp,
                self: item
            });
        },
        viewItem(index, item){
             this.currentViewTypeId=item.id
                this.newList = item.pmElementTypes;
                this.content = item.pmElementTypes[0].pmElements;
        },
        //点击确定按钮触发的事件
        ok(e) {
            this.$emit("on-ok", e);
        },
        clickTr(item, i) {
           
            this.TrIndex = i;
            this.content = item.pmElements;
        }
    },
    computed: {
        show_: {
            get() {
                return this.show;
            },
            set(e) {
                this.$emit("update:show", e);
            }
        },
        list_: {
            get() {
                return this.list;
            },
            set(e) {
                this.$emit("update:list", e);
            }
        }
    }
};
</script>
<style lang="less" scoped>
.Pcategory {
    width: 800px;
}
.category {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    height: 450px;
    font-size: 14px;
    //左边部分
    .categoryLeft {
        width: 30%;
        margin-right: 15px;
        box-sizing: border-box;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        border-radius: 3px;
        border: solid 1px #c8ced3;
        border-top: none;
        table {
            width: 100.5%;

            td {
                color: #333333;
                padding: 8px 0;
            }
        }
        .active-type{
            color:#0c8399;
        }
    }
    .categoryRight {
        width: 40%;
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        border-bottom: 1px solid #e2e2e2;
        .r_title {
            background-color: #fafafa;
            border-radius: 3px 3px 0px 0px;
            border: solid 1px #c8ced3;
            color: #666666;
            font-size: 14px;
            padding: 12px 8px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            .r_title-tip{
                color:rgb(12, 131, 250)
;
            }
        }
        .r_content {
            height: 91%;
            padding: 0 15px;
            background-color: #ffffff;
            border-radius: 3px;
            border: solid 1px #c8ced3;
            border-top: none;
            border-bottom: none;
            > li {
                padding: 10px 0px;
                border-bottom: 1px solid #e2e2e2;
                font-size: 12px;
                color: #666666;
            }
        }
    }
}
#MItem {
    .maintainItem {
        .clickTr {
            border-left: 3px solid #01b0c7;
            cursor: pointer;
            > td {
                color: #01b0c7;
            }
        }
    }
}
</style>
