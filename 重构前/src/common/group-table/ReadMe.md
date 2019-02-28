### GroupTree API

#### props

-   accordion : 是否开启折叠板的手风琴模式 (默认开启)

-   collapseColumns:整个 group-table 的表头数据

    ```javascript
    [
        {
            key: "name",//列key 对应groupDatas中的row
            title: "计划名称",// 表头名
            width:"30%",//:String 宽度 （%，px）
            poptip:false,//:Boolean 是否支持poptip弹窗（默认false）
            style:{
                "font-weight": 700,
                color: "#0c8399"
            }//:Object/String 表头样式
            render: (h, { column, row, index }) => {})//该列下表格内容render
        },

    ]
    ```

-   groupDatas:Array

    ```javascript
    [
        {
            //单个折叠面版数据
            //点击事件会传回来的参数query；
            callbackArg: {
                id: 1
            },
            //折叠窗口标题{}（行数据）
            row: { name: "aa", cycle: "bb" },

            //自定义需要符合列数[]  key必要（与iview Table组件传入数据格式相同）
            tableData: {
                //列数据
                columns: [
                    {
                        key: "name"
                    },
                    {
                        key: "age"
                    },
                    {
                        key: "address"
                    },
                    {
                        key: "date"
                    }
                ],
                //行数据[]
                data: [
                    {
                        name: "John Brown",
                        age: 18,
                        address: "New York No. 1 Lake Park",
                        date: "2016-10-03"
                    },
                    {
                        name: "Jim Green",
                        age: 24,
                        address: "London No. 1 Lake Park",
                        date: "2016-10-01"
                    },
                    {
                        name: "Joe Black",
                        age: 30,
                        address: "Sydney No. 1 Lake Park",
                        date: "2016-10-02"
                    }
                ]
            }
        }
    ];
    ```

#### Methods

-   on-table-click

    触发：点击每个折叠页面表格时触发

    需要 ：function

    参数 ：callbackArg:Object
