<template>
  <div class="samll-QR">
    <component :is='"style"'>
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
      .QR {
      width: 40mm;
      height: 29.9mm;
      background: #fafafa;
      margin: auto;
      /* padding:0 3mm; */
      font-family: "黑体" !important;
      overflow: hidden;
      color: #000;
      margin: 5mm auto;
      padding-top: 2mm;
      }
      .QR .bianma {
      padding-top: 0.2mm;
      font-size: 3.3mm;
      text-align: center;
      }
      .QR .yiyuan {
      font-size: 2.82mm;
      font-weight: 550;
      text-align: center;
      letter-spacing: -1px;
      }
      .QR img {
      width: 14mm;
      height: 14mm;
      }
      .QR p {
      padding: 0;
      margin: 0;
      }
      .QR .name {
      font-size: 2.8mm;
      line-height: 3mm;
      max-height: 9mm;
      overflow: hidden;
      -webkit-text-size-adjust: none;
      }
      .QR .keshi {
      margin-top: 1.5mm;
      font-size: 2.82mm;
      }
      .QR .QR-title {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #000;
      padding: 0.4mm 3mm;
      padding-bottom: 1mm;
      border-bottom: 0.5px solid #000;
      }
      .QR .QR-title .title-info {
      padding: 0 0.2mm;
      }
      @media print {
      .QR {
      margin: 0;
      padding-top: 0;
      }
      }

    </component>
    <div class="QR"
         v-for="item in smallData">
      <div class="QR-title">
        <div class="title-info">
          <div class="name">
            {{item.assetName}}
          </div>
          <div class="keshi">
            {{item.osName}}
          </div>
        </div>
        <img :src="`data:image/png;base64,${item.qrCode}`"
             alt="">
      </div>
      <p class="bianma">{{item.assetCode}}</p>
      <p class="yiyuan">{{$store.state.user_in.hosName}}固定资产标签</p>
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
    smallData() {
      return this.AssetData;
    }
  },
  created() {
    console.log(require("./big.vue"));
  }
};
</script>

<style lang="less" scoped>
/deep/ body {
  margin: 0;
  padding: 0;
  // font-size: "32131"
}

@page {
  size: auto;
  /* auto is the initial value */
  margin: 0mm;
  /* this affects the margin in the printer settings */
  padding: 0;
  margin: 0;
}

.QR {
  width: 40mm;
  height: 29.9mm;
  background: #fafafa;
  margin: auto;
  /* padding:0 3mm; */
  font-family: "黑体" !important;
  overflow: hidden;
  color: #000;
  margin: 5mm auto;
  padding-top: 2mm;
  .bianma {
    padding-top: 0.2mm;
    font-size: 3.3mm;
    text-align: center;
  }
  .yiyuan {
    font-size: 2.82mm;
    font-weight: 550;
    text-align: center;
    letter-spacing: -1px;
  }
  img {
    width: 14mm;
    height: 14mm;
  }

  p {
    padding: 0;
    margin: 0;
  }

  .name {
    font-size: 2.8mm;
    // font-weight: 550;
    line-height: 3mm;
    max-height: 9mm;
    overflow: hidden;
    -webkit-text-size-adjust: none;
  }

  .keshi {
    margin-top: 1.5mm;
    font-size: 2.82mm;
  }

  .QR-title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #000;
    padding: 0.4mm 3mm;
    padding-bottom: 1mm;
    border-bottom: 0.5px solid #000;
    .title-info {
      padding: 0 0.2mm;
    }
  }
}
@media print {
  .QR {
    margin: 0;
    padding-top: 0;
  }
}
/* @media print {
        .QR {
            margin: 0;
        }
    } */
</style>
