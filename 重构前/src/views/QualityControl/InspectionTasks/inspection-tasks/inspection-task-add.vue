<template>
    <div class="inspection-task-add kld-box-effect">
        <Form :model="formData" :rules="routeType === 'add' ? taskFormRules : {}" ref="taskForm" label-position="top">
            <p class="detail-title">基础信息</p>
            <Row :gutter="20" class="mt26">
                <i-col :span="8">
                    <FormItem label="任务名称：" prop="name">
                        <i-input :disabled="routeType === 'details'" v-model.trim="formData.name" class="kld-input" placeholder="请填写任务名称"></i-input>
                    </FormItem>
                </i-col>
                <i-col :span="8">
                    <FormItem label="制定人：">
                        <poptip-show-info :info-id="routeType === 'add' ? user_in.id : formData.customId" width="100%">
                            <i-input :value="routeType === 'add' ? user_in.name : formData.customName" class="kld-input" disabled></i-input>
                        </poptip-show-info>
                    </FormItem>
                </i-col>
                <i-col :span="8">
                    <FormItem label="制定时间：">
                        <i-input v-if="routeType === 'add'" :value="moment().format('YYYY-MM-DD')" class="kld-input" disabled></i-input>
                        <i-input v-else :value="moment(formData.createTime).format('YYYY-MM-DD')" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <div class="mt26">
                <FormItem label="巡检科室：" prop="sectionIds">
                    <div v-if="routeType === 'add'" class="inspection-section">
                        <div class="selected-section" @click="sectionModalShow = true">
                            <Tag v-for="(section, index) in sectionTreeConfirmChecked" @on-close="selectedSectionClose" :name="index" :key="section.id" type="border" closable>{{section.osName}}</Tag>
                        </div>
                        <Button @click="sectionModalShow = true" class="kld-btn" icon="plus">添加科室</Button>
                    </div>
                    <template v-else>
                        <div v-for="(section, index) in sectionTreeConfirmChecked" :key="index" class="inspection-section-item">{{section.title}}</div>
                    </template>
                </FormItem>
            </div>
            <p class="detail-title">执行期数</p>
            <Row :gutter="20" class="mt26">
                <i-col :span="12">
                    <FormItem label="执行年度：" prop="syear">
                        <Select v-if="routeType === 'add'" v-model="formData.syear" class="kld-select" placeholder="请选择执行年度">
                            <Option :value="currentYear + ''">{{currentYear}}年</Option>
                            <Option v-for="i in 20" :value="currentYear + i + ''" :key="i">{{currentYear + i}}年</Option>
                        </Select>
                        <i-input v-else :value="formData.syear" disabled class="kld-input"></i-input>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="周期：" prop="cycle">
                        <div class="execution-cycle">
                            <Select v-if="routeType === 'add'" v-model="formData.cycle" class="kld-select" placeholder="请选择周期">
                                <Option :value="1">1</Option>
                                <Option :value="2">2</Option>
                                <Option :value="3">3</Option>
                                <Option :value="6">6</Option>
                                <Option :value="12">12</Option>
                            </Select>
                            <i-input v-else :value="formData.cycle" disabled class="kld-input"></i-input>
                            <span>月</span>
                        </div>
                    </FormItem>
                </i-col>
            </Row>
            <div v-if="formData.pmTasks.length > 0" class="inspection-plain mt26">
                <template v-if="routeType === 'add'">
                    <Row v-for="(item, index) in formData.pmTasks" :key="index" class="inspection-plain-row" type="flex" justify="space-between" align="middle">
                        <i-col class="inspection-plain-col inspection-plain-col-300">
                            <strong class="cycle-primary">第{{item.periods | numToLocale}}期</strong>
                            <span>({{item.startTime}} 至 {{item.endTime}})</span>
                        </i-col>
                        <i-col class="inspection-plain-col">
                            <FormItem>
                                <div class="inspection-plain-label">
                                    <span><span class="kld-error">*</span>执行人：</span>
                                    <!--<poptip-show-info :info-id="item.executorId">-->
                                        <Select v-model="item.executorId" class="kld-select" placeholder="请选择执行人">
                                            <Option v-for="{id, name} in engineerList" :key="id" :value="id">{{name}}</Option>
                                        </Select>
                                    <!--</poptip-show-info>-->
                                </div>
                            </FormItem>
                        </i-col>
                        <i-col class="inspection-plain-col">
                            <div class="inspection-plain-label">
                                <span><span class="kld-error">*</span>执行时间段：</span>
                                <DatePicker :editable="false"
                                            format="yyyy-MM-dd"
                                            :value="item.executeStartTime"
                                            @on-change="item.executeStartTime = $event"
                                            class="kld-date-picker"
                                            placeholder="开始时间"
                                ></DatePicker>
                                <span class="p0-10">至</span>
                                <DatePicker :editable="false"
                                            format="yyyy-MM-dd"
                                            :value="item.executeEndTime"
                                            @on-change="item.executeEndTime = $event"
                                            class="kld-date-picker"
                                            placeholder="结束时间"
                                ></DatePicker>
                            </div>
                        </i-col>
                    </Row>
                </template>
                <template v-else>
                    <Row v-for="(item, index) in formData.pmTasks" :key="index" class="inspection-plain-row" type="flex" align="middle" >
                        <i-col :span="2">
                            <kld-tag v-if="item.status == 0" type="default">未开始</kld-tag>
                            <kld-tag v-else-if="item.status == 1" type="warning">执行中</kld-tag>
                            <kld-tag v-else-if="item.status == 2" type="success">已完成</kld-tag>
                            <kld-tag v-else-if="item.status == 3" type="purple">未完成</kld-tag>
                            <kld-tag v-else-if="item.status == 4" type="error">逾期</kld-tag>
                        </i-col>
                        <i-col :span="5" class="inspection-plain-col">
                            <strong class="cycle-primary">第{{item.periods | numToLocale}}期</strong>
                            <span>({{item.startTime}} 至 {{item.endTime}})</span>
                        </i-col>
                        <i-col :span="5" class="inspection-plain-col">
                            <div v-if="item.periods !== plainAllowEditIndex" class="inspection-plain-label">
                                <span>执行人：</span>
                                <poptip-show-info :info-id="item.executorId">
                                    <span class="cycle-primary">{{item.executorName}}</span>
                                </poptip-show-info>
                            </div>
                            <div v-else class="inspection-plain-label">
                                <span>执行人：</span>
                                <!--<poptip-show-info :info-id="currentPlainFormData.executorId">-->
                                    <Select v-model="currentPlainFormData.executorId" class="kld-select" placeholder="请选择执行人">
                                        <Option v-for="{id, name} in engineerList" :key="id" :value="id">{{name}}</Option>
                                    </Select>
                                <!--</poptip-show-info>-->
                            </div>
                        </i-col>
                        <i-col :span="9" class="inspection-plain-col">
                            <div v-if="item.periods !== plainAllowEditIndex" class="inspection-plain-label">
                                <span>执行时间段：</span>
                                <span class="kld-success">{{item.executeStartTime}}</span>
                                <span class="p0-10">至</span>
                                <span class="kld-success">{{item.executeEndTime}}</span>
                            </div>
                            <div v-else class="inspection-plain-label">
                                <span>执行时间段：</span>
                                <DatePicker :editable="false"
                                            format="yyyy-MM-dd"
                                            :value="currentPlainFormData.executeStartTime"
                                            @on-change="currentPlainFormData.executeStartTime = $event"
                                            class="kld-date-picker"
                                            placeholder="开始时间"
                                ></DatePicker>
                                <span class="p0-10">至</span>
                                <DatePicker :editable="false"
                                            format="yyyy-MM-dd"
                                            :value="currentPlainFormData.executeEndTime"
                                            @on-change="currentPlainFormData.executeEndTime = $event"
                                            class="kld-date-picker"
                                            placeholder="结束时间"
                                ></DatePicker>
                            </div>
                        </i-col>
                        <i-col :span="3" class="inspection-plain-control">
                            <template v-if="item.periods === plainAllowEditIndex">
                                <a href="javascript:" :disabled="submitLoading" @click="plainEditConfirm" key="confirm">确认</a>
                                <a href="javascript:" @click="plainEditCancel(item)" key="cancel">取消</a>
                            </template>
                            <template v-else>
                                <a v-if="moment().valueOf() < moment(item.startTime).valueOf() && editTaskLimit" href="javascript:" @click="plainEdit(item)" key="edit">编辑</a>
                                <a href="javascript:" @click="checkPlainDetails(item)" key="details">查看详情</a>
                            </template>
                            <a v-if="delTaskLimit && ! [2, 4].includes(item.status)" @click="deleteTask(item.id)" href="javascript:">删除</a>
                        </i-col>
                    </Row>
                </template>
            </div>
            <div class="kld-form-footer">
                <Button v-if="routeType === 'add'" :loading="submitLoading" @click="formDataSubmit" class="kld-btn">确定</Button>
                <Button @click="cancelSubmit" class="kld-btn-default" v-if="routeType === 'add'">取消</Button>
                <Button @click="goBack" class="kld-btn-default" v-else>返回</Button>
            </div>
        </Form>
        <Modal
                v-model="sectionModalShow"
                title="选择科室"
                @on-cancel="sectionModalCancel"
                v-if="routeType === 'add'"
                class-name="vertical-center-modal"
                width="auto"
        >
            <div class="section-modal">
                <Loading v-if="sectionTreeLoading"></Loading>
                <div class="section-modal-tree section-modal-wrap">
                    <div class="section-modal-title">科室列表 <span class="cycle-error">(所选科室数{{sectionTreeChecked.length}}个)</span></div>
                    <div class="section-modal-content">
                        <kld-search-tree
                                placeholder="请输入科室名称"
                                select-wrap-styles="padding: 12px; border-bottom: 1px solid rgba(2,31,57,0.1);"
                                tree-wrap-styles="padding: 12px"
                        >
                            <kld-tree
                                    slot="tree"
                                    v-model="sectionTreeChecked"
                                    :data="sectionTreeData"
                                    value-type="node"
                                    title-key="osName"
                                    children-key="lists"
                                    show-checkbox
                                    only-leaf
                                    :default-expanded-keys="defaultExpandedKeys"
                                    ref="kld-tree"
                                    :disables="noTemSection"
                            ></kld-tree>
                        </kld-search-tree>
                    </div>
                </div>
                <div class="section-modal-result section-modal-wrap">
                    <div class="section-modal-title">选择设备 <span class="cycle-error">{{assetModalSubTitle}}</span></div>
                    <!--<div class="section-modal-title">选择设备 <span class="cycle-error">(所选设备数{{assetChecked.length}}个)</span></div>-->
                    <div class="section-modal-content">
                        <!--<Tag v-for="(section, index) in sectionTreeChecked" :name="index" :key="section.id" @on-close="sectionTreeTagClose" type="border" closable>{{section.osName}}</Tag>-->
                        <div class="section-modal-search">
                            <Form :model="assetSearchData" ref="asset-search-form">
                                <Row :gutter="20">
                                    <i-col span="24">
                                        <FormItem prop="keyword">
                                            <i-input v-model="assetSearchData.keyword" placeholder="设备名称/序列号/型号"></i-input>
                                        </FormItem>
                                    </i-col>
                                    <!--<i-col span="12">-->
                                        <!--<FormItem prop="labelType">-->
                                            <!--<Select v-model="assetSearchData.labelType" placeholder="标签状态">-->
                                                <!--<Option value="">全部</Option>-->
                                                <!--<Option :value="1">已贴</Option>-->
                                                <!--<Option :value="2">未贴</Option>-->
                                            <!--</Select>-->
                                        <!--</FormItem>-->
                                    <!--</i-col>-->
                                </Row>
                            </Form>
                        </div>
                        <div style="position: relative;">
                            <Loading v-if="assetTableLoading"></Loading>
                            <kld-table
                                    :selected.sync="assetChecked"
                                    :data="showAssetList"
                                    :columns="assetColumns"
                            ></kld-table>
                            <div class="table-page">
                                <kld-page
                                        :current.sync="assetPage.current"
                                        :total="assetPage.total"
                                        :page-size="assetPage.pageSize"
                                ></kld-page>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template slot="footer">
                <Button @click="sectionModalCancel" class="kld-btn-default">取消</Button>
                <Button @click="sectionModalConfirm" class="kld-btn">确认</Button>
            </template>
        </Modal>
    </div>
