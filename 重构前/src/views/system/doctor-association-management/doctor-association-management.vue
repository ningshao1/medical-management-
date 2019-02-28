<template>
    <div class="doctor-association-wrap">
        <div class="item-title">
            <span>医生关联管理</span>
        </div>
        <div class="item-content">
            <div class="doctors-list">
                <div class='doctors-list-title'>
                    医生列表
                </div>
                <div class="doctors-list-content">
                    <div class='list-content-search'>
                        <i-input class="kld-input" placeholder="关键字查找" icon="ios-search-strong" @on-change='searchChange'></i-input>
                    </div>
                    <ul class="list-content-ul">
                        <li :class="{'list-content-li':true,'list-content-li-active':v.uId===doctor.currentId}" v-for='(v,i) of doctor.list' :key='i' @click="getDoctorLinked(v)">
                            <p class='single-doctor-name'>{{v.uName}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="department-tree">
                <div class='department-tree-title'>
                    关联科室
                </div>
                <div class="department-tree-content">
                    <div class="department-tree-wrap">
                        <Loading v-if="loading"></Loading>
                        <kld-search-tree
                                placeholder="请输入科室名称"
                                select-wrap-styles="padding: 0"
                                select-styles="width: 300px; position: absolute; right: -12px;top: -116px;"
                        >
                            <kld-tree
                                    slot="tree"
                                    class="department-tree-self"
                                    :data='treeData'
                                    ref="kld-tree"
                                    show-checkbox
                                    v-model='doctor.linked'
                                    title-key="osName"
                                    children-key="lists"
                                    include-half-checked
                                    first-expanded
                            ></kld-tree>
                        </kld-search-tree>
                    </div>
                </div>
                <div class="department-tree-icon">
                    <i-button type="primary" @click="saveLinked">确定</i-button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import KldTree from '@common/kld-tree';
import KldSearchTree from '@common/kld-search-tree';
import kldConfirm from "@common/kld-confirm";
export default {
    name: "doctor-association-management",
    components: {
        KldTree, KldSearchTree
    },
    data() {
        return {
            doctor: {
                list: [],
                originList: [],
                currentId: null,
                linked: []
            },
            treeData: [],
            loading: false
        };
    },
    created() {
        this.getOriginData();
    },
    computed: {
        userInfo() {
            return this.$store.state.user_in;
        }
    },
    methods: {
        //医生名称搜索
        searchChange(e) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                let filterItem = e.target.value.toLocaleLowerCase();
                if (!filterItem) {
                    this.doctor.list = this.doctor.originList;
                    return;
                }
                this.doctor.list = this.doctor.originList.filter(v => {
                    return (
                        v.uName.toLocaleLowerCase().indexOf(filterItem) !== -1
                    );
                });
            }, 200);
        },

        //获得初始值
        getOriginData() {
            Promise.all([this.getDoctorLists(), this.getDepartmentTree()]).then(
                res => {
                    this.initPaga();
                }
            );
        },
        //初始化默认页面内容
        initPaga() {
            if (
                this.doctor.list.length &&
                this.doctor.list[0] &&
                this.doctor.list[0].uId
            ) {
                this.doctor.currentId = this.doctor.list[0].uId;
                this.getDoctorLinked(this.doctor.list[0]);
            }
        },
        //获得所有医生名单列表
        getDoctorLists() {
            return this.$axios
                .get(`/doctorAllots/listDoctors?osId=${this.userInfo.osId}`)
                .then(res => {
                    this.doctor.list = res.data;
                    this.doctor.originList = JSON.parse(
                        JSON.stringify(res.data)
                    );
                });
        },
        //获得科室树信息
        getDepartmentTree() {
            return this.$axios
                .get(`/orgstruct/findAllTrees/${this.userInfo.osId}`)
                .then(res => {
                    this.treeData = [res.data];
                });
        },
        //获得当前医生关联科室
        getDoctorLinked(info) {
            this.doctor.currentId = info.uId;
            this.loading = true;
            this.$axios
                .get(`/doctorAllots/doctorsOsIds?uId=${this.doctor.currentId}`)
                .then(res => {
                    this.$nextTick(() => {
                        this.doctor.linked = this.doctorLinkedFilter(res.data);
                    });
                })
                .finally(() => this.loading = false);
        },
        //获得当前医生关联科室的末级科室
        doctorLinkedFilter(list) {
            return list.filter(v => {
                let node = this.$refs['kld-tree'].getNode(v);
                return !(node && node.childNodes && node.childNodes.length);
            });
        },
        //保存新的科室关联树
        saveLinked() {
            kldConfirm({
                title: "关联提示",
                content: "确认保存该关联？",
                ok: () => {
                    this.doSaveLinked();
                }
            });
        },
        //保存新的科室关联树
        doSaveLinked() {
            this.$axios.post(`/doctorAllots/save`, {
                userId: this.doctor.currentId,
                departmentIds: this.doctor.linked,
                hosId: this.userInfo.osId
            }).then(res=>{
                this.$Message.success('成功修改医生关联科室')
            });
        }
    }
};
</script>

