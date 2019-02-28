<template>
    <div>
        <div class="content">
            <div class="nav-title">
                <div class="nav-line"></div>
                <ul>
                    <li style="cursor:pointer">
                        <router-link to="/index/home" style=" color: #999 ">首页</router-link>

                    </li>
                    <li style="cursor:pointer">
                        <span>></span>

                        预置工作
                    </li>
                    <li v-if="!$route.query.status" style="cursor:pointer">
                        <span>></span>
                        查看合同
                    </li>
                    <li v-else style="cursor:pointer">
                        <span>></span>
                        编辑合同
                    </li>
                </ul>
            </div>
            <div class="nav-sub">
                <h2>合同详情</h2>
            </div>
            <div class="line"></div>
            <div class="main-contract">
                <div class="contract-list">
                    <ul>
                        <li>
                            <p>合同编号：
                                <span>*</span>
                            </p>
                            <input type="text" v-model="infos.contractCode" :disabled="status">
                        </li>
                        <li>
                            <p>合同名称：
                                <span>*</span>
                            </p>
                            <input type="text" v-model="infos.contractName" :disabled="status">
                        </li>
                        <li>
                            <p>签订日期
                                <span>*</span>
                            </p>
                            <!-- <input v-model="infos.signDate" disabled> -->
                            <DatePicker :editable="false" v-model="infos.signDate" format="yyyy-MM-dd" :disabled="status" style="width:100%" @on-change="getStartTime"></DatePicker>
                        </li>
                        <li>
                            <p>合同类型：</p>
                            <!-- <input v-model="infos.contractType" :disabled="status"> -->
                            <input v-show="infos.contractType==1" :disabled="status" value="维保合同">
                            <input v-show="infos.contractType==2" :disabled="status" value="采购合同">
                            <input v-show="infos.contractType==3" :disabled="status" value="维修合同">
                            <input v-show="infos.contractType==4" :disabled="status" value="其它">
                        </li>
                        <li>
                            <p>供应商名称：
                                <span>*</span>
                            </p>
                            <input type="text" v-model="infos.supplierName" :disabled="status">
                        </li>
                        <li>
                            <p>联系人： </p>
                            <input type="text" v-model="infos.supplierContactor" :disabled="status">
                        </li>
                        <li>
                            <p>联系方式： </p>
                            <input type="text" v-model="infos.supplierContact" :disabled="status">
                        </li>
                        <li>
                            <p>采购金额（元）：</p>
                            <input type="number" v-model="infos.purchaseAmount" :disabled="status">
                        </li>
                        <!-- <li>
                            <p>厂家名称：</p>
                            <input type="text" v-model="infos.manufactorName" :disabled="status">
                        </li>
                        <li>
                            <p>厂家联系方式：：</p>
                            <input type="number" v-model="infos.manufactorPhone" :disabled="status">
                        </li> -->
                        <li style="width: 100%">
                            <p>合同标签： </p>
                            <div class="lable-content">
                                <input type="text" style=" cursor: pointer;" class="labebtn" disabled="true">
                                <div class="lable-list">
                                    <div class="asset-lable" v-for="(item,index) in infos.labels" :key="index">{{item.labelName}}</div>
                                </div>
                            </div>

                        </li>

                    </ul>
                </div>

                <div class="stages">
                    <p>分期付款选项：
                        <span>（如合同存在分期请勾选，并填写采购金额）</span>
                    </p>
                    <div class="stages-info">
                        <Checkbox :value="infos.periodsNum !== 0" disabled>分期付款</Checkbox>
                        <div class="stages-mun">
                            <span>分</span>
                            <input type="number" placeholder="分期数" :disabled='status' v-model="infos.periodsNum">
                            <span>期</span>
                        </div>

                    </div>
                    <div class="details">
                        <p>分期详情：</p>
                        <table class="table-stripe" width="100%" border="1" style="border-collapse:collapse;">
                            <tr style="height:38px;background:#f4f4f4;">
                                <th>序号</th>
                                <th>期数</th>
                                <th>付款日期</th>
                                <th>付款金额</th>
                                <th>付款状态</th>
                            </tr>
                            <tr v-for="(item,index) in infos.paymentInstalments" :key="index">
                                <td>{{index+1}}</td>
                                <td>第{{item.periods}}期</td>
                                <td>
                                    <DatePicker :editable="false" placeholder="请选择付款日期" v-model="item.paymentDate" :disabled='status'></DatePicker>
                                </td>
                                <td><i-input type="text" v-model="item.paymentAmount" class="money" disabled></i-input></td>
                                <td>
                                    <Button v-if="item.paymentStatus==0">未支付</Button>
                                    <span v-else>
                                        <img src="./image/complete.png" alt=""> 已支付
                                    </span>
                                </td>
                            </tr>

                        </table>
                    </div>

                    <div class="contract-up">
                        <span class='bx-title'> 合同图片：</span>
                    </div>
                    <ImageView :imgUrlList='infos.attachments' :showStyle='{border: "1px dashed #ccc","background-color":"transparent"}'></ImageView>
                    
                    <p style="font-size: 16px;color: #f2740c;margin-top:20px">合同所含设备</p>
                     <div class="line"></div>
                     <p style="font-size: 16px;color: #f2740c;padding-top: 20px;">设备信息</p>
                    <div class="line"></div>
                    <div class="device-name">
                        <ul v-for="(item,index) in infos.assets" :key="index" style="margin-bottom:10px">
                            <li style="width:24%">
                                <p>设备名称</p>
                                <input type="text" disabled v-model="item.assetName">
                            </li>
                            <li style="width:24%">
                                <p>设备型号 </p>
                                <input type="text" :disabled="status" v-model="item.assetClass">
                            </li>
                            <li style="width:24%" :disabled="status">
                                <p>设备品牌</p>
                                <input type="text" :disabled="status" v-model="item.brandName">
                            </li>
                            <li style="width:24%" :disabled="status">
                                <p>过保日期
                                    <span style="color:#f2740c;">* </span>
                                </p>

                                <!-- <input type="text" :disabled="status" v-model="item.updateTime.slice(0,10)"> -->
                                <DatePicker :editable="false" v-model="item.assetWarrntyDate" format="yyyy-MM-dd" :disabled="status" style="width:100%"></DatePicker>
                            </li>
                        </ul>
                    </div>
                    <p style="font-size: 16px;color: #f2740c;padding-top: 20px;">备件信息</p>
                    <div class="line"></div>
                    <div class="device-name">
                        <ul v-for="(item,index) in infos.spareParts" :key="index" style="margin-bottom:10px">
                            <li style="width:24%">
                                <p>备件名称：</p>
                                <input type="text" v-model="item.sparePartName" :disabled="status">
                            </li>
                            <li style="width:24%">
                                <p>备件型号：

                                </p>
                                <input type="text" v-model="item.sparePartModel" :disabled="status">
                            </li>
                            <li style="width:24%">
                                <p>所属设备：
                                    <span style="color:#f2740c;">* </span>
                                </p>
                                <input type="text" v-model="item.assetName" :disabled="status">

                            </li>
                            <li style="width:24%">
                                <p>设备数量
                                    <span style="color:#f2740c;">*</span>
                                </p>
                                <input type="text" v-model="item.sparePartNum" :disabled="status">
                            </li>
                        </ul>

                    </div>

                </div>
                <div class="asset-footer">
                     <div style="margin-left:20px">
                          <Checkbox v-if="ViewLimit('con:del')" v-model="singles" @on-change="statutts">设为无效合同</Checkbox>
                      </div>
                    <div class="retrieval-btn">
                        <Button @click="back">返回</Button>
                        <Button class="btn-active" @click="edits" v-if="! singles && limit.findIndex(e=>{return e.plPermission=='con:edit'})!=-1">编辑</Button>
                    </div>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
