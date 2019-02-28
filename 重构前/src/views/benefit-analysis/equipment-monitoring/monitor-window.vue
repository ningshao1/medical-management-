<template>
    <div class="monitor-window-wrap">
        <!-- showMonitor -->
        <Modal v-model="modalShow"
               :mask-closable="false"
               width="auto"
               class-name="monitor-modal-wrap">
            <div class="kld-moniter-wrap"
                 ref="kld-moniter-wrap">
            </div>
            <div class="close-window"
                 @click="hiddenModal">
                关闭窗口
            </div>
            <div class="toggle-stream" v-show="monitorToggling">
                正在切换监控画面清晰度....
            </div>
            <div slot="footer">
            </div>
        </Modal>

    </div>
</template>
<script>
import axios from "@/libs/monitor-axios";
// import videojs from "video.js";
import videojs from "./videoJs";

export default {
    name: "monitor-window",
    data() {
        return {
            playip: null,
            checkTimer: null,
            monitorTimer: null,
            toggleTimer:null,
            player: null,
            currentSharpness: 1,
            customurl: null,
            sharpnesses: [
                {
                    key: "ultra",
                    label: "超清",
                    value: 0
                },
                {
                    key: "height",
                    label: "高清",
                    value: 1
                },
                {
                    key: "normal",
                    label: "普清",
                    value: 2
                }
            ],
            monitorToggling:false
        };
    },
    props: {
        monitorInfo: {
            type: Object,
            default() {
                return {};
            }
        },
        showMonitor: Boolean
    },
    mounted() {},
    computed: {
        monitorUserInfo() {
            return this.$store.state.monitorUserInfo;
        },
        modalShow: {
            get() {
                return this.showMonitor;
            },
            set(val) {
                this.$emit("update:showMonitor", val);
            }
        },
        videoUrl() {
            return this.playip && this.monitorInfo
                ? `http://${this.playip}:8091/hls/${this.monitorInfo.hid}.m3u8`
                : "";
        }
    },
    watch: {
        modalShow(val) {
            if (val) {
                this.viewStart();
            }
        }
    },
    methods: {
        //基础步骤

        //开始设备端推流
        pushDeviceRtmpAction(
            device,
            streamid = this.currentSharpness,
            { username, access_token, state } = this.monitorUserInfo
        ) {
            const { hid: deviceid, dataserver } = device;
            let puship = this.parseDataserver(dataserver);
            let customurl = `rtmp://${puship}/hls/${deviceid}`;
            this.customurl = customurl;
            return axios.post("PushDeviceRtmpAction.php", {
                username,
                access_token,
                state,
                deviceid,
                streamid,
                customurl
            });
        },

        //解析推流IP
        parseDataserver(dataserver) {
            if (!dataserver) {
                return false;
            }
            let index = dataserver.indexOf("ssp://");
            if (index > -1) {
                let start = index + 6;
                let end = dataserver.indexOf(":", start);
                return dataserver.substring(start, end);
            }
        },
        //查询设备端m3u8推流状态
        checkRtmpAction(
            deviceid,
            { username, access_token, state } = this.monitorUserInfo
        ) {
            return axios.post(`CheckRtmpAction.php`, {
                username,
                access_token,
                state,
                deviceid
            });
        },
        //结束设备端推流
        stopDeviceRtmpAction(
            deviceid,
            { username, access_token, state } = this.monitorUserInfo
        ) {
            return axios.post("StopDeviceRtmpAction.php", {
                username,
                access_token,
                state,
                deviceid
            });
        },

        //基础组合步骤

        //检测推流是否成功
        async cehckcCircuit(device, max = 40, start = 0) {
            let current = start;
            if (current > max) {
                return Promise.reject(false);
            }
            const { hid } = device;
            const {
                data: { status }
            } = await this.checkRtmpAction(hid);

            if (status === "200") {
                return true;
            } else {
                return new Promise((res, rej) => {
                    this.monitorTimer = setTimeout(async () => {
                        try {
                            await this.cehckcCircuit(device, max, ++current);
                            res(true);
                        } catch {
                            rej(false);
                        }
                    }, 500);
                });
            }
        },

        //检测视频流
        async preLoadHls(max = 50, start = 0) {
            if (start > max) {
                return;
            }
            try {
                return await axios.get(this.videoUrl);
            } catch (e) {
                let preLoadHls = await new Promise(resolve => {
                    this.checkTimer = setTimeout(() => {
                        resolve(this.preLoadHls);
                    }, 500);
                });
                return preLoadHls(max, ++start);
            }
        },

        //功能步骤

        //开始直播加载
        async viewStart() {
            if (!this.monitorUserInfo) {
                return;
            }
            let innerHTML = `<video id="kld-moniter"></video>`;
            let dom = this.$refs["kld-moniter-wrap"];
            dom.innerHTML = innerHTML;
            this.monitorToggling=false;
            this.initPlayer();
            this.reLoadStreeam({ inited: false });
        },
        async hiddenModal() {
            this.modalShow = false;
            //模态框隐藏
            this.clearAllTimer();
            await this.stopDeviceRtmpAction(this.monitorInfo.hid);
            if (this.player) {
                this.player.dispose();
            }
        },
        clearAllTimer() {
            clearTimeout(this.checkTimer);
            clearTimeout(this.monitorTimer);
        },

        //初始化播放器
        initPlayer() {
            const config = {
                controls: true,
                preload: "auto",
                width: "800",
                height: "500",
                autoplay: false,
                bigPlayButton: false,
                controlBar: {
                    volumePanel: false,
                    audioTrackButton: false
                }
            };
            const _this = this;
            //初始化
            videojs("kld-moniter", config, function() {
                _this.onPleyerReady(this);
            });
        },
        onPleyerReady(player) {
            this.player = player;
            player.addClass("video-js");
            player.addClass("vjs-default-skin");
            player.addClass("vjs-seeking");
            player.addClass("vjs-big-play-centered");
            this.player.on("seeking",this.startPlay);
            this.addRefresh(player, player.controlBar);
            this.addToggleSharpness(player, player.controlBar);
        },
        //添加刷新按钮
        addRefresh(player, controlBar) {
            const this_ = this;
            let Button = videojs.getComponent("Button");
            class RefreshButton extends Button {
                constructor(player, options) {
                    super(player, options);
                    const contentDom = this.el_.querySelector(
                        ".vjs-icon-placeholder"
                    );
                    this.el_.style.cursor = "pointer";
                    contentDom.innerText = "刷新";
                    contentDom.style.fontSize = "1.2em";
                }
                buildCSSClass() {
                    return `vjs-control-refresh ${super.buildCSSClass()}`;
                }
                handleClick(event) {
                    super.handleClick(event);
                    player.addClass("vjs-seeking");

                    this_.reLoadStreeam({ inited: false });
                }
            }
            let refreshButton = new RefreshButton(player, {});

            controlBar.addChild(
                refreshButton,
                {},
                controlBar.children_.length - 1
            );
        },
        //切换清晰度
        addToggleSharpness(player, controlBar) {
            clearTimeout(this.toggleTimer);

            let SharpnessButton = videojs.getComponent("SharpnessButton");
            let sharpnessButton = new SharpnessButton(player, {
                currentKey: "normal"
            });
            this.sharpnesses
                .map(item => ({ ...item, clickCallBack: this.toggleSharpness }))
                .forEach(item => {
                    sharpnessButton.addSharpnessItem(item);
                });
            controlBar.addChild(
                sharpnessButton,
                {},
                controlBar.children_.length - 1
            );
        },
        async toggleSharpness(info, player) {
            this.currentSharpness = info.value;
            this.monitorToggling=true;
            this.reLoadStreeam();
        },
        async reLoadStreeam({ inited } = { inited: true }) {
            

            this.clearAllTimer();
            const {
                data: { playip }
            } = await this.pushDeviceRtmpAction(this.monitorInfo);
            this.playip = playip;

            await this.cehckcCircuit(this.monitorInfo);
            await this.preLoadHls();
            //重载浏览器
            if (inited) {
                this.player.one("seeking", this.toggleEnd);
                this.toggleTimer=setTimeout(()=>{
                    this.monitorToggling=false;
                },20000)
            } else {
                this.startPlay();
            }
        },
        toggleEnd(){
            this.monitorToggling=false;
            clearTimeout(this.toggleTimer);
            this.player.addClass("vjs-seeking");
            this.startPlay();
        },

        //播放器开始接收流
        startPlay() {
            this.player.src(this.videoUrl);
            this.player.load();
            this.player.play();
        }
    }
};
</script>
<style lang="less" scoped>
.monitor-window-wrap {
}
/deep/.monitor-modal-wrap {
    display: flex;
    justify-content: center;
    .ivu-modal {
        .ivu-modal-content {
            width: auto;
            display: inline-block;
            .ivu-modal-body {
                padding: 0;
                position: relative;
                overflow: hidden;
                .close-window {
                    position: absolute;
                    top: 0;
                    right: 0;
                    color: white;
                    padding: 1px 3px;
                    background-color: black;
                    transform: translateY(-100%);
                    transition: all 0.1s linear;
                    user-select: none;
                    cursor: pointer;
                    &:active {
                        color: #ff352b;
                    }
                }
                .toggle-stream{
                    padding: 3px 10px;
                    background-color: rgba(0,0,0,0.3);
                    color: white;
                    position: absolute;
                     user-select: none;
                    bottom: 30px;
                    left: 0;
                    border-radius:3px; 
                }
                &:hover {
                    .close-window {
                        transform: translateX(0);
                    }
                }
            }
            .ivu-modal-footer {
                border-top: 0;
                height: 0px;
                padding: 0;
            }
        }
    }
}
</style>