<style lang="less" scoped>
.doctor-association-wrap {
    width: 100%;
    height: 705px;
    position: relative;
    .item-title {
        width: 100%;
        height: 40px;
        margin-bottom: 20px;
        border-bottom: 1px solid#ccd2d7;
        font-size: 20px;
        font-weight: 400;
        color: #333333;
        display: flex;
        justify-content: space-between;
    }
    .item-content {
        width: 100%;
        height: calc(~"100% - 60px");
        position: relative;
        display: flex;
        @listWidth: 20%;
        @titleHeight: 45px;
        .doctors-list {
            height: 100%;
            width: @listWidth;
            border:1px solid rgb(220, 224, 230);
            .doctors-list-title {
                width: 100%;
                height: @titleHeight;
                padding: 20px 0 0 20px;
                font-size: 15px;
                color: rgb(51, 51, 51);
                font-weight: 600;
                border-bottom: 1px solid rgb(220, 224, 230);
            }
            .doctors-list-content {
                height: calc(~"100% - 45px");
                padding-top: 50px;
                position: relative;
                .list-content-search {
                    padding: 2px 5px;
                    position: absolute;
                    height: 50px;
                    width: 100%;
                    top: 0;
                    right: 0;
                }
                .list-content-ul {
                    height: 100%;
                    overflow: auto;
                    .list-content-li {
                        height: 56px;
                        cursor: pointer;
                        border-bottom: 1px solid rgb(220, 224, 230);
                        display: flex;
                        align-items: center;
                        padding-left:20px; 
                        .single-doctor-name{
                            font-size: 14px; 
                        }
                        &:hover{
                            background-color:#fff; 
                            color:#01b0c7;
                        border-left: solid 3px #01b0c7;
                        }
                    }
                    .list-content-li-active {
                        background-color: #f5f6fa !important;
                        border-left: solid 3px #01b0c7;
                    }
                }
            }
        }
        .department-tree {
            height: 100%;
            width: 100% - @listWidth;
            border:1px solid rgb(220, 224, 230);
            border-left: none;
            .department-tree-title {
                width: 100%;
                height: @titleHeight;
                padding: 20px 0 0 20px;
                font-size: 15px;
                color: rgb(51, 51, 51);
                font-weight: 600;
                border-bottom: 1px solid rgb(220, 224, 230);
            }
            .department-tree-content{
                height: calc(~'100% - 95px');
                width: 100%;
                padding: 10px;
                .department-tree-wrap{
                    position: relative;
                    /*overflow: auto;*/
                    border:1px solid rgb(220, 224, 230);
                    height: 100%;
                }
                /deep/.department-tree-self{
                    border-radius: 4px;
                    background-color: transparent;
                }
            }
            .department-tree-icon{
                height: 50px;
                width: 100%;
                background-color: #f5f6fa;
                display: flex;
                padding-right:20px; 
                align-items: center;
                justify-content: flex-end;

            }
        }
    }
}
</style>