import ImageView from "@common/imageView/ImageView";

export default {
    data() {
        return {
            singles:"",
            show: "",
            time: "",
            single: true,
            limit: JSON.parse(localStorage.getItem("limit")),
            infos: {
                contractCode: "",
                contractName: "",
                signDate: "",
                contractType: "",
                supplierName: "",
                supplierContactor: "",
                supplierContact: "",
                purchaseAmount: "",
                labels: [],
                spareParts: [],
                assets: [],
                periodsNum: "",
                paymentInstalments: [],
                attachments:[]
            }
        };
    },
    computed: {
        info() {
            return JSON.parse(localStorage.getItem("contractlist"));
        },
        status() {
            return ! this.$route.query.status;
        }
    },
    created() {
        this.getinfo();
    },

    methods: {
        
            statutts() {
                if(this.singles){
                this.$Message.warning("此合同已经设为无效合同");
            }
         let osid = JSON.parse(localStorage.getItem("user_in")).osId;
         let status=this.singles?1:0
           this.axios.put(`/contracts/${osid}/${this.info}/status?contractStatus=${status}`).then(res=>{
            
           })

          
        },
        edits(){
          this.$router.push({name: 'edit-contract'});
        },
        getStartTime(data) {
            this.time = data;
        },
        close() {
            this.show = false;
        },
        //获取数据
        getinfo() {

            let osid = JSON.parse(localStorage.getItem("user_in")).osId;

            this.axios
                .get(`contracts/${osid}/${this.info}/`, {
                    limit: 10,
                    offset: 0,
                    params: {}
                })
                .then(res => {
                    this.infos = res.data;
                    this.singles = res.data.contractStatus == 1;
                    let list = [];
                    let lists = [];

                    res.data.paymentInstalments.map(function(item) {
                        let status = item.paymentDate=="1970-01-01" ?"" : item.paymentDate;
                        list.push({
                            paymentDate: status,
                            periods: item.periods,
                            paymentAmount: item.paymentAmount,
                            paymentStatus: item.paymentStatus
                        });
                    });
                    res.data.assets.map(function(item) {
                        let status = item.assetWarrntyDate=="1970-01-01" ?"":  item.assetWarrntyDate;
                        lists.push({
                             assetName: item.assetName,
                            assetClass: item.assetClass,
                            assertBrand: item.assertBrand,
                            assetWarrntyDate: status,
                            brandName:item.brandName,
                            assetClass:item.assetClass
                        });
                    });
                     
                    this.infos.paymentInstalments = list;
                    this.infos.assets = lists;
                    this.infos.purchaseAmount=res.data.purchaseAmount==0?"":this.infos.purchaseAmount=res.data.purchaseAmount
                     
                })
                .catch(error => {
                    console.log(error);
                });
        },
        
        // edit() {
        //     let osid = JSON.parse(localStorage.getItem("user_in")).osId;

        //     this.axios
        //         .put(`contracts/${osid}/${this.info}/`, {
        //             contractCode: this.infos.contractCode,
        //             contractName: this.infos.contractName,
        //             signDate: this.time,
        //             supplierName: this.infos.supplierName,
        //             supplierContactor: this.infos.supplierContactor,
        //             supplierContact: this.infos.supplierContact,
        //             purchaseAmount: this.infos.purchaseAmount,
        //             periodsNum: this.infos.periodsNum,
        //             paymentInstalments: list,
        //             spareParts: this.infos.spareParts,
        //             contractType: this.infos.contractType,
                   
        //             //  assetIds: list,
        //             // labelIds:
        //             // assets
        //         })
        //         .then(res => {
        //             debugger;
        //             this.$Message.info("编辑数据成功");
        //             this.$router.go(-1);
        //         })
        //         .catch(error => {
        //             console.log(error);
        //         });
        // },
        back() {
            this.$router.go(-1);
        }
    },
    components:{
        ImageView
    }
};
</script>

