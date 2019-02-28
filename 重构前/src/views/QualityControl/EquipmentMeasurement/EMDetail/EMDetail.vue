<template>
    <div class="emd-detail container-fluid" style="position: relative;">
        <Button class="add kld-btn" icon="plus" @click="Addmodal.add=true;RecordID=null" v-if="$route.name == 'normalEM-detail'?ViewLimit('pm:adverseevent:execute'):ViewLimit('pm:lowmeasurement:execute')">添加计量信息</Button>
        <Type :title="'基础信息'"></Type>
        <div class="base-info">
            <p>
                设备名称 : {{basicInfo.assetName}}
            </p>
            <div class="detail-info">
                <ul>
                    <li v-if='$route.name === "normalEM-detail"'>设备编码：{{$store.state.kldToUpperCase(basicInfo.assetCode)}}</li>
                    <li v-if='$route.name === "normalEM-detail"'>设备品牌：{{basicInfo.brandName}}</li>
                    <li>所属科室：{{basicInfo.osName}}</li>
                    <li>设备序列号：{{basicInfo.assetSN}}</li>
                    <li>设备型号：{{basicInfo.assetClass}}</li>
                    <li>设备厂家：{{$route.name === "normalEM-detail"?basicInfo.manufactor:basicInfo.brandName}}</li>
                </ul>
            </div>
        </div>
        <Type :title="'历史计量结果'"></Type>
        <div class="history-results" style="max-height: 350px;overflow: auto;">
            <Table class='i-table-stripe' :columns="listColumns" :data="tableDatas" :no-data-text="'暂无历史计量结果'"></Table>
            <div :style="{
                        width:'100%',
                        display:'flex',
                        'justify-content':'center'
                    }">
                <Page style="margin-top:10px;" :total='page.total' :current='page.current' @on-change='changePage'></Page>
            </div>
        </div>
        <Modal v-model="modal" :title="'计量详情'" :styles="{width:'1060px'}">
            <div class="modal-body">
                <Type title="计量信息"></Type>
                <ul>
                    <li>
                        <p>计量设备类型</p>
                        <div class="single-detail textEllipsis">{{everyData.mrState==1?'正常计量设备':"低值计量设备"}}</div>
                    </li>
                    <li>
                        <p>计量类型</p>
                        <div class="single-detail textEllipsis">{{everyData.mtType==="0"?"强检":everyData.mtType==="1"?"非强检":everyData.mtType==="2"?"院内计量":''}}</div>
                    </li>
                    <li>
                        <p>执行人</p>
                        <div class="single-detail textEllipsis">{{everyData.mrExecuteName}}</div>
                    </li>
                    <li>
                        <p>检定机构</p>
                        <div class="single-detail textEllipsis">{{everyData.organisationName}}</div>
                    </li>
                    <li>
                        <p>计量时间</p>
                        <div class="single-detail textEllipsis">{{everyData.executionTime}}</div>
                    </li>
                    <li v-if="pageName==='normalEM-detail'">
                        <p>计量周期</p>
                        <div class="single-detail textEllipsis">
                            {{everyData.mtCycle}}
                            <div>月</div>
                        </div>
                    </li>
                    <li>
                        <p>计量费用</p>
                        <div class="single-detail textEllipsis">
                            {{everyData.mrMoney}}
                            <div>元</div>
                        </div>
                    </li>
                    <li>
                        <p>所耗工时</p>
                        <div class="single-detail textEllipsis">
                            {{everyData.mrWorkhours}}
                            <div>小时</div>
                        </div>
                    </li>
                </ul>
                <Type title="计量结果"></Type>
                <ul>
                    <li>
                        <p>批准人</p>
                        <div class="single-detail textEllipsis">{{everyData.mrChargeName}}</div>
                    </li>
                    <li>
                        <p>校准员</p>
                        <div class="single-detail textEllipsis">{{everyData.mrCheckName}}</div>
                    </li>
                    <li>
                        <p>核验员</p>
                        <div class="single-detail textEllipsis">{{everyData.mrAuditName}}</div>
                    </li>
                    <li>
                        <p>证书编号</p>
                        <div class="single-detail textEllipsis">{{everyData.mrCode}}</div>
                    </li>
                    <li>
                        <p>计量结果</p>
                        <div class="single-detail textEllipsis">{{everyData.mrResult==0?"合格":"不合格"}}</div>
                    </li>
                </ul>
                <div class="certificate row" id='certificate'>
                    <p>合格证书</p>
                    <ImageView :showStyle="{'background-color':'#fff'}" :imgUrlList="everyData.photos?everyData.photos:[]"></ImageView>
                </div>
            </div>

            <div slot="footer">
                <Button class="back" size="large" @click="modal=false">返 回</Button>
            </div>
        </Modal>
        <addEMD :mtIDs='mtIDs' @addSuccess='addSuccess' :type="mtType" :mtId='mtId' :show='Addmodal' :RecordID='RecordID'></addEMD>
    </div>
