<template>
    <div>
        <div id='pie' :style='styles'>

        </div>
    </div>
</template>
<script>


import echarts from "@common/echartsComponents";
export default {
  props: {
    Data: {
      default() {
        return  [{ value: 0, name: "暂无数据" }]
      },
      type:Array
      // type: Object //验证传入类型
    },
    //饼图的颜色
    color: {
      default() {
        return ["#82c4a0", "#50ba73", "#30aea0", "#5ab79c", "#2d6274"];
      },
      type: [String, Array]
    },
    //饼图的大小
    size: {
      default() {
        return {
          fontSize:24 //不能加px
        };
      },
      fontSize: {
        default: 15,
        type: [String, Number]
      }
    },
    //样式书写
    styles: {
      default() {
        return { width: "413px", height: "200px" };
      }
    }
  },
  data() {
    return {
      list: null
    };
  },
  mounted() {
      this.pie();
  },
  watch:{
    Data(){
      this.pie();
    }
  },
  methods: {
    pie() {
      const that = this;
      var myChart = echarts.init(document.getElementById("pie"));
      let option = {
        color: that.color,
        title: {
          subtext:"总计",
          subtextStyle:{
              align:"right"
          },
          text: this.Data.reduce((p,c)=>({value:p.value+c.value})).value,
          x: "center",
          top: "70",
          textStyle: {
            fontWeight: "normal",
            fontSize: 15,
            color: "#000"
          }
        },
        legend: {
          orient: "vertical",
          right: "0px",
          y:"center",
          selectedMode: false,
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            center:["center",'center'],
            name: "设备计量",
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: false,
                position: "center"
              }
              
            },
            data: that.Data
          }
        ]
      };
      myChart.clear();
      myChart.setOption(option);
    }
  }
};
</script>
<style>
</style>

