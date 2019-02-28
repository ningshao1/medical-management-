<script type="text/jsx">
    import Vue from 'vue';
    import {getVNodeTextContent} from '@/utils';

    export default {
        name: "text-ellipsis",
        functional: true,
        props: {
            tag: {
                type: [String, Vue],
                default: 'p'
            },
            title: {
                type: String
            }
        },
        render(h, ctx) {
            const
                Tag = ctx.props.tag,
                defaultSlot = ctx.slots().default,
                title = ctx.props.title || getVNodeTextContent(defaultSlot).trim();

            return (
                <Tag {...ctx.data} class="text-ellipsis" title={title}>{defaultSlot}</Tag>
            );
        }
    }
</script>