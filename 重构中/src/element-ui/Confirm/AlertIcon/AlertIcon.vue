<script type="text/jsx">
    import './styles/index.scss';

    export default {
        name: "kld-alert-icon",
        functional: true,
        props: {
            type: {
                type: String,
                required: true
            }
        },
        render(h, {data, props: {type}}) {
            type = type === 'danger' ? 'error' : type;

            let innerElements = null;

            switch (type) {
                case 'success':
                    innerElements = [
                        <span class="swal-icon--success__line swal-icon--success__line--long"></span>,
                        <span class="swal-icon--success__line swal-icon--success__line--tip"></span>,
                        <span class="swal-icon--success__ring"></span>,
                        <span class="swal-icon--success__hide-corners"></span>
                    ];
                    break;
                case 'warning':
                    innerElements = [
                        <span class="swal-icon--warning__body">
                            <span class="swal-icon--warning__dot"></span>
                        </span>
                    ];
                    break;
                case 'error':
                    innerElements = (
                        <span class="swal-icon--error__x-mark">
                            <span class="swal-icon--error__line swal-icon--error__line--left"></span>
                            <span class="swal-icon--error__line swal-icon--error__line--right"></span>
                        </span>
                    );
            }

            return (
                <div {...data} class={`swal-icon swal-icon--${type}`}>
                    {innerElements}
                </div>
            );
        }
    }
</script>