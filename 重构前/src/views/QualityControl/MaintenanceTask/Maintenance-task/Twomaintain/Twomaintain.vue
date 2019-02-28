<template>
    <div class="inspection-task-list">
        <div class="search kld-box-effect">
            <Form :model="searchData">
                <Row type="flex" :gutter="10">
                    <i-col>
                        <i-input v-model.trim="searchData.keyword" placeholder="任务名称/执行人" icon="ios-search-strong"
                                 class="kld-input"></i-input>
                    </i-col>
                    <i-col>
                        <kld-tree-select
                                v-model="searchData.sectionId"
                                :data="sectionList"
                                title-key="osName"
                                children-key="lists"
                                placeholder="选择科室"
                                filterable
                                clearable
                                first-expanded
                        ></kld-tree-select>
                    </i-col>
                    <i-col>
                        <Select v-model="searchData.status" class="kld-select" placeholder="任务状态">
                            <Option value="">全部</Option>
                            <Option value="0">未开始</Option>
                            <Option value="1">执行中</Option>
                            <Option value="2">已完成</Option>
                            <Option value="3">未完成</Option>
                            <Option value="4">逾期</Option>
                        </Select>
                    </i-col>
                    <i-col>
                        <DatePicker
                                type="year"
                                class="kld-date-picker"
                                format="yyyy"
                                placeholder="年份"
                                :value="searchData.year"
                                @on-change="searchData.year = $event"
                        ></DatePicker>
                    </i-col>
                    <i-col>
                        <Button @click="startSearch" icon="android-search" class="kld-btn">检索</Button>
                    </i-col>
                </Row>
            </Form>
        </div>
        <div class="task-list kld-box-effect">
            <group-table :page-num="pageNum" :is-loading="isLoading" :group-datas="taskList"
                         @on-table-click="toTaskDetails" :collapse-columns="collapseColumns"></group-table>
            <div class="task-page">
                <kld-page :total="pageData.total" :page-size="pageData.pageSize" :current.sync="pageData.current"
                          @on-change="pageChange"></kld-page>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    .inspection-task-list {
        .search {
            display: flex;
            margin-bottom: 15px;
            .kld-input,.kld-select,.kld-tree-select,.kld-date-picker{
                width: 300px;
            }
        }

        .task-list {
            padding: 0;

            .task-page {
                text-align: center;
                padding: 30px 0;
            }
        }

        .section-tree {
            .ivu-poptip-body {
                max-height: 300px;
                overflow: auto;
            }
        }
    }
</style>

