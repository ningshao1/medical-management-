<template>
    <div style="padding:0 30px;">
        <div class="temp_title">
            巡检设备分类
        </div>
        <div class="category">
            <div class="categoryLeft">
                <div class='title'>设备分类（置灰选项为已经关联模板的分类）</div>
                <div class='categoryScroll'>
                    <div style="padding:8px 10px">
                        <Tree @on-selected="treeClick" ref="tree" show-checkbox :data='TreeData' @on-check="clicked" @on-check-change='getCheck'></Tree>
                    </div>
                </div>
            </div>
            <div class="categoryRight">
                <div class='r_title'>
                    所选设备分类
                </div>
                <div style="border: 1px solid #c8ced3;border-top:none;height:403px; overflow: auto">
                    <table class="table-stripe" width="100%" border="0" style="border-collapse: collapse;">
                        <tr>
                            <th style="width:30%">序号</th>
                            <th style="width:70%">设备分类</th>
                        </tr>
                        <tr v-for="(item,i) in content" :key='i'>
                            <td>{{(i+1+'').padStart(4,'0')}}</td>
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
export default {
    data() {
        return {
            //检查项
            content: [],
            TreeData: [],
            modal1: false,
            isAddPage: this.$route.name === "inspection-template-add",
            relationList:[],
            checkedList:[],
            levelCount:0,
            bottomLevel:0
        };
    },
    created() {
        this.getRelations()
            .then(
                res=>{
                    this.typeTree();

                }
            );
    },
    props: {
        originChecked: {
            type: Array,
            default: []
        }
    },
    methods: {

        getRelations(){
            return this.$axios.get(`/inspectionModel/isExistsModelByAssetType/${this.$store.state.user_in.osId}`)
                .then(
                    res=>{
                        if(res.data.length>0){
                            this.relationList=res.data.map(v=>v.assetTypeId);
                        }
                    }
                )
        },
        //获取设备分类数据
        typeTree() {
            this.axios
                .get(
                    `/assetTypeHospital/findList/${
                        this.$store.state.user_in.osId
                    }`
                )
                .then(res => {
                    this.checkConfig(res);
                })
                .catch(error => {
                    if (error.code == "403") {
                        this.$Message.warning(
                            "对不起，您没有权限获取设备分类列表"
                        );
                    }
                });
        },

        checkedListFormat(data,list=[]){
            // console.log(data)
            data.forEach(v => {
                if(v.lists){
                    this.checkedListFormat(v.lists,list);
                }else{
                    // console.log(v);
                    list.push(v);
                }
                
            });
            // console.log(list);
            return list;

        },
        //获取已经勾选的树状数据
        getCheck(e) {
            // console.log(e);
            if (e instanceof Array) {
                let filterData = e.filter(el => {
                    // console.log(el)
                    return el.children == undefined&&!el.disableCheckbox;
                });
                this.content = filterData;
                this.$emit("getCheck", filterData);
            }
        },
        //树结构生成器
        treeDateFormat(data, title='typeName',disabledList=[],checkedList=[],level=0) {
           level++;
            //checkedList传过来的已选择的树
            return data.map(v=>{
                this.levelCount=this.levelCount>level?this.levelCount:level;
                this.bottomLevel=this.levelCount;
                if(v.lists){
                    return {
                        ...v,
                        title:v[title],
                        level,
                        children:this.treeDateFormat(v.lists,title,disabledList,checkedList,level),
                        //  checked:checkedList.includes(v.id)

                    }
                }
                return {
                    ...v,
                    title:v[title],
                    disableCheckbox:disabledList.includes(v.id),
                    checked:checkedList.includes(v.id),
                    level,
                }
            })
        },
        //判断是新增还是编辑
        checkConfig(res) {
            if (!this.isAddPage) {
                this.checkedList=this.checkedListFormat(this.originChecked);
                this.relationList=this.relationList.filter(v=>!this.checkedList.map(v=>v.id).includes(v));//
                this.TreeData=this.checkDisabled(this.treeDateFormat(
                    res.data,
                   'typeName',
                   this.relationList,
                   this.checkedList.map(v=>v.id)
                ))
                this.getCheck(this.checkedList);
            }
            if (this.isAddPage) {
                this.TreeData =this.checkDisabled( this.treeDateFormat(res.data,'typeName',this.relationList));
            }
        },
        checkDisabled(treeData){

            
            while(--this.levelCount){
                let level=this.levelCount;
                (function isDisabled(list,level){
                    list.forEach(v=>{
                        if(v.children&&v.level<=level){
                            if(v.level===level){
                                v.disableCheckbox=v.children.every(item=>item.disableCheckbox);
                            }
                            isDisabled(v.children,level);
                        }
                    })
                })(treeData,level)
            }

            // console.log(treeData)
            return treeData;
        },

        treeClick(nodeKey) {
            const node = this.$refs['tree'].flatState[nodeKey].node;
            if (node.children && node.children.length > 0) {
                this.$set(node, 'expand', ! node.expand);
            }
        },
        clicked(){

        }
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
            height: 350px;
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