export default {
    name: "cell",
    functional: true,
    props: {
        render: Function,
        column: Object,
        row: Object,
        index: Number
    },
    render: (h, ctx) => {
        const { render, column, row, index } = ctx.props;
        return render(h, { column, row, index });
    }
};
