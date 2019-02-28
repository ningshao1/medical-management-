<template>
    <div>
        <div class="content">
            <div class="main">
                <Row :gutter="10">
                    <Col span="24">
                    <div style="padding:0 30px;background:#fafafa">
                        <h3>基础信息</h3>
                        <span></span>
                        <div class="line"></div>
                        <div class="details" style="background:#fafafa">
                            <div class="details-title">
                                <p class="title" style="margin-left: 3px;">设备名称：{{list_.assetName}}</p>
                                <p class="bload" style="width:600px">
                                    <span style="display:block;text-align:left;width:49%;    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;margin-left:5px;">
                                        <span style="width:60px;">设备编码：</span>
                                        <span>{{list_.assetCode}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;">
                                        <span style="width:60px;">设备序列号：</span>
                                        <span>{{list_.assetSN}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;margin-left:5px;">
                                        <span style="width:60px;">设备品牌：</span>
                                        <span>{{list_.brandName}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;">
                                        <span style="width:60px;">设备型号：</span>
                                        <span>{{list_.assetClass}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;   white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;margin-left:5px;">
                                        <span style="width:60px;">所属科室：</span>
                                        <span>{{list_.departmentName}}</span>

                                    </span>
                                    <span style="display:block;text-align:left;width:49%;    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;">
                                        <span style="width:60px;">设备厂家：</span>
                                        <span>{{list_.manufacturer}}</span>
                                    </span>
                                </p>
                                <!-- <Button type="ghost" shape="circle" size="small" v-for="(item,index) in infos.labels" :key="index" style="margin-top:10px;margin-right:10px;width:100px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" v-show="item.labelName!=null&&item.labelName!=''">{{item.labelName}}</Button> -->
                            </div>
                        </div>
                        <h3>历史保养结果</h3>
                        <div class="line"></div>
                        <div class="tab" style="background:#fafafa">

                            <table class='table-stripe' width="100%" border="1" style="border-collapse:collapse;background:#fafafa">
                                <tr class="one" style="height:38px;background:#fafafa;">
                                    <th>序号</th>
                                    <th>上传人</th>
                                    <th>上传时间</th>
                                    <th>保养单位 </th>
                                    <th>操作</th>
                                </tr>
                                <tr v-for='(item,i) in list' :key='i'>
                                    <td>{{i+1}}</td>
                                    <td>{{item.uploadName}}</td>
                                    <td>2017-02-12</td>
                                    <td>{{item.measurementName}}</td>
                                    <td>
                                        <span @click='PhotoView(item.id)'>查看</span>
                                    </td>
                                </tr>

                            </table>
                            <div class="page">
                                <Page :total='page.total' @on-change='changePage'></Page>
                            </div>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
        </div>
        <PhotoView :url-arr="imgs"></PhotoView>
    </div>
</template>
<script>
import PhotoView from "../../../../common/Picture-viewer/PictureViewer";
import address from '@common/Address';
export default {
    data() {
        return {
            imgs: [], //查看图片地址的集合
            list: [],
            list_: {}, //用于储存第一条数据
            page: {
                total: 10,
                current: 1
            },
            judge: 0
        };
    },
    created() {
        this.getDetails();
    },
    methods: {
        //获取获取详情
        getDetails() {
            this.$axios
                .post(`/pmMaintenance/getThreeLog`, {
                    limit: 10,
                    offset: (this.page.current - 1) * 10,
                    params: {
                        assetId: this.$route.query.id
                    }
                })
                .then(res => {
                    if (this.judge == 0) {
                        this.list_ = res.data.data[0];
                        ++this.judge;
                    }
                    this.list = res.data.data;
                });
        },
        //触发显示照片
        PhotoView(id) {
            this.$axios
                .get(`/pmMaintenance/getThreeLogPhoto/${id}`)
                .then(res => {
                    this.imgs = res.data.map(url => address.slice(0, -1) + url.photoUrl);
                    this.$children[1].showImage(0);
                })
                .catch(error => {});
        },
        //点击page触发事件
        changePage(e){
            this.page.current=e;
            this.getDetails();
        }
    },
    components: {
        PhotoView
    }
};
</script>

<style scoped lang="less">
.bload {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    > span {
        > span:nth-of-type(1) {
            font-weight: 500;
        }
    }
}
.bload span {
    line-height: 30px;
}
.content {
    padding-bottom: 30px;
    width: 100%;
    background-color: #fafafa;
    border-radius: 3px;
    border: solid 1px rgba(2, 31, 57, 0.1);

    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .main {
        padding-top: 0;
        .ivu-tabs {
            margin: 0;
        }
        h3 {
            font-size: 16px;
            font-weight: normal;
            font-size: 16px;
            color: #f2740c;
            margin-top: 20px;
        }
        .details {
            display: flex;
            justify-content: space-between;
            padding-top: 20px;
            margin-bottom: 30px;
            .details-code {
                font-size: 14px;
                color: #666;
                margin-bottom: 15px;
            }
            .title {
                font-size: 18px;
                color: #0c8399;
                margin-bottom: 10px;
            }
            .details-contract {
                display: flex;
            }
        }
        .purchase {
            height: 250px;
            background-color: #ffffff;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            margin-top: 20px;
            padding: 20px;
            margin-bottom: 10px;
        }
    }
    .tab {
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin-top: 30px;
        padding: 15px;
        position: relative;
        left: 1px;
        table {
            border: none;
            tr {
                border: none;
                border-bottom: solid 1px rgba(2, 31, 57, 0.1);
                height: 48px;
                text-align: left;
                font-size: 12px;
                cursor: default;
                &:not(.one):hover {
                    background: #f2f2f2;
                }
                th {
                    color: #666666;
                    border: none;
                }
                td {
                    border: none;
                }
                td:nth-last-of-type(1) {
                    color: #7ca7d2;
                    cursor: pointer;
                }
            }
        }
        .page {
            margin-top: 15px;
            text-align: center;
        }
    }
}
</style>