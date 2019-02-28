<template>
    <div class="home-calendar kld-box-effect">
        <div class="control">
            <h6 class="control-header">任务分类</h6>
            <div class="checkbox-wrap">
                <Checkbox v-model="checkAll" size="large">全部任务</Checkbox>
                <CheckboxGroup v-model="currentOptions">
                    <div v-for="option in allOptions">
                        <Checkbox
                                :label="option.value"
                                :key="option.value"
                                size="large"
                        >{{option.label}}</Checkbox>
                    </div>
                </CheckboxGroup>
            </div>
            <div class="schedule-types">
                <div v-for="type in scheduleTypes" class="schedule-type-item">
                    <div class="color-chunk" :style="{backgroundColor: type.color}"></div>
                    <span>{{type.title}}</span>
                </div>
            </div>
        </div>
        <div class="calendar-wrap">
            <kld-calendar
                @date-change="dateChange"
                @click-schedule="clickSchedule"
                :schedules="schedules"
                use-detail-popup
            ></kld-calendar>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @border-style: 1px solid #e5e5e5;
    .home-calendar {
        display: inline-flex;
        width: 100%;
        padding: 0;

        .control{
            width: 20%;
            border-right: @border-style;
            padding-left: 20px;
            font-size: 14px;
            .control-header{
                line-height: 44px;
                border-bottom: @border-style;
                color: #666;
                font-size: 14px;
            }
            .checkbox-wrap{
                margin: 20px 0;
                .ivu-checkbox-wrapper{
                    margin-bottom: 10px;
                }
            }
            .schedule-types{
                border-top: @border-style;
                .schedule-type-item{
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                    &:first-of-type{
                        margin-top: 20px;
                    }
                    .color-chunk{
                        width: 16px;
                        height: 16px;
                        margin-right: 4px;
                    }
                }
            }
        }
        .calendar-wrap{
            width: 80%;
        }
    }
    .kld-calendar{
        background-color: transparent;
        border: none;
    }
</style>

