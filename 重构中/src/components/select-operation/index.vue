<template>
    <div class="select-operation"
         v-clickoutside='clickoutside'>
        <i class="el-icon-more kld-operation"
           @click="showSelect"></i>
        <transition name="fade">
            <div class="popup"
                 v-show="show">
                <ul class="kld-select-ui">
                    <li v-for='(item,i) in data'
                        :key='i'
                        @click="clickLi(item,i)">
                        {{item}}
                    </li>
                </ul>
            </div>

        </transition>

    </div>
</template>
<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
export default {
    name: "select-operation",
    directives: { Clickoutside },
    props: {
        data: {
            type: Array,
            default() {
                return ["编辑", "删除"];
            }
        },
        id: {
            type: "",
            default: ""
        }
    },
    data() {
        return {
            show: false
        };
    },
    methods: {
        showSelect() {
            this.show = !this.show;
        },
        clickoutside() {
            this.show = false;
        },
        clickLi(item, i) {
            this.$emit("click", { item: item, index: i, id: this.id });
            this.show = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.select-operation {
    position: absolute;
    top: 6px;
    right: 6px;
    .kld-operation {
        transform: rotate(-90deg);
        color: #74808a;
        &:active {
            opacity: 0.8;
        }
    }
    .popup {
        position: absolute;
        transform: translateX(-73%);
        top: 20px;
        .kld-select-ui {
            background-color: #fcfcfc;
            box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
            border: solid 1px #cccccc;
            text-align: center;
            padding: 0;
            margin: 0;
            > li {
                padding: 4px 12px;
                list-style: none;
                color: rgba(0, 0, 0, 0.85);
                font-size: 14px;
                display: block;
                white-space: nowrap;
                cursor: pointer;
            }
        }
    }
}
</style>

