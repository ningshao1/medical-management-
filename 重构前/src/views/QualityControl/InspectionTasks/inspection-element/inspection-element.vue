<template>
    <div class="inspection-element">
        <element-tabs :add-limit="addLimit" :edit-limit="editLimit" :typeListLoaded='typeListLoaded' :del-limit="delLimit" :list-limit="listLimit" type-title="巡检类别" item-title="巡检项" element-title="巡检要素" :internal-type-list="internalTypeList" :custom-type-list="customTypeList" :item-list="itemList" :element-list="elementList" @click-type="clickType" @click-item="clickItem" @click-element="clickElement" @add-type="addType" @add-item="addItem" @add-element="addElement" @del-type="delType" @del-item="delItem" @del-element="delElement"></element-tabs>
        <Modal v-model="modalState.show" :title="modalState.title" @on-visible-change="modalVisibleChange" class-name="vertical-center-modal">
            <i-input @on-keydown.enter="modalSubmit" ref="modalInput" v-model="modalState.input" :placeholder="modalState.placeholder" class="kld-input"></i-input>
            <div slot="footer">
                <Button @click="modalCancel" class="kld-btn-default kld-btn-small">取消</Button>
                <Button :loading="submitLoading" @click="modalSubmit" class="kld-btn kld-btn-small">确认</Button>
            </div>
        </Modal>
        <Modal v-model="modalState.addItemShow" :title="modalState.title" @on-visible-change="modalVisibleChange" class-name="vertical-center-modal" class="inspection-element-modal" width='1000'>
            
            <div class="convenient-switch">
                <span class="convenient-switch-title">快速添加巡检项</span>
                <Switch v-if="internalTypeList.length > 0" v-model="isConvenient"></Switch>
            </div>
            <!-- <transition name="fade"> -->
                <i-input  v-if="!isConvenient" @on-keydown.enter="modalSubmit" ref="modalInput" v-model="modalState.input" :placeholder="modalState.placeholder" class="kld-input"></i-input>
                <element-check v-else ref="element-check"></element-check>
            <!-- </transition> -->
            <div slot="footer">
                <Button @click="itemModalCancel" class="kld-btn-default kld-btn-small">取消</Button>
                <Button :loading="submitLoading" @click="ItemModalSubmit" class="kld-btn kld-btn-small">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<style lang="less" scoped>
.inspection-element {
    height: calc(~"100vh - 215px");
}
.inspection-element-modal {
    position: relative;
    .convenient-switch{
        .convenient-switch-title{
            margin-right: 5px;
        }
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 13px;
        margin-bottom:5px;
    }
}
</style>

