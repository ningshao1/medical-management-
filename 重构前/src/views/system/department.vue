<template>
    <div>
        <div class="department-content">
            <div class="content-title">
                <h2>科室管理</h2>
                <div class="line"></div>
            </div>
            <org></org>
        </div>
    </div>
</template>

<script>
import org from "../../common/orgstruc/initalTwo";
export default {
    data() {
        return {
            addDepartment: false,
            cityList: [],
            model1: "",
            cityList1: [],
            model2: ""
        };
    },
    components: {
        org
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

.department-content {
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
            font-size: 14px;
            font-weight: normal;
            color: #333333;
            height: 55px;
            border-bottom: solid 1px rgba(2, 31, 57, 0.2);
        }
        .search-box {
            margin: 20px 10px 10px;
        }
        .content-list {
            width: 20%;
            border-right: solid 1px rgba(2, 31, 57, 0.2);
        }
        .content-info {
            width: 80%;
            .department-tab {
                margin: 20px;
                padding: 20px;
                height: 547px;
                background-color: #fafafa;
                border-radius: 3px;
                border: solid 1px #dce0e6;
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
                .add-department {
                    height: 40px;
                    background-color: #f5f6fa;
                    border-radius: 2px;
                    border: solid 1px #dcdcdc;
                    font-size: 14px;
                    color: #01b0c7;
                    line-height: 40px;
                    margin-top: 10px;
                    text-align: center;
                    span {
                        cursor: pointer;
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