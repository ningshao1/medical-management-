<template>
    <kld-file-upload v-model="allFiles" v-bind="$attrs"/>
</template>

<script>
    import KldFileUpload from '@/common/kld-file-upload';
    import remoteAddress from '@/common/Address';
    export default {
        name: "file-upload",
        components: {
            KldFileUpload,
        },
        props: {
            type: {
                type: [String, Number],
                required: true
            },
            defaultImages: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                allFiles: []
            };
        },

        computed: {
            hospitalId() {
                return this.$store.state.user_in.osId;
            }
        },

        watch: {
            defaultImages: {
                immediate: true,
                async handler(images) {
                    this.allFiles = await Promise.all(
                        images.map(
                            async image => {
                                const {photoUrl: url} = image,
                                    {data} = await this.$axios.get(url, {responseType: 'blob'}),
                                    file = new File([data], this.getFileName(url));

                                file.result = image;

                                return file;
                            }
                        )
                    );
                }
            }
        },

        methods: {
            getFullUrl(url) {
                return new URL(url, remoteAddress).href;
            },

            getFileName(url) {
                return url.match(/.*\/(.*\..*)$/)[1];
            },
            async submit() {
                const headers = {'content-type': 'multipart/form-data'};
                return await Promise.all(
                    this.allFiles.map(
                        async file => {
                            if (file.result) {
                                return file.result;
                            } else {
                                const formData = new FormData();
                                formData.append('file', file);

                                const {data} = await this.$axios.post(`/photo/${this.hospitalId}/${this.type}/upload`, formData, headers);

                                file.result = data;

                                return data;
                            }
                        }
                    )
                )
            }
        }
    }
</script>