<template>
    <div class="kld-calendar">
        <div class="kld-calendar-header" >
            <Button @click="calendarToPrevOrNextOrToday(0)" style="margin-right: 10px;">本月</Button>
            <div class="calendar-control">
                <Button type="text" shape="circle" icon="chevron-left" @click="calendarToPrevOrNextOrToday(-1)"></Button>
                <span class="calendar-current-render-date">{{currentRenderDate}}</span>
                <Button type="text" shape="circle" icon="chevron-right" @click="calendarToPrevOrNextOrToday(1)"></Button>
            </div>
        </div>
        <div id="calendar"></div>
    </div>
</template>

<style lang="less">
    .kld-calendar{
        width: 100%;
        height: 100%;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        .kld-calendar-header{
            padding: 6px 20px;
            display: flex;
            align-items: center;
            .calendar-control{
                display: flex;
                align-items: center;
            }
            .calendar-current-render-date{
                font-weight: normal;
                font-size: 20px;
                padding: 0 4px;
                line-height: 32px;
            }
        }
        #calendar{
            height: calc(~'100% - 44px');
            width: 100%;
        }
        .calendar-popup-details{
            .tui-full-calendar-popup.tui-full-calendar-popup-detail{
                position: static;
            }
            .tui-full-calendar-popup-container{
                width: auto;
                max-width: 300px;
                min-width: auto;
            }
            .tui-full-calendar-popup-detail .tui-full-calendar-section-header{
                height: auto;
            }
            .tui-full-calendar-popup-section{
                margin-bottom: 0;
            }
        }

    }
</style>

