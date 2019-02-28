export default function (ref, callback, $this = this) {
    let lastNode = null;

    $this.$refs[ref].$on('on-select-change', ([node]) => {
        if (node) {
            lastNode = node;
            callback && callback(node);
        } else {
            lastNode.selected = true;
        }
    });
}