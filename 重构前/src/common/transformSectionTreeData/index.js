export default function transformSectionTreeData(rawTreeData, titleField = 'osName', childrenKey = 'lists') {
    const result = [];

    if (rawTreeData instanceof Array) {
        for (const rawNode of rawTreeData) {
            const { [childrenKey]: children, [titleField]: title } = rawNode;

            delete rawNode[childrenKey];

            const node = {
                ...rawNode,
                title
            };

            if (children && children.length > 0) {
                node.children = transformSectionTreeData(children, titleField, childrenKey);
            }

            result.push(node);
        }
    } else if (typeof rawTreeData === 'object') {
        const { [childrenKey]: children, [titleField]: title } = rawTreeData;

        delete rawTreeData[childrenKey];

        const node = {
            ...rawTreeData,
            expand: true,
            title
        };

        if (children && children.length > 0) {
            node.children = transformSectionTreeData(children, titleField, childrenKey);
        }

        result.push(node);
    } else {
        throw new Error('参数必须是数组或者对象');
    }

    return result;
};