<script type="text/jsx">
    import groupTable from '@common/group-table/index';
    import kldPage from "@common/page/page.vue";
    import kldTag from "@inspection-common/kld-tag.vue";
    import numToLocale from '@common/numberToLocale';
    import poptipShowInfo from '@common/poptip-show-info';
    import KldTreeSelect from '@common/kld-tree-select';
    import kldConfirm from '@common/kld-confirm';

    export default {
        name: "inspection-task-list",
        components: {
            groupTable,
            kldPage,
            kldTag,
            KldTreeSelect
        },
        data() {
            return {
                pageNum: ['1'],
                isLoading: false,
                taskList: [],
                sectionList: [],
                searchData: {
                    status: '',
                    sectionId: '',
                    keyword: '',
                    year: '', /*String(new Date().getFullYear())*/
                },
                pageData: {
                    pageSize: 10,
                    current: 1,
                    total: 0
                },
                collapseColumns: [
                    {
                        key: "name",
                        title: "计划名称",
                        width: "30%",
                        style: {
                            "font-weight": 700,
                            color: "#0c8399"
                        }
                    },
                    {
                        key: "customName",
                        title: "制定人",
                        width: "20%",
                        render: (h, {column, row, index}) => {
                            return h(
                                poptipShowInfo,
                                {props: {infoId: row.customId}},
                                row.customName
                            );
                        }
                    },
                    {
                        key: "cycle",
                        title: "周期（月）",
                        width: "15%"
                    },
                    {
                        key: "sysOrgstructVos",
                        title: "包含科室",
                        poptip: true,
                        width: "30%"
                    },
                    {
                        key: "conifg",
                        title: "操作",
                        width: "96px",
                        render: (h, {column, row, index}) => {

                            if (this.delLimit) {
                                const taskIds = row.pmTasks.reduce(
                                    (result, task) => {
                                        if (![2, 4].includes(task.status)) {
                                            result.push(task.id);
                                        }
                                        return result;
                                    },
                                    []
                                );

                                if (taskIds.length === row.pmTasks.length) {
                                    const handler = event => {
                                        this.deleteTask(row.id, taskIds);
                                        event.stopPropagation();
                                    };

                                    return (
                                        <a href="javascript:" onClick={handler}>
                                            删除
                                        </a>
                                    );
                                }
                            }
                        }
                    }
                ]
            };
        },
        created() {
            this.getTaskList();
            this.getSection();
        },
        watch: {
            sectionName(name) {
                name === "" && (this.searchData.sectionId = "");
            },
            searchData: {
                handler() {
                    this.pageData.current = 1;
                    this.getTaskList();
                },
                deep: true
            }
        },
        computed: {
            user_in() {
                return this.$store.state.user_in;
            },
            delLimit() {
                return this.checkLimit('pm:two:task:del');
            }
        },
        methods: {

            //点击搜索按钮
            startSearch() {
                this.pageData.current = 1;
                this.getTaskList();
            },

            //当分页变化
            pageChange() {
                this.getTaskList();
            },
            //跳转任务详情
            toTaskDetails(task) {
                if (this.ViewLimit('pm:two:task:query')) {

                    this.$router.push({
                        name: "AllTwoTaskDetail",
                        query: {id: task.id}
                    });
                } else {
                    this.$Message.warning('您没有权限查看详情！')
                }
            },

            //获取科室
            getSection() {
                return this.$axios
                    .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                    .then(({data}) => {
                        this.sectionList = [data];
                    });
            },

            //获取任务列表
            getTaskList() {
                const data = {
                    limit: this.pageData.pageSize,
                    offset: (this.pageData.current - 1) * 10,
                    params: this.searchData
                };


                this.isLoading = true;

                return this.$axios
                    .post(`/maintenanceSchedule/${this.user_in.osId}/list`, data)
                    .then(({data: {recordsTotal, data}}) => {
                        this.pageData.total = recordsTotal;
                        const taskList = [];
                        for (const item of data) {
                            item.sysOrgstructVos = item.sysOrgstructVos.map(item => item.osName).join('、');
                            taskList.push({

                                row: item,
                                callbackArg: item,
                                tableData: {
                                    columns: [
                                        {
                                            render(h, {row: {status}}) {
                                                let type = "",
                                                    tagText = "";
                                                switch (status) {
                                                    case 0:
                                                        type = "default";
                                                        tagText = "未开始";
                                                        break;
                                                    case 1:
                                                        type = "warning";
                                                        tagText = "执行中";
                                                        break;
                                                    case 2:
                                                        type = "success";
                                                        tagText = "已完成";
                                                        break;
                                                    case 3:
                                                        type = "purple";
                                                        tagText = "未完成";
                                                        break;
                                                    case 4:
                                                        type = "error";
                                                        tagText = "逾期";
                                                }

                                                return h(
                                                    kldTag,
                                                    {props: {type}},
                                                    tagText
                                                );
                                            }
                                        },
                                        {
                                            render(
                                                h,
                                                {
                                                    row: {startTime, endTime},
                                                    index
                                                }
                                            ) {
                                                return <span>第{numToLocale(index + 1)}期 ({startTime} 至 {endTime})</span>;
                                            }
                                        },
                                        {
                                            render(h, {row: {executorName, executorId}}) {
                                                if (executorName) {
                                                    return h("p", [
                                                        "执行人：",
                                                        h(
                                                            "span",
                                                            {
                                                                class: "kld-success"
                                                            },
                                                            [h(poptipShowInfo, {props: {infoId: executorId}}, executorName)]
                                                        )
                                                    ]);
                                                } else {
                                                    return h('p', "执行人：无");
                                                }
                                            }
                                        },
                                        {
                                            render(
                                                h,
                                                {
                                                    row: {
                                                        status,
                                                        executeStartTime,
                                                        executeEndTime
                                                    }
                                                }
                                            ) {
                                                if (executeEndTime) {
                                                    let dateTextClassName =
                                                        "kld-success";
                                                    return h("p", [
                                                        "执行时间段：",
                                                        h(
                                                            "span",
                                                            {
                                                                class: dateTextClassName
                                                            },
                                                            executeStartTime
                                                        ),
                                                        " 至 ",
                                                        h(
                                                            "span",
                                                            {
                                                                class: dateTextClassName
                                                            },
                                                            executeEndTime
                                                        )
                                                    ]);
                                                } else {
                                                    return h('p', "执行时间段：无");
                                                }
                                            }
                                        },
                                        {
                                            width: 140, render: (h, {row: {id, status, scheduleId}}) => {
                                                if (this.delLimit && ![2, 4].includes(status)) {
                                                    const handler = event => {
                                                        this.deleteTask(scheduleId, id);
                                                        event.stopPropagation();
                                                    };
                                                    return <a href="javascript:" onClick={handler}>删除</a>;
                                                }
                                            }
                                        }
                                    ],
                                    data: item.pmTasks.sort(
                                        (a, b) => a.periods - b.periods
                                    ) /*后台没有按期数排序*/
                                }
                            });
                        }
                        this.taskList = taskList;
                        this.$nextTick(() => {

                            this.pageNum = ['1']
                        })
                    })
                    .finally(() => this.isLoading = false);
            },
            deleteTask(sId, taskIds) {
                const taskIdsIsArray = Array.isArray(taskIds);
                kldConfirm({
                    content: `确定删除该${taskIdsIsArray ? '计划' : '任务'}？`,
                    ok: async () => {
                        await this.$axios.post('/maintenanceSchedule/deleteMaintenanceSchedule', {
                            sId,
                            taskId: taskIdsIsArray ? taskIds : [taskIds]
                        });

                        this.$Message.success('删除成功');
                        this.getTaskList();
                    }
                });
            }
        }
    };
</script>