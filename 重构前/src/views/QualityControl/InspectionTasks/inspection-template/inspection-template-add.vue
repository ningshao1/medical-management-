<template>
    <div id="addTwoTpl">
        <div class="step_bg">
            <steps :current='current' :data='list'></steps>
        </div>
        <div class='step_content'>
            <!-- <StepTemp1 :value.sync='datas'></StepTemp1> -->
            <keep-alive>
                <component :is="tpl" :originChecked="originChecked" :value.sync='datas' @showModal='getshow' @getCheck='getCheck' :CheckCategoryList='CheckCategoryList' @delC='del_'></component>
                <!-- <component :is="'StepTemp3'" :originChecked="originChecked" :value.sync='datas' @showModal='getshow' @getCheck='getCheck' :CheckCategoryList='CheckCategoryList' @delC='del_'></component> -->
            </keep-alive>
            <div class='step_bottom'>
                <span @click='pre_' :class="{default: current === 0}">{{preContent}}</span>
                <span @click='next'>{{nextContent}}</span>
            </div>
        </div>
        <addCategory :show.sync='Model.show' :list.sync='categoryList' :selectedData='CheckCategoryLists'  @on-ok='ok_'></addCategory>
    </div>
</template>
<script>
import steps from "@common/step/step.vue"; //步骤组件
import addCategory from "./inspection-template-add-step/addCategory"; //添加检查类别组件
import StepTemp1 from "./inspection-template-add-step/oneStepTemp"; //第一步
// import StepTemp2 from "./inspection-template-add-step/TwoStepTemp"; //第二步
import StepTemp2 from "./inspection-template-add-step/new-two-step-temp"; //第二步
import StepTemp3 from "./inspection-template-add-step/ThreeStepTemp"; //第三步
import confirm from '@common/kld-confirm';

