<template>
    <span v-if="currentIcon&&currentIcon.test(icon,iconKey)"
          class="asset-icon"
          :style="currentIcon.style(icon,iconKey)">
        {{currentIcon.label(icon,iconKey)}}
    </span>
</template>

<script>
export default {
    name: "asset-icon",
    props: {
        iconKey: String,
        icon: Object
    },
    data() {
        const usedIcons = {
            0: {
                label: "闲置",
                style: {
                    backgroundColor: "#156cf3"
                }
            },
            1: {
                label: "在用",
                style: {
                    backgroundColor: "#09b785"
                }
            },
            2: {
                label: "报废",
                style: {
                    backgroundColor: "#24baf9"
                }
            },
            3: {
                label: "备用",
                style: {
                    backgroundColor: "#24baf9"
                }
            },
            4: {
                label: "待用",
                style: {
                    backgroundColor: "#e1bb6a"
                }
            }
        };
        return {
            assetIcons: {
                used: {
                    iconKey: "used",
                    label(icon, iconKey) {
                        let obj = usedIcons[icon[iconKey]] || {};
                        return obj.label;
                    },
                    style(icon, iconKey) {
                        let obj = usedIcons[icon[iconKey]] || {};
                        return obj.style || {};
                    },
                    test(icon, iconKey) {
                        return usedIcons[icon[iconKey]];
                    }
                },
                eventType: {
                    iconKey: "eventType",
                    label() {
                        return "不良";
                    },
                    style() {
                        return {
                            backgroundColor: "#556b8d"
                        };
                    },
                    test(icon, iconKey) {
                        return icon[iconKey];
                    }
                },
                assetWarrntyDate: {
                    iconKey: "assetWarrntyDate",
                    label() {
                        return "已出保";
                    },
                    style() {
                        return {
                            backgroundColor: "#b99341"
                        };
                    },
                    test: (icon, iconKey) => {
                        return this.isAssetWarrnty(icon[iconKey]);
                    }
                },
                pictureStatus: {
                    iconKey: "pictureStatus",
                    label() {
                        return "图";
                    },
                    style() {
                        return {
                            backgroundColor: "#ff8e09"
                        };
                    },
                    test: (icon, iconKey) => {
                        return icon[iconKey] === 1;
                    }
                }
            }
        };
    },
    computed: {
        currentIcon() {
            return this.assetIcons[this.iconKey];
        }
    },
    methods: {
        isAssetWarrnty(date) {
            return +new Date() - (+new Date(date) + 60 * 60 * 24 * 1000) > 0;
        }
    }
};
</script>

<style lang="less" scoped>
.asset-icon {
    vertical-align: middle;
    display: inline-block;
    height: 18px;
    color: #fff;
    padding: 0 3px;
    line-height: 18px;
    border-radius: 3px;
    margin-left: 6px;
}
</style>

