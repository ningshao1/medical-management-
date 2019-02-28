<template>
    <div class="em-wrap container-fluid" id='container-fluid'>
        <div class="position-to-title">
            <Button @click="addLowAsset" class="kld-btn" icon="plus" v-if="ViewLimit('pm:lowmeasurement:add')">新增低值设备计量</Button>
        </div>
        <div style="margin-bottom:15px;">
            <div class="search kld-box-effect">
                <Row type="flex" :gutter="10">
                    <i-col>
                        <Input v-model.trim="search.assetName" placeholder="设备名称" style="width:250px;margin-right:15px;" icon="android-search" />
                    </i-col>
                    <!--<i-col>-->
                        <!--<Select v-model="search.mrResult" style="width:250px" placeholder="设备状态">-->
                            <!--<Option :value="0">合格</Option>-->
                            <!--<Option :value="1">不合格</Option>-->
                        <!--</Select>-->
                    <!--</i-col>-->
                    <i-col>
                        <DatePicker :editable="false" v-model="searchStartTime" @on-change="validateTime($event, 'startTime')" format="yyyy-MM-dd" type="date" placeholder="检测时间开始" style="width: 250px"></DatePicker>
                    </i-col>
                    <span style="line-height: 44px;">至</span>
                    <i-col>
                        <DatePicker :editable="false" v-model="searchEndTime" @on-change="validateTime($event, 'endTime')" format="yyyy-MM-dd" type="date" placeholder="检测时间结束" style="width: 250px"></DatePicker>
                    </i-col>
                    <i-col>
                        <Select v-model="search.executingState" style="width:250px;margin-right:15px;" placeholder="计量结果">
                            <Option value="">全部</Option>
                            <Option :value="1">已计量</Option>
                            <Option :value="2">未计量</Option>
                        </Select>
                    </i-col>
                    <i-col>
                        <Button class="kld-btn" @click="getDeviceList" icon="android-search">检索</Button>
                    </i-col>
                    <!--<i-col>-->
                        <!--<Button class="kld-btn" @click="btnReset" icon="android-search">重置</Button>-->
                    <!--</i-col>-->
                </Row>
            </div>
        </div>
        <div class="ael-list-wrap">
            <!-- 左侧科室树 -->
            <div class="ael-list-tree">
                <kld-search-tree placeholder="科室名称搜索" select-class="kld-select">
                    <kld-tree
                            slot="tree"
                            :current.sync="search.departmentId"
                            :data="treeData"
                            title-key="osName"
                            children-key="lists"
                            highlight-current
                            first-expanded
                    ></kld-tree>
                </kld-search-tree>
            </div>
            <!-- 右侧列表 -->
            <div class="ael-list relative">
                <Loading v-if="isLoading"></Loading>
                <kld-table  stripe @on-row-click="rowClick" :columns="listColumns" :data='deviceList' :no-data-text="'暂无数据'"></kld-table>
                <kld-page class="mt-10" @on-change='getDeviceList' :page-size="pageData.size" :total='pageData.total' :current.sync='pageData.current'></kld-page>
            </div>
        </div>
    </div>
</template>