<style scoped lang="less">
.asset-footer{
    display: flex;
    justify-content: space-between;
}
.imgs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 120px;
    cursor: pointer;
}
#mo {
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.7);
    top: 0px;
    left: 0px;
    z-index: 10;
}

.close {
    font-size: 40px;
    font-weight: bold;
    position: absolute;
    top: 20px;
    right: 14%;
    color: #f1f1f1;
}
.close:hover,
.close:focus {
    color: #bbb;
    cursor: pointer;
}
.img-box {
    min-height: 80px;
    border: 1px dashed #ccc;
    display: flex;
}
.money {
    /deep/.ivu-input{
        width: 200px;
    }
    height: 34px;
}
.content {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    .nav-title {
        margin-top: 16px;
        display: flex;
        .nav-line {
            height: 16px;
            width: 4px;
            background-color: #76bdc1;
            display: inline-block;
        }

        li {
            margin-left: 6px;
            display: inline-block;
            font-size: 12px;
            color: #999999;
            position: relative;
            top: -3px;
        }
        li:last-child {
            color: #333333;
        }
        li:last-child span {
            color: #76bdc1;
        }
    }
    .nav-sub {
        h2 {
            font-weight: normal;
            color: #333333;
            font-size: 16px;
            margin-top: 1px;
            line-height: 40px;
        }
    }
    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .main-contract {
        background-color: #fafafa;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin-top: 20px;
        padding: 20px 30px;
        .contract-list {
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
                        span {
                            color: #f2740c;
                        }
                        i {
                            font-style: normal;
                            color: #999999;
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
                    input:disabled {
                        background-color: #f5f6fa;
                    }
                }
            }
        }

        .lable-content {
            position: relative;
            cursor: pointer;
            .lable-list {
                position: absolute;
                display: flex;
                top: 8px;
                left: 10px;
                .asset-lable {
                    padding-right: 5px;
                    text-align: center;
                    height: 36px;
                    min-width: 80px;
                    background-color: #76bdc1;
                    border-radius: 18px;
                    border: solid 1px #0c8399;
                    margin-right: 10px;
                    padding-left: 15px;
                    font-size: 14px;
                    line-height: 36px;
                    color: #ffffff;
                    display: inline-block;
                    span {
                        width: 30px;
                        height: 30px;
                        background-color: rgba(69, 133, 137, 0.5);
                        opacity: 0.5;
                        display: inline-block;
                        border-radius: 50%;
                        text-align: center;
                        margin-left: 6px;
                        position: relative;
                        top: 2px;
                    }
                }
            }
            .lable-down {
                position: absolute;
                right: 10px;
                top: 15px;
            }
        }
        .label-box {
            padding-bottom: 10px;
            background-color: #f5f6fa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            padding-left: 10px;
            display: flex;
            .box-label {
                width: 70px;
                height: 36px;
                background-color: #76bdc1;
                border-radius: 18px;
                border: solid 1px #0c8399;
                color: #fff;
                line-height: 36px;
                margin-right: 10px;
                text-align: center;
                margin-top: 10px;
            }
        }
        .stages {
            p {
                font-size: 14px;
                color: #000000;
                span {
                    color: #999999;
                }
            }
            .stages-info {
                display: flex;
                .ivu-checkbox-wrapper {
                    margin-top: 30px;
                }
                .stages-mun {
                    margin-left: 50px;
                    span {
                        display: inline-block;
                        margin-top: 30px;
                        margin-left: 20px;
                        margin-right: 20px;
                    }
                    input {
                        width: 100px;
                        height: 50px;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.2);
                        text-align: center;
                        &:disabled {
                            background-color: #f5f6fa;
                        }
                    }
                }
            }
        }
        .details {
            p {
                margin-top: 20px;
                margin-bottom: 14px;
            }
            table {
                border: solid 1px rgba(2, 31, 57, 0.1);
                text-align: center;
                tr {
                    height: 50px;
                    th {
                        border-right: none;
                        border-left: none;
                    }
                    td {
                        border-right: none;
                        border-left: none;
                    }
                }
            }
        }
        .contract-up {
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .device-name {
            margin-top: 20px;
            ul {
                display: flex;
                justify-content: space-between;
                li {
                    p {
                        margin-bottom: 20px;
                    }
                    input {
                        height: 50px;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.2);
                        width: 100%;
                        padding-left: 20px;
                    }
                    input:disabled {
                        background-color: #f5f6fa;
                    }
                }
            }
        }
        .add {
            margin-top: 20px;
            height: 50px;
            line-height: 50px;
            background-color: #f5f6fa;
            border-radius: 3px;
            text-align: center;
            p {
                color: #22a1b9;
                cursor: pointer;
            }
        }
    }
}
</style>