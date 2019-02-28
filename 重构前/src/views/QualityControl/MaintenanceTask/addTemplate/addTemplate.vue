<template>
    <div id="addOneTemplate">
        <div class="step_bg">
            <steps :current='current' :data='list'></steps>
        </div>
        <div class='step_content'>
            <!-- <StepTemp1 :value.sync='datas'></StepTemp1> -->
            <keep-alive>
                <component :is="tpl" :value.sync='datas' @showModal='getshow' @getCheck='getCheck' :CheckCategoryList='CheckCategoryList'></component>
            </keep-alive>
            <div class='step_bottom'>
                <span @click='pre_' :style="current>0?'background-color: #22a1b9;border: 1px solid #0c8399;':''">{{preContent}}</span>
                <span @click='next'>{{nextContent}}</span>
            </div>
        </div>
        <addCategory :show.sync='Model.show' :list.sync='categoryList' @on-change='selectCategory' @on-ok='ok_'></addCategory>
    </div>
</template>
<script>
import steps from "../../../../common/step/step"; //步骤组件
import StepTemp1 from "./oneStepTemp.vue"; //第一步
import addCategory from "./addCategory.vue"; //添加检查类别组件
import StepTemp2 from "./TwoStepTemp.vue";
import confirm from "@common/kld-confirm/index"; //提示框

