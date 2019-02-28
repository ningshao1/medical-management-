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
      line-height: 1;
      }
      .weight {
      font-weight: 500;
      }
      .tag-wrap {
      width: 100mm;
      height: 79.9mm;
      background: #fafafa;
      overflow: hidden;
      margin: 4mm auto;
      color: #000;
      }
      img {
      width: 12mm;
      margin: auto;
      vertical-align: middle;
      height: 12mm;
      }
      h1,
      h2,
      p {
      margin: 0;
      }
      .tag-title {
      padding-top: 3mm;
      /* background-color: #000; */
      text-align: center;
      font-size: 4.94mm;
      line-height: 10mm;
      font-family: "Microsoft YaHei";
      }
      .asset-info-wrap {
      padding: 3mm;
      padding-top: 1mm;
      font-family: "黑体";
      }
      .asset-name {
      padding-bottom: 2mm;
      border-bottom: 1mm solid #000;
      font-size: 4.94mm;
      font-weight: normal;
      }
      .asset-info {
      font-size: 3.53mm;
      }
      .layout {
      display: flex;
      }
      .layout > * {
      flex-shrink: 0;
      }
      .grow {
      flex-grow: 1;
      }
      .bb {
      border-bottom: 0.1mm solid #000;
      }
      .bl {
      border-left: 0.1mm solid #000;
      }
      .asset-field {
      line-height: 7mm;
      }
      .asset-field > * {
      vertical-align: top;
      }
      .label {
      width: 18mm;
      display: inline-block;
      text-align: right;
      }
      .label.short {
      letter-spacing: 0.9mm;
      }
      .qr {
      padding: 2mm;
      }
      .qr > img {
      width: 23mm;
      height: 23mm;
      }
      #asset-vender {
      display: block;
      }
      .aseet-service {
      display: flex;
      justify-content: space-between;
      align-items: center;
      }
      @media print {
      .tag-wrap {
      margin: 0;
      }
      }
      /* .label.duty{
      width: auto;
      letter-spacing: 1.3mm;
      } */

    </component>
    <div class="tag-wrap"
         v-for="item in bigData">
      <h1 class="tag-title">{{$store.state.user_in.hosName}}固定资产标签</h1>
      <div class="asset-info-wrap">
        <h2 class="asset-name">{{item.assetName}}</h2>
        <div class="asset-info">
          <div class="layout bb">
            <div class="grow">
              <div class="bb">
                <p class="asset-field">
                  <span class="label">设备编码：</span>{{item.assetCode}}
                </p>
                <p class="asset-field">
                  <span class="label short">序列号：</span>{{item.assetSN}}
                </p>
              </div>
              <div>
                <p class="asset-field">
                  <span class="label">设备品牌：</span>{{item.brandName}}
                </p>
                <p class="asset-field">
                  <span class="label">设备型号：</span>{{item.assetClass}}
                </p>
              </div>
            </div>
            <div class="qr bl">
              <img :src="`data:image/png;base64,${item.qrCode}`"
                   alt="">
            </div>
          </div>
          <div class="layout bb">
            <div class="grow">
              <p class="asset-field">
                <span class="label">所属科室：</span>{{item.osName}}
              </p>
              <p class="asset-field">
                <span class="label short">管理人：</span>{{item.uName}}
              </p>
            </div>
            <div class="grow">
              <p class="asset-field">
                <span class="label">装机时间：</span>{{item.collarTime}}
              </p>
              <p class="asset-field">
                <span class="label short duty">责任人：</span>{{item.responsibleName}}
              </p>
            </div>
          </div>
          <div>

            <p class="asset-field"
               id='asset-vender'>
              <span class="label">生产厂家：</span>{{item.manufactor}}
            </p>
            <!-- <p class="asset-field">
                                <span class="label">维修公司：</span>南京恺立达
                            </p> -->

            <div class="asset-field aseet-service">
              <div>
                <span class="label">维修公司：</span>南京恺立达
              </div>
              <div>
                <span class="label">维修电话：</span>025-56673939
              </div>
            </div>

          </div>
        </div>
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
    bigData() {
      return this.AssetData;
    }
  }
};
</script>
<style lang="less" scoped>
</style>