<script>
    import kldCalendar from '@common/kld-calendar';
    import moment from 'moment';
    import testLimit from '@common/test-limit';
    export default {
        name: "home-calendar",
        components: {kldCalendar},
        props: {
            type: {
                type: String,
                // default: 'doctor'
                default: 'engineer'
            }
        },
        data() {
            return {
                inspectionLimit: testLimit('pm:inspection:task'),
                maintenanceTwoLimit: testLimit('pm:two:task'),
                badEventLimit: testLimit('pm:adverseevent'),
                maintenanceOneLimit: testLimit('pm:one:task'),

                currentDate: moment().format('YYYY-MM'),
                currentOptions: [],
                schedules: []
            };
        },
        watch: {
            currentOptions: {
                handler() {
                    this.getSchedules();
                }
            }
        },
        computed: {
            allOptions() {
                if (this.type === 'engineer') {
                    return [
                        {
                            label: '巡检任务',
                            value: 1
                        },
                        {
                            label: '保养任务',
                            value: 2
                        },
                        {
                            label: '不良事件',
                            value: 3
                        }
                    ]
                } else if (this.type === 'doctor') {
                    return [
                        {
                            label: '日常保养',
                            value: 4
                        },
                        {
                            label: '不良事件',
                            value: 3
                        }
                    ];
                } else {
                    return [];
                }
            },
            allOptionsValue() {
                return this.allOptions.map(
                    ({value}) => value
                );
            },
            checkAll: {
                get() {
                    return this.currentOptions.length === this.allOptions.length;
                },
                set(val) {
                    if (val) {
                        this.currentOptions = this.allOptionsValue;
                    } else {
                        this.currentOptions = [];
                    }
                }
            },


            scheduleTypes() {
                const /*notZero = ({status}) => status !== 0,*/
                    titleRender = data => `<span style="color: #666; font-size: 14px">${data}</span>`,
                    contentRender = data => `<span style="color: #000; font-size: 14px">${data}</span>`,
                    taskPopupRender = data => {
                        let statusText = '';
                        switch (data.status) {
                            case 0:
                                statusText = '未开始';
                                break;
                            case 1:
                                statusText = '执行中';
                                break;
                            case 2:
                                statusText = '已完成';
                                break;
                            case 3:
                                statusText = '未完成';
                                break;
                            case 4:
                                statusText = '逾期';
                        }

                        return [
                            {
                                title: titleRender('执行时间：'),
                                content: contentRender(`${data.startTime}至${data.endTime}`)
                            },
                            {
                                title: titleRender('任务状态：'),
                                content: contentRender(statusText)
                            }
                        ]
                    },
                    badEventPopupRender = data => {
                        let eventResult = '';

                        switch (data.aeConsequence) {
                            case '1':
                                eventResult = '死亡';
                                break;
                            case '2':
                                eventResult = '危及生命';
                                break;
                            case '3':
                                eventResult = '机体功能结构永久性损伤';
                                break;
                            case '4':
                                eventResult = '可能导致机体功能机构永久性损伤';
                                break;
                            case '5':
                                eventResult = '需要内、外科治疗避免上述永久损伤';
                                break;
                            case '6':
                                eventResult = '其他';
                        }

                        return [
                            {
                                title: titleRender('上报人：'),
                                content: contentRender(data.uploadName)
                            },
                            {
                                title: titleRender('事件后果：'),
                                content: contentRender(eventResult)
                            }
                        ]
                    };

                if (this.type === 'engineer') {
                    return [
                        {
                            title: '巡检任务',
                            color: '#9ac4fe',
                            type: 1,
                            // validator: notZero,
                            popupRender: taskPopupRender
                        },
                        {
                            title: '保养任务',
                            color: '#fb9796',
                            type: 2,
                            // validator: notZero,
                            popupRender: taskPopupRender
                        },
                        {
                            title: '不良事件',
                            color: '#f7a16e',
                            type: 3,
                            // validator: notZero,
                            popupRender: badEventPopupRender
                        }
                    ]
                } else if (this.type === 'doctor') {
                    return [
                        {
                            title: '日常保养已执行',
                            color: '#459ca2',
                            type: 4,
                            validator: ({status}) => status === 2
                            // popupRender: taskPopupRender
                        },
                        {
                            title: '日常保养未完成',
                            color: '#6a84e8',
                            type: 4,
                            validator: ({status}) => status === 3
                            // popupRender: taskPopupRender
                        },
                        {
                            title: '不良事件',
                            color: '#f7a16e',
                            type: 3,
                            // validator: notZero,
                            popupRender: badEventPopupRender
                        }
                    ];
                } else {
                    return [];
                }
            }
        },
        created() {
            this.currentOptions = this.allOptionsValue;
        },
        methods: {
            getSchedules() {
                if (this.currentOptions.length === 0) {
                    this.schedules = [];
                    return Promise.resolve();
                } else {
                    return this.$axios.post('/statistical/findHomePageByEngineeraAndDoctor', {
                        type: this.currentOptions,
                        month: this.currentDate
                    })
                        .then(({data}) => {
                            this.schedules = this.transformSchedules(data);
                        });
                }
            },

            transformSchedules(data) {
                const schedules = [];

                for (const rawData of data) {

                    for (const scheduleType of this.scheduleTypes) {
                        if (
                            rawData.type === scheduleType.type &&
                            (typeof scheduleType.validator === 'function' ? scheduleType.validator(rawData) : true)
                        ) {
                            schedules.push({
                                title: scheduleType.title,
                                bgColor: scheduleType.color,
                                start: rawData.startTime,
                                data: rawData,
                                popupTemplate: typeof scheduleType.popupRender === 'function' && scheduleType.popupRender(rawData)
                            });
                        }
                    }
                }

                return schedules;
            },

            dateChange(date) {
                this.currentDate = moment(date.getTime()).format('YYYY-MM');
                this.getSchedules();
            },

            clickSchedule(schedule) {
                let pushName = '';
                switch (schedule.type) {
                    case 1:
                        if (! this.inspectionLimit) return;
                        pushName = 'inspection-task-list';
                        break;
                    case 2:
                        if (! this.maintenanceTwoLimit) return;
                        pushName = 'MaintenanceTask';
                        break;
                    case 3:
                        if (! this.badEventLimit) return;
                        pushName = 'adverse-event-list';
                        break;
                    case 4:
                        if (! this.maintenanceOneLimit) return;
                        pushName = 'MaintenanceTask';
                }
                this.$router.push({name: pushName});
            }
        }
    }
</script>