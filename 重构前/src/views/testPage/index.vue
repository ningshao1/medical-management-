<template>
    <div class="test-page">
        <div class='wrap'>
            <div class=test>

                <!-- <i-button @click="setCurrent">Select</i-button>
                <kld-side-tree
                    ref="dropdown"
                    cancelable
                    show-input
                    v-model='id'
                    :data='treeData'
                    leaf-only
                    @current-change='currentChange'
                ></kld-side-tree> -->
                <!-- <kld-tree-side
                    ref="dropdown"
                    cancelable
                    clearable
                    show-input
                    v-model='id'
                    :data='treeData'
                    leaf-only
                    search-leaf
                    @current-change='currentChange'
                ></kld-tree-side> -->
            </div>
        </div>
    </div>
</template>

<script>
import kldDropdownTree from "@common/kld-dropdown-tree/index";
import kldSideTree from "@common/kld-side-tree/kld-side-tree";
// import KldTreeSide from "@common/element-components/TreeSide";
export default {
    name: "test-page",
    components: { kldDropdownTree, kldSideTree },
    data() {
        return {
            treeData: [],
            id: "0256P6GED"
        };
    },
    created() {
        this.loadCountryTree();
    },
    watch: {
        id(val) {
            console.log(val);
        }
    },
    computed: {
        $dropdown() {
            return this.$refs["dropdown"];
        }
    },
    methods: {
        async loadCountryTree() {
            let { data } = await this.$axios.get(`/assetTypes/typeAllTree`);

            this.treeData = data;
        },
        currentChange(data, node) {
            console.log("trigger", data, node);
        },
        setCurrent() {
            // debugger
            // this.id='0256EDOA4'
            this.$dropdown.setCurrent("");
        }
    }
};
</script>
<style lang="less" scoped>
.test-page {
    width: 100%;
    height: 1000px;
    .wrap {
        width: 300px;
        margin: 0 auto;
        .test {
            height: 600px;
        }
    }
}
</style>
