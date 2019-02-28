export default function searchTree(tree, name, searchField = 'title', childrenField = 'children') {
    let result = [];

    for (const node of tree) {
        if (node[searchField].indexOf(name) !== -1) {
            result.push(node);
        } else if (node[childrenField] && node[childrenField].length > 0) {
            result = result.concat(searchTree(node[childrenField], name));
        }
    }

    return result;
};