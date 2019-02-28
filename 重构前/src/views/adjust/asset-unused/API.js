const config ={
    rotate: 0,
    align: 'center',
    // verticalAlign: 'middle',
    position: 'top',
    distance: 5,
};
const labelOption ={
    normal: {
        show: true,
        position: config.position,
        distance: config.distance,
        align: config.align,
        // verticalAlign: config.verticalAlign,
        rotate: config.rotate,
        // formatter: '{name|{a}}',
        formatter: function({seriesName}){
            return seriesName.split('').join('\n');
        },
        fontSize: 12,
        color:'#333'
       
    }
};

// oldOptionformat

 // formatEchartsData(res){
        //     this.originData=res.data.filter(v=>v.assets.length);
        //     if(!this.originData.length){
        //         return
        //     }
        //     this.xAxis= {
        //         type: 'category',
        //         axisTick: {show: false},
        //         data: this.originData.length>=3?this.originData.map(v=>v.osName):(()=>{
        //             let arr=this.originData.map(v=>v.osName);
        //             arr.push(...this.preArr.splice(0,this.minArrLength-arr.length));
        //             return arr
        //         })(),
        //         axisLabel:{
        //             interval:0,//强制显示所有的x轴坐标（类目名）
        //             rotate: 25
        //         }
        //     }
            
            
            
        //     let seriesData=[];
        //     this.originData.forEach(v=>{
        //         v.assets.forEach(value=>{
        //             if(!seriesData.includes(value.typeName)){
        //                 seriesData.push(value.typeName)
        //             }
        //         })
        //     })
        //     this.series=seriesData.map(v=>{
        //         return {
        //             name: v,
        //             type: 'bar',
        //             barGap: 0,
        //             barMaxWidth: '50',
        //             label: labelOption,
        //             data: this.originData.map(value=>{
        //                 return value.assets.find(item=>item.typeName==v)?value.assets.find(item=>item.typeName==v).count:null
        //             })
        //         }
        //     })
        //     this.loadChartData=true;

        // },


// const oldOption =  {
//     color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
//     tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//             type: 'shadow'
//         },
//         formatter:function(params, ticket, callback){
//             return `${params[0].name}<br />`+params.filter(v=>+v.value).map(v=>{
//                 return `<span style="display:inline-block;width:10px;height:10px;margin:-2px 2px 0 0;background-color:${v.color};border-radius:50%;"></span>${v.seriesName}:${v.value}<br/>`
//             }).join('')
//         }
//     },
//     grid:{
//         left: '3%',
//         right: '4%',
//         top:'15%',
//         bottom:this.originData.length>10?'17%':'3%',
//         containLabel: true
//     },
           
//     toolbox: {
//         show: true,
//         orient: 'vertical',
//         left: 'right',
//         top: 'center',
//         feature: {
//             mark: { show: true },
//             dataView: { show: true, readOnly: false },
//             magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
//             restore: { show: true },
//             saveAsImage: { show: true }
//         }
//     },
//     calculable: true,
//     xAxis: this.xAxis,
//     yAxis:{
//         minInterval: 1,
//         maxInterval: 2,
//         type: 'value',
//         name:"设备数量",
//         max:function(value) {
//             return value.max%2||value.max<=6?value.max + 1:value.max + 2;
//         }
//     },
//     dataZoom: [
//         {
//             type: 'slider',
//             startValue: 0,
//             endValue: 9,
//             height: 30, //组件高度
//             show:this.originData.length>10,


//         },
//     ],
//     series:this.series
// }



// const newOption={//新柱状图配置项
//     tooltip : {
//         trigger: 'axis',
//         axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//             type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//         }
//     },
//     legend: {
//         data:['在用','不在用']
//     },
//     grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//     },
//     xAxis : [
//         {
//             type : 'category',
//             data : ['周一','周二','周三','周四','周五','周六','周日']
//         }
//     ],
//     yAxis : [
//         {
//             type : 'value'
//         }
//     ],
//     series : [
       
        
//         {
//             name:'在用',
//             type:'bar',
//             stack: '广告',
//             label:{
//                     show: true,
//                     position: 'top',
//                     distance: 5,
//                     align: 'center',
//                     rotate: 0,
//                     fontSize: 12,
//                     color:'#333'
//             },
//             data:[220, 182, 191, 234, 290, 330, 310]
//         },
//         {
//             name:'不在用',
//             type:'bar',
//             stack: '广告',
//             label:{
//                     show: true,
//                     position: 'top',
//                     distance: 5,
//                     align: 'center',
//                     rotate: 0,
//                     fontSize: 12,
//                     color:'#333'
//             },
//             data:[150, 232, 201, 154, 190, 330, 410]
//         },
        
//         {
//             name:'在用',
//             type:'bar',
//             stack: '搜索引擎',
//             label:{
//                     show: true,
//                     position: 'top',
//                     distance: 5,
//                     align: 'center',
//                     rotate: 0,
//                     fontSize: 12,
//                     color:'#333'
//             },
//             data:[620, 732, 701, 734, 1090, 1130, 1120]
//         },
        
//         {
//             name:'不在用',
//             type:'bar',
//             stack: '搜索引擎',
//             label:{
//                     show: true,
//                     position: 'top',
//                     distance: 5,
//                     align: 'center',
//                     rotate: 0,
//                     fontSize: 12,
//                     color:'#333'
//             },
//             data:[62, 82, 91, 84, 109, 110, 120]
//         }
//     ]
// };
export { labelOption};