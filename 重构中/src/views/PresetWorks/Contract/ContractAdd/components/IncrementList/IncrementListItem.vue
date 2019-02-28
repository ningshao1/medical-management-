<script type="text/jsx">
    export default {
        name: "increment-list-item",
        functional: true,
        props: {
            label: String
        },
        render(h, context) {
            const
                slots = context.slots(),
                label = slots.label || context.props.label;

            return (
                <div class="increment-list-item">
                    <div class="increment-list-item-title mb-10">
                        {label}
                    </div>
                    <div>
                        {slots.default}
                    </div>
                </div>
            );
        }
    }
</script>