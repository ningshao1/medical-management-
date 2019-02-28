<script type="text/jsx">
    import {getVNodeTextContent, isValid} from '@/utils';
    export default {
        name: "transform-empty",
        functional: true,
        props: {
            placeholder: {
                type: String,
                default: '--'
            },
            tag: {
                type: String,
                default: 'span'
            }
        },
        render(h, {slots, props, data}) {
            const
                {default: defaultSlot} = slots(),
                {placeholder, tag: Tag} = props,
                textContent = getVNodeTextContent(defaultSlot).trim();

            return isValid(textContent) ? defaultSlot : (
                <Tag {...data} class="text-secondary">{placeholder}</Tag>
            );
        }
    }
</script>