<template>
    <div class="index">
        <div class="heads">
            <div class='head_1'>
                <div class="div-logo">
                    <img class='logo_'
                         src="./image/logo.svg">
                </div>
                <div :class="{active: routerType === 'home'}"
                     class="nav"
                     @click="jump('home')">
                    <img src="./image/nav-icons/首页@2x.png"
                         alt="">
                    <p>首页</p>
                </div>

                <div :class="{active: routerType === 'presets'}"
                     v-if="ViewLimit('sys:presetwork')"
                     class="nav down">
                    <img src="./image/nav-icons/预置工作@2x.png"
                         alt="">
                    <p>预置工作</p>
                    <ul style="z-index:100">
                        <li style="position:relative;background:transparent">
                            <span class="sanj"></span>
                        </li>
                        <li @click="jump('annualPlan')"
                            style="position:relative;"
                            v-if="ViewLimit('ann:list')">年度计划</li>
                        <li @click="jump('purchase-plain')"
                            style="position:relative;"
                            v-if="ViewLimit('purchase:list')">采购计划</li>
                        <li @click="jump('contract-list')"
                            v-if="ViewLimit('con:list')">合同管理</li>
                        <li @click="jump('supplier')"
                            v-if="ViewLimit('sup:list')">供应商管理</li>
                        <li @click="jump('acceptanceList')"
                            v-if="ViewLimit('acc:list')">安装验收</li>

                    </ul>
                </div>
                <div :class="{active: routerType === 'annual-plain'}"
                     class="nav"
                     @click="jump('annual-plain')"
                     v-if="ViewLimit('annual:list')">
                    <img src="./image/nav-icons/年度计划@2x.png"
                         alt="">
                    <p>年度计划</p>
                </div>

                <div :class="{active: routerType === 'asset'}"
                     class="nav"
                     @click="jump('asset-home')"
                     v-if="ViewLimit('ass:list')">
                    <img src="./image/nav-icons/资产目录@2x.png"
                         alt="">
                    <p>资产目录</p>
                </div>
                <div :class="{active: routerType === 'declaration'}"
                     class="nav"
                     @click="jump('singer-center')"
                     v-if="ViewLimit('fr:list')">
                    <img src="./image/nav-icons/报单中心@2x.png"
                         alt="">
                    <p>报单中心</p>
                </div>
                <!--<div class="nav" @click="jumpNone">-->
                <div :class="{active: routerType === 'depreciation-scrap'}"
                     class="nav down"
                     v-if="ViewLimit('ds:list')">
                    <img src="./image/nav-icons/折旧报废@2x.png"
                         alt="">
                    <p>折旧报废</p>
                    <ul style="z-index:100">
                        <li style="position:relative;background:transparent">
                            <span class="sanj"></span>
                        </li>
                        <li @click="jump('depreciation')"
                            style="position:relative;"
                            v-if="ViewLimit('ds:dep')">折旧管理</li>
                        <li @click="jump('scrap-list')"
                            v-if="ViewLimit('ds:scrap')">报废管理</li>
                    </ul>
                </div>
                <div :class="{active: routerType === 'QS'}"
                     class="nav"
                     @click="jump('QS-home')"
                     v-if="ViewLimit('pm:list')">
                    <img src="./image/nav-icons/质量控制@2x.png"
                         alt="">
                    <p>质量控制</p>
                </div>
                <div :class="{active: routerType === 'IoT-manage'}"
                     class="nav"
                     v-if="viewIoT"
                     @click="jump('IoT-manage')">
                    <img src="./image/nav-icons/设备物联@2x.png"
                         alt="">
                    <p>物联管理</p>
                </div>
                <div class="nav"
                     @click="jumpNone">
                    <img src="./image/nav-icons/智慧盘点@2x.png"
                         alt="">
                    <p>智慧盘点</p>
                </div>
                <!-- <div class="nav" @click="jumpNone"> -->

                <div :class="{active: routerType === 'adjust'}"
                     class="nav"
                     @click="jump('adjust')"
                     v-if="ViewLimit('ass:adjust')">
                    <img src="./image/nav-icons/设备调剂@2x.png"
                         alt=""
                         width="27">
                    <p>设备调剂</p>
                </div>
                <div :class="{active: routerType === 'benefit-analysis'}"
                     class="nav down">
                    <img src="./image/nav-icons/效益分析@2x.png"
                         alt=""
                         width="27">
                    <p>效益分析</p>
                    <ul style="z-index:100">
                        <li style="position:relative;background:transparent">
                            <span class="sanj"></span>
                        </li>
                        <li @click="jump('benefit-analysis-home')"
                            style="position:relative;">设备效益分析</li>
                        <li @click="jump('doctor-pr-analysis')"
                            style="position:relative;">医生阳性率分析</li>
                        <li @click="jump('equipment-monitoring')"
                            style="position:relative;"
                            v-if="viewMonitor">设备监控</li>
                    </ul>
                </div>
                <div v-if="ViewLimit('shiftchange:list')"
                     :class="{active: routerType === 'shift-manage'}"
                     class="nav"
                     @click="jump('shift-management')">
                    <img src="./image/nav-icons/交接班管理@2x.png"
                         alt=""
                         width="27">
                    <p>交接班管理</p>
                </div>
                <div :class="{active: routerType === 'form'}"
                     class="nav"
                     @click="jump('form-manage')"
                     v-if="ViewLimit('excel:list')">
                    <img src="./image/nav-icons/表单管理@2x.png"
                         alt="">
                    <p>表单管理</p>
                </div>
                <div :class="{active: routerType === 'data-statistics'}"
                     class="nav"
                     @click="jump('data-statistics')"
                     v-if="viewDataStatistics">
                    <img src="./image/nav-icons/数据统计@2x.png"
                         alt="">
                    <p>数据统计</p>
                </div>
                <!--<div class="nav" v-show="">-->
                <!--<img src="./image/data.png" alt="">-->
                <!--<img src="./image/data-h.png" alt="">-->
                <!--<p>数据报表</p>-->
                <!--</div>-->
                <div :class="{active: routerType === 'system'}"
                     class="nav"
                     @click="jump('system')"
                     v-show="ViewLimit('system:list')">
                    <img src="./image/nav-icons/系统管理@2x.png"
                         alt="">
                    <p>系统管理</p>
                </div>
                <div class="nav-notice user_l"
                     style="width:160px;cursor:pointer;">
                    <div class='user_'
                         style="position: relative;width:100%"
                         @click='exit_'>
                        <p style="margin-top:0;">
                            <img src="./image/nav-icons/用户 hover@2x.png"
                                 alt=""
                                 style="width: 28px;vertical-align: middle;margin:0 0px 0 0" />
                            <img src="./image/nav-icons/用户@2x.png"
                                 alt=""
                                 style="width: 28px;vertical-align: middle;margin:0 0px 0 0" />
                            <span>{{user_in.name}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <cache-page></cache-page>
    </div>
</template>
<script>
import kldConfirm from "@common/kld-confirm";
import cachePage from "@common/cache-page";

export default {
    name: "top-navigation-bar",
    components: { cachePage },
    methods: {
        exit_() {
            kldConfirm({
                title: "退出登录",
                content: "是否确定退出？",
                ok: () => {
                    this.$store.commit("removeUserIn");
                    this.$store.commit("removeToken");
                    this.$store.commit("removeLimit");
                    this.$router.replace("/sign");
                }
            });
        },
        jump(name) {
            // this.$store.state.reload();
            this.$router.push({ name });
        },
        jumpNone() {
            kldConfirm({
                title: "提示",
                content: "该模块正在内测中，敬请期待。。。",
                cancel: false
            });
        },
        isDef(item){
            return item!==null&&item!==undefined;
        },
        getLimit(pageModule,env){
               const pageLimit=this.limitByWeb[pageModule];
               if(!this.isDef(pageLimit)){
                   return this.limitByWeb['default']
               }
               const limit=pageLimit[env];
               if(!this.isDef(limit)){
                   return pageLimit['default']
               }
               return limit;
           
        }
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        },
        osId() {
            return this.user_in.osId;
        },
        routerType() {
            for (const { name } of this.$route.matched) {
                switch (name) {
                    case "home":
                        return "home"; //主页
                    case "contract":
                    case "supplier":
                    case "supplier-info":
                    case "add-supplier":
                    case "AssetsAcceptance_":
                    case "publicity":
                    case "annualPlan":
                    case "approval":
                    case "addPlan":
                    case "clinical":
                    case "yeardetails":
                    case "purchase-plain":
                        return "presets"; //预置管理
                    case "asset":
                        return "asset"; //资产
                    case "singer-center-home":
                        return "declaration"; //保单中心
                    case "QS-home":
                        return "QS"; //质控
                    case "form-manage":
                    case "form-manage-upload-message":
                        return "form"; //表单管理
                    case "system":
                        return "system"; //系统管理
                    case "depreciation-scrap":
                        return "depreciation-scrap"; //折旧报废
                    case "benefit-analysis-wrap":
                        return "benefit-analysis"; //效益分析
                    case "shift-management":
                        return "shift-manage"; //交接班管理
                    case "adjust":
                        return "adjust"; //设备调剂
                    case "annual-plain":
                        return "annual-plain"; //年度计划
                    case "IoT-manage": //物联管理
                        return "IoT-manage";
                    case "data-statistics":
                        return "data-statistics";
                }
            }
        },
        isKun() {
            let KunShanHospitalId = "514872920313434233";
            return  this.osId === KunShanHospitalId;
        },
        limitByWeb(){
            return {
                IoT:{
                    build:false,
                    test_out:true,
                    default:true
                },
                monitor:{
                    build:false,
                    test_out:this.isKun,
                    default:true
                },
                dataStatistics:{
                    build:false,
                    default:this.ViewLimit('annual:list')
                },
                default:true
            }
        },
        viewIoT(){
            return this.getLimit('IoT',RUN_ENV);
        },
        viewMonitor(){
            return this.getLimit("monitor",RUN_ENV);
        },
        viewDataStatistics(){
            return this.getLimit("dataStatistics",RUN_ENV)
        }
        
        
    },
    created() {
        document.title = "恺立达医学装备信息化管理系统";
    }
};
</script>

