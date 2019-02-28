export default {
    data() {
        return {
            brandData: [],
            assetData: {
                inUseCount: 0,
                idleCount: 0,
                standbyCount: 0,
                scrapCount: 0
            },
            ControlData: {
                oneCount: 0
            },
            badData: [],
            badTotal: 0,
            totalData: {
                orderCount: 0,
                maintenanceCount: 0
            },
            everyData: {},
            TopFive: [],
            constraint: [],
            constraintData: {},
            lifeData: {
                atName: [],
                umAssetCount: [],
                upAssetCount: []
            },
            eqData: {
                os_Name: [],
                assetCount: []
            },
            lifeEntryData: []
        }
    },
    created() {
        this.brand();
        this.getAsset();
        this.getControl();
        this.getBad();
        this.getTotal();
        this.getEvery();
        this.getConstraint();
        this.getLife();
        this.getEquipment();
        this.getLifeDetail()
    },
    methods: {
        //获取品牌
        brand() {
            this.$axios.get(`/statistical/brankFalutPercent`).then(({
                data
            }) => {
                this.brandData = data;
            })
        },
        //资产数据
        getAsset() {
            this.$axios.get(`/statistical/assetDataCount`).then(({
                data
            }) => {
                this.assetData = data
            })
        },
        //质控数据
        getControl() {
            this.$axios.get(`/statistical/monthPmCount`).then(({
                data
            }) => {
                this.ControlData = data
            })
        },
        //获取不良
        getBad() {
            this.$axios.get(`/statistical/adverseEventCount`).then(({
                data
            }) => {
                if (data instanceof Array) {
                    let temp = []
                    let total = 0;
                    data.map(v => {
                        if (v.aeCount !== undefined && v.aeCount !== null && v.aeCount !== '') {
                            total = v.aeCount - 0 + total;
                        }
                    })
                    this.badTotal = total;
                    data.forEach(v => {
                        switch (v.aeType) {
                            case 6:

                                temp.push({
                                    value: v.aeCount - 0,
                                    name: "其它",

                                    label: {
                                        normal: {
                                            show: true
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                });
                                break;
                            case 5:
                                temp.push({
                                    value: v.aeCount - 0,
                                    name: "需要内、外科治疗避免永久性损伤",

                                    label: {
                                        normal: {
                                            show: true
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                });
                                break;
                            case 4:
                                temp.push({
                                    value: v.aeCount - 0,
                                    name: "可能导致机体功能机构永久性损伤",

                                    label: {
                                        normal: {
                                            show: true
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                });
                                break;
                            case 3:
                                temp.push({
                                    value: v.aeCount - 0,
                                    name: "机体功能结构永久性损伤",

                                    label: {
                                        normal: {
                                            show: true
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                });
                                break;
                            case 2:
                                temp.push({
                                    value: v.aeCount - 0,
                                    name: "危及生命",

                                    label: {
                                        normal: {
                                            show: true
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                });
                                break;
                            case 1:
                                temp.push({
                                    value: v.aeCount - 0,
                                    name: "死亡",

                                    label: {
                                        normal: {
                                            show: true
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                });
                                break;
                        }
                    })
                    this.badData = temp;
                }


            })
        },
        getTotal() {
            this.$axios.get(`/statistical/faultReportCount/${this.$store.state.user_in.osId}`).then(({
                data
            }) => {
                this.totalData = data;
            })
        },
        //获取日常保养
        getEvery() {
            this.$axios.get(`/statistical/oneLogCount/${this.$store.state.user_in.osId}`).then(({
                data
            }) => {
                this.everyData = [{
                    value: 100 - data.percentage * 100,
                    name: "未保养率",
                    label: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: "#efefef",
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    emphasis: {
                        itemStyle: {
                            color: "#efefef"
                        }
                    }
                }, {
                    value: data.percentage * 100,
                    name: "保养率",
                    label: {
                        normal: {
                            formatter: "{d} %",
                            position: "center",
                            textStyle: {
                                fontSize: 30
                            }
                        }
                    }
                }]
                this.TopFive = data.top5;

            })
        },
        //计量信息
        getConstraint() {
            this.$axios.get(`/statistical/measurementCount/${this.$store.state.user_in.osId}`).then(({
                data
            }) => {
                this.constraintData = data;
                this.constraint = [{
                    value: data.unExecuteCount,
                    name: "未计量",

                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true,
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }, {
                    value: data.executeCount,
                    name: "已计量",

                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }]
            })
        },
        //生命支持
        getLife() {
            this.$axios.get(`/statistical/assetLifeCount`).then(({
                data
            }) => {
                if (data instanceof Array) {
                    data = data.sort((a, b) => {
                        return b.assetCount - a.assetCount;
                    })
                    let atName = [];
                    let umAssetCount = []
                    let upAssetCount = []
                    data.map(v => {
                        if (v.atName !== undefined && v.atName !== null) {
                            atName.push(v.atName);
                            umAssetCount.push(v.umAssetCount);
                            upAssetCount.push(v.upAssetCount)
                        }

                    })
                    this.lifeData = {
                        atName,
                        umAssetCount,
                        upAssetCount
                    };
                    // if (this.lifeData.atName.length < 5) {
                    //     for (let i = this.lifeData.atName.length; i < 8; i++) {
                    //         this.lifeData.atName.push('')
                    //     }
                    // }
                }
            })
        },
        getEquipment() {
            this.$axios.get(`/statistical/assetDistribute`, {
                params: {
                    minValue: this.minNumber === '' ? null : this.minNumber,
                    maxValue: this.maxINumber === '' ? null : this.maxINumber
                }
            }).then(({
                data
            }) => {
                if (data instanceof Array) {
                    let os_Name = [];
                    let assetCount = []
                    data.map(v => {
                        if (typeof v === 'object' && v !== null) {
                            os_Name.push(v.os_Name);
                            assetCount.push(v.assetCount)
                        }
                    })
                    this.eqData = {
                        os_Name,
                        assetCount
                    }
                }
            })
        },
        //应急物资入口数量
        getLifeDetail() {
            this.$axios.post(`EmergencyMaterials/getLifeDetail`).then(({
                data
            }) => {
                this.lifeEntryData = data;
            })
        }
    }
}