</template>

<script>
import ImageView from "@common/imageView/ImageView";
import Type from "../../adverseEvent/reportAdverseEvent/type";
import addEMD from "./AddDetail";
export default {
    data() {
        return {
            listColumns: [
                {
                    title: "状态",
                    key: "status",
                    render: this.status,
                    renderHeader: this.renderHeader
                },
                {
                    title: "执行人",
                    key: "supervisor",
                    render: this.currencyRender,
                    renderHeader: this.renderHeader
                },
                {
                    title: "检定结果",
                    key: "result",
                    render: this.Result,
                    renderHeader: this.renderHeader
                },
                {
                    title: "发证时间",
                    key: "issuingTime",
                    render: this.currencyRender,
                    renderHeader: this.renderHeader
                },
                {
                    title: "检定机构",
                    key: "mechanism",
                    render: this.currencyRender,
                    renderHeader: this.renderHeader
                },
                {
                    title: "操作",
                    key: "config",
                    render: this.config,
                    renderHeader: this.renderHeader
                }
            ],
            //列表数据
            tableDatas: [],
            //基础信息
            basicInfo: {},
            //page 数据
            page: {
                total: 10,
                current: 1
            },
            everyData: {
                photos: []
            },
            //模态窗显影
            modal: false,
            Addmodal: {
                add: false
            }, //新增弹窗
            RecordID: null,
            mtType: null,
            mtIDs: null,
            mtId: null
        };
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        },
        pageName() {
            return this.$route.name;
        }
    },
    methods: {
        getMtType() {
            return this.$axios
                .get(`/assets/${this.user_in.osId}/${this.$route.query.id}`)
                .then(({ data: { mtType } }) => {
                    this.mtType = mtType;
                });
        },
        //获取列表
        getDetail() {
            this.$axios
                .post(`/measurementTask/list`, {
                    limit: 10,
                    offset: (this.page.current - 1) * 10,
                    params: {
                        assetId: this.$route.query.id,
                        type: this.$route.name == "normalEM-detail" ? 0 : 1
                    }
                })
                .then(res => {
                    let temp = [];
                    res.data.data.map(el => {
                        temp.push({
                            status_: el.mrType,
                            status:
                                el.mrType == 1
                                    ? "逾期"
                                    : el.mrType == 2
                                        ? "逾期已补"
                                        : "正常",
                            supervisor: el.mrExecuteName,
                            result:
                                el.mrResult == 0
                                    ? "合格"
                                    : el.mrResult == 1
                                        ? "不合格"
                                        : "",
                            mechanism: el.organisationName,
                            issuingTime: el.executionTime,
                            config: el.mrType == 1 ? "填写计量信息" : "查看",
                            id: el.id,
                            mtId: el.mtId
                        });
                    });
                    this.tableDatas = temp;
                    this.page.total = res.data.recordsTotal;
                });
        },
        //获取基础信息
        getbasic() {
            let url;
            this.$route.name == "normalEM-detail"
                ? (url = `/assets/getSimpleAsset/${
                      this.$route.query.id
                  }?type=0`)
                : (url = `/assets/getSimpleAsset/${
                      this.$route.query.id
                  }?type=1`);
            this.$axios.get(url).then(res => {
                //let {assetCode, assetName,assetSN,brandName,manufactor,os_Name,typeName} = res.data.data[0];
                this.basicInfo = res.data;
                if (res.data.mtId !== undefined) {
                    this.mtIDs = res.data.mtId;
                    this.mtId = res.data.mtId;
                }
            });
        },

        //获取详情
        getEveryLast(id) {
            this.$axios.get(`/measurementTask/${id}`).then(res => {
                this.everyData = res.data;
            });
        },
        //添加或修改调用的函数
        addSuccess() {
            this.getDetail();
        },
        //page点击事件
        changePage(e) {
            this.page.current = e;
            this.getDetail();
        },
        //表头render
        renderHeader(h, params) {
            return h(
                "span",
                {
                    style: {
                        "font-size": "14px",
                        color: "#666666"
                    }
                },
                params.column.title
            );
        },
        //通用render
        currencyRender(h, params) {
            return h(
                "span",
                {
                    style: {
                        "font-size": "14px",
                        color: "#666666"
                    }
                },
                params.row[params.column.key]
            );
        },
        //status
        status(h, params) {
            return params.row.status == "正常"
                ? this.normalStatus(h, params)
                : this.overdueStatus(h, params);
        },
        //正常状态render
        normalStatus(h, params) {
            return h(
                "Button",
                {
                    props: {
                        type: "primary"
                    },
                    style: {
                        width: "auto"
                    }
                },
                params.row[params.column.key]
            );
        },
        //逾期状态render
        overdueStatus(h, params) {
            return h(
                "Button",
                {
                    props: {
                        type: "error"
                    }
                },
                params.row[params.column.key]
            );
        },

        Result(h, params) {
            return params.row.result == "合格"
                ? this.qualified(h, params)
                : this.unqualified(h, params);
        },
        //合格
        qualified(h, params) {
            return h(
                "span",
                {
                    style: {
                        "font-size": "14px",
                        color: "#339933"
                    }
                },
                params.row[params.column.key]
            );
        },
        //不合格
        unqualified(h, params) {
            return h(
                "span",
                {
                    style: {
                        "font-size": "14px",
                        color: "#a9a8a9"
                    }
                },
                params.row[params.column.key]
            );
        },
        //操作
        config(h, params) {
            return params.row.status_ == 1
                ? this.overdueConfig(h, params)
                : this.normalConfig(h, params);

            // return params.row.status == "正常"
            //     ? this.overdueConfig(h, params)
            //     : this.normalConfig(h, params);
        },
        //正常操作
        normalConfig(h, params) {
            return h(
                "span",
                {
                    style: {
                        "font-size": "14px",
                        color: "#7ca7d2"
                    },
                    on: {
                        click: () => {
                            this.getEveryLast(params.row.id);
                            this.modal = true;
                        }
                    }
                },
                params.row[params.column.key]
            );
        },
        //逾期操作
        overdueConfig(h, params) {
            return h(
                "span",
                {
                    style: {
                        "font-size": "14px",
                        color: "#0c8399"
                    },
                    on: {
                        click: () => {
                            this.everyData = {};
                            this.Addmodal.add = true;
                            this.RecordID = params.row.id;
                            // this.$router.push({
                            //     name: this.$route.meta.nextPage
                            // });
                        }
                    }
                },
                params.row[params.column.key]
            );
        }
    },
    created() {
        this.getDetail();
        this.getbasic();
        this.$route.name === "normalEM-detail" && this.getMtType();
    },
    components: {
        Type,
        addEMD,
        ImageView
    }
};
</script>

