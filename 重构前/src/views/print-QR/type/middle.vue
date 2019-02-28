<template>
  <div>
    <component :is="'style'">
      @page {
      size: auto;
      /* auto is the initial value */
      margin: 0mm;
      /* this affects the margin in the printer settings */
      padding: 0;
      margin: 0;
      }
      body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      font-family: "黑体"!important;
      -webkit-font-smoothing: none;
      }

      .weight {
      font-weight: 550;
      }

      .border-bottom {
      border-bottom: 0.1mm solid #000;
      }

      .middle-QR {
      font-size:'黑体';
      width: 60mm;
      height: 40.22mm;
      background: #fafafa;
      text-align: center;
      font-size: 3.53mm;
      overflow: hidden;
      box-sizing: border-box;
      padding: 0;
      margin: 8px auto;
      }
      @media print {
      .middle-QR {
      margin: 0;
      }
      }

      img {
      width: 13mm;
      height: 13mm;
      margin: 1mm;
      }
      .info {
      height: 4.2mm;
      box-sizing: border-box;
      padding: 0.2mm;
      box-sizing: border-box;
      line-height: 4.2mm;
      }
      .info > span {
      line-height: 4.2mm;
      }

      .QR-top {
      display: flex;
      justify-content: space-between;
      border-bottom: 0.1mm solid #000;
      }

      /* .xitong,.encoding{
      padding: 1mm 2mm;
      } */
      .top-title {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      }

      .xitong,
      .encoding {
      border-bottom: 0.1mm solid #000;
      font-weight: 550;
      box-sizing: border-box;
      /* flex: 1; */
      /* display: flex; */
      /* height: 100%; */
      justify-content: center;
      align-items: center;
      padding-bottom: 2mm;
      overflow: hidden;
      max-height: 11mm;
      }

      .encoding {
      border-bottom: none;
      padding-top: 1mm;
      }

      .top-img {
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 0.1mm solid #000;
      padding: 1mm 2mm;
      /* padding-bottom: 1.5mm; */
      }

      .QR-center {
      display: flex;
      font-size: 3mm;
      }

      .user-title {
      width: 6mm;
      writing-mode: tb-rl;
      text-align: center;
      line-height: 6mm;
      border-right: 0.1mm solid #000;
      }

      .user-info {
      width: 54mm;
      text-align: left;
      }

      .user-info div {
      padding-left: 1mm;
      overflow: hidden;
      }

      .belongs {
      display: flex;
      justify-content: space-between;
      }

      .manage {
      display: flex;
      justify-content: space-around;
      font-size: 3mm;
      line-height: 3mm;
      }

      .foot {
      /* padding: 0.3mm; */
      font-size: 3mm;
      text-align: center;
      }
    </component>
    <div class="middle-QR"
         v-for="item in middleData">
      <div class="QR-top">
        <div class="top-title ">
          <div class="xitong">{{item.assetName}}</div>
          <div class="encoding">
            {{item.assetCode}}
          </div>
        </div>
        <div class="top-img">
          <img :src="`data:image/png;base64,${item.qrCode}`"
               alt="">
        </div>
      </div>
      <div class="QR-center border-bottom">
        <div class="user-title">
          使用信息
        </div>
        <div class="user-info">
          <div class="border-bottom info">设备型号：{{item.assetClass}}</div>
          <div class="border-bottom belongs info"><span>所属科室：{{item.osName}}</span><span>{{item.collarTime}}</span></div>
          <div style="white-space:nowrap; info">序列号：{{item.assetSN}}</div>
        </div>

      </div>
      <div class="manage border-bottom info">
        <span>管理人：{{item.uName}}</span><span>责任人：{{item.responsibleName}}</span>
      </div>
      <div class="foot">
        {{$store.state.user_in.hosName}}固定资产标签
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["AssetData"],
  data() {
    return {};
  },
  computed: {
    middleData() {
      return this.AssetData;
    }
  }
};
</script>
<style lang="less" scoped>
</style>