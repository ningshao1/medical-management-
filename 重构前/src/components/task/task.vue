<template>
  <div class="task" style="background:#fafafa">
    <div class="task-head">
      <div class="task-title">
        <div class="vertical"></div>
        <p style="font-size:14px;">{{title}}</p>
      </div>

      <div class="task-whole">
        <p>查看更多</p>
        <img src="./image/whole.png" alt="" style="margin-top:3px;">
      </div>
    </div>
    
      
   
    <div class="amount">
      <!-- <ul>
        <Row :gutter="20">
          <Col span="8">
          <li v-for="item in amout">
            <p class="amout-num">{{item.num}}111</p>
            <p class="amout-active">{{item.active}}3333</p>
          </li>
          </Col>
          <Col span="8">
          <li v-for="item in amout">
            <p class="amout-num">{{item.num}}111</p>
            <p class="amout-active">{{item.active}}3333</p>
          </li>
          </Col>
          <Col span="8">
          <li v-for="item in amout">
            <p class="amout-num">{{item.num}}111</p>
            <p class="amout-active">{{item.active}}3333</p>
          </li>
          </Col>

        </Row>
      </ul> -->
        暂无数据
    </div>
    <!-- <p class="plan">月度总计划完成占比</p>
    <div class="plan-circle">
      <Circle :percent="percent">
        <span class="demo-Circle-inner" style="font-size:24px">80%</span>
      </Circle>
    </div>
    <div class="amount-data">
      <ul>
        <li>本月</li>
        <li>本季</li>
        <li>本年</li>
      </ul>
    </div>
    <div class="task-line"></div>
    <slot name="btn"></slot>
    <slot name="btnList"></slot> -->
  </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "巡检任务"
        },
        // amout: {
        //     type: Array,
        //     default: [
        //         {
        //             num: "",
        //             active: ""
        //         }
        //     ]
        // },
        // percent: {
        //     type: Number,
        //     default: 80
        // }
    }
};
</script>

<style scoped  lang="less">
.task {
    height: 300px;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);
    border-radius: 3px;
    border: solid 1px rgba(2, 31, 57, 0.1);
    .task-head {
        display: flex;
        justify-content: space-between;
        .task-title {
            display: flex;
            .vertical {
                width: 4px;
                height: 30px;
                background-color: #76bdc1;
                color: #333333;
            }
            > p {
                margin-left: 12px;
                font-size: 16px;
            }
        }
        .task-whole {
            display: flex;
            align-items: center;
            > p {
                color: #01b0c7;
                font-size: 12px;
                margin-right: 11px;
            }
            img {
                width: 14px;
                height: 14px;
            }
        }
    }
    .amount {
        position: absolute;
        left: 50%;
        top: 50%;
        transform:translate(-50%,-50%);

        li {
            height: 105px;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            text-align: center;
            .amout-num {
                margin-top: 28px;
                font-size: 18px;
                color: #333333;
            }
            .amout-active {
                margin-top: 20px;
                font-size: 14px;
                color: #999999;
            }
        }
    }
    .plan {
        margin-top: 20px;
        color: #333333;
    }
    .plan-circle {
        margin-top: 20px;
        width: 90px;
        height: 90px;
        margin: 0 auto;
    }
    .amount-data {
        margin-top: 40px;
        ul {
            display: flex;
            justify-content: flex-end;
            li {
                font-size: 14px;
                color: #333333;
                margin-left: 20px;
                line-height: 20px;
                border-bottom: 3px solid #5ba4c8;
            }
        }
    }
    .task-line {
        height: 1px;
        background: rgba(2, 31, 57, 0.1);
        margin-top: 10px;
        margin-bottom: 20px;
    }
}
</style>