<template>
    <div class="engineer-doctor-home">
        <div class="content">
            <div class="nav-title">
                <div class="nav-line"></div>
                <p style="cursor:pointer">首页</p>
            </div>
            <h2><img src="../../img/home.svg"
                     style="vertical-align:middle;width: 25px;margin-right: 5px;" />控制台</h2>
            <div class="line"></div>
            <div class="main">
                <Row :gutter="20"
                     class="mb20">
                    <i-col span="16">
                        <template v-if="isEngineer">
                            <engineer-data-count class="mb20"></engineer-data-count>
                            <approval-center></approval-center>
                        </template>
                        <template v-else>
                            <doctor-data-count class="mb20"></doctor-data-count>
                            <service-progress></service-progress>
                        </template>
                    </i-col>
                    <i-col span="8">
                        <div class="entry-news">
                            <div class="entry">
                                <life-entry></life-entry>
                            </div>
                            <div class="news kld-box-effect">

                                <news-information></news-information>
                            </div>
                        </div>
                    </i-col>
                </Row>
                <home-calendar :type="isEngineer ? 'engineer' : 'doctor'"
                               class="mb20"></home-calendar>
                <doc-download class="mb20"></doc-download>
            </div>
            <div class="copy">
                Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.engineer-doctor-home {
    .mb20 {
        margin-bottom: 20px;
    }
    .news {
        padding: 0;
        /deep/.ivu-tabs-content {
            height: 355px !important;
        }
    }

    .home-calendar {
        height: 660px;
    }
}
.content {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    .nav-title {
        padding-top: 14px;
        .nav-line {
            height: 16px;
            width: 4px;
            background-color: #76bdc1;
            display: inline-block;
        }
        > p {
            margin-left: 6px;
            display: inline-block;
            font-size: 12px;
            color: #999999;
            position: relative;
            top: -3px;
        }
    }
    h2 {
        font-weight: normal;
        color: #333333;
        font-size: 16px;
        margin-top: 2px;
    }
    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .main {
        margin-top: 20px;
        padding-bottom: 50px;
    }
}
.entry-news {
    display: flex;
    flex-direction: column;
    height: 445px;
    .entry {
        height: 110px;
    }
    .news {
        display: flex;
        flex: 1;
        overflow: auto;
    }
}
</style>

<script>
import docDownload from "./doc-download";
import newsInformation from "./news-information/news-information";
import homeCalendar from "./home-calendar";
import lifeEntry from "./lifeEntry";
const engineerDataCount = () => import("./engineer-data-count"),
    approvalCenter = () => import("./approval-center"),
    doctorDataCount = () => import("./doctor-data-count"),
    serviceProgress = () => import("./service-progress");

export default {
    name: "engineer-doctor-home",
    components: {
        docDownload,
        newsInformation,
        homeCalendar,
        engineerDataCount,
        approvalCenter,
        doctorDataCount,
        serviceProgress,
        [lifeEntry.name]: lifeEntry
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.$store.state.user_in.roles[0].srName === "CHIEF") {
                next({ name: "home" });
            } else {
                next();
            }
        });
    },
    computed: {
        isEngineer() {
            return this.$store.state.user_in.roles[0].srName === "ENGINEER";
            // return true;
        }
    }
};
</script>