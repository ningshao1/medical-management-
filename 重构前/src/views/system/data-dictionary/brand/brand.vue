<template>
    <div style="position:relative;">
        <i-input icon="ios-search"  style="width:270px;;cursor:pointer;position:absolute;top:-70px;right:0;" placeholder="请输入品牌关键字" v-model="searchKey"></i-input>
        <div class="brand-content">
            <div class="content-box">
                <div class="content-info">
                    <div class="content-tit">
                        <h3>品牌管理</h3>
                        <Button shape="circle" class="kld-btn" icon="plus" v-show="ViewLimit('org:bra:add')" @click="add_p">新增品牌</Button>
                    </div>

                    <div class="content-tree">
                        <Loading v-if='spanshow'></Loading>
                        <Table class='i-table-stripe' height="520" border :columns="columns7" :data="data6"></Table>
                        <Page style="text-align:center; margin-top: 5px;" :current.sync="currentPage" :total="page.recordsTotal" :page-size="10" @on-change='change_page'></Page>
                    </div>
                </div>

            </div>
        </div>
        <Modal v-model="brand_info.addbrand" :title="brand_info.title" width="900" @on-ok='add_brand($event,brand_info.judge)' :loading="brand_info.loading">
            <!-- <div class='one_Messager' v-show="brand_info.errMessage">
                <span>
                    <img src="src/img/error1.png" alt="">
                </span>
                <span>您新增或者修改的品牌已存在</span>
            </div> -->
            <ul class="mode">
                <li>
                    <p>品牌名称：
                        <span>* </span>
                    </p>
                    <input type="text" maxlength='100' placeholder="请输入品牌名称" v-model="brand_info.name">
                    <ul class="brandList" v-show="dropBrandShow">
                        <li v-for="(item,i ) in searchList" :key='i'>{{item.brandName}}</li>
                    </ul>
                </li>
                <li>
                    <p>品牌国别：
                        <span>* </span>
                    </p>
                    <div>
                        <Select v-model="select_.model13" filterable>
                            <Option v-for="(option, index) in test_country" :value="option.value+''" :key="index">{{ option.label }}</Option>
                        </Select>
                    </div>
                </li>
                <li>
                    <p>厂家名称：
                    </p>
                    <input type="text" maxlength='100' placeholder="请输入厂家名称" v-model="brand_info.Supplier">
                </li>
                <li>
                    <p>联系方式：
                    </p>
                    <input type="text" placeholder="请输入联系方式" v-model="brand_info.contactWay">
                </li>
            </ul>
        </Modal>
        <pop :msginfo='del_info' @pro_ok='remove(del_e)'></pop>
    </div>

</template>

