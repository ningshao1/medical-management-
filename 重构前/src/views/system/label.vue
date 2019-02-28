<template>

    <div class="label-content">
        <div class="content-title">
            <h2>标签管理</h2>
            <div class="line"></div>
        </div>
        <div class="content-box">
            <div class="content-list">
                <h2>标签分类</h2>
                <div class="list-info">
                    <!-- <div class="search-box">
                        <Input icon="ios-search" placeholder="搜索分类"></Input>

                    </div> -->
                    <ul>
                        <li @click='get_label(3)'
                            :class='{click_li:add_label.label_type ==3}'>
                            <p><img src='./image/ht_l.svg' />合同标签</p>
                        </li>
                        <li @click='get_label(1)'
                            :class='{click_li:add_label.label_type ==1}'>
                            <p><img src='./image/zi_l.svg' />资产标签</p>

                        </li>
                        <li @click='get_label(4)'
                            :class='{click_li:add_label.label_type ==4}'>
                            <p><img src='./image/gong_l.svg' />供应商标签</p>
                            <!-- <p>74</p> -->
                        </li>
                        <li @click='get_label(2)'
                            :class='{click_li:add_label.label_type ==2}'>
                            <p><img src='./image//bao_l.svg' />报单标签</p>
                            <!-- <p>74</p> -->
                        </li>
                    </ul>
                </div>
            </div>
            <div class="content-info">
                <h2>{{add_label.names}}</h2>
                <div class="search-box"
                     v-if="ViewLimit('sys:label:add')">
                    <p>新增标签：
                        <span class="hint">(标签名最大长度为5个汉字，10个字母)</span>
                    </p>
                    <div class="add-label">
                        <input placeholder="请输入标签名称"
                               class="put"
                               v-model="add_label.label_name"
                               @keyup.enter='add_label_'>
                        <Button :loading='loading'
                                class="kld-btn add-label-btn"
                                icon="plus"
                                style="vertical-align: top;"
                                @click='add_label_'>新增</Button>
                    </div>
                </div>
                <div class="label">
                    <p>我的标签库：</p>
                    <div class="lable-list">
                        <!-- textEllipsis -->
                        <div v-for='(item,i) in mi_label'
                             :key='i'
                             class="asset-lable">
                            <div class="textEllipsis"
                                 :title="item.labelName">
                                {{item.labelName}}
                            </div>
                            <span :data-id='item.id'
                                  :data-index='i'
                                  v-if="ViewLimit('sys:label:del')"
                                  @click='remove_label($event,item.id,i)'><img src="./image/close.png"
                                     alt=""></span>
                        </div>

                    </div>
                </div>
                <div class="public-label">
                    <div class="line"></div>
                    <p>
                        公共标签库：
                        <span>（公共标签库不可进行编辑，使用时自动读取）</span>
                    </p>
                    <ul style="height: 104px; overflow-y: auto;">
                        <li v-for='(item,i) in inlay_label'
                            :key='i'>{{item.labelName}}</li>

                    </ul>
                </div>
            </div>

        </div>
        <pop :msginfo='del_info'
             @pro_ok="dels"></pop>
    </div>

</template>