<script>
    import {KldTree, KldSearchTree, KldTable, KldPage} from '@/components';
    import {tableRenderEllipsis} from '@/utils';
    export default {
        name:'low-value-EM',
        components: {
            KldTree,
            KldSearchTree,
            KldPage,
            KldTable
        },
        data() {
            return {
                isLoading:true,
                treeData: [],
                listColumns: [
                    {
                        title: "设备名称",
                        key: "alName",
                        render: tableRenderEllipsis('alName', 'kld-success')
                    },
                    {
                        title:'型号',
                        key:'alClass'
                    },
                    {
                        title: "设备序列号",
                        key: "alOldCode"
                    },
                    {
                        title: "所属科室",
                        key: "alOsName",
                        render: tableRenderEllipsis('alOsName')
                    },
                    {
                        title: '数量',
                        width: 80,
                        key: 'alNumber'
                    },
                    {
                        title: "上次计量时间",
                        width: 114,
                        key: "executionTime"
                    },
                    {
                        title:'计量结果',
                        key:'mrResult',
                        width: 100,
                        render(h,params){
                            return h(
                                'span',params.row[params.column.key]===0?'合格':'不合格'
                            )
                        }
                    },
                    {
                        title:'类型',
                        key:'mtType',
                        width: 80,
                        render(h,params){
                            return h(
                                'span',params.row[params.column.key]===0?'强检':'非强检'
                            )
                        }
                    },
                    {
                        title: '计量周期',
                        width: 84,
                        key: 'mtCycle'
                    },
                    {
                        title: '下次检定日期',
                        width: 114,
                        key: 'nextTime'
                    }
                   
                ],
                deviceList: [],


                searchStartTime: '',
                searchEndTime: '',
                search: {
                    assetName: "",
                    startTime: "",
                    endTime: "",
                    // mrResult: '',
                    departmentId: '',
                    executingState: '',
                },
                pageData: {
                    pageSize: 10,
                    total: 0,
                    current: 1
                }
            };
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.getDeviceList();
            })
        },
        created() {
            this.get_os_info();
            this.getDeviceList();
        },
        computed: {
            user_in() {
                return this.$store.state.user_in;
            }
        },
        watch: {
            search: {
                deep: true,
                handler() {
                    this.isLoading=true;
                    this.pageData.current = 1;
                    this.getDeviceList();
                }
            }
        },

        methods: {
            //重置按钮
            // btnReset(){
            //     this.search={
            //         assetName: "",
            //         startTime: "",
            //         endTime: "",
            //         // mrResult: '',
            //         departmentId: '',
            //     }
            //     this.searchStartTime= '';
            //     this.searchEndTime='';
            // },
            getDeviceList() {
                const data = {
                    limit: this.pageData.pageSize,
                    offset: (this.pageData.current - 1) * 10,
                    params: this.search
                };
                return this.$axios.post('/measurementTask/getAssetLow/list', data)
                    .then(({data: {data, recordsTotal}}) => {
                        this.isLoading=false;
                        this.deviceList = data;
                        this.pageData.total = recordsTotal;
                    }).catch(error=>{
                        this.isLoading=false;
                    });
            },

            //获取树数据
            get_os_info() {
                this.axios
                    .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                    .then(res => {
                        this.treeData = [res.data];
                    });
            },



            //验证搜索时间
            validateTime(date, field) {
                this.search[field] = date;
                if (this.searchStartTime && this.searchEndTime) {
                    const startTime = this.searchStartTime.getTime(),
                        endTime = this.searchEndTime.getTime();
                    
                    if (startTime > endTime) {
                        this.$Message.warning('开始时间不能超过结束时间');
                        if (field === 'startTime') {
                            this.searchStartTime = '';
                        } else {
                            this.searchEndTime = '';
                        }
                    } else {
                        this.search[field] = date;
                    }
                }
            },

            addLowAsset() {
                this.$router.push({name: 'add-EM-low'});
            },
            rowClick(row) {
                if(this.ViewLimit('pm:lowmeasurement:query')){

                    this.$router.push({
                        name: 'lowEM-detail',
                        query: {
                            id: row.id
                        }
                    });
                }else{
                    this.$Message.warning("您没有详情查看权限")
                }
            },
        }
    };
</script>

<style lang="less" scoped>
    .em-wrap {
        .constraint-search {
            height: 86px;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            display: flex;
            align-items: center;
            overflow: hidden;

            // .ivu-input-wrapper {
            //     height: 45px;
            //     width: 200px;
            //     margin: 20px;
            //     .ivu-input {
            //         height: 100%;
            //     }
            // }
            // .ivu-icon {
            //     height: 100%;
            //     line-height: 45px;
            // }
        }
        .ael-list-wrap {
            @wrapWidth: 20.5%;
            @wrapHeight: 882px;
            @wrapSpace: 1%;
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            .ael-list-tree {
                width: @wrapWidth;
                height: @wrapHeight;
                background-color: #fafafa;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
                .select-tree {
                    height: @wrapHeight - 57px;
                    // background-color:#fafafa;
                    overflow: auto;
                }
                .name-search {
                    height: 55px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-bottom: 1px solid #ccd2d7;
                }
                .select-tree {
                    width: 90%;
                    margin: 0 auto;
                }
            }
            .ael-list {
                width: 100% - @wrapSpace - @wrapWidth;
                height: @wrapHeight;
                background-color: #fafafa;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
            }
        }
    }
</style>