<script>
    import ElementTabs from "@inspection-common/element-tabs";
    import ElementCheck from "@inspection-common/element-check";
    import kldConfirm from "@common/kld-confirm";

    export default {
    name: "inspection-element",

    components: {
        ElementTabs,
        ElementCheck
    },

    data() {
        return {
            submitLoading: false,
            addLimit: false,
            editLimit: false,
            delLimit: false,
            listLimit: false,

            internalTypeList: [],
            customTypeList: [],
            itemList: [],
            elementList: [],

            currentType: null,
            currentItem: null,
            currentElement: null,
            modalState: {
                show: false,
                input: "",
                type: "",

                title: "",
                placeholder: "",
                freshField: "",
                successMessage: "",
                validMessage: "",
                addItemShow: false
            },
            axiosConfig: {},

            isCustomType:false,//当前类别是否是自定义类别
            typeListLoaded:false,
            isConvenient:false
        };
    },

    computed: {
        user_in() {
            return this.$store.state.user_in;
        },
    },

    created() {
        for (const { plPermission } of this.limit) {
            switch (plPermission) {
                case "pm:inspection:element:add":
                    this.addLimit = true;
                    break;
                case "pm:inspection:element:edit":
                    this.editLimit = true;
                    break;
                case "pm:inspection:element:del":
                    this.delLimit = true;
                    break;
                case "pm:inspection:element:list":
                    this.listLimit = true;
                    break;
            }
        }

        this.getTypeList();
    },

    watch: {
        itemList() {
            this.elementList = [];
            this.currentItem = null;
        },
        elementList() {
            this.currentElement = null;
        },
        "modalState.type"(type) {
            switch (type) {
                case "add-type":
                    this.modalState.title = "添加巡检类别";
                    this.modalState.placeholder = "请输入巡检类别名称";
                    this.modalState.validMessage = "巡检类别名称不能为空";
                    this.modalState.successMessage = "添加巡检类别成功";
                    this.modalState.freshField = "getTypeList";

                    this.axiosConfig = {
                        url: "/inspectionOption/elementOption",
                        method: "POST"
                    };
                    break;
                case "add-item":
                    this.modalState.title = "添加巡检项";
                    this.modalState.placeholder = "请输入巡检项名称";
                    this.modalState.validMessage = "巡检项名称不能为空";
                    this.modalState.successMessage = "添加巡检项成功";
                    this.modalState.freshField = "getItemList";

                    this.axiosConfig = {
                        url: "/inspectionOption/elementType",
                        method: "POST"
                    };
                    break;
                case "add-element":
                    this.modalState.title = "添加巡检要素";
                    this.modalState.placeholder = "请输入巡检要素名称";
                    this.modalState.validMessage = "巡检要素名称不能为空";
                    this.modalState.successMessage = "添加巡检要素成功";
                    this.modalState.freshField = "getElementList";

                    this.axiosConfig = {
                        url: "/inspectionOption/element",
                        method: "POST"
                    };
                    break;
                case "edit-element":
                    this.modalState.title = "编辑巡检要素";
                    this.modalState.placeholder = "请输入巡检要素名称";
                    this.modalState.validMessage = "巡检要素名称不能为空";
                    this.modalState.successMessage = "编辑巡检要素成功";
                    this.modalState.freshField = "getElementList";

                    this.axiosConfig = {
                        url: "/inspectionOption/element",
                        method: "PUT"
                    };
                    break;
            }
        }
    },

    methods: {
        //获取类别列表
        getTypeList() {
            return this.$axios
                .post(
                    `/inspectionOption/elementOption/${this.user_in.osId}/list`,
                    {
                        limit: 50,
                        offset: 0,
                        params: {}
                    }
                )
                .then(({ data }) => {
                    const internalList = [],
                        customList = [];

                    for (const type of data) {
                        type.title = type.name;

                        if (type.selfType === 1) {
                            internalList.push(type);
                        } else {
                            customList.push(type);
                        }
                    }
                    this.customTypeList = customList;
                    this.internalTypeList = internalList;
                    this.typeListLoaded=true;
                });
        },

        resetQuickly(){//重置
            this.isConvenient=false;
        },
        //获取项列表
        getItemList(type = this.currentType) {
            return this.$axios
                .post(`/inspectionOption/elementType/${type.id}/list`, {
                    limit: 50,
                    offset: 0,
                    params: {}
                })
                .then(({ data }) => {
                    data.forEach(item => (item.title = item.lName));
                    this.itemList = data;
                });
        },
        

        //获取要素列表
        getElementList(item = this.currentItem) {
            return this.$axios
                .post(`/inspectionOption/element/${item.id}/list`, {
                    limit: 50,
                    offset: 0,
                    params: {}
                })
                .then(({ data }) => {
                    data.forEach(item => (item.title = item.eContent));
                    this.elementList = data;
                });
        },

        //为axios创建 提交数据
        getAxiosData() {
            this.axiosConfig.data = { orgId: this.user_in.osId };
            let selfType=this.isCustomType?2:1;
            switch (this.modalState.type) {
                case "add-type":
                    this.axiosConfig.data.name = this.modalState.input;
                    this.axiosConfig.data.selfType = selfType;
                    break;
                case "add-item":
                    this.axiosConfig.data.lName = this.modalState.input;
                    this.axiosConfig.data.optionId = this.currentType.id;
                    this.axiosConfig.data.selfType = selfType;
                    break;
                case "add-element":
                    this.axiosConfig.data.eContent = this.modalState.input;
                    this.axiosConfig.data.lId = this.currentItem.id;
                    this.axiosConfig.data.selfType = selfType;
                    break;
                case "edit-element":
                    this.axiosConfig.data.eContent = this.modalState.input;
                    this.axiosConfig.data.id = this.currentElement.id;
                    this.axiosConfig.data.lId = this.currentType.id;
                    this.axiosConfig.data.selfType = selfType;
                    break;
            }
        },

        //类别被点击
        clickType(type,isCustomType) {
            this.isCustomType=isCustomType;
            this.currentType = type;
            this.getItemList(type,true);
        },
        //项被点击
        clickItem(item) {
            this.currentItem = item;
            this.getElementList(item,true);
        },
        //要素被点击后进入编辑
        clickElement(element) {
            this.currentElement = element;
            this.modalState.show = true;
            this.modalState.input = element.title;
            this.modalState.type = "edit-element";
        },

        //添加类别
        addType(isCustomType) {
            this.isCustomType=isCustomType;
            this.modalState.show = true;
            this.modalState.type = "add-type";
        },
        //添加项
        addItem() {
            if(this.isCustomType){
                this.resetQuickly();
                this.modalState.addItemShow = true;
            }else{
                this.modalState.show=true;
            }
            this.modalState.type = "add-item";
        },
        //添加要素
        addElement() {
            this.modalState.show = true;
            this.modalState.type = "add-element";
        },

        //删除类别
        delType(type) {
            kldConfirm({
                title: "提示",
                content: "确认删除此巡检类别？",
                ok: () => {
                    this.$axios
                        .delete(`/inspectionOption/elementOption/${type.id}`)
                        .then(() => {
                            this.$Message.success("删除巡检类别成功");
                            this.getTypeList();
                        });
                }
            });
        },
        //删除项
        delItem(item) {
            kldConfirm({
                title: "提示",
                content: "确认删除此巡检项？",
                ok: () => {
                    this.$axios
                        .delete(
                            `/inspectionOption/elementType/${
                                this.user_in.osId
                            }/${item.id}`
                        )
                        .then(() => {
                            this.$Message.success("删除巡检项成功");
                            this.getItemList();
                        });
                }
            });
        },
        //删除要素
        delElement(element) {
            kldConfirm({
                title: "提示",
                content: "确认删除此巡检要素？",
                ok: () => {
                    this.$axios
                        .delete(`/inspectionOption/element/${element.id}`)
                        .then(() => {
                            this.$Message.success("删除巡检要素成功");
                            this.getElementList();
                        });
                }
            });
        },

        //modal点击确定
        modalSubmit() {
            const modalState = this.modalState;
            if (modalState.input.trim() === "") {
                this.$Message.warning(modalState.validMessage);
            } else if (modalState.input.length > 100) {
                this.$Message.warning("输入字数不能超过100");
            } else {
                this.getAxiosData();
                this.submitLoading = true;
                this.$axios(this.axiosConfig)
                    .then(() => {
                        this.$Message.success(modalState.successMessage);
                        this[modalState.freshField]();
                        modalState.show = false;
                        modalState.addItemShow=false;
                    })
                    .finally(() => (this.submitLoading = false));
            }
        },
        ItemModalSubmit() {
            const modalState = this.modalState;
            if(!this.isConvenient){
                if (modalState.input.trim() === "") {
                    this.$Message.warning(modalState.validMessage);
                } else if (modalState.input.length > 100) {
                    this.$Message.warning("输入字数不能超过100");
                } else {
                    this.getAxiosData();
                    this.submitLoading = true;
                    this.$axios(this.axiosConfig)
                        .then(() => {
                            this.$Message.success(modalState.successMessage);
                            this[modalState.freshField]();
                            this.modalState.addItemShow = false;
                        })
                        .finally(() => (this.submitLoading = false));
                }
                return;
            }


            const {currentType} = this,
                checkedType = this.$refs['element-check'].getChecked(currentType.id, currentType.selfType);


            if(! checkedType.length){
                this.$Message.warning('请勾选巡检项！');
                return;
            }
            
            let requestBody={
                name:this.currentType.name,
                orgId:this.$store.state.user_in.osId,
                pmElementTypes: checkedType
            };

            this.$axios.post(`/inspectionType/elementTypeAll`,requestBody)
                .then(res=>{
                    this.$Message.success(modalState.successMessage);
                    this[modalState.freshField]();
                    this.modalState.addItemShow=false;
                })
                .finally(res=>{
                    this.submitLoading = false;
                })
        },

        //modal点击取消按钮
        modalCancel() {
            this.modalState.show = false;
        },
        itemModalCancel() {
            this.modalState.addItemShow = false;
        },
        //当modal显示的发生变化时
        modalVisibleChange(show) {
            if (show) {
                this.$nextTick(() => this.$refs.modalInput.focus());
            } else {
                this.modalState.input = "";
            }
        }
    }
};
</script>