export default {
    name:'inspection-template-add',
    data() {
        return {
            list: ["填写基本信息", "选择巡检设备分类", "制定巡检要素"], //步骤信息
            datas: {
                mName: "",
                customName: this.$store.state.user_in.name,
                createTime: this.time_(Date.now())
            }, //第一步信息

            DeviceId: [], //第二步骤 设备ID集合
            categoryList: [],
            current: 0, //控制步骤//TODO 改回0
            preContent: "取消",
            nextContent: "下一步",
            Model: {
                show: false
            },
            TempData: [], //临时储存被选中的数据
            CheckCategoryList: [], //被选择的类别总和
            isAddPage:this.$route.name==='inspection-template-add',//判断是否是新增路由
            originChecked:[],//步骤二默认选中值
            configData:{},
        };
    },
    components: {
        steps,
        StepTemp1,
        StepTemp2,
        StepTemp3,
        addCategory,
    },
    created() {
        // this.currentPage=this.$route.name
        if(this.isAddPage){

        this.getElements(); //获取第三步弹窗类别
        }else{
            
            this.getDetail(this.getElements);
        }
    },
    methods: {
        //获得并编辑路由的信息
        getDetail(fn){
            this.$axios.get(`/inspectionModel/${this.$route.query.id}`)
                .then(res=>{
                    this.configDataFormat(res.data);
                    if(!this.isAddPage) fn();
                }).catch(error=>{

                })
        },
        //编辑数据路由处理
        configDataFormat(data){
            this.configData=data;
            this.originChecked=data.assetTypes;
            this.CheckCategoryList=data.pmModelElementOptions.map(v=>{
                v.value=true;
                return v;
            });

            this.datas={
                mName: data.mName,
                customName:data.customName,
                createTime: data.createTime
            }
        },
        //下一步
        next() {
            if (this.current == 0) {
                if (this.datas.mName == "") {
                    this.$Message.warning("请填写模板名称");
                    return;
                } else if (this.datas.mName.length > 100) {
                    this.$Message.warning("模板名称字数不能超过100");
                    return;
                }
            }
            if (this.current == 1) {
                if (this.DeviceId.length == 0) {
                    this.$Message.warning("请选择设备分类");
                    return;
                }
            }
            if (this.current == 2) {
                if (this.CheckCategoryList.length == 0) {
                    this.$Message.warning("请选择检查类别");
                    return;
                }
            }
            ++this.current;
            if (this.current >= this.list.length) {
                this.current=this.list.length-1;
                //新增界面提交
                if(this.isAddPage){
                    this.$axios.post('/inspectionModel',{
                        mName:this.datas.mName,
                        pmModelAssetTypes:this.DeviceId.map(v=>({assetTypeId:v})),
                        pmModelElementOptions:this.PMEDataFormat(this.CheckCategoryList),
                    }).then(res=>{
                        this.$Message.success('新增巡检模板成功');
                        this.$router.push({name:'inspection-template-list'})
                    }).catch(err=>{
                        // this.$Message.warning('请返回上一步修改');
                    })
                }
                //编辑页面提交
                if(!this.isAddPage){
                    this.$axios.put('/inspectionModel',{
                        mName:this.datas.mName,
                        id:this.configData.id,
                        mVersion:this.mVersion+1,
                        pmModelAssetTypes:this.DeviceId.map(v=>({assetTypeId:v})),
                        pmModelElementOptions:this.PMEDataFormat(this.CheckCategoryList),
                    }).then(res=>{
                        this.$Message.success('编辑巡检模板成功');
                        this.$router.push({name:'inspection-template-list'})
                    }).catch(err=>{
                        // this.$Message.warning('请返回上一步修改');
                    })
                }
                
            }
        },
        //提交数据格式化
        PMEDataFormat(data){
            return data.map(v=>{
                return {
                    optionId: v.id,
                    pmModelElements: v.pmElementTypes.map(el => {
                        return {
                            elementTypeId:el.id,
                            elementIds:el.pmElements.map(value=>value.id).join(',')
                        }
                    })
                }
            })
        },
        pre_() {
            if (this.current <= 0) {
                confirm({
                    title: '提示',
                    content: '确定取消本次操作',
                    ok: () => {
                        this.$router.go(-1);//不填写时跳转
                    }
                });
            } else {
                --this.current;
            }
        },

        //--------------第二步骤的方法--------------
        //步骤二获取添加类别的触发事件
        getshow(e) {
            this.Model.show = true;
        },
        //--------------第三步骤的方法--------------

        //获取勾选的值
        getCheck(e) {
            if (e instanceof Array) {
                this.DeviceId =e.map(el => {
                    return el.id;
                });
            }
        },
        //获取第三步弹窗类别
        getElements(e) {
            
                 this.$axios.post(`/inspectionOption/elementOption/${this.user_in.osId}/list`)
                    .then(
                        res=>{
                            if (res.data instanceof Array) {

                                this.categoryList = res.data.sort((pre,current)=>+pre.orgId);//保证基础类排第一位
                               
                            } else if (res.data instanceof Object) {
                                this.categoryList.push(res.data);
                            }
                            if(!this.isAddPage){
                                this.categoryList=this.categoryList.map(v=>{
                                    v.value=this.CheckCategoryList.map(value=>value.id).includes(v.id);
                                    return v;
                                })
                            }
                        }
                    )



               
        },
      
        ok_(data) {
            this.CheckCategoryList = data;
        },
        //删除方法
        del_({index,value}) {
            this.categoryList[this.categoryList.findIndex(v=>v.id===value.id)].value=false;
            // this.categoryList=this.categoryList.map(v=>{

            // })
            // console.log(this.categoryList);
            // let temparray = [];
            // this.categoryList.map(e => {
            //     let temp;

            //     if (
            //         this.TempData.findIndex(el => {
            //             return e.id == el.id;
            //         }) != -1
            //     ) {
            //         temp = { ...e, value: true };
            //     } else {
            //         temp = { ...e, value: false };
            //     }
            //     temparray.push(temp);
            // });
            // this.categoryList = temparray;
            // console.log(this.categoryList);
        }
    },
    computed: {
        //动态组件名称
        tpl: {
            get() {
                return `StepTemp${this.current + 1}`;
            }
        },
        //用户信息
        user_in() {
            return this.$store.state.user_in;
        },
        CheckCategoryLists(){
            return [...this.CheckCategoryList]
        }
    },
    watch: {
        current: {
            handler() {
                if (this.current == 0) {
                    this.preContent = "取消";
                }
                if (this.current > 0) {
                    this.preContent = "上一步";
                }

                if (this.current == this.list.length - 1) {
                    this.nextContent = "完成";
                }
                if (this.current < this.list.length - 1) {
                    this.nextContent = "下一步";
                }
            },
            immediate: true
        },
        CheckCategoryList(data){
            if(!this.isAddPage){
                this.categoryList=this.categoryList.map(v=>{
                    v.value=data.map(value=>value.id).includes(v.id);
                    return v;
                })
            }
        },
        TempData() {}
    }
};
</script>
<style lang="less" scoped>
.step_bg {
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: center;
    justify-content: center;
    height: 60px;
    background-color: #fafafa;
    border-radius: 3px;
    border: 1px solid rgba(2, 31, 57, 0.1);
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 20px;
}
.step_content {
    min-height: 400px;
    background-color: #fafafa;
    border-radius: 3px;
    border: solid 1px rgba(2, 31, 57, 0.1);
    position: relative;
    padding-bottom: 65px;
}
.step_bottom {
    position: absolute;
    bottom: 0;
    height: 60px;
    background-color: rgba(210, 210, 210, 0.5);
    border-radius: 0px 0px 3px 3px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    left: 0;
    padding: 0 30px;
    > span {
        width: 90px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 3px;
        color: #fff;
        border: solid 1px #999999;
        cursor: pointer;
    }

    span:nth-of-type(1) {
        background-color: #22a1b9;
        border: solid 1px #0c8399;
        margin-right: 20px;
    }
    span:nth-of-type(2) {
        background-color: #22a1b9;
        border: solid 1px #0c8399;
    }
    span.default{
        background-color: #a9a8a9;
        border: 1px solid #999;
    }
}
</style>
