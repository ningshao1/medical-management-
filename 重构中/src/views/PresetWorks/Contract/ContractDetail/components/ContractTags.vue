<template>
    <div class="contract-tags">
        <kld-tag v-for="id in value" :key="id">{{tagsMap[id]}}</kld-tag>
    </div>
</template>

<script>
    import SelectContractTag from '../../ContractAdd/components/SelectContractTag';
    import {KldTag} from '@/components';
    export default {
        extends: SelectContractTag,
        name: "contract-tags",
        components: {
            KldTag
        },
        computed: {
            tagsMap() {
                return this.tags.reduce(
                    (map, tag) => {
                        map[tag.id] = tag.labelName;
                        return map;
                    },
                    {}
                );
            }
        }
    }
</script>