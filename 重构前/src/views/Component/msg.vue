<template>
    <div>
        <Modal v-model="modal2" title="{{title}}" class-name="{{className}}">
            <div class='content_t'>

            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            default: "添加文件"
        },
        className: {
            default: "tree_tan"
        },
        mType: {
            default: true
        }
    },
    data() {
        return {
            modal2: true
        };
    }
};
</script>

