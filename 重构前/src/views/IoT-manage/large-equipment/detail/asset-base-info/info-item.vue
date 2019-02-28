<script type="text/jsx">
    export default {
        name: "info-item",
        functional: true,
        props: {
            label: String,
            ellipsis: {
                type: Boolean,
                default: true
            },
            content: String
        },
        render(h, {data, props}) {
            return (
                <p {...data} class={{'text-ellipsis': props.ellipsis}} title={props.ellipsis ? props.content : null}>
                    <span class="pr-20">{props.label}</span>
                    <span>{props.content}</span>
                </p>
            );
        }
    }
</script>