</template>

<style lang="less" scoped>
    @import "~@inspection-common/varible";
    .mt26{
        margin-top: 26px;
    }
    .p0-10{
        padding: 0 10px;
    }
    .cycle-primary{
        color: #0c8399;
    }
    .cycle-error{
        color: @color-error;
    }
    .inspection-task-add{
        padding: 0 30px 30px 30px;
        font-size: 14px;
        .detail-title{
            color: #f2740c;
            border-bottom: 1px solid @border-color;
            padding: 16px 0;
        }
        .inspection-section{
            display: flex;
            .kld-btn{
                margin-left: 20px;
            }
            .selected-section{
                min-height: 44px;
                border: 1px solid rgba(2,31,57,.1);
                border-radius: 4px;
                flex: 1;
                background-color: #fff;
                padding: 4px 7px;
            }
        }
        .ivu-form-item-error{
            .selected-section{
                border: 1px solid #ed3f14 !important;
            }
        }
        .inspection-section-item{
            padding: 0 12px;
            line-height: 42px;
            border-radius: 4px;
            height: 44px;
            border: 1px solid rgba(2,31,57,.1);
            margin-right: 10px;
            margin-bottom: 10px;
            background-color: #f5f6fa;
            display: inline-block;
            vertical-align: top;
        }
        .execution-cycle{
            display: flex;
            .kld-select{
                /deep/.ivu-select-selection{
                    border-radius: 4px 0 0 4px;
                }
            }
            /deep/.ivu-input{
                border-radius: 4px 0 0 4px;
            }
            span{
                width: 44px;
                height: 44px;
                line-height: 44px;
                text-align: center;
                background: #f5f6fa;
                border-radius: 0 4px 4px 0;
                border: solid 1px rgba(2, 31, 57, 0.1);
                border-left: 0;
            }
        }
        .inspection-plain{
            border: 1px solid @border-color;
            background-color: #fff;
            .inspection-plain-row{
                height: 60px;
                padding: 0 30px;
                border-bottom: 1px solid @border-color;
                &:last-of-type{
                    border-bottom: 0;
                }
            }
            .inspection-plain-label{
                display: flex;
                align-items: center;
                span{
                    flex-shrink: 0;
                }
            }
            .kld-select,.kld-input,.kld-date-picker{
                width: 200px;
            }
        }
        .kld-form-footer{
            .kld-btn{
                margin-left: 10px;
            }
        }
        .inspection-plain-col-300{
            width: 300px;
        }
        .inspection-plain-control{
            text-align: right;
            a{
                margin-right: 20px;
                &:last-of-type{
                    margin-right: 0;
                }
            }
        }
    }
    .section-modal{
        display: flex;
        justify-content: center;
        .section-modal-wrap{
            border: solid 1px #c8ced3;
            border-radius: 4px;
            overflow: hidden;
        }
        .section-modal-title{
            background-color: #eaeaea;
            color: #666;
            padding: 10px;
            line-height: 1;
        }
        .section-modal-content{
            height: 570px;
        }
        .section-modal-search{
            padding: 12px;
            border-bottom: 1px solid @border-color;
        }

        .section-modal-tree{
            width: 270px;
            margin-right: 10px;
        }
        .section-modal-result{
            width: 800px;
            /deep/.ivu-tag-border{
                height:auto;
                padding-right: 29px;
                .ivu-icon-ios-close-empty{
                    position: absolute;
                    right: 9px;
                    top: 50%;
                    margin-top: -7px;
                }
            }

            .section-modal-content{
                overflow-y: auto;
            }
            /deep/.ivu-table{
                &::before,&::after{
                    display: none;
                }
            }

            .table-page{
                padding: 20px 0;
            }
        }
    }
