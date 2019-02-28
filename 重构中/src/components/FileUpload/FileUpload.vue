<template>
    <kld-upload v-model="allFiles" @input="emitFormItemChange" class="file-upload" :multiple="multiple" v-bind="$attrs"></kld-upload>
</template>

<script>
    import KldUpload from '@/components/kld-upload';
    import {FormControl} from '@/mixins';
    const
        imageRegular = /\.(?:png|jpg|jpeg|webp|gif)$/i,
        isImage = (filename) => {
            return imageRegular.test(filename);
        },
        isFileInstance = (data) => data instanceof File;

    export default {
        name: "file-upload",
        mixins: [FormControl],
        components: {
            KldUpload
        },
        props: {
            //图片提交的地址
            actionImage: String,
            //文件提交的地址
            actionFile: String,
            multiple: {
                type: Boolean,
                default: true
            },
            files: {
                type: Array,
                default() {
                    return [];
                }
            },
            images: {
                type: Array,
                default() {
                    return [];
                }
            },
            transformFile: {
                type: Function,
                default: (file) => ({
                    url: file.fileUrl,
                    filename: file.fileName,
                })
            },
            transformImage: {
                type: Function,
                default: image => ({
                    url: image.photoUrl
                })
            },
        },
        data() {
            return {
                internalFiles: [],
                internalImages: [],
            };
        },
        computed: {
            allFiles: {
                get() {
                    const {internalImages, internalFiles} = this;
                    return internalImages.concat(internalFiles);
                },
                set(value) {
                    const
                        files = [],
                        images = [];

                    for (const item of value) {
                        if (isImage(item.name)) {
                            images.push(item._raw || item);
                        } else {
                            files.push(item);
                        }
                    }
                    this.updateFiles(files);
                    this.updateImages(images);
                },
            }
        },

        watch: {
            files: {
                immediate: true,
                async handler(files) {
                    const {transformFile} = this;
                    this.internalFiles = await Promise.all(
                        files.map(
                            async item => {
                                if (isFileInstance(item)) {
                                    return item;
                                } else {
                                    const
                                        {url, filename} = transformFile(item),
                                        file = await this.getFileInstance(url, filename);
                                    file._raw = item;
                                    return file;
                                }
                            }
                        )
                    );
                }
            },
            images: {
                immediate: true,
                async handler(images) {
                    const {transformImage} = this;
                    this.internalImages = await Promise.all(
                        images.map(
                            async item => {
                                if (isFileInstance(item)) {
                                    return item;
                                } else {
                                    const
                                        {url, filename} = transformImage(item),
                                        file = await this.getFileInstance(url, filename);
                                    file._raw = item;
                                    return file;
                                }
                            }
                        )
                    );
                }
            }
        },
        methods: {
            //images和files返回的是object和File实例的混合数组，
            //在表单提交前把所有File实例转化为object
            async upload() {
                await Promise.all([
                    this.uploadImages(),
                    this.uploadFiles(),
                ]);
            },
            async uploadFiles() {
                await Promise.all(
                    this.internalFiles.map(
                        file => {
                            const formData = new FormData();
                            formData.append('file', file);
                            return this.$axios.post(this.actionFile, formData, {'content-type': 'multipart/form-data'});
                        }
                    )
                );
            },
            async uploadImages() {
                this.updateImages(await Promise.all(
                    this.images.map(
                        async item => {
                            if (isFileInstance(item)) {
                                const formData = new FormData();
                                formData.append('file', item);
                                const {data} = await this.$axios.post(this.actionImage, formData, {'content-type': 'multipart/form-data'});
                                return data;
                            } else {
                                return item;
                            }
                        }
                    )
                ));
            },

            updateFiles(value) {
                this.$emit('update:files', value);
            },
            updateImages(value) {
                this.$emit('update:images', value);
            },

            //下载文件并转化为File实例
            async getFileInstance(url, filename = this.getFilenameFromURL(url)) {
                const {data} = await this.$axios.get(url, {responseType: 'blob'});
                return new File([data], filename);
            },

            getFilenameFromURL(url = '') {
                const matched = url.match(/^(?:.*\/)?(.+\..+)$/);
                return matched ? matched[1] : '';
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    @import "~@/styles/mixins";
    @include form-item-error() {
        .file-upload{
            >/deep/.file-block{
                border-color: $color-error;
            }
        }
    }
</style>