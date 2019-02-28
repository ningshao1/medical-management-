<template>

    <div class="basic-content">
        <div class="content-title">
            <h2>基础信息</h2>
            <div class="line"></div>
        </div>
        <div class="content-box">

            <div class="basic-list">
                <ul>
                    <li style="width:100%">
                        <p>医院名称：<span>*</span></p>
                        <input type="text" placeholder="南京市鼓楼医院">
                    </li>
                    <li>
                        <p>联系人：<span>*</span></p>
                        <input type="text" placeholder="胡科长 ">
                    </li>
                    <li>
                        <p>联系方式：<span>*</span></p>
                        <input type="text" placeholder="13813838438 ">
                    </li>
                    <li style="width:20%">
                        <p>医院地址：<span>*</span></p>
                         <Cascader :data="data" v-model="value2"></Cascader>

                    </li>
                    <li style="width:79%">
                        <p></p>
                        <input type="text" placeholder="中山路321号">
                    </li>

                </ul>

                <div class="tree-btn">
                    <div class="retrieval-btn">
                        <Button >取消</Button>
                        <Button class="btn-active">确定</Button>
                    </div>

                </div>

            </div>

        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
           value2: ['jiangsu', 'suzhou', 'zhuozhengyuan'],
                data: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }]
        }
    },
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
        background-color: #ffffff;
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