<script>
    import Calendar from 'tui-calendar/dist/tui-calendar.min';
    import 'tui-calendar/dist/tui-calendar.css';
    import {Schedule} from './schedule';
    import $ from 'jquery';
    export default {
        name: "kld-calendar",
        mounted() {
            //实例化日历
            const calendar = this.calendar = new Calendar('#calendar', {
                defaultView: 'month',
                month: {
                    daynames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                },
                template: {
                    allday: schedule => `<i class="ivu-icon ivu-icon-${schedule.raw.icon}"></i> <span>${schedule.title}</span>`,
                    monthGridHeaderExceed: count => `<span class="tui-full-calendar-weekday-grid-more-schedules">${count} 更多</span>`
                }
            });

            window.addEventListener('resize', this.calendarResizeRender, false);

            /*每个日程hover时展示详情弹窗的代码*************************************************************************/
            if (this.useDetailPopup) {
                const kldCalendar = document.querySelector('.kld-calendar'),
                    calendarPopupDetails = document.createElement('div'),


                    getCalendarPopupDetailsTemplate = (schedule, arrowDirection) => `
                            <div class="tui-full-calendar-popup tui-full-calendar-popup-detail">
                                <div class="tui-full-calendar-popup-container">
                                    ${function (popupTemplate) {
                        let popupHtml = '';
                        for (const tem of popupTemplate) {
                            popupHtml += `
                                                <div class="tui-full-calendar-popup-section tui-full-calendar-section-header">
                                                    <div>
                                                        <span class="tui-full-calendar-schedule-title">${tem.title}</span>
                                                    </div>
                                                </div>
                                                <div class="tui-full-calendar-section-detail">
                                                    <div class="tui-full-calendar-popup-detail-item"><span class="tui-full-calendar-content">${tem.content}</span></div>
                                                </div>
                                                `;
                        }
                        return popupHtml;
                    } (schedule.raw.popupTemplate)}
                                </div>
                                <div class="tui-full-calendar-popup-top-line" style="background-color: ${schedule.borderColor}"></div>
                                <div id="tui-full-calendar-popup-arrow" class="tui-full-calendar-popup-arrow tui-full-calendar-arrow-${arrowDirection}">
                                    <div class="tui-full-calendar-popup-arrow-border">
                                        <div class="tui-full-calendar-popup-arrow-fill"></div>
                                    </div>
                                </div>
                            </div>`;

                let popupTimer = 0;

                calendarPopupDetails.setAttribute('class', 'tui-full-calendar-floating-layer calendar-popup-details');
                calendarPopupDetails.style.position = 'absolute';
                calendarPopupDetails.style.display = 'none';
                calendarPopupDetails.style.zIndex = '1050';


                $(kldCalendar)
                    .on('mouseenter', '[data-schedule-id]', ({target}) => {
                        let scheduleId = '',
                            detailPopupElement = null;

                        if (scheduleId = target.getAttribute('data-schedule-id')) {
                            detailPopupElement = target;
                        } else {
                            detailPopupElement = $(target).parents('[data-schedule-id]')[0];
                            scheduleId = detailPopupElement.getAttribute('data-schedule-id')
                        }

                        if (detailPopupElement) {
                            for (const schedule of this.rawSchedules) {
                                if (scheduleId === schedule.id.toString()) {

                                    //如果没有传模板则什么都不做
                                    if (! schedule.raw.popupTemplate) return;

                                    calendarPopupDetails.innerHTML = getCalendarPopupDetailsTemplate(schedule);
                                    clearTimeout(popupTimer);

                                    const targetClientRect = detailPopupElement.getBoundingClientRect(),
                                        targetOffsetLeft = targetClientRect.left,
                                        targetOffsetRight = document.documentElement.clientWidth - targetClientRect.right,
                                        targetOffsetTop = targetClientRect.top,
                                        targetOffsetBottom = document.documentElement.clientHeight - targetClientRect.bottom,
                                        targetOffsetWidth = targetClientRect.width,
                                        targetOffsetHeight = targetClientRect.height,
                                        popupWidth = $(calendarPopupDetails).outerWidth(),
                                        popupHeight = $(calendarPopupDetails).outerHeight();



                                    let popupLeft = 0, popupTop = 0, popupArrowDirection = '';

                                    getPopupPosition: {
                                        if (Math.min(targetOffsetTop, targetOffsetBottom) * 2 + targetOffsetHeight > popupHeight) {
                                            if (targetOffsetRight > popupWidth) {
                                                popupArrowDirection = 'left';
                                                popupLeft = targetClientRect.right + 10;
                                                popupTop = targetOffsetTop + targetOffsetHeight / 2 - popupHeight / 2;
                                                break getPopupPosition;
                                            } else if (targetOffsetLeft > popupWidth) {
                                                popupArrowDirection = 'right';
                                                popupLeft = targetOffsetLeft - (popupWidth + 10);
                                                popupTop = targetOffsetTop + targetOffsetHeight / 2 - popupHeight / 2;
                                                break getPopupPosition;
                                            }
                                        }

                                        if (Math.min(targetOffsetLeft, targetOffsetRight) * 2 + targetOffsetWidth > popupWidth) {
                                            if (targetOffsetTop > popupHeight) {
                                                popupArrowDirection = 'bottom';
                                                popupLeft = targetOffsetLeft + targetOffsetWidth / 2 - popupWidth / 2;
                                                popupTop = targetOffsetTop - popupHeight - 10;
                                            } else if (targetOffsetBottom > popupHeight) {
                                                popupArrowDirection = 'top';
                                                popupLeft = targetOffsetLeft + targetOffsetWidth / 2 - popupWidth / 2;
                                                popupTop = targetClientRect.bottom + 10;
                                            }
                                        }
                                    }

                                    popupLeft += window.pageXOffset;
                                    popupTop += window.pageYOffset;

                                    calendarPopupDetails.style.left = popupLeft + 'px';
                                    calendarPopupDetails.style.top = popupTop + 'px';
                                    popupArrowDirection && (calendarPopupDetails.innerHTML = getCalendarPopupDetailsTemplate(schedule, popupArrowDirection));
                                    $(calendarPopupDetails).fadeIn(300);
                                    break;
                                }
                            }
                        }
                    })
                    .on('mouseleave', '[data-schedule-id]', () => {
                        popupTimer = setTimeout(() => {
                            $(calendarPopupDetails).fadeOut(300);
                        }, 300);
                    });

                $(calendarPopupDetails).hover(
                    () => clearTimeout(popupTimer),
                    () => popupTimer = setTimeout(() => {
                        $(calendarPopupDetails).fadeOut(300);
                    }, 300)
                );

                kldCalendar.appendChild(calendarPopupDetails);
            }
            /*****************************************************************************************************/






            calendar.on({
                clickSchedule: ({schedule}) => {
                    this.$emit('click-schedule', schedule.raw.data);
                },

                //清除点击日历时生成的遮罩
                beforeCreateSchedule({guide}) {
                    guide.clear();
                }
            });

            //根据props中schedules 渲染日程标签
            this.freshSchedule();

            //日历实例化完成后立即更新当前渲染日期
            this.updateCurrentRenderDate();
        },
        beforeDestroy() {
            this.calendar.destroy();
            window.removeEventListener('resize', this.calendarResizeRender, false);
        },
        props: {
            schedules: {
                type: Array,
                default() {
                    return [];
                },
                validator(schedules) {
                    for (const schedule of schedules) {
                        if (typeof schedule !== 'object') {
                            throw new Error('属性schedule中的每一项必须为对象');
                        }
                    }
                    return true;
                }
            },
            useDetailPopup: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            schedules() {
                this.freshSchedule();
            }
        },
        data() {
            return {
                calendar: null,             //日历实例
                currentRenderDate: '',      //日历当前渲染出的日期
                rawSchedules: []            //将使用者传来的schedules转化后的数据，其中包含了每个schedules所对应的每个元素
            }
        },
        methods: {
            //控制日历的翻页
            calendarToPrevOrNextOrToday(val) {
                switch (val) {
                    case -1 :
                        this.calendar.prev();
                        break;
                    case 1 :
                        this.calendar.next();
                        break;
                    case 0 :
                        this.calendar.today();
                        break;
                }
                this.$emit('date-change', this.calendar.getDate());
                this.updateCurrentRenderDate();
            },
            //更新日历当前渲染出的日期
            updateCurrentRenderDate() {
                const tzDate = this.calendar.getDate(),
                    month = tzDate.getMonth() + 1,
                    year = tzDate.getFullYear();
                this.currentRenderDate = `${year}年${month}月`;
            },

            //刷新日历中的日程
            freshSchedule() {
                const calendar = this.calendar,
                    schedules = [];

                calendar.clear();

                for (const schedule of this.schedules) {
                    const raw = {
                        data: schedule.data,
                        icon: schedule.icon,
                        popupTemplate: schedule.popupTemplate
                    };

                    schedules.push(new Schedule({...schedule, raw}));
                }

                calendar.createSchedules(schedules);

                this.rawSchedules = schedules;
            },


            //当window resize时刷新日历
            calendarResizeRender() {
                this.calendar.render();
            }
        }
    }
</script>

