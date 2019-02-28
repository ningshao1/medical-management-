<template>
    <component
        :is="isCollapse ? 'kld-collapse' : 'div'"
        :class="{'annual-fifty-step3': ! isCollapse}"
        title="院部讨论"
    >
        <court-vote v-if="editable" ref="court-vote" :data="data"></court-vote>
        <file-list v-else :data="courtFile" style="padding: 20px;" ></file-list>
    </component>
</template>

<script>
import CourtVote from '../../common/court-vote';
import KldCollapse from "../../common/kld-collapse/index";
import FileList from "../../../add-annual/detail-annual/common/file-list";

export default {
    name:'annual-fifty-step3',
    components:{FileList, KldCollapse, CourtVote},
    props: {
        data: {
            type: Object
        },
        isCollapse: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        editable() {
            if (this.data) {
                const {approveType: type} = this.data;
                return type < 7;
            } else {
                return false;
            }
        },
        courtFile() {
            if (this.data) {
                const {hospitalType: radio, hospitalVote: note, hospitalFiles: files, hospitalPhotos: photos} = this.data;
                return {
                    radio: {
                        title: '院部讨论意见',
                        content: radio
                    },
                    note: {
                        title: '院部讨论备注',
                        content: note
                    },
                    file: {
                        title: '院部讨论附件',
                        content: files
                    },
                    imgUrl: photos
                }
            }
        },
    },

    methods:{
        submit() {
            this.$refs['court-vote'].postData();
        }
    }
}
</script>


