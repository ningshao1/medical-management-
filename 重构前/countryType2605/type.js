const myApp = (function(Vue, $, iView, $axios, plugins) {
    const { kldConfirm } = plugins;
    Vue.use(iView);
    Vue.prototype.$axios = $axios;

    const kldTestPoptip = {
        template: `<Poptip trigger="hover"  placement='bottom'>
            <Icon type='ios-create-outline' class="ios-compose-outline single-icon"></Icon>
            <div slot="content" class="kld-test-poptip-content">
                <i-button type="info"  @click="configCode">
                    编辑国家分类编码
                </i-button>
                <br />
                <br />
                <i-button type="info"  @click="configName">
                    编辑国家分类名称
                </i-button>
            </div>
        </Poptip>`,
        name: "kld-test-poptip",
        methods: {
            configCode(event) {
                event.stopPropagation();
                this.$emit("config-code");
            },
            configName(event) {
                event.stopPropagation();
                this.$emit("config-name");
            }
        }
    };
    iView.Message.config({
        top: 80,
        duration: 4
    });

    {
        let $countryTreeSort = function(list) {
            function countryTreeFormat(treeList) {
                return treeList.map(type => {
                    if (type.lists && type.lists.length) {
                        return {
                            ...type,
                            lists: countryTreeFormat(chidrenSort(type.lists))
                        };
                    } else {
                        return type;
                    }
                });
            }
            function chidrenSort(treeList) {
                return treeList.sort((pre, current) => {
                    if (pre.typeCode && current.typeCode) {
                        let preIndex = pre.typeCode.lastIndexOf("-") + 1;
                        let currentIndex =
                            current.typeCode.lastIndexOf("-") + 1;
                        return (
                            +pre.typeCode.slice(preIndex) -
                            +current.typeCode.slice(currentIndex)
                        );
                    } else {
                        return pre.typeCode - current.typeCode;
                    }
                });
            }
            return countryTreeFormat(chidrenSort(list));
        };
        Vue.prototype.$countryTreeSort = $countryTreeSort;
    }

    let app = new Vue({
        el: "#app",
        data() {
            const typeCodeCheck = (rule, value, callback) => {
                // if(!/^\d*$/.test(value)){
                //     return callback(new Error('请填写纯数字编码！'))
                // }
                // if(value&&(value.length>10||value.length<6)){
                //    return callback(new Error('请填写长度为6-10位的编码！'));
                // }

                if (value && this.allTypes.find(v => v.typeCode === value)) {
                    return callback(
                        new Error("该国家分类编码已存在，请修改！")
                    );
                }
                callback();
            };
            const typeNameCheck = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("该项为必填项！"));
                }
                // if(value.length>10||value.length<6){
                //    return callback(new Error('请填写长度为6-10位名称！'));
                // }

                if (this.allTypes.find(v => v.typeName === value)) {
                    return callback(
                        new Error("该国家分类名称已存在，请修改！")
                    );
                }
                callback();
            };
            return {
                loadingShow: false,
                searchData: "",
                searchTimer: null,
                treeData: [],
                allTypes: [],
                currentNodeKey: null,
                currentData: {},
                appendData: {},
                config: false,
                configQuery: null,
                configTitle: {
                    configCode: "编辑国家分类编码",
                    configName: "编辑国家分类名称"
                },
                add: false,
                isNewAdd: true,
                dataBench: null,
                addFrom: {
                    typeCode: "",
                    typeName: ""
                },
                addRules: {
                    typeCode: [{ validator: typeCodeCheck, trigger: "change" }],
                    typeName: [
                        {
                            required: true,
                            validator: typeNameCheck,
                            trigger: "change"
                        }
                    ]
                },
                CCForm: {
                    typeCode: ""
                },
                CCRules: {
                    typeCode: [{ validator: typeCodeCheck, trigger: "change" }]
                },
                CNForm: {
                    typeName: ""
                },
                CNRules: {
                    typeName: [
                        {
                            required: true,
                            validator: typeNameCheck,
                            trigger: "change"
                        }
                    ]
                },
                originData: null
            };
        },
        computed: {
            user_in() {
                return JSON.parse(localStorage.getItem("user_in"));
            },
            configDom() {
                switch (this.configQuery) {
                    case "configCode":
                        return "CCForm";
                    case "configName":
                        return "CNForm";
                    default:
                        return null;
                }
            }
        },
        watch: {
            searchData: {
                handler() {
                    clearTimeout(this.searchTimer);
                    this.searchTimer = setTimeout(() => {
                        let reg = new RegExp(this.searchData);
                        // console.log(this.searchDataFormat(this.originData,reg));
                        if (this.searchData) {
                            this.treeData = [
                                {
                                    typeName: "国家分类",
                                    id: "-1",
                                    title: "国家分类",
                                    typeLevel: "0",
                                    expand: true,
                                    children: this.searchDataFormat(
                                        this.originData,
                                        reg
                                    )
                                }
                            ];
                            this.treeData = this.searchDataFormat(
                                this.originData,
                                reg
                            );
                        } else {
                            this.treeData = this.originData;
                        }
                        this.currentNodeKey = null;
                    }, 100);
                }
            }
        },
        created() {
            this.getOriginDate();
            // console.log(this.components)
        },
        mounted() {
            //Motal拖拽
            this.$nextTick(() => {
                $(function() {
                    let clientX = 0;
                    let clientY = 0;
                    let moveX = 0;
                    let moveY = 0;
                    let tempY = 0;
                    let tempX = 0;
                    let tagetName = "";
                    let target = "";
                    function moveMotal(e) {
                        moveX = e.clientX - clientX; //移动的距离
                        moveY = e.clientY - clientY;
                        let finallyX =
                            parseInt(tempX + moveX) % 2
                                ? parseInt(tempX + moveX) + 1
                                : parseInt(tempX + moveX);
                        let finallyY =
                            parseInt(tempY + moveY) % 2
                                ? parseInt(tempY + moveY) + 1
                                : parseInt(tempY + moveY);
                        $(this)
                            .find(".ivu-modal-content")
                            .css({
                                transform: `translate(${finallyX}px,${finallyY}px)`
                            });
                    }
                    $(document).on(
                        {
                            mousedown(e) {
                                if (target !== this) {
                                    target = this;
                                    tempY = 0;
                                    tempX = 0;
                                }
                                tagetName = e.target.className;
                                if (
                                    tagetName !== "ivu-modal-header" &&
                                    tagetName !== "ivu-modal-header-inner"
                                ) {
                                    return;
                                }
                                clientX = e.clientX; //获取按压鼠标时候鼠标的位置
                                clientY = e.clientY;
                                $(this).on("mousemove", function(events) {
                                    moveMotal.call(this, events);
                                });
                            },
                            mouseup() {
                                if (
                                    tagetName !== "ivu-modal-header" &&
                                    tagetName !== "ivu-modal-header-inner"
                                ) {
                                    return;
                                }
                                var arr = $(this)
                                    .find(".ivu-modal-content")
                                    .css("transform")
                                    .replace(/[^0-9\-,]/g, "")
                                    .split(",");
                                tempX = arr[4] - 0; //记录释放前的偏移值
                                tempY = arr[5] - 0;
                                $(this).off("mousemove");
                            }
                        },
                        ".ivu-modal-wrap"
                    );
                });
            });
        },
        methods: {
            searchDataFormat(data, reg) {
                let arr = [];
                data.forEach(v => {
                    if (reg.test(v.title) || reg.test(v.typeCode)) {
                        arr.push(v);
                        return;
                    }
                    if (v.children && v.children.length > 0) {
                        arr.splice(
                            arr.length,
                            0,
                            ...this.searchDataFormat(v.children, reg)
                        );
                    }
                });
                return arr;
            },
            getOriginDate() {
                this.getType();
            },
            getType() {
                this.loadingShow = true;
                return this.$axios
                    .get(`/assetTypes/typeAllTree`)
                    .then(({ data }) => {
                        data = this.$countryTreeSort(data); //国家分类排序
                        let costumeData = {
                            typeName: "国家分类",
                            id: "-1",
                            typeLevel: "0",
                            lists: data,
                            typeCode: null
                        };
                        let assignValue = Object.keys(data[0]);
                        if (data[0].lists) {
                            assignValue.splice(
                                assignValue.findIndex(v => v == "lists"),
                                1
                            );
                        }
                        this.treeData = this.formatTreeData(
                            [costumeData],
                            assignValue,
                            true
                        );
                        this.$nextTick(() => {
                            // console.log(this.treeData);
                            this.updateOriginData();
                            this.loadingShow = false;
                        });
                    });
            },
            //处理树数据
            formatTreeData(data, limit, expand = false) {
                return data.map(v => {
                    if (v.lists) {
                        return {
                            title: v.typeName,
                            children: this.formatTreeData(v.lists, limit),
                            ...JSON.parse(JSON.stringify(v, limit)),
                            expand
                        };
                    }
                    return {
                        title: v.typeName,
                        ...v
                    };
                });
            },
            currencyRender(h, { root, node, data }) {
                let active = this.currentNodeKey === data.nodeKey;
                let isRoot = data.id === "-1";
                return h(
                    "span",
                    {
                        style: {
                            display: "inline-block",
                            width: "100%"
                        }
                    },
                    [
                        h(
                            "span",
                            {
                                class: {
                                    "node-wrap": true,
                                    "node-active":
                                        this.currentNodeKey === data.nodeKey
                                },
                                on: {
                                    click: () => {
                                        // console.log(root,node,data)
                                        if (!active) {
                                            this.currentNodeKey = data.nodeKey;
                                        }
                                        if (
                                            data.children &&
                                            data.children.length > 0 &&
                                            !isRoot
                                        ) {
                                            data.expand = !data.expand;
                                        }
                                    }
                                }
                            },
                            [
                                h("span", this.viewTypeCode(data)),
                                active
                                    ? h(
                                          "div",
                                          {
                                              class: {
                                                  "icon-wrap": true
                                              }
                                          },
                                          [
                                              h("Icon", {
                                                  //新增
                                                  props: {
                                                      type:
                                                          "ios-add-circle-outline"
                                                  },
                                                  class: {
                                                      "ios-plus-outline": true,
                                                      "single-icon": true
                                                  },
                                                  nativeOn: {
                                                      click: event => {
                                                          event.stopPropagation();
                                                          this.reset();
                                                          this.queryAppend(
                                                              root,
                                                              node,
                                                              data
                                                          );
                                                      }
                                                  }
                                              }),
                                              !isRoot
                                                  ? h("Icon", {
                                                        //删除
                                                        props: {
                                                            type:
                                                                "ios-trash-outline"
                                                        },
                                                        class: {
                                                            "ios-trash-outline": true,
                                                            "single-icon": true
                                                        },
                                                        nativeOn: {
                                                            click: event => {
                                                                event.stopPropagation();
                                                                if (
                                                                    data.children &&
                                                                    data
                                                                        .children
                                                                        .length >
                                                                        0
                                                                ) {
                                                                    this.$Message.warning(
                                                                        "请先移除分类子节点再删除该分类！"
                                                                    );
                                                                    return;
                                                                }
                                                                this.queryDelete(
                                                                    root,
                                                                    node,
                                                                    data
                                                                );
                                                            }
                                                        }
                                                    })
                                                  : "",
                                              !isRoot
                                                  ? this.configIcon(
                                                        h,
                                                        root,
                                                        node,
                                                        data
                                                    )
                                                  : ""
                                          ]
                                      )
                                    : h("span", "")
                            ]
                        )
                    ]
                );
            },
            updateOriginData() {
                if (!this.searchData) {
                    this.originData = JSON.parse(JSON.stringify(this.treeData));
                }
            },
            syncOriginData(id, type, data) {
                if (!this.searchData) {
                    return;
                }

                let node = this.findNode(id, this.originData);
                // console.log(node);
                let parentNode = this.findNode(node.pId, this.originData);
                if (type === "add") {
                    const children = node.children || [];
                    children.push({
                        ...data,
                        title: this.viewTypeCode(data),
                        expand: true
                    });
                    node.expand = true;
                    return;
                }
                if (type === "delete") {
                    parentNode.children.splice(
                        parentNode.children.findIndex(v => v === node),
                        1
                    );
                    return;
                }
                if (type === "config") {
                    node.title = data.typeName;
                    node.typeName = data.typeName;
                    node.typeCode = data.typeCode;
                }
            },
            findNode(id, data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === id) {
                        return data[i];
                    }
                    if (data[i].children && data[i].children.length > 0) {
                        let final = this.findNode(id, data[i].children);
                        if (final) {
                            return final;
                        }
                    }
                }
                return null;
            },
            reset() {
                this.addFrom = {
                    typeCode: "",
                    typeName: ""
                };
                this.CCForm = {
                    typeCode: ""
                };
                this.CNForm = {
                    typeName: ""
                };
            },
            //编辑按钮
            configIcon(h, root, node, data) {
                return h(
                    kldTestPoptip,
                    {
                        on: {
                            "config-code": () => {
                                this.queryConfig(root, node, data);
                                this.CCForm.typeCode = data.typeCode || "";
                                this.configQuery = null;
                                this.$nextTick(() => {
                                    this.configQuery = "configCode";
                                });
                            },
                            "config-name": () => {
                                this.queryConfig(root, node, data);
                                this.CNForm.typeName = data.typeName || "";
                                this.configQuery = null;
                                this.$nextTick(() => {
                                    this.configQuery = "configName";
                                });
                            }
                        }
                    },
                    ""
                );
            },
            viewTypeCode(data) {
                return (
                    (data.typeCode ? `[${data.typeCode}] ` : "") + data.typeName
                );
            },
            queryAppend(root, node, data) {
                this.isNewAdd = false;
                this.$nextTick(() => {
                    this.isNewAdd = true;
                });
                this.allTypes = root.map(({ node: { typeCode, typeName } }) => {
                    return {
                        typeCode,
                        typeName
                    };
                });
                this.appendData = {
                    pId: data.id,
                    typeLevel: +data.typeLevel + 1 + ""
                };
                this.currentData = data;
                // console.log(this.allTypes)
                this.add = true;
            },
            queryDelete(root, node, data) {
                // console.log(node,data);
                kldConfirm({
                    title: "提示",
                    content: `确认删除该国家分类：${data.typeName} ？`,
                    maskClosable: false, //是否允许点击遮罩关闭 默认:false
                    ok: () => {
                        //当点击了确认按钮时
                        this.$axios
                            .delete(`/assetTypes/${data.id}`)
                            .then(res => {
                                this.$Message.success("删除国家分类成功！");
                                this.syncOriginData(res.data, "delete");
                                this.removeChild(root, node, data);
                                this.currentNodeKey = null;
                            });
                    },
                    cancel: () => {
                        //取消按钮同上
                        // console.log('cancel');
                    }
                });
            },

            removeChild(root, node, data) {
                const parentKey = root.find(el => el === node).parent;
                // console.log(parentKey);
                if (parentKey === undefined) {
                    const index = this.treeData.indexOf(data);
                    this.treeData.splice(index, 1);
                    return;
                }
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
                this.$nextTick(() => {
                    this.updateOriginData();
                });
            },
            appendChild() {
                this.$axios
                    .post(`/assetTypes`, {
                        ...this.addFrom,
                        ...this.appendData,
                        typeCode: this.addFrom.typeCode || null
                    })
                    .then(res => {
                        this.$Message.success("新增国家分类成功！");
                        this.syncOriginData(
                            this.currentData.id,
                            "add",
                            res.data
                        );
                        this.add = false;
                        const children = this.currentData.children || [];
                        children.push({
                            ...res.data,
                            title: this.viewTypeCode(res.data),
                            expand: true
                        });
                        this.currentData.expand = true;
                        this.$set(this.currentData, "children", children);
                        this.currentNodeKey = null;
                        this.$nextTick(() => {
                            this.updateOriginData();
                        });
                    });
            },

            doCancel() {
                this.add = false;
            },

            doDetermine() {
                this.$refs["addInfo"].validate(valid => {
                    //  console.log(valid);
                    if (valid) {
                        this.appendChild();
                    }
                });
            },

            doCancelConfig() {
                this.config = false;
            },
            doConfig(query, name) {
                // console.log(query,name);
                const putData = {
                    configCode: {
                        typeCode: this.CCForm.typeCode
                    },
                    configName: {
                        typeName: this.CNForm.typeName
                    }
                };
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.$axios
                            .put(`/assetTypes`, {
                                ...this.configData,
                                ...putData[query]
                            })
                            .then(res => {
                                this.$Message.success("编辑国家分类成功！");
                                this.syncOriginData(
                                    res.data.id,
                                    "config",
                                    res.data
                                );
                                this.$set(
                                    this.currentData,
                                    "title",
                                    res.data.typeName
                                );
                                this.$set(
                                    this.currentData,
                                    "typeName",
                                    res.data.typeName
                                );
                                this.$set(
                                    this.currentData,
                                    "typeCode",
                                    res.data.typeCode
                                );
                                this.config = false;
                                this.$nextTick(() => {
                                    this.reset();
                                    this.updateOriginData();
                                });
                            });
                    }
                });
            },
            queryConfig(root, node, data) {
                this.allTypes = root.map(({ node: { typeCode, typeName } }) => {
                    return {
                        typeCode,
                        typeName
                    };
                });
                (this.configData = {
                    id: data.id,
                    typeLevel: data.typeLevel,
                    pId: data.pId,
                    typeCode: data.typeCode,
                    typeName: data.typeName
                }),
                    (this.currentData = data);
                this.config = true;
            }
        }
    });

    return app;
})(Vue, $, iview, $axios, plugins);