export default {
    data() {
        return {
            datas: {
                mName: "",
                mMaintenanceLevel: 1,
                customName: this.$store.state.user_in.name,
                createTime: this.time_(Date.now())
            }, //第一步信息
            list: ["填写基本信息", "添加保养要素"], //步骤信息
            current: 0, //控制步骤
            preContent: "取消",
            nextContent: "下一步",
            Model: {
                show: false
            },
            categoryList: [],
            TempData: [], //临时储存被选中的数据
            CheckCategoryList: [], //被选择的类别总和
            tplId: ""
        };
    },
    components: {
        steps,
        StepTemp1,
        StepTemp2,
        addCategory
    },
    created() {
        this.getElements(); //获取第三步弹窗类别
        if (this.$route.name == "configOneTemplate") {
            this.getDetail();
        }
    },
    methods: {
        //下一步
        next() {
            let Temp = [];
            if (this.current == 0) {
                if (this.datas.mName == "") {
                    this.$Message.warning("请填写模板名称");
                    return;
                }
            }
            if (this.current == 1) {
                if (this.CheckCategoryList.length == 0) {
                    this.$Message.warning("请选择保养要素");
                    return;
                }
            }
            if (this.current == this.list.length - 1) {
                //添加一级模板
                this.CheckCategoryList.map(e => {
                    let element = e.pmElementTypes.map(el => {
                        let temp = [];
                        el.pmElements.map(ele => {
                            temp.push(ele.id);
                        });

                        temp = temp.join(",");
                        return {
                            elementTypeId: el.id,
                            elementIds: temp
                        };
                    });
                    Temp.push({
                        optionId: e.id,
                        pmModelElements: element
                        // pmModelElements: {
                        //     elementTypeId: e.pmElementTypes
                        //         .map(el => el.id)
                        //         .join(","),
                        //     elementIds: e.pmElementTypes
                        //         .map(el => {
                        //             if (el.pmElements.length >= 0) {
                        //                 return el.pmElements.map(v => v.id);
                        //             }
                        //         })
                        //         .filter(value => value.length > 0)
                        //         .join(",")
                        // }
                    });
                });
                console.log(Temp);
                if (this.$route.name == "configOneTemplate") {
                    //修改一级模板
                    this.$axios
                        .put(`/maintenanceModel`, {
                            mName: this.datas.mName,
                            mMaintenanceLevel: 1,
                            pmModelElementOptions: Temp,
                            id: this.tplId,
                            orgId: this.user_in.osId
                        })
                        .then(e => {
                            this.$router.replace({ name: "templateList" });
                            this.$Message.success("模板修改成功");
                        });
                } else {
                    this.$axios
                        .post("/maintenanceModel", {
                            mName: this.datas.mName,
                            mMaintenanceLevel: 1,
                            pmModelElementOptions: Temp
                        })
                        .then(e => {
                            this.$router.replace({ name: "templateList" });
                            this.$Message.success("模板添加成功");
                        });
                }
            }

            // this.$route.push(""); //填写完成时跳转

            if (this.current < this.list.length - 1) {
                ++this.current;
            }
        },
        pre_() {
            if (this.current <= 0) {
                confirm({
                    title: "提示",
                    content: "是否取消本次操作",
                    maskClosable: true, //是否允许点击遮罩关闭 默认:false
                    okText: "确定", //确认按钮文本  默认:确认
                    cancelText: "返回", //确认取消文本  默认:取消
                    ok: () => {
                        //当点击了确认按钮时
                        this.$router.go(-1); //不填写时跳转
                    },
                    cancel() {
                        //取消按钮同上
                    }
                });
            } else {
                --this.current;
            }
        },
        //步骤二获取添加类别的触发事件
        getshow(e) {
            this.Model.show = true;
        },

        //--------------第三步骤的方法--------------

        //获取勾选的值
        getCheck(e) {
            let temp = [];
            if (e instanceof Array) {
                temp.push(
                    e.map(el => {
                        return el.id;
                    })
                );
            }
            this.DeviceId = temp;
            console.log(this.DeviceId);
        },
        //获取第三步弹窗类别
        getElements(e) {
            this.$axios
                .post(
                    `/maintenanceOption/elementOption/${this.user_in.osId}/list`
                )
                .then(res => {
                    if (res.data instanceof Array) {
                        this.categoryList = res.data;
                    } else if (res.data instanceof Object) {
                        this.categoryList.push(res.data);
                    }
                    this.SyncData();
                })
                .catch(e => {
                    if (e.code == "403") {
                        this.$Message.warning("对不起，您没有权限获取类别列表");
                    }
                })
                .finally(e => {
                    console.log(e);
                });
        },
        selectCategory(e) {
            this.TempData = e.allTrue;
            console.log(this.TempData);
        },
        ok_() {
            this.CheckCategoryList = this.TempData;
            console.log(this.CheckCategoryList);
        },
        //删除方法
        // del_() {
        //     console.log(this.categoryList);
        //     let temparray = [];
        //     this.categoryList.map(e => {
        //         let temp;

        //         if (
        //             this.TempData.findIndex(el => {
        //                 return e.id == el.id;
        //             }) != -1
        //         ) {
        //             temp = { ...e, value: true };
        //         } else {
        //             temp = { ...e, value: false };
        //         }
        //         temparray.push(temp);
        //     });
        //     this.categoryList = temparray;
        //     console.log(this.categoryList);
        // },
        //获取保养详情
        getDetail() {
            let id = this.$route.query.id || null;
            this.$axios.get(`/maintenanceModel/${id}`).then(res => {
                console.log(res);
                //处理step1 数据
                let {
                    mName,
                    customName,
                    createTime,
                    mMaintenanceLevel,
                    id
                } = res.data;
                this.tplId = id;
                if (typeof createTime == "string") {
                    createTime = createTime.split(" ")[0];
                }
                this.datas = {
                    mName,
                    customName,
                    createTime,
                    mMaintenanceLevel
                };
                //处理 step2的数据
                this.TempData = this.CheckCategoryList =
                    res.data.pmModelElementOptions;
                console.log(res.data.pmModelElementOptions);
            });
        },
        //同步数据方法
        SyncData() {
            console.log(this.categoryList);
            let temparray = [];
            this.categoryList.map(e => {
                let temp;

                if (
                    this.TempData.findIndex(el => {
                        return e.id == el.id;
                    }) != -1
                ) {
                    temp = { ...e, value: true };
                } else {
                    temp = { ...e, value: false };
                }
                temparray.push(temp);
            });
            this.categoryList = temparray;
            console.log(this.categoryList);
        }
    },
    computed: {
        //动态组件名称
        tpl: {
            get() {
                if (this.current < this.list.length) {
                    return `StepTemp${this.current + 1}`;
                }
            }
        },
        //用户信息
        user_in() {
            return this.$store.state.user_in;
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
        CheckCategoryList() {
            this.SyncData();
        }
    }
};
</script>
<style lang="less">
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
        background-color: #a9a8a9;
    }
    span:nth-of-type(2) {
        background-color: #22a1b9;
        border: solid 1px #0c8399;
    }
}
</style>
