<template>
    <div>
        <div class='radio'>
            {{data.radio.title}}
            <span>{{data.radio.content===1?'通过':'未通过'}}</span>
        </div>
        <div>
            <div>
                <div class='file-list-title'>{{data.note.title}}</div>

                <Input type="textarea"
                       :rows='4'
                       v-model="data.note.content"
                       disabled></Input>
            </div>
        </div>
        <div class="file-list">
            <div class='file-list-title'>{{data.file.title}}</div>
            <ul v-if="preview">
                <template v-if="listData.length>0">
                    <li v-for='(item,i) in listData'>
                        <a href="javascript:;"
                           @click="down(item)">
                            {{i+1}}、
                            <img :src="item.img"
                                 alt="" />
                            <span>{{item.fileName}}</span>
                        </a>
                    </li>
                </template>

                <li v-else>暂无数据</li>
            </ul>
            <div v-else>
                <imageView :imgUrlList='data.imgUrl'></imageView>

            </div>
        </div>

    </div>
</template>
<script>
import wordImg from "@common/C-UploadFile/image/word.png";
import excelImg from "@common/C-UploadFile/image/excel.png";
import picImg from "@common/C-UploadFile/image/pict.png";
import serverAddress from "@common/Address";
import imageView from "@common/imageView/ImageView.vue";
const download = (blob, filename) => {
    const link = document.createElement("a");
    link.setAttribute("download", filename);
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // URL.revokeObjectURL(link.href);
};
export default {
    props: {
        data: {
            default() {
                return {
                    radio: {
                        title: "院部讨论意见",
                        content: null
                    },
                    file: {
                        title: "",
                        content: [
                            {
                                fileName: "",
                                url: ""
                            }
                        ]
                    },
                    imgUrl: [],
                    note: {
                        title: "院部讨论备注",
                        content: ""
                    }
                };
            }
        },
        preview: {
            default: true
        }
    },
    components: { imageView },
    data() {
        return {};
    },
    methods: {
        down(file) {
            this.$axios
                .get(file.fileUrl, {
                    responseType: "blob"
                })
                .then(res => {
                    download(res.data, file.fileName);
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        this.$Message.warning("该文件已经失效");
                    }
                });
        }
    },
    computed: {
        listData() {
            let temp = [];
            let tempData = this.data.file.content;
            if (tempData instanceof Array) {
                tempData.map(v => {
                    let img;
                    if (
                        v.fileName.endsWith(".doc") ||
                        v.fileName.endsWith(".docx") ||
                        v.fileName.endsWith(".wps")
                    ) {
                        img = wordImg;
                    } else if (
                        v.fileName.endsWith("xls") ||
                        v.fileName.endsWith("xlsx")
                    ) {
                        img = excelImg;
                    } else {
                        img = picImg;
                    }
                    temp.push({ ...v, img });
                });
            }
            if (this.data.imgUrl instanceof Array) {
                this.data.imgUrl.map(v => {
                    if (!v) return;
                    temp.push({
                        fileName: v.photoUrl.match(/.*\/(.*?)$/)[1],
                        fileUrl: v.photoUrl,
                        img: picImg
                    });
                });
            }
            return temp;
        }
    }
};
</script>
<style lang="less" scoped>
.radio {
    color: #f2740c;
    font-size: 14px;
    padding: 0 0 15px 0;
    > span {
        color: #020e0f;
    }
}
.file-list {
    padding: 8px 0;

    > ul {
        margin-top: 5px;
        max-height: 200px;
        overflow: auto;
        li {
            padding: 8px 20px;
            cursor: pointer;
            img {
                width: 18px;
                height: 18px;
                margin: 0 10px;
                vertical-align: middle;
            }
            span {
                font-size: 12px;
            }
            &:hover {
                background-color: #f2f2f2;
                span {
                    color: #2195ec;
                }
            }
        }
    }
}
.file-list-title {
    color: #f2740c;
    font-size: 14px;
    padding-bottom: 5px;
}
</style>

