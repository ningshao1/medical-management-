<template>
  <div class="detail">
    <kld-type :title='"基础信息"'
              class="type"></kld-type>
    <i-row :gutter='20'
           class="detail-info">
      <i-col :span='8'>
        <div class="os-info">
          所属科室：{{osName}}</div>
      </i-col>
      <i-col :span='8'>
        <div class="os-info">
          科室电话：{{osPhone}}</div>
      </i-col>
    </i-row>
    <kld-type :title='"应急物资列表"'
              class="type"></kld-type>
    <Table class='i-table-stripe'
           :columns="listColumns"
           :data="tableData"
           :no-data-text="'暂无列表'">
    </Table>

    <kld-page :current.sync='page.current'
              :total='page.total'
              @on-change='getDetail'
              :page-size="page.size"
              style="margin-top:5px;">
    </kld-page>
  </div>
</template>
<script>
import type from "@common/kld-type";
import page from "@common/page/index";
export default {
  data() {
    return {
      tableData: [],
      listColumns: [
        {
          title: "状态",
          key: "used",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type:
                    params.row.used === 1
                      ? "success"
                      : params.row.used === 4
                      ? "warning"
                      : ""
                },
                style: {
                  backgroundColor: params.row.used === 1 ? "#22a1b9" : ""
                }
              },
              params.row.used === 1
                ? "在用"
                : params.row.used === 4
                ? "待用"
                : ""
            );
          }
        },
        {
          title: "设备名称",
          key: "assetName",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#22a1b9"
                }
              },
              params.row.assetName
            );
          }
        },
        {
          title: "设备信息",
          key: "info",
          render: (h, params) => {
            return h("div", [
              h(
                "div",
                {
                  style: {
                    color: "#666",
                    padding: "3px 0px"
                  }
                },
                this.isTrue(params.row.assetClass)
                  ? "型号：" + params.row.assetClass
                  : ""
              ),
              h(
                "div",
                {
                  style: {
                    color: "#666"
                  }
                },
                this.isTrue(params.row.brandName)
                  ? "品牌：" + params.row.brandName
                  : ""
              )
            ]);
          }
        },
        {
          title: "设备分类",
          key: "typeName"
        }
      ],
      page: {
        size: 4,
        total: 10,
        current: 1
      },
      osName: "",
      osPhone: ""
    };
  },
  components: {
    [type.name]: type,
    [page.name]: page
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  created() {
    this.getDetail();
    this.getosName();
  },
  methods: {
    getDetail() {
      this.$axios
        .post(`EmergencyMaterials/getDetail`, {
          limit: this.page.size,
          offset: (this.page.current - 1) * this.page.size,
          params: {
            departmentId: this.id
          }
        })
        .then(({ data: { data, recordsTotal } }) => {
          this.page.total = recordsTotal;
          this.tableData = data;
        });
    },
    getosName() {
      this.$axios
        .get(`EmergencyMaterials/getOsIdDetail/${this.id}`)
        .then(({ data: { os_Name, os_Phone } }) => {
          this.osName = os_Name;
          this.osPhone = os_Phone ? os_Phone : "暂无";
        });
    },
    isTrue(val = null) {
      return val !== "" && val !== null;
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
  /deep/.type {
    > p {
      padding-bottom: 8px;
    }
  }
}
.os-info {
  font-size: 14px;
  padding-left: 5px;
}
.detail-info{
  margin-bottom: 6px;
}
</style>


