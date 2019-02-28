# kld-calendar API文档

## props

#### schedules _[schedule: Object]: Array_
##### schedule:
###### start 开始时间 _Date_
###### end 结束时间 默认与start字段相同 _Date_
###### title 日程标题 _String_
###### icon 日程标题左侧图标 _String_
###### data 日程对象绑定的数据，在click-schedule时间触发时传回 _Any_
###### color 日程标签的字体颜色 default: #fff _String_
###### bgColor default: #2d8cf0  _String_
###### bgColor default: #2d8cf0  _String_

#### useDetailPopup 是否在日程标签hover时显示详情气泡 default: false _Boolean_

## events

#### click-schedule 当日程标签被点击时
##### arg: data 日程对象绑定的数据

#### date-change 当日历渲染日期发生变化时
##### arg: date 变化后的时间 _TdDate_