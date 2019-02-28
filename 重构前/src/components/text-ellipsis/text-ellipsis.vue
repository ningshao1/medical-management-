<script type="text/jsx">
    const getNodeTextContent = nodes => {
        let result = '';

        if (! Array.isArray(nodes)) {
            nodes = [nodes]
        }

        for (const node of nodes) {
            if (! (node instanceof Object)) {
                continue;
            }

            if (Array.isArray(node.children)) {
                result += getNodeTextContent(node.children);
            } else if (node.text) {
                result += node.text;
            }
        }

        return result;
    };

    export default {
        name: "text-ellipsis",
        functional: true,
        props: {
            tag: {
                type: String,
                default: 'p'
            }
        },
        render(h, ctx) {
            const
                Tag = ctx.props.tag,
                defaultSlot = ctx.slots().default,
                title = getNodeTextContent(defaultSlot);

            return (
                <Tag {...ctx.data} class="text-ellipsis" title={title}>{defaultSlot}</Tag>
            );
        }
    }
</script>