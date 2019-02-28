<template>
    <div class="asset-info">
        <div class="asset-title">设备信息</div>
        <div class="info-every">
            <span class="state"
                  :class="dataInfo.state===1?'being':dataInfo.state===2?'wait':dataInfo.state===3?'service':''">
                {{dataInfo.state===1?'在用':dataInfo.state===2?'待用':dataInfo.state===3?'维修':''}}
            </span>
            <i-row :gutter='30'
                   class="asset-row">
                <i-col :span='24'>
                    <span class="asset-info-title">设备编码：{{dataInfo.assetCode}}</span>
                </i-col>
            </i-row>
            <i-row :gutter='30'
                   class="asset-row">
                <i-col :span='12'>
                    <span class="asset-info-every">设备名称：{{dataInfo.assetName}}</span>
                </i-col>
                <i-col :span='12'>
                    <span class="asset-info-every">所属科室：{{dataInfo.departmentName}}</span>
                </i-col>
            </i-row>
            <i-row :gutter='30'
                   class="asset-row">
                <i-col :span='12'>
                    <span class="asset-info-every">设备品牌：{{dataInfo.brandName}}</span>
                </i-col>
                <i-col :span='12'>
                    <span class="asset-info-every">设备型号：{{dataInfo.assetClass}}</span>
                </i-col>
            </i-row>
            <i-row :gutter='30'
                   class="asset-row">
                <i-col :span='24'>
                    <span class="asset-info-every">设备分类：{{dataInfo.typeName}}</span>
                </i-col>
            </i-row>
        </div>
    </div>
</template>
<script>
export default {
    name: "loT-asset-info",
    props: {
        data: {
            required: true
        }
    },
    computed: {
        dataInfo() {
            if (this.data) return this.data;
            else return {};
        }
    },
    data() {
        return {};
    }
};
</script>
<style lang="less" scoped>
.asset-info {
    background: #fafafa;
    padding: 0 20px;
    padding-bottom: 10px;
    .asset-title {
        color: #f2740c;
        font-size: 16px;
        padding: 10px 0;
        border-bottom: 1px solid #c8ced3;
    }
    .asset-info-title {
        font-size: 16px;
        color: #0c8399;
    }
    .asset-info-title {
        padding: 8px 0;
        display: inline-block;
    }
    .asset-info-every {
        display: inline-block;
        padding: 4px 0;
        font-size: 14px;
    }
    .info-every {
        position: relative;
        .state {
            position: absolute;
            right: 0;
            top: 8px;
            width: 40px;
            height: 20px;
            border-radius: 2px;
            font-size: 14px;
            text-align: center;
            color: #fff;
        }
        .being {
            background-color: #09b785;
        }
        .wait {
            background-color: #e1bb6a;
        }
        .service {
            background-color: #ca431d;
        }
    }
}
</style>