<script>
import pop from "../../../../common/prompt/prompt";
export default {
    data() {
        return {
            searchKey:'',
            limit: JSON.parse(localStorage.getItem("limit")),
            left_index: 0,
            //左侧点击的ID值
            left_id: "",
            //点击获取权限的值
            left_limit: "",
            //下拉框的值
            model1: "",
            currentPage: 1,
            //   列表数据
            columns7: [
                {
                    width: 100,
                    title: "序号",
                    key: "order",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                style: {
                                    color: params.row.flag ? "#5ba4c8" : ""
                                }
                            },
                            // params.row.order
                            String(
                                params.index + 1 + (this.currentPage - 1) * 10
                            ).padStart(2, "0")
                        );
                    }
                },
                {
                    title: "品牌名称",
                    key: "band_name",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    class: "textEllipsis",
                                    title: params.row.band_name
                                },
                                style: {
                                    color: params.row.flag ? "#5ba4c8" : ""
                                }
                            },
                            params.row.band_name
                        );
                    }
                },
                {
                    title: "品牌国别",
                    key: "band_nationality",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    class: "textEllipsis",
                                    title: params.row.band_nationality
                                },
                                style: {
                                    color: params.row.flag ? "#5ba4c8" : ""
                                }
                            },
                            params.row.band_nationality
                        );
                    }
                },
                {
                    title: "厂家名称",
                    key: "Supplier",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    class: "textEllipsis",
                                    title: params.row.Supplier
                                },
                                style: {
                                    color: params.row.flag ? "#5ba4c8" : ""
                                }
                            },
                            params.row.Supplier
                        );
                    }
                },
                {
                    title: "联系方式",
                    key: "contactWay",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    class: "textEllipsis",
                                    title: params.row.contactWay
                                },
                                style: {
                                    color: params.row.flag ? "#5ba4c8" : ""
                                }
                            },
                            params.row.contactWay
                        );
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 150,
                    align: "center",
                    render: (h, params) => {
                        console.log(params.row.osId,this.$store.state.user_in.osId)
                        if (params.row.osId!==this.$store.state.user_in.osId) {
                            return ;
                        } else {
                            return h("div", [
                                this.ViewLimit("org:bra:edit")
                                    ? h(
                                          "span",
                                          {
                                              props: {
                                                  type: "primary",
                                                  size: "small"
                                              },
                                              style: {
                                                  marginRight: "5px",
                                                  fontSize: "14px",
                                                  color: "#5ba4c8",
                                                  cursor: "pointer"
                                              },
                                              on: {
                                                  click: () => {
                                                      this.show(params);
                                                  }
                                              }
                                          },
                                          "修改"
                                      )
                                    : null,
                                this.ViewLimit("org:bra:del")
                                    ? h(
                                          "span",
                                          {
                                              props: {
                                                  type: "error",
                                                  size: "small"
                                              },
                                              style: {
                                                  marginRight: "5px",
                                                  fontSize: "14px",
                                                  color: "#5ba4c8",
                                                  cursor: "pointer"
                                              },
                                              on: {
                                                  click: () => {
                                                      this.removes(params);
                                                  }
                                              }
                                          },
                                          "删除"
                                      )
                                    : null
                            ]);
                        }
                    }
                }
            ],
            //弹窗信息
            brand_info: {
                name: "", //输入的品牌的名字
                nationality: null, //输入的国家的名字
                errMessage: false, //控制提示条显示
                addbrand: false, //控制弹窗显示
                loading: true,
                judge: "",
                id: "",
                title: "",
                Supplier: null,
                contactWay: null
            },
            data6: [],
            user_info: JSON.parse(localStorage.getItem("user_in")),
            //分页信息
            page: {
                recordsTotal: 0,
                pagination: 0
            },
            select_: {
                model13: "",
                loading1: false,
                options1: []
            },
            all_country: [], //所有国家的信息
            //model11: 10,
            test_country: [],
            //删除框
            del_info: {
                title: "删除品牌",
                okText: "删除",
                name: "是否删除该品牌？",
                modal2: false
            },
            del_e: "",
            spanshow: false,
            searchList: [], //局部搜索后的品牌列表
            brandList: [], //品牌列表
            tempBrandName: "",
            dropBrandShow: true
        };
    },
    created() {
        this.get_all();
        // setTimeout(() => {
        //     this.get_brand(0);
        // }, 200)
        this.get_brand(0);
        this.getAllBrand();
    },
    methods: {
        //获取品牌管理列表
        get_brand(page = 0) {
            this.spanshow = true;
            this.page.pagination = page;
            let list = [];
            const that = this;
            this.axios
                .post(`assertBrandcopys/${this.user_info.osId}/list`, {
                    limit: 10,
                    offset: page,
                    params: {
                        keyword: this.searchKey == "" ? null : this.searchKey
                    }
                })
                .then(res => {
                    
                
                    this.data6 = res.data.data.map((item, index)=>{
                        return {
                            order: "0" + (index + 1),
                            band_name: item.brandName,
                            band_nationality: item.modeCountry,
                            flag: item.flag,
                            id: item.brandId,//id=>brandId
                            band_index: item.modeCountry,
                            Supplier: item.manufactor,
                            contactWay: item.manufactorPhone,
                            osId:item.osId
                        }
                    })
                    this.page.recordsTotal = res.data.recordsTotal;
                    this.spanshow = false;
                })
                .catch(error => {
                    this.spanshow = false;
                });
        },
        //添加信息事件
        add_brand(e, j) {
            //j=1 调用添加接口 2 调用修改借口
            const that = this;
            setTimeout(() => {
                that.brand_info.loading = false;
                that.$nextTick(() => {
                    that.brand_info.loading = true;
                });
            });
            if (
                this.brand_info.name == null ||
                this.brand_info.name.trim() == ""
            ) {
                this.$Message.warning("请填写科室名称");
                return;
            }
            if (this.select_.model13 == null || this.select_.model13 == "") {
                this.$Message.warning("请选择国别");
                return;
            }
            that.brand_info.loading = true;
            if (j == 1) {
                let temp = this.all_country.find(e => {
                    return e.id == this.select_.model13;
                }).countryName;
                this.axios
                    .post(`assertBrandcopys/${this.user_info.osId}`, {
                        brandName: this.brand_info.name,
                        modeCountry: temp,
                        manufactor:
                            this.brand_info.Supplier == null ||
                            this.brand_info.Supplier == ""
                                ? null
                                : this.brand_info.Supplier.trim(),
                        manufactorPhone:
                            this.brand_info.contactWay == null ||
                            this.brand_info.contactWay == ""
                                ? null
                                : this.brand_info.contactWay.trim()
                    })
                    .then(res => {
                        that.$Message.success("添加品牌成功");
                        that.brand_info.addbrand = false;
                        this.get_brand(this.page.pagination);
                    })
                    .catch(error => {
                        that.brand_info.addbrand = true;

                        if (error.code == 400) {
                            that.$Message.warning(error.message);
                            // that.brand_info.errMessage = true;
                            setTimeout(() => {
                                that.brand_info.errMessage = false;
                            }, 1500);
                        } else {
                            that.$Message.error("添加品牌错误");
                        }
                    });
            } else {
                this.change_();
            }
        },
        add_p() {
            this.brand_info.addbrand = true;
            this.brand_info.name = "";
            this.brand_info.nationality = "";
            this.brand_info.judge = 1;
            this.brand_info.title = "新增品牌";
            this.brand_info.Supplier = "";
            this.brand_info.contactWay = "";
            this.select_.model13 = "";
        },
        //管理列表删除
        removes(e) {
            if (
                this.limit.findIndex(e => {
                    return e.plPermission == "org:bra:del";
                }) == -1
            ) {
                that.$Message.error("对不起您没有权限");
                return;
            }
            this.del_info.modal2 = true;
            this.del_e = e;
        },
        remove(e) {
            const that = this;
            if (e.row.osId==="-1") {
                this.$Message.warning("内置厂商不允许删除");
                return;
            }
            this.axios
                .delete(`assertBrandcopys/${this.user_info.osId}/${e.row.id}`, {
                    osId: this.user_info.osId,
                    brandId: e.row.id//id=>brandId
                })
                .then(res => {
                    that.$Message.success("列表删除成功");
                    this.get_brand(this.page.pagination);
                })
                .catch(error => {
                    that.$Message.error("列表删除失败");
                });
        },
        //点击修改事件
        show(e) {
            console.log(e);
            if (
                this.limit.findIndex(e => {
                    return e.plPermission == "org:bra:edit";
                }) == -1
            ) {
                this.$Message.warning("对不起您没有权限");
                return;
            }
            this.tempBrandName = e.row.band_name;
            this.brand_info.Supplier = e.row.Supplier;
            this.brand_info.contactWay = e.row.contactWay;
            this.brand_info.addbrand = true;
            this.brand_info.name = e.row.band_name;
            this.brand_info.nationality = e.row.band_nationality;
            this.brand_info.id = e.row.id;

            this.brand_info.title = "修改品牌";
            this.brand_info.judge = 2;
            this.brand_info.index = e.index;
            this.select_.model13 =
                this.all_country.find(v => {
                    return v.countryName == e.row.band_nationality;
                }).id + "";
        },
        //修改发送接口
        change_(e) {
            const that = this;
            let temp = this.all_country.find(e => {
                return e.id == this.select_.model13;
            }).countryName;
            console.log(temp);
            this.axios
                .put(
                    `assertBrandcopys/${this.user_info.osId}/${
                        this.brand_info.id
                    }`,
                    {
                        brandId: this.brand_info.id,
                        brandName: this.brand_info.name,
                        //flag: true,
                        osId: this.user_info.osId,
                        modeCountry: temp,
                        manufactor:
                            this.brand_info.Supplier == null ||
                            this.brand_info.Supplier == ""
                                ? ""
                                : this.brand_info.Supplier.trim(),
                        manufactorPhone:
                            this.brand_info.contactWay == null ||
                            this.brand_info.contactWay == ""
                                ? ""
                                : this.brand_info.contactWay.trim()
                    }
                )
                .then(res => {
                    that.$Message.success("修改品牌成功");
                    that.brand_info.addbrand = false;
                    //刷新数据
                    that.data6[that.brand_info.index].band_name =
                        res.data.brandName;
                    that.data6[that.brand_info.index].band_nationality =
                        res.data.modeCountry;
                    that.data6[that.brand_info.index].Supplier =
                        res.data.manufactor;
                    that.data6[that.brand_info.index].contactWay =
                        res.data.manufactorPhone;
                    //that.get_brand(that.page.pagination);
                })
                .catch(error => {
                    if (error.code == 400) {
                        that.brand_info.errMessage = true;
                        setTimeout(() => {
                            that.brand_info.errMessage = false;
                        }, 1500);
                    } else {
                        that.$Message.error("修改品牌错误");
                    }
                });
        },
        //触发点击页码事件
        change_page(e) {
            this.get_brand((e - 1) * 10);
        },
        //厂商管理接口调用
        get_manufacturer() {
            this.axios
                .post(`manufactorcopys/${this.user_info.osId}/list`, {
                    limit: 9,
                    offset: 0,
                    params: {}
                })
                .then(res => {})
                .catch(error => {});
        },
        //搜索下拉框
        // remoteMethod1(query) {
        //     if (query !== "") {
        //         this.loading1 = true;
        //         setTimeout(() => {
        //             this.loading1 = false;
        //             const list = this.all_country.map(item => {
        //                 return {
        //                     value: item.id,
        //                     label: item.countryName
        //                 };
        //             });
        //             console.log(list);
        //             this.select_.options1 = list.filter(item => {
        //                 console.log(query);
        //                 return item.label.indexOf(query) > -1;
        //             });
        //         }, 200);
        //     } else {
        //         this.select_.options1 = [];
        //     }
        // },
        //获取所有国家的信息
        get_all() {
            this.axios
                .get("country/list")
                .then(res => {
                    this.all_country = res.data;
                    let temp = [];
                    this.all_country.forEach(item => {
                        temp.push({
                            value: item.id.toString(),
                            label: item.countryName.toString()
                        });
                    });
                    this.test_country = temp;
                    // console.log(this.test_country);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //获取所有品牌
        getAllBrand() {
            this.$axios.get(`/assertBrandcopys/listbrand`).then(res => {
                this.AllBrand = res.data;
            });
        },
        //搜索品牌
        searchBrand() {
            let temp = [];
            this.AllBrand.map(v => {
                if (v instanceof Object && v !== null) {
                    console.log(v.brandName);
                    // console.log(v.brandName.includes(this.brand_info.name))
                    if (v.brandName.includes(this.brand_info.name)) {
                        temp.push(v);
                    }
                }
            });
            this.searchList = temp;
        }
    },
    components: {
        pop
    },
    watch: {
        searchKey(val, old) {
            this.get_brand();
        },
        "brand_info.name"(v) {
            if (v === "") {
                this.searchList = [];
                return;
            }
            if (
                this.brand_info.title === "修改品牌" &&
                v === this.tempBrandName
            ) {
                this.dropBrandShow = false;
                return;
            } else {
                this.dropBrandShow = true;
            }
            this.searchBrand();
        }
    }
};
</script>

<style scoped lang='less'>
.one_Messager {
    height: 30px;
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 15px;
    position: absolute;
    width: 39%;
    top: 25px;
    transform: translate(-50%, -50%);
    left: 50%;
    // display: none;
    span:nth-of-type(1) {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: rgba(255, 0, 0, 0.15);
        text-align: center;
        line-height: 38px;
        border-radius: 50%;
    }
    span:nth-of-type(2) {
        padding-left: 45px;
        line-height: 30px;
        color: #cc0000;
    }
}
.mode {
    display: flex;
    margin: 20px;
    justify-content: space-between;
    flex-wrap: wrap;

    > li {
        width: 49%;
        margin-bottom: 20px;
        position: relative;
        p {
            font-size: 14px;
            margin-bottom: 10px;
            color: #000000;
            span {
                color: #f2740c;
            }
        }
        input {
            height: 50px;
            width: 100%;
            background-color: #ffffff;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.2);
            padding-left: 20px;
        }
    }
    .brandList {
        max-height: 144px;
        overflow: auto;
        z-index: 100;
        position: absolute;
        background: #fafafa;
        width: 100%;
        li {
            padding: 10px;
        }
    }
}
.brand-content {
    .content-title {
        h2 {
            font-size: 20px;
            font-weight: normal;
            color: #333333;
        }
    }
    .content-box {
        height: 645px;
        background-color: #fafafa;
        display: flex;
        h2 {
            padding-top: 20px;
            padding-left: 20px;
            font-size: 14px;
            font-weight: normal;
            color: #333333;
            height: 55px;
            border-bottom: solid 1px rgba(2, 31, 57, 0.2);
        }

        .content-list {
            width: 20%;
            border-right: solid 1px rgba(2, 31, 57, 0.2);

            .list-info {
                li {
                    display: flex;
                    justify-content: space-between;
                    padding: 22px;
                    height: 56px;
                    background-color: #f5f6fa;
                    border: solid 1px #dce0e6;
                    cursor: pointer;
                    p:nth-child(1) {
                        font-size: 14px;
                    }
                    p:nth-child(2) {
                        font-size: 14px;
                        width: 40px;
                        height: 30px;
                        background-color: #ffffff;
                        border-radius: 15px;
                        border: solid 1px #dce0e6;
                        text-align: center;
                        margin-top: -8px;
                        line-height: 30px;
                    }

                    &:hover {
                        border-left: solid 1px #01b0c7;
                        background-color: #ffffff;
                    }
                    &:hover p:nth-child(1) {
                        color: #01b0c7;
                    }
                    &:hover p:nth-child(2) {
                        border-color: #01b0c7;
                        color: #01b0c7;
                    }
                }
            }
        }
        .content-info {
            width: 100%;
            .content-tit {
                display: flex;
                justify-content: space-between;
                border-bottom: solid 1px rgba(2, 31, 57, 0.2);
                height: 55px;
                h3 {
                    font-size: 15px;
                    font-weight: 600;
                    color: #333333;
                    padding-top: 20px;
                    padding-left: 20px;
                }
            }
            .content-tree {
                height: 564px;
                background-color: #fafafa;
                border-radius: 3px;
                border: solid 1px #dce0e6;
                margin: 20px 10px 10px;
                position: relative;
                //padding: 20px;
                table {
                    border: none;
                    tr {
                        border: none;
                        border-bottom: solid 1px rgba(2, 31, 57, 0.1);
                        height: 50px;
                        text-align: left;
                        font-size: 14px;
                        th {
                            color: #666666;
                            border: none;
                        }
                        td {
                            border: none;
                        }
                    }
                }
            }
        }
    }
}

.line {
    height: 1px;
    background-color: #ccd2d7;
    margin-top: 10px;
    margin-bottom: 20px;
}
</style>