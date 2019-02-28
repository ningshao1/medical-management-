<template>
    <div id="addOneTemplate">
        <div class="step_bg">
            <steps :current='current' :data='list'></steps>
        </div>
        <div class='step_content'>
            <!-- <StepTemp1 :value.sync='datas'></StepTemp1> -->
            <keep-alive>
                <component :is="tpl" :value.sync='datas' @showModal='getshow' @getCheck='getCheck' :CheckCategoryList='CheckCategoryList' @delC='del_'></component>
            </keep-alive>
            <div class='step_bottom'>
                <span @click='pre_'>{{preContent}}</span>
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

export default {
    data() {
        return {
            datas: {
                mName: "",
                mMaintenanceLevel: 1,
                customName: this.$store.state.user_in.loginName,
                createTime: this.time_(Date.now())
            }, //第一步信息
            list: ["填写基本信息", "添加保养元素"], //步骤信息
            current: 0, //控制步骤
            preContent: "取消",
            nextContent: "下一步",
            Model: {
                show: false
            },
            categoryList: [],
            TempData: [], //临时储存被选中的数据
            CheckCategoryList: [] //被选择的类别总和
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
    },
    methods: {
        //下一步
        next() {
            ++this.current;
            if (this.current >= this.list.length) {
                this.$route.push(""); //填写完成时跳转
            }
        },
        pre_() {
            if (this.current <= 0) {
                this.$route.push(""); //不填写时跳转
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
        },
        //获取第三步弹窗类别
        getElements(e) {
            this.$axios
                .get(`/maintenanceType/${this.user_in.osId}/list`)
                .then(res => {
                    if (res.data instanceof Array) {
                        this.categoryList = res.data;
                    } else if (res.data instanceof Object) {
                        this.categoryList.push(res.data);
                    }
                })
                .catch(e => {
                    if (e.code == "403") {
                        this.$Message.warning("对不起，您没有权限获取类别列表");
                    }
                });
        },
        selectCategory(e) {
            this.TempData = e.allTrue;
        },
        ok_() {
            this.CheckCategoryList = this.TempData;
        },
        //删除方法
        del_() {
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
    >span{
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
