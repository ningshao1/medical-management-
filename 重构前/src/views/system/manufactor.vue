<template>
    <div>
        <div class="manufactor-content">
            <div class="content-title">
                <h2>数据字典</h2>
                <div class="line"></div>
            </div>
            <div class="content-box">
                <div class="content-list">
                    <h2>数据类型</h2>
                    <div class="list-info">
                        <ul>
                            <li>
                                <p>全部合同</p>
                                <p>74</p>
                            </li>
                            <li>
                                <p>全部合同</p>
                                <p>74</p>
                            </li>
                            <li>
                                <p>全部合同</p>
                                <p>74</p>
                            </li>
                            <li>
                                <p>全部合同</p>
                                <p>74</p>
                            </li>
                            <li>
                                <p>全部合同</p>
                                <p>74</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="content-info">
                    <div class="content-tit">
                        <h3>厂家管理</h3>
                        <Button shape="circle" @click="addManufactor=true">新增厂家</Button>
                    </div>

                    <div class="content-tree">
                        <table class='table-stripe' width="100%" border="1" style="border-collapse:collapse;">
                            <tr>
                                <th>序号</th>
                                <th>厂家名称</th>
                                <th>联系人</th>
                                <th>联系方式</th>
                                <th>操作</th>
                            </tr>
                            <tr>
                                <td>001</td>
                                <td>GE（中国）股份有限公司</td>
                                <td>姓名</td>
                                <td>13813838438</td>
                                <td>
                                    <a href="">编辑丨</a>
                                    <a href="">删除</a>
                                </td>
                            </tr>
                            <tr>
                                <td>001</td>
                                <td>GE（中国）股份有限公司</td>
                                <td>姓名</td>
                                <td>13813838438</td>
                                <td>
                                    <a href="">编辑丨</a>
                                    <a href="">删除</a>
                                </td>
                            </tr>
                            <tr>
                                <td>001</td>
                                <td>GE（中国）股份有限公司</td>
                                <td>姓名</td>
                                <td>13813838438</td>
                                <td>
                                    <a href="">编辑丨</a>
                                    <a href="">删除</a>
                                </td>
                            </tr>
                            <tr>
                                <td>001</td>
                                <td>GE（中国）股份有限公司</td>
                                <td>姓名</td>
                                <td>13813838438</td>
                                <td>
                                    <a href="">编辑丨</a>
                                    <a href="">删除</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

            </div>
        </div>
        <Modal v-model="addManufactor" title="新增厂家信息" width="900">
            <ul class="mode">
                <li style="width:100%">
                    <p>厂家名称：
                        <span>* </span>
                    </p>
                    <input type="text" placeholder="请输入厂家名称">
                </li>
                <li>
                    <p>联系人：
                        <span>* </span>
                    </p>
                     <input type="text" placeholder="请输入联系人">

                </li>
                <li>
                    <p>联系方式：
                        <span>* </span>
                    </p>
                    <input type="text" placeholder="请输入联系方式">

                </li>
               
            </ul>
        </Modal>
    </div>

</template>

<script>
export default {
    data() {
        return {
            addManufactor: false
        };
    }
};
</script>

<style scoped lang='less'>
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
.manufactor-content {
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
            width: 80%;
            .content-tit {
                display: flex;
                justify-content: space-between;
                border-bottom: solid 1px rgba(2, 31, 57, 0.2);
                height: 55px;
                h3 {
                    font-size: 14px;
                    font-weight: normal;
                    color: #333333;
                    padding-top: 20px;
                    padding-left: 20px;
                }
            }
            .content-tree {
                height: 564px;
                background-color: #ffffff;
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