<style lang="less" scoped>
@import url("./EMD");
/deep/.ivu-modal-content {
    .modal-body {
        > ul {
            width: 100%;
            display: flex;
            flex-flow: row wrap;
            p {
                font-size: 14px;
                color: #000000;
                padding: 12px 0;
            }
            > li {
                width: 100%/3;
                @padding: 1%;
                &:nth-child(3n + 1) {
                    padding-right: @padding;
                }
                &:nth-child(3n + 2) {
                    padding: 0 @padding / 2;
                }
                &:nth-child(3n) {
                    padding-left: @padding;
                }
                // padding-right:5%;
                .single-detail {
                    @height: 40px;
                    position: relative;
                    height: @height;
                    line-height: @height;
                    background-color: #fcfcfc;
                    border-radius: 3px;
                    border: solid 1px rgba(2, 31, 57, 0.1);
                    padding-left: 10px;
                    div {
                        width: @height - 2;
                        border-left: solid 1px #c8ced3;
                        position: absolute;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        background-color: #edeef3;
                        border-radius: 3px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    > span {
                    }
                }
            }
        }
        .certificate {
            p {
                font-size: 14px;
                color: #000000;
                padding: 12px 0;
            }
            > div {
                width: 100%;
                min-height: 50px;
                background-color: #ffffff;
                border-radius: 2px;
                border: dashed 1px #ccd2d7;
                display: flex;
                align-items: center;
                padding-left: 10px;
                > img {
                    width: 60px;
                    height: 60px;
                    border-radius: 2px;
                }
            }
        }
    }
    .back {
        background-color: #a9a8a9;
        color: #fff;
        padding: 7px 20px;
    }
}
.add {
    cursor: pointer;
    padding: 0px 8px;
    line-height: 40px;
    color: #fff;
    background-color: #22a1b9;
    font-size: 12px;
    text-align: center;
    border-radius: 3px;
    top: -65px;
    position: absolute;
    right: 0;
}
#certificate {
    > div {
        min-height: 50px;
        flex-wrap: wrap;
        > img {
            margin: 10px;
        }
    }
}
</style>

