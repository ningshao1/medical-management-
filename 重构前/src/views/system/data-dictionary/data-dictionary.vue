<template>
    <div>
        <div class="brand-content">
            <div class="content-title">
                <div class="title_c">
                    <h2>数据字典</h2>
                    <!-- <Input icon="ios-search" style="width:14%;cursor:pointer;" placeholder="请输入品牌关键字" v-model="data7">
                    </Input> -->
                </div>
                <div class="line"></div>
            </div>
            <div class="content-box">
                <div class="content-list">
                    <h2>数据类型</h2>
                    <div class="list-info">
                        <ul>
                            <router-link tag='li' v-for="(v,i) of dataType" :key='i' :to="{name:v.routeName}" active-class='active-li'>
                                <p class="data-type-title">{{v.title}}</p>
                            </router-link>
                        </ul>
                    </div>
                </div>
                <div class="content-info">
                    <router-view></router-view>
                </div>

            </div>
        </div>

    </div>

</template>

<script>
export default {
    data() {
        return {
            list: null,
            limit: JSON.parse(localStorage.getItem("limit")),
            left_index: 0,
            dataType: [
                {
                    routeName: "brand-management",
                    title: "品牌管理"
                },
                {
                    routeName: "fault-type",
                    title: "故障类型"
                },
                {
                    routeName: "fault-phenomenon",
                    title: "故障现象"
                },
                {
                    routeName: "fault-process",
                    title: "故障处理方案"
                }
            ]
        };
    },
    methods: {
        test() {
            this.data7 = [];
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
    li {
        width: 49%;
        margin-bottom: 10px;
        p {
            font-size: 14px;
            margin-bottom: 20px;
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
}
.brand-content {
    .content-title {
        .title_c {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
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

        .content-list {
            width: 20%;
            border-right: solid 1px #dce0e6;

            .list-info {
                li {
                    display: flex;
                    justify-content: space-between;
                    padding: 0px 22px;
                    height: 51px;
                    line-height: 51px;
                    background-color: #fafafa;
                    //border: solid 1px #dce0e6;
                    border-bottom: solid 1px #dce0e6;
                    cursor: pointer;
                    .data-type-title {
                        font-size: 14px;
                    }

                    &:hover {
                        border-left: solid 3px #01b0c7;
                        background-color: #ffffff;
                    }
                    &:hover .data-type-title {
                        color: #01b0c7;
                    }
                }
                .active-li {
                    background-color: #f5f6fa !important;
                    border-left: solid 3px #01b0c7;
                    .data-type-title {
                        //color: #01b0c7;
                        color: #495060;
                    }
                }
            }
        }
        .content-info {
            width: 80%;
            background: #fafafa;
            .content-tit {
                display: flex;
                justify-content: space-between;
                border-bottom: solid 1px #dce0e6;
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
                padding: 20px;
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