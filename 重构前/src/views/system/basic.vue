<template>

    <div class="basic-content">
        <div class="content-title">
            <h2>基础信息</h2>
            <div class="line"></div>
        </div>
        <div class="content-box"
             style='position:relative;'>
            <Kloading v-if="spinShow"></Kloading>
            <div class="basic-list">
                <ul>
                    <li>
                        <p>医院名称：
                            <span style="color: #f2740c;">*</span>
                        </p>
                        <input type="text"
                               placeholder="请输入医院名称"
                               v-model.trim="basics.hospital">
                    </li>
                    <li>
                        <p>医院简称：
                            <span style="color: #f2740c;"></span>
                        </p>
                        <input type="text"
                               placeholder="请输入医院简称"
                               v-model.trim="basics.osShortname">
                    </li>
                    <li>
                        <p>联系人：
                            <span style="color: #f2740c;">*</span>
                        </p>
                        <input type="text"
                               placeholder="请输入联系人"
                               v-model.trim='basics.contact'>
                    </li>
                    <li>
                        <p>联系方式：
                            <span style="color: #f2740c;">*</span>
                        </p>
                        <input type='tel'
                               placeholder="请输入联系方式 "
                               v-model.trim="basics.tel">
                    </li>
                    <li style="width:20%">
                        <p>医院地址：</p>
                        <Cascader :data="data4"
                                  :load-data="loadData"
                                  @on-change='get_a'
                                  v-model="value2"></Cascader>

                    </li>
                    <li style="width:79%">
                        <p></p>
                        <input type="text"
                               placeholder="详细地址"
                               v-model.trim="basics.address">
                    </li>

                </ul>

                <div class="tree-btn"
                     @click="save_info">
                    <div class="retrieval-btn">
                        <Button class="btn-active"
                                :loading='spinShow'>保存</Button>
                    </div>

                </div>

            </div>

        </div>
    </div>

</template>

<script>
import Kloading from "../../common/loading//loading";
export default {
    data() {
        return {
            data4: [],
            basics: {
                hospital: "",
                contact: "",
                tel: "",
                address: "",
                region: ["", "", ""],
                osShortname: ""
            },
            osParentid: "",
            value2: null,
            spinShow: true
        };
    },
    created() {
        //获取省级信息
        this.get_province();
        this.get_info();
    },
    methods: {
        loadData(item, callback) {
            item.loading = true;
            if (item.type == 1) {
                this.axios
                    .get(`address/provinceList/${item.value}`)
                    .then(res => {
                        res.data.forEach(items => {
                            item.children.push({
                                value: items.value,
                                label: items.label,
                                loading: false,
                                children: [],
                                type: items.type
                            });
                        });
                        item.loading = false;
                        callback();
                    });
            } else if (item.type == 2) {
                this.axios
                    .get(`address/provinceList/{provinceid}/${item.value}`)
                    .then(res => {
                        res.data.forEach(items => {
                            item.children.push({
                                value: items.value,
                                label: items.label
                            });
                        });
                        item.loading = false;
                        callback();
                    });
            } else if (item.type == 3) {
                return;
            }
        },
        //获取省信息
        get_province() {
            const that = this;
            let pro_list = [];
            this.axios.get(`address/provinceList`).then(res => {
                res.data.forEach(item => {
                    pro_list.push({
                        value: item.value,
                        label: item.label,
                        loading: false,
                        type: item.type,
                        children: []
                    });
                });
            });
            that.data4 = pro_list;
        },
        //获取值
        get_a(e, p) {
            this.basics.region = e;
        },
        //提交接口
        post_info() {
            const that = this;
            this.$axios
                .put(`/orgstruct/updatehospital`, {
                    provinceid: that.basics.region[0] + "",
                    cityid: that.basics.region[1] + "",
                    areaid: that.basics.region[2] + "",
                    osName: that.basics.hospital,
                    osPhone: that.basics.tel,
                    osContact: that.basics.contact,
                    osShortname: that.basics.osShortname,
                    osAddress: that.basics.address,
                    osParentid: this.osParentid,
                    id: JSON.parse(localStorage.getItem("user_in")).osId
                })
                .then(res => {
                    that.$Message.success("修改信息保存成功");
                });
        },
        save_info() {
            const that = this;
            if (that.basics.hospital == null || that.basics.hospital == "") {
                this.$Message.warning("请输入医院名称");
                return;
            }
            if (that.basics.contact == null || that.basics.contact == "") {
                this.$Message.warning("请输入联系人");
                return;
            }
            if (this.basics.tel == null || this.basics.tel == "") {
                this.$Message.warning("请填写联系方式");
                return;
            } else {
                if (!/^\d+[-]?\d+$/.test(this.basics.tel)) {
                    this.$Message.warning("请填写正确的联系方式");
                    return;
                }
            }

            if (!this.basics.tel.replace(/\D/gi, "")) {
                this.$Message.warning("联系方式只准是数字");
                return;
            }
            this.post_info();
        },
        //回显信息
        get_info() {
            this.spinShow = true;
            const that = this;
            this.axios
                .get(
                    `/orgstruct/query/${
                        JSON.parse(localStorage.getItem("user_in")).osId
                    }`
                )
                .then(res => {
                    that.basics.hospital = res.data.osName;
                    that.basics.osShortname = res.data.osShortname;
                    that.basics.contact = res.data.osContact;
                    that.basics.tel = res.data.osPhone;
                    that.basics.address = res.data.osAddress;
                    this.osParentid = res.data.osParentid;
                    that.value2 = [
                        res.data.provinceid,
                        res.data.cityid,
                        res.data.areaid
                    ];
                    that.data[
                        that.data4.findIndex(e => {
                            return e.value == res.data.provinceid;
                        })
                    ]["children"] = [
                        {
                            label: res.data.cityid,
                            value: res.data.city,
                            type: 2,
                            children: [
                                {
                                    label: res.data.areaid,
                                    value: res.data.area,
                                    type: 3
                                }
                            ]
                        }
                    ];
                    this.spinShow = false;
                })
                .catch(error => {
                    this.spinShow = false;
                });
        }
    },
    components: {
        Kloading
    }
};
</script>

<style scoped lang='less'>
.basic-content {
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
        border-radius: 3px;
        border: solid 1px #dce0e6;
        padding: 30px 20px;
        position: relative;
        .basic-list {
            ul {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                li {
                    width: 49%;
                    margin-bottom: 20px;
                    p {
                        font-size: 14px;
                        margin-bottom: 20px;
                        color: #000000;
                        height: 30px;
                        // span {
                        //     color: #f2740c;
                        // }
                        // i {
                        //     font-style: normal;
                        //     color: #999999;
                        // }
                    }
                    input {
                        height: 45px;
                        width: 100%;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.2);
                        padding-left: 20px;
                    }
                    input:disabled {
                        background-color: #f5f6fa;
                    }
                }
            }
        }
        .tree-btn {
            height: 50px;
            background-color: #f5f6fa;
            border-radius: 0px 0px 3px 3px;
            position: absolute;
            //left: 0;
            bottom: 0;
            display: flex;
            justify-content: flex-end;
            width: 100%;
            margin-left: -20px;
            .retrieval-btn {
                margin-right: 20px;
                line-height: 50px;
                .btn-active {
                    background-color: #22a1b9;
                    color: #ffffff;
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