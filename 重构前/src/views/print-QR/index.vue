<template>
  <div>
    <div class="print-btn">
      <span @click="print">打印</span>
    </div>
    <iframe src=""
            frameborder="0"
            ref='ifr'
            class="iframe"></iframe>
    <div class="prints">
      <component :is='printName'
                 :AssetData='AssetData'
                 ref="QR"></component>
    </div>
  </div>
</template>
<script>
import small_ from "./type/small.vue";
import middle from "./type/middle.vue";
import big from "./type/big.vue";
import "./jqPrint.js";
export default {
  data() {
    return {
      AssetData: []
    };
  },
  components: {
    small_,
    middle,
    big
  },
  computed: {
    printName() {
      if (this.$route.query.type === "1") {
        return "small_";
      } else if (this.$route.query.type === "2") {
        return "middle";
      } else if (this.$route.query.type === "3") {
        return "big";
      } else {
        return "small_";
      }
    },
    data() {
      console.log(this.$route.query.assetIds);
      if (typeof this.$route.query.assetIds === "string") {
        return [this.$route.query.assetIds];
      } else {
        return this.$route.query.assetIds;
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    print() {
      this.$nextTick(() => {
        this.$refs.ifr.contentWindow.document.body.innerHTML = "";
        this.$refs.ifr.contentWindow.document.write(
          this.$refs.QR.$el.outerHTML
        );
        this.$refs.ifr.contentWindow.print();
      });
    },
    getData() {
      this.$axios
        .post(`assets/getNewQrcode`, {
          assetIds: this.data
        })
        .then(({ data }) => {
          data["hosName"] = this.$store.state.user_in.hosName;
          this.AssetData = data;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.print-btn {
  padding: 10px 50px;
  font-size: 16px;
  display: flex;
  justify-content: flex-end;
  border-bottom: 3px solid #459ca2;
  span {
    cursor: pointer;
    &:hover {
      color: #459ca2;
    }
  }
}
@media print {
  .print-btn {
    display: none;
  }
}
.iframe {
  width: 100%;
  height: 100%;
  display: none;
}
@media print {
  .iframe {
    display: block;
  }
}
</style>