</style>

<script type="text/jsx">
    import kldTag from '@inspection-common/kld-tag.vue';
    import kldTree from '@common/kld-tree';
    import moment from 'moment';
    import poptipShowInfo from '@common/poptip-show-info';
    import {KldTable, KldSearchTree, KldPage} from '@/components';
    import {uniq, numberToLocale as numToLocale, kldConfirm as confirm, tableRenderEllipsis} from '@/utils';
    const transformSectionData = (data, skips = [], dels = []) => {
        const result = [];
        for (const item of data) {
            const {lists: children, id} = item;

            if (children && children.length > 0) {
                item.id = Math.random().toString();

                if (! skips.includes(id) && ! dels.includes(id)) {
                    children.unshift({
                        osName: item.osName,
                        id,
                        pId: item.pId
                    });
                }

                item.lists = transformSectionData(children, skips, dels);
            } else {
                if (dels.includes(id)) {
                    continue;
                }
            }
            result.push(item);
        }

        return result;
    };

    const getDisiableds = (data, noDisableds) => {
            let result = [];
            for (const item of data) {
                if (item.lists && item.lists.length > 0) {
                    result = result.concat(getDisiableds(item.lists, noDisableds));
                } else {
                    const index = noDisableds.indexOf(item.id);
                    if (index === -1) {
                        result.push(item.id);
                    } else {
                        noDisableds.splice(index, 1);
                    }
                }
            }

            return result;
        },
        copy = data => JSON.parse(JSON.stringify(data));

    export default {
        name: "inspection-task-add",
        components: {
            kldTag,
            kldTree,
            KldSearchTree,
            KldPage,
            poptipShowInfo,
            KldTable
        },
        data() {
            return {
                submitLoading: false,
                formData: {
                    sectionIds: [],
                    assetIds: [],
                    name: '',
                    cycle: '',
                    syear: '',
                    pmTasks: [
                        // {
                        //     startTime: '',
                        //     endTime: '',
                        //     executeStartTime: '',
                        //     executeEndTime: '',
                        //     executorId: '',
                        //     periods: '',
                        // }
                    ]
                },
                engineerList: [],
                currentYear: new Date().getFullYear(),
                taskFormRules: {
                    name: {required: true, message: '任务名称为必填'},
                    syear: {required: true, message: '执行年度为必选'},
                    cycle: {required: true, message: '周期为必选'},
                    sectionIds: {required: true, validator(rule, value, callback) {
                            if (value.length === 0) {
                                callback(new Error('科室为必选'));
                            } else {
                                callback();
                            }
                        }
                    },
                },

                currentPlainFormData: {},

                sectionModalShow: false,
                sectionTreeData: [],
                sectionTreeChecked: [],
                sectionTreeConfirmChecked: [],
                sectionTreeLoading: false,
                assetChecked: [],
                assetCheckedConfirm: [],
                assetListCache: [],
                assetColumns: [
                    {type: 'selection', width: 60},
                    {title: '设备名称', render: tableRenderEllipsis('assetName')},
                    {title: '所属科室', render: tableRenderEllipsis('osName')},
                    {title: '设备分类', render: tableRenderEllipsis('typeName')},
                    {title: '设备分类是否关联模板', width: 162, render: (h, {row: {modelId}}) => <span>{modelId ? '是' : '否'}</span>},
                    // {title: '资产标签', width: 100, render: (h, {row: {assetLabelType}}) => <span>{['已贴', '未贴'][assetLabelType - 1]}</span>}
                ],
                assetPage: {
                    current: 1,
                    total: 0,
                    pageSize: 8,
                },
                assetTableLoading: false,
                assetSearchData: {
                    labelType: '',
                    keyword: ''
                },

                routeType: '',
                taskId: '',
                plainAllowEditIndex: -1,
                noTemSection: []
            };
        },
        created() {
            this.buildSectionTree();
            this.getEngineerList();

            switch (this.$route.name) {
                case 'inspection-task-add':
                    this.routeType = 'add';
                    this.formData.syear = this.currentYear.toString();


                    this.$watch('sectionTreeConfirmChecked', checked => {
                        this.formData.sectionIds = checked.map(checked => checked.id);
                        this.$refs.taskForm.validateField('sectionIds');
                    });
                    break;
                case 'inspection-task-details':
                    this.routeType = 'details';
                    this.taskId = this.$route.query.id;
                    this.getDetails();
            }

            this.$nextTick(this.tableSelectInit);
        },
        filters: {
            numToLocale
        },
        computed: {
            user_in() {
                return this.$store.state.user_in;
            },

            //编辑任务权限
            editTaskLimit() {
                return this.checkLimit('pm:inspection:task:edit');
            },

            //删除任务权限
            delTaskLimit() {
                return this.checkLimit('pm:inspection:task:del');
            },

            defaultExpandedKeys() {
                const {sectionTreeData} = this;
                if (sectionTreeData.length > 0) {
                    return [sectionTreeData[0].id];
                }
            },

            noTypeAssets() {
                return this.assetListCache.filter(({typeName}) => ! typeName);
            },
            noModelAssets() {
                return this.assetListCache.filter(({modelId}) => ! modelId);
            },
            noLabelAssets() {
                return this.assetListCache.filter(({assetLabelType}) => assetLabelType === 2);
            },
            assetModalSubTitle() {
                const {assetListCache, assetChecked, noTypeAssets, noModelAssets, noLabelAssets} = this;
                return `(
                        共${assetListCache.length}台设备，
                        已选择${assetChecked.length}台
                        ${noLabelAssets.length ? `，${noLabelAssets.length}台设备没有贴标签` : ''}
                        ${noTypeAssets.length ? `，${noTypeAssets.length}台没有设备分类` : ''}
                        ${noModelAssets.length ? `，${noModelAssets.length}台设备分类没有关联模版` : ''}
                    )`
                    .replace(/\s/g, '');
            },



            assetList() {
                const {assetListCache, assetSearchData: {keyword, labelType}} = this;

                return assetListCache
                    .filter(
                        ({assetName, assetClass, assetSN, assetLabelType}) => {
                            const keywordResult = assetName.includes(keyword) || assetClass.includes(keyword) || assetSN.includes(keyword);

                            const labelTypeResult = labelType ? labelType === assetLabelType : true;

                            return keywordResult && labelTypeResult;
                        }
                    )
                    .sort((prev, next) => {
                        const prevValue = prev.modelId ? 1 : 0,
                            nextValue = next.modelId ? 1 : 0;

                        return nextValue - prevValue;
                    });
            },

            showAssetList() {
                const {assetList, assetPage: {current, pageSize}} = this;
                return assetList.slice(
                    (current - 1) * pageSize,
                    current * pageSize
                );
            }
        },
        watch: {
            'formData.cycle'() {
                this.routeType === 'add' && this.updatePMTasks();
            },
            'formData.syear'() {
                this.routeType === 'add' && this.updatePMTasks();
            },
            sectionTreeChecked(section) {
                this.getAssetListBySectionIds(section.map(item => item.id));
            },

            assetCheckedConfirm(assets) {
                this.formData.assetIds = assets.map(({id}) => id);
            },
            assetList(assetList) {
                this.assetPage.total = assetList.length;
                this.assetPage.current = 1;

                this.assetChecked = assetList.filter(({modelId}) => modelId);

                if (! this.sectionModalShow) {
                    this.assetCheckedConfirm = copy(this.assetChecked);
                }
            }
        },
        methods: {
            async getAssetListBySectionIds(sectionIds) {
                if (sectionIds.length === 0) {
                    this.assetListCache = [];
                } else {
                    this.assetTableLoading = true;
                    try {
                        const {data} = await this.$axios.post('/assets/getAssetBySectionIds', {
                            type: 1,
                            sectionIds
                        });
                        this.assetListCache = data;
                    } finally {
                        this.assetTableLoading = false;
                    }
                }
            },

            //生成科室树的数据
            buildSectionTree() {
                this.sectionTreeLoading = true;
                return Promise.all([
                    this.getSection(),
                    this.getNoAssetSection(),
                    this.getNoTemAssetSection()
                ])
                    .then(
                        ([section, noAsset, noTem]) => {
                            this.noTemSection = noTem;
                            this.sectionTreeData = transformSectionData([section], [this.user_in.osId], noAsset);
                        }
                    )
                    .finally(() => {
                        this.sectionTreeLoading = false;
                    })
            },

            //获取科室
            getSection() {
                return this.axios.get(`orgstruct/findAllTree/${this.user_in.osId}`)
                    .then(({data}) => data);
            },


            //获取没有资产的科室
            async getNoAssetSection() {
                const {data} = await this.$axios.get(`/orgstruct/getAssetCountIsNull?hosId=${this.user_in.osId}`);
                return data;
            },
            //
            // //获取没有任务的科室
            // getNoTaskSection() {
            //     return this.$axios.get(`/orgstruct/getTaskCount?hosId=${this.user_in.osId}&type=1`);
            // },
            //获取没有模板的科室
            async getNoTemAssetSection() {

                const
                    {user_in: {osId}} = this,
                    {data} = await this.$axios.get(`/orgstruct/getModelCountIsNull`, {
                        params: {
                            hosId: osId,
                            type: 1
                        }
                    });

                const index = data.indexOf(osId);

                if (index !== -1) {
                    data.splice(index, 1);
                }

                return data;
            },

            //获取工程师列表
            getEngineerList() {
                return this.$axios
                    .get(`/orgstruct/getEngineers/${this.user_in.osId}`)
                    .then(({data}) => (this.engineerList = data));
            },

            //获取巡检详情
            getDetails() {
                return this.$axios.get(`/inspectionSchedule/${this.taskId}`)
                    .then(({data}) => {
                        if (data) {
                            this.formData = data;
                            this.sectionTreeConfirmChecked = data.sysOrgstructVos.map(
                                item => ({title: item.osName})
                            );
                        } else {
                            this.goBack();
                        }
                    });
            },

            //选择科室后确定
            sectionModalConfirm() {
                const {assetChecked} = this;
                if (assetChecked.length === 0) {
                    this.$Message.warning('请选择设备');
                } else if (assetChecked.find(
                    ({modelId}) => modelId === null
                )) {
                    this.$Message.warning('所选设备中包含未关联模板的分类');
                } else {
                    this.sectionTreeConfirmChecked = JSON.parse(JSON.stringify(this.sectionTreeChecked));
                    this.assetCheckedConfirm = JSON.parse(JSON.stringify(assetChecked));

                    this.assetPage.current = 1;
                    this.sectionModalShow = false;
                }
            },
            //选择科室后取消
            sectionModalCancel() {
                const lastAssetChecked = copy(this.assetCheckedConfirm),
                    unwatch = this.$watch('assetListCache', () => {
                        this.assetCheckedConfirm = lastAssetChecked;
                        this.assetChecked = copy(lastAssetChecked);
                        unwatch();
                    });

                this.sectionTreeChecked = this.sectionTreeConfirmChecked;

                this.assetPage.current = 1;
                this.sectionModalShow = false;
                this.$refs['asset-search-form'].resetFields();
            },

            //已经被选择的科室标签 点击关闭
            selectedSectionClose(event, index) {
                this.sectionTreeConfirmChecked.splice(index, 1);
                this.sectionTreeChecked = copy(this.sectionTreeConfirmChecked);
            },

            //跳转到计划的每一期的详情
            checkPlainDetails(plain) {
                this.$router.push({
                    name: 'inspection-task-stage-details',
                    query: {
                        id: plain.id,
                        status: plain.status,
                        startTime: plain.startTime,
                        endTime: plain.endTime,
                        periods: plain.periods,
                        executeStartTime: plain.executeStartTime,
                        executeEndTime: plain.executeEndTime,
                        executorName: plain.executorName,
                        executorId: plain.executorId,
                        sectionIds: this.formData.sectionIds
                    }
                });
            },


            //查看详情时每一期的小计划编辑按钮
            plainEdit(plain) {
                this.plainAllowEditIndex = plain.periods;
                this.currentPlainFormData = {...plain};
            },
            //查看详情时每一期的小计划编辑确定按钮
            plainEditConfirm() {
                if (this.validPlainsDate(this.currentPlainFormData)) {
                    this.submitLoading = true;
                    this.$axios.put('/inspectionSchedule/updateTask', {
                        id: this.currentPlainFormData.id,
                        executeStartTime: this.currentPlainFormData.executeStartTime,
                        executeEndTime: this.currentPlainFormData.executeEndTime,
                        executorId: this.currentPlainFormData.executorId
                    })
                        .then(() => {
                            this.$Message.success('巡检计划编辑成功');
                            this.plainAllowEditIndex = -1;
                            this.getDetails();
                        })
                        .finally(() => this.submitLoading = false);
                }
            },
            //查看详情时每一期的小计划编辑取消按钮
            plainEditCancel() {
                confirm({
                    title: '提示',
                    content: '取消后正在编辑的内容不会保存，确定要取消吗？',
                    ok: () => {
                        this.plainAllowEditIndex = -1;
                    }
                });
            },
            //当执行年度或者周期变化时更新
            updatePMTasks() {
                const pmTasks = [],
                    year = this.formData.syear,
                    cycle = this.formData.cycle,
                    totalPeriods = 12 / cycle,
                    currentTime = new Date().getTime();

                let periods = 0;

                if (Number.isInteger(totalPeriods)) {
                    for (let i = 1; i <= totalPeriods; i ++) {
                        let endTime = new Date(year, i * cycle, 0).getTime();

                        if (endTime > currentTime) {
                            const startTime = moment(new Date(year, (i - 1) * cycle, 1).getTime()).format('YYYY-MM-DD');

                            endTime = moment(endTime).format('YYYY-MM-DD');

                            periods += 1;

                            pmTasks.push({
                                startTime,
                                endTime,
                                periods,
                                executeStartTime: startTime,
                                executeEndTime: endTime,
                                executorId: '',
                            });
                        }
                    }
                    this.formData.pmTasks = pmTasks;
                }
            },

            //验证没一期小计划开始执行时间和结束执行时间是否合法的函数   验证通过返回true 否则返回false
            validPlainsDate(rawPmTasks) {
                let pmTasks = [];

                if (Array.isArray(rawPmTasks)) {
                    pmTasks = rawPmTasks;
                } else if (typeof rawPmTasks === 'object') {
                    pmTasks.push(rawPmTasks);
                } else {
                    throw new Error('参数必须为Array');
                }

                for (const item of pmTasks) {
                    const periodsString = numToLocale(item.periods);

                    let valid = false;

                    if (item.executorId) {
                        if (! item.executeStartTime) {
                            this.$Message.warning(`请选择第${periodsString}期执行开始时间`);
                        } else if (! item.executeEndTime) {
                            this.$Message.warning(`请选择第${periodsString}期执行结束时间`);
                        } else {
                            const start = moment(item.startTime, 'YYYY-MM-DD').valueOf(),
                                end = moment(item.endTime, 'YYYY-MM-DD').valueOf(),
                                executeStart = moment(item.executeStartTime, 'YYYY-MM-DD').valueOf(),
                                executeEnd = moment(item.executeEndTime, 'YYYY-MM-DD').valueOf();

                            if (executeStart < start || executeStart > end) {
                                this.$Message.warning(`第${periodsString}期执行开始时间不在本周期时间段内`);
                            } else if (executeEnd < start || executeEnd > end) {
                                this.$Message.warning(`第${periodsString}期执行结束时间不在本周期时间段内`);
                            } else if (executeEnd < executeStart) {
                                this.$Message.warning(`第${periodsString}期执行结束时间不能小于执行结束时间`);
                            } else {
                                valid = true;
                            }
                        }
                    } else {
                        this.$Message.warning(`请选择第${periodsString}期执行人`)
                    }

                    if (! valid) {
                        return false
                    }
                }

                return true;
            },

            //添加任务时把整个表单提交
            formDataSubmit() {
                this.$refs.taskForm.validate(valid => {
                    const {formData} = this;

                    if (formData.assetIds.length === 0) {
                        this.$Message.warning('请在巡检科室对话框中选择设备');
                    } else if (valid) {
                        if (this.validPlainsDate(formData.pmTasks)) {
                            const data = {
                                ...formData,
                                sectionIds: formData.sectionIds.join(',')
                            };

                            this.submitLoading = true;
                            this.$axios.post(`/inspectionSchedule`, data)
                                .then(() => {
                                    this.$Message.success('新增巡检计划成功');
                                    this.$router.go(-1);
                                })
                                .finally(() => this.submitLoading = false);
                        }
                    }
                });
            },
            //点击取消按钮
            cancelSubmit() {
                confirm({
                    title: '提示',
                    content: '取消提交后，已填写的内容不会保存，确定要取消吗？',
                    ok: () => {
                        this.$router.go(-1);
                    }
                });
            },
            goBack(){
                if(this.plainAllowEditIndex !== -1){

                    confirm({
                        title: '提示',
                        content: '正在编辑的内容不会保存，确定要返回吗？',
                        ok: () => {
                            this.$router.go(-1);
                        }
                    });
                }else{
                    this.$router.go(-1);
                }
            },

            deleteTask(taskId) {
                confirm({
                    content: `确定删除该任务？`,
                    ok: async () => {
                        await this.$axios.post('/inspectionSchedule/deleteInpectionSchedule', {
                            sId: this.taskId,
                            taskId: [taskId]
                        });

                        this.$Message.success('删除成功');
                        this.getDetails();
                    }
                });
            },

            moment
        }
    }
</script>