export default {
    color: ["#57B8E2"],
    tooltip: {
        trigger: "axis",
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: "8%",
        right: "2%",
        bottom: "20%",
        top: "15%"
    },
    xAxis: [{
        type: "category",
        data: [],
        axisTick: {
            show: false,
            alignWithLabel: true
        },
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: "#666"
            }
        },
        axisLabel: {
            formatter(value) {
                var data = value;
                if (value.length > 5) {
                    for (var i = 3; i < value.length; i = i + 3) {
                        data = data.slice(0, i) + "\n" + data.slice(i)
                    }
                }
                return data;

            }
        }
    }],
    yAxis: [{
        name: '维修率（%）',
        type: "value",
        splitLine: {
            show: false
        },
        nameTextStyle: {
            color: " #666666",
            // fontSize:14
        },
        axisLine: {
            lineStyle: {
                color: "#666"
            }
        }
    }],
    series: [{
        name: "维修率",
        type: "bar",
        barMaxWidth: 40,
        data: [],
        label: {
            show: true,
            position: "top"
        },
    }]
}