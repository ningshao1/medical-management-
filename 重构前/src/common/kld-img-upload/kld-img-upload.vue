<template>
    <Upload
        type="drag"
        action="fakePath"
        :before-upload="beforeUpload"
        :multiple="multiple"
    >
        <div class="kld-img-upload" ref="img-viewer">
            <div v-for="(img, index) in imgs" :key="imgs.url" class="img-thumb">
                <img :src="getFullUrl(img.thumb || img.url)" alt="">
                <div @click.stop class="img-thumb-mask">
                    <Icon class="icon" @click.native="showImg(index)" type="eye" size="20"></Icon>
                    <Icon v-if="editable" class="icon" @click.native="removeImg(index)" type="trash-a" size="20"></Icon>
                </div>
            </div>
            <div v-if="editable" class="add-img">
                <Icon type="android-add" size="20"></Icon>
            </div>
        </div>
    </Upload>
</template>

<style lang="less" scoped>
    .kld-img-upload {
        width: 100%;
        transition: border;
        padding: 15px;
        display: flex;
        flex-flow: wrap;
        >*{
            flex-shrink: 0;
            margin: 5px;
        }
        .add-img{
            width: 60px;
            height: 60px;
            border-radius: 4px;
            border: 1px dashed #dddee1;
            line-height: 60px;
            text-align: center;
            &:active,&:hover{
                border-color: #2d8cf0;
            }
        }
        .img-thumb{
            overflow: hidden;
            border-radius: 4px;
            width: 60px;
            height: 60px;
            position: relative;
            img{
                width: 60px;
                height: 60px;
            }

            &:hover{
                .img-thumb-mask{
                    display: flex;
                }
            }
            .img-thumb-mask{
                display: none;
                position: absolute;
                left: 0;
                top: 0;
                width: 60px;
                height: 60px;
                background-color: rgba(0,0,0,.6);
                justify-content: center;
                align-items: center;
                color: #fff;
                .icon{
                    margin-left: 10px;
                    &:first-of-type{
                        margin-left: 0;
                    }
                }
            }
        }
    }
</style>

<script>
    import kldConfirm from '@common/kld-confirm';
    import remoteAddress from '@common/Address';
    import Viewer from '@common/viewerjs';
    export default {
        name: "kld-img-upload",
        props: {
            editable: {
                type: Boolean,
                default: true
            },
            value: {            //v-model 双向绑定 返回包含所有file对象的数组
                type: Array,
                default() {
                    return [];
                }
            },
            accept: {           //允许的文件类型 例如['image/png', 'image/jpeg', 'image/png']
                type: Array,
                default() {
                    return [];
                }
            },
            maxSize: {          //允许的问价大小 单位为字节 例如5MB 为 5*1024*1024
                type: Number,
                default: Infinity
            },
            maxLength: {        //允许的最大文件数量
                type: Number,
                default: Infinity
            },
            multiple: {         //是否多选
                type: Boolean,
                default: true
            }


                                /*
                                    event:
                                        @error-file-type  当文件类型错误时  参数返回错误的文件类型
                                        @error-file-size  当文件大小超出限制时  参数返回超出文件的字节大小
                                        @error-max-length  当文件大小超出数量限制
                                */

        },
        data() {
            return {
                imgs: [],
                proxyValue: []
            };
        },
        watch: {
            value: {
                handler(val) {
                    this.proxyValue = [...val];
                    this.imgs = val.map(
                        img => {
                            if (img instanceof File) {
                                return {
                                    file: img,
                                    url: URL.createObjectURL(img)
                                };
                            } else {
                                return img;
                            }
                        }
                    );
                },
                immediate: true
            }
        },

        methods: {
            beforeUpload(file) {
                if (this.imgs.length > this.maxLength) {
                    this.$emit('error-max-length');
                } else if (! this.accept.includes(file.type)) {
                    this.$emit('error-file-type', file.type);
                } else if (file.size > this.maxSize) {
                    this.$emit('error-file-size', file.size);
                } else {
                    this.patchValue('push', file);
                }
                return false;
            },

            patchValue(action, ...arg) {
                const patch = [...this.proxyValue];
                patch[action](...arg);
                this.proxyValue = [...patch];
                this.$emit('input', patch);
            },

            showImg(index) {
                const viewer = new Viewer(this.$refs['img-viewer'], {
                    title: false,
                    initialViewIndex: index,
                    hidden() {
                        viewer.destroy();
                    }
                });

                viewer.show();
            },

            removeImg(index) {
                kldConfirm({
                    title: '提示',
                    content: '是否删除图片？',
                    ok: () => {
                        this.patchValue('splice', index, 1);
                    }
                })
            },

            getFullUrl(url) {
                return new URL(url, remoteAddress).href;
            }
        }
    }
</script>