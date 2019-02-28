<script>
export default {
    name: "kld-photo-view",
    props: {
        src: ""
    },
    render: function(h) {
        return h(
            "el-dialog",
            {
                class: {
                    "upload-dialog": true
                },
                props: {
                    ...this.$attrs
                },
                on: {
                    ...this.$listeners
                }
            },
            [
                h(
                    "div",
                    {
                        class: {
                            "show-img": true
                        }
                    },
                    [
                        h("img", {
                            attrs: {
                                src: this.src
                            }
                        })
                    ]
                )
            ]
        );
    },

};
</script>
<style lang="scss">
.upload-dialog {
    .el-dialog__header {
        background: #fff;
        padding: 0px 20px 10px;

        button {
            color: #666;
        }
    }

    .el-dialog__body {
        padding: 30px 40px;
    }
}

.show-img {
    width: 100%;
    height: 100%;
    text-align: center;

    > img {
        max-width: 100%;
        max-height: 100%;
    }
}
</style>
