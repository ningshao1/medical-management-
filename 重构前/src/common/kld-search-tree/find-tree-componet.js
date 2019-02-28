const findTreeComponent = vnodes => {
    ! Array.isArray(vnodes) && (vnodes = [vnodes]);

    for (const vnode of vnodes) {
        const {componentOptions: options, children} = vnode;
        if (options && options.tag === 'kld-tree') {
            return vnode.componentInstance;
        } else if (children && children.length > 0) {
            const result = findTreeComponent(children);

            if (result) {
                return result;
            }
        }
    }

    return null;
};


export default findTreeComponent;