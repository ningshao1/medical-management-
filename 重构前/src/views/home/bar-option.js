export default {
    color: ["#3398DB"],
    tooltip: {
        trigger: "axis",
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: "8%",
        right: "2%"
    },
    xAxis: [
        {
            type: "category",
            data: ["", ""],
            axisTick: {
                show: false,
                alignWithLabel: true
            },
            splitLine: {
                show: false
            }
        }
    ],
    yAxis: [
        {
            type: "value",
            splitLine: {
                show: false
            }
        }
    ],
    series: [
        {
            name: "维修率",
            type: "bar",
            barMaxWidth: 60,
            data: ['', ''],
            label: {
                show: true,
                position: "top"
            },
        }
    ]
}