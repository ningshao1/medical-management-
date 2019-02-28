<template>
    <div style="padding:0 30px;">
        <div class="temp_title">
            巡检设备分类
        </div>
        <div class="category">
            <div class="categoryLeft">
                <div class='title'>设备分类（国家分类）</div>
                <div class='categoryScroll'>
                    <div style="padding:8px 10px">
                        <!-- <Tree  :show-checkbox="!currentPage"  :data='currentPage?treeDatas:TreeData' @on-check-change='getCheck'></Tree> -->
                        <kldTree :data='treeDatas' :props="{label:'title'}"  style='background-color:transparent;' @node-expand='nodeExpand'></kldTree>
                    </div>
                </div>
            </div>
            <div class="categoryRight">
                <div class='r_title'>
                    所选设备分类
                </div>
                <div style="border: 1px solid #c8ced3;border-top:none;height:403px; overflow: auto;">
                    <table class='table-stripe' width="100%" border="0" style="border-collapse: collapse;">
                        <tr>
                            <th style="width:30%">序号</th>
                            <th style="width:70%">设备分类</th>
                        </tr>
                        <tr  v-for="(item,i) in currentPage?contents:content" :key='i'>
                            <td>{{(i+1+'').padStart(3,"0")}}</td>
                            <td class="textEllipsis">{{item.typeName}} </td>
                        </tr>

                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import prData from "@common/transformSectionTreeData/API.js"; //处理树状数据
import kldTree from "@common/element-components/el-custom-tree";
export default {
    data() {
        return {
            //检查项
            content: [],
            TreeData: [],
            modal1: false,
            currentPage:this.$route.name==='inspection-template-details'
        };
    },
    components:{
        kldTree
    },
    props:{
        checkList:[],
        outTreeData:{
            type:Array,
            default(){
                return []
            }
        }
    },
    created(){
        if(this.$route.name!="TwoTemplateDetails"){

            this.typeTree();
        }
        

    },
    computed:{
        treeDatas(){
            return prData.treeDateFormat(this.outTreeData,[],this.currentPage)
        },
        contents(){
            return prData.contentDataFormat(this.outTreeData)
        }
    },
    methods: {
        nodeExpand(data,node){
                while(node.childNodes.length){
                    node.childNodes[0].expanded=true;
                    node=node.childNodes[0];
                }
        },
        //获取设备分类数据
        typeTree() {
            this.axios
                .get(`/assetTypes/typeAllTree`)
                .then(res => {
                    res.data=this.$countryTreeSort(res.data);
                    this.TreeData = prData.treeDateFormat(res.data);
                })
                .catch(error => {
                    if(error.code=='403'){
                        this.$Message.warning('对不起，您没有权限获取设备分类列表')
                    }
                });
        },
        //获取已经勾选的树状数据
        getCheck(e){
           if(e instanceof Array){
             let filterData=e.filter((el)=>{return el.children==undefined})
             this.content=filterData;
             this.$emit('getCheck',filterData)
           }
        },
        
    }
};
</script>
<style lang="less" scoped>
.temp_title {
    font-size: 14px;
    font-weight: normal;
    line-height: 40px;
    font-stretch: normal;
    color: #f2740c;
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 15px;
    //background-color: #e2e2e2;
}
.Pcategory {
    width: 800px;
}
.category {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    height: 450px;
    //左边部分
    .categoryLeft {
        width: 20%;
        margin-right: 15px;
        box-sizing: border-box;

        overflow: hidden;
        border-radius: 3px;
        border: solid 1px #c8ced3;
        .categoryScroll {
            overflow-y: auto;
            height: calc(~"100% - 52px");
        }

        > .title {
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            padding: 15px 15px;
            border-bottom: solid 1px #c8ced3;
        }
        > a {
            display: block;
            cursor: default;
            text-align: center;
            line-height: 40px;
            p {
                cursor: pointer;
                display: inline-block;
                > span {
                    color: #78bbc0;
                    font-size: 14px;
                    cursor: pointer;
                }
                span:nth-of-type(1) {
                    font-size: 20px;
                }
            }
        }
    }
    .categoryRight {
        width: 80%;
        box-sizing: border-box;
        height: 100%;
        .r_title {
            border-radius: 3px 3px 0px 0px;
            border: solid 1px #c8ced3;
            color: #666666;
            font-size: 14px;
            padding: 12px 8px;
            font-weight: 600;
        }
        table {
            table-layout: fixed;
            border: none;
            tr {
                border: none;
                border-bottom: 1px solid rgba(2, 31, 57, 0.1);
                text-align: left;
                font-size: 14px;
                td:nth-of-type(1),
                th:nth-of-type(1) {
                    padding-left: 20px;
                }
                td,
                th {
                    border: none;
                    padding: 13px 0;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>