<style scoped lang='less'>
.heads {
    height: 73px;
    text-align: center;
    background-color: #1b1e24;
    box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);
    position: relative;
    user-select: none;
    .head_1 {
        height: 73px;
        display: flex;
        justify-content: space-between;
        align-content: center;
        .div-logo {
            text-align: center;
            position: relative;
            width: 180px;

            > img {
                width: 100%;
                max-width: 140px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                margin-top: 0;
            }
        }
        > div {
            padding: 0 8px;
        }
        > div:nth-last-of-type(1) {
            padding: 0;
        }
        > div:nth-of-type(1) {
            padding: 0;
        }
    }
    img {
        margin-top: 13px;
        width: 24px;
    }
    p {
        font-size: 14px;
        color: #333333;
        margin-top: 3px;
        white-space: nowrap;
    }
    .nav {
        min-width: 85px;
        p {
            color: #d0d0d0;
            font-weight: 500;
        }
        img {
            opacity: 0.5;
        }
    }
    .nav:hover,
    .active {
        background-color: #0c0e13;
        border-bottom: 4px solid #22a1b9;
        cursor: pointer;
        p {
            color: #fff;
        }
        img {
            opacity: 1;
        }
    }

    .nav-notice {
        border-left: 1px solid #aaa;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        .notice-box {
            position: relative;
            .notice-icon {
                width: 26px;
                height: 30px;
            }
            .notice-msg {
                position: absolute;
                width: 26px;
                height: 26px;
                border-radius: 50%;
                background: #f2740c;
                color: #ffffff;
                font-size: 10px;
                line-height: 20px;
                left: 25px;
                top: 8px;
            }
        }

        > p {
            margin-left: 50px;
            color: #333333;
            font-size: 14px;
        }
    }
    .down {
        position: relative;

        .showdown {
            height: 30px;
            width: 300px;
            position: absolute;
        }
        span {
            display: block;
            width: 0;
            height: 0;
            border-right: 20px solid transparent;
            border-bottom: 40px solid #ffffff;
            border-left: 20px solid transparent;
            position: absolute;
            top: 105px;
        }

        ul {
            width: 180px;
            position: absolute;
            display: none;
            top: 45px;
            left: 0;
            li {
                height: 40px;
                padding: 12px;
                font-size: 13px;
                font-weight: 500;
                color: #fff;
                border-bottom: solid 1px rgba(255, 255, 255, 0.1);
                background-color: #333;
                cursor: pointer;
                .sanj {
                    display: block;
                    width: 0;
                    height: 0;
                    border-right: 6px solid transparent;
                    border-bottom: 12px solid #333;
                    border-left: 6px solid transparent;
                    position: absolute;
                    left: 30px;
                    top: 28px;
                }
            }
            li:hover {
                background-color: #0c8399;
                color: #ffffff;
                cursor: pointer;
            }
        }
    }
    .down:hover {
        ul {
            display: block;
        }
    }
}
.user_list {
    position: absolute;
    bottom: -80px;
    width: 100%;
    display: none;
    z-index: 100;
    li {
        height: 40px;
        line-height: 40px;
        background: #fff;
        width: 95%;
        position: relative;
        cursor: pointer;
        span {
            position: absolute;
            width: 0;
            height: 0;
            border-width: 12px;
            border-style: solid;
            border-color: transparent transparent #fff transparent;
            top: -25px;
            left: 2px;
            font-size: 12px;
        }
    }
    li:nth-of-type(2):hover {
        background-color: #006b92;
        color: #ffffff;
        cursor: pointer;
    }
}

.user_ {
    height: 100%;
    border-bottom: 4px solid transparent;
    > p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #557e93;
        > img:first-of-type {
            display: none;
        }
    }
}

.user_:hover {
    background-color: rgba(0, 0, 0, 0.5);
    border-bottom: 4px solid #22a1b9;
    > p {
        color: #22a1b9;
        > img:first-of-type {
            display: inline-block;
        }
        > img:last-of-type {
            display: none;
        }
    }
}
</style>