<script>
import pop from "../../common/prompt/prompt";
export default {
    data() {
        return {
            loading: false,
            inlay_label: null,
            mi_label: null,
            add_label: {
                label_name: "",
                label_type: 3,
                names: "合同标签"
            },
            limit: JSON.parse(localStorage.getItem("limit")),
            del_info: {
                title: "提示",
                okText: "确认",
                name: "是否要是删除该标签",
                modal2: false
            },
            label_id: "",
            label_i: ""
        };
    },
    created() {
        this.get_label(3);
    },
    methods: {
        get_label(index) {
            this.get_m_label(index);
            if (this.add_label.label_type !== index) {
                this.add_label.label_name = "";
            }
            // if(index==1){
            this.add_label.label_type = index;
            // }
            this.axios.get("labels/list/" + index).then(res => {
                console.log(res);
                this.inlay_label = res.data;
            });
            switch (index) {
                case 1:
                    this.add_label.names = "资产标签";
                    break;
                case 2:
                    this.add_label.names = "报单标签";
                    break;
                case 3:
                    this.add_label.names = "合同标签";
                    break;
                case 4:
                    this.add_label.names = "供应商标签";
                    break;
            }
        },
        get_m_label(index) {
            const that = this;
            this.axios
                .get(
                    `labelOrgstructs/${
                        JSON.parse(localStorage.getItem("user_in")).osId
                    }/list?type=${index}`
                )
                .then(res => {
                    that.mi_label = res.data;
                });
        },
        remove_label(e, id, i) {
            if (
                this.limit.findIndex(el => {
                    return el.plPermission == "sys:label:del";
                }) == -1
            ) {
                this.$Message.warning("抱歉，你没有权限删除标签");
                return;
            }
            this.label_id = id;
            this.iabel_i = i;
            this.del_info.modal2 = true;
        },
        dels() {
            const that = this;
            this.axios
                .delete(
                    `labelOrgstructs/${
                        JSON.parse(localStorage.getItem("user_in")).osId
                    }/${this.label_id}`
                )
                .then(res => {
                    that.mi_label.splice(this.iabel_i, 1);
                    //console.log(res)
                })
                .catch(error => {
                    console.log(error);
                    if (error.code == "400") {
                        this.$Message.warning(error.message);
                    } else {
                        this.$Message.warning("标签删除失败");
                    }
                });
        },
        add_label_() {
            if (this.add_label.label_name.trim() == "") {
                this.$Message.warning("请输入需要新添加的标签");
                return;
            }
            if (
                this.add_label.label_name.trim().replace(/[^\x00-\xff]/g, "**")
                    .length > 10
            ) {
                this.$Message.warning("标签名最大长度为5个汉字，10个字母");
                return;
            }
            if (this.mi_label.length >= 20) {
                this.$Message.warning("对不起，您添加的标签数量超过最大限制");
                return;
            }
            const that = this;
            this.loading = true;
            this.$axios
                .post("labelOrgstructs", {
                    osId: JSON.parse(localStorage.getItem("user_in")).osId,
                    labelType: that.add_label.label_type,
                    labelName: that.add_label.label_name
                })
                .then(res => {
                    this.mi_label.push(res.data);
                    this.add_label.label_name = ""; //清空输入框的信息
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    components: {
        pop
    }
};
</script>

<style scoped lang='less'>
.label-content {
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
        display: flex;
        h2 {
            padding-top: 20px;
            padding-left: 20px;
            font-size: 15px;
            font-weight: 600;
            color: #333333;
            height: 55px;
            border-bottom: solid 1px #dce0e6;
        }
        .search-box {
            margin: 20px 20px 10px;
        }
        .content-list {
            width: 20%;
            border-right: solid 1px #dce0e6;

            .list-info {
                li {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 22px;
                    //height: 56px;
                    //background-color: #f5f6fa;
                    //border-left: solid 1px #01b0c7;
                    background-color: #fafafa;
                    border-bottom: solid 1px #dce0e6;
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
                        background-color: #e5e5ea;
                    }
                    img {
                        vertical-align: middle;
                        margin-right: 5px;
                        width: 16px;
                    }
                }
                li:nth-of-type(1) {
                    //border-top: solid 1px #dce0e6;
                }
                .click_li {
                    background-color: #f5f6fa !important;
                    border-left: solid 3px #01b0c7;
                    // background-color: #ffffff;
                    p:nth-child(1) {
                        //color: #01b0c7;
                        color: #495060;
                    }
                    p:nth-child(2) {
                        border-color: #01b0c7;
                        color: #01b0c7;
                    }
                }
            }
        }
        .content-info {
            width: 80%;

            p {
                font-size: 14px;
                color: #333333;
                margin-bottom: 12px;
            }

            button {
                width: 6%;
                height: 50px;
                background-color: #22a1b9;
                border-radius: 3px;
                border: solid 1px #0c8399;
                color: #ffffff;
                position: relative;
                left: -3px;
                cursor: pointer;
            }
            .label {
                margin-top: 30px;
                padding-top: 20px;
                padding-left: 20px;
                p {
                    font-size: 12px;
                    color: #333333;
                    margin-bottom: 14px;
                }
                .lable-list {
                    max-height: 120px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    .asset-lable {
                        //width: 88px;
                        height: 36px;
                        background-color: #76bdc1;
                        border-radius: 18px;
                        border: solid 1px #0c8399;
                        margin: 10px 10px;
                        padding-left: 15px;
                        font-size: 12px;
                        line-height: 36px;
                        color: #ffffff;
                        display: inline-block;
                        position: relative;
                        padding-right: 38px;
                        max-width: 130px;
                        span {
                            width: 30px;
                            height: 30px;
                            background-color: rgba(69, 133, 137, 0.5);
                            opacity: 0.5;
                            display: inline-block;
                            border-radius: 50%;
                            text-align: center;
                            margin-left: 6px;
                            position: absolute;
                            right: 0;
                            top: 2px;
                        }
                        img {
                            cursor: pointer;
                        }
                    }
                }
            }
            .public-label {
                padding-top: 20px;
                padding-left: 20px;
                .line {
                    height: 1px;
                    background-color: #edecec;
                }
                p {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #333333;
                    span {
                        color: #999999;
                    }
                }
                ul {
                    display: flex;
                    flex-wrap: wrap;
                    li {
                        width: 88px;
                        height: 36px;
                        background-image: linear-gradient(#5ba4c8, #5ba4c8),
                            linear-gradient(#5ba4c8, #5ba4c8);
                        background-blend-mode: normal, normal;
                        border-radius: 17px;
                        border: solid 1px #126c99;
                        line-height: 36px;
                        color: #ffffff;
                        margin-right: 20px;
                        text-align: center;
                        margin: 10px 10px;
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
.add-label {
    display: flex;
    justify-content: space-between;
    .put {
        height: 45px;
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.2);
        width: 90%;
        padding-left: 20px;
        font-size: 12px;
    }
    .add-label-btn {
        width: 8% !important;
        height: 45px !important;
        max-width: 90px;
    }
}
</style>