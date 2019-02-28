import {isVNode, isComponentInstance} from '@/utils';

const
    findComponent = (components, names) => {
        if (!Array.isArray(components)) {
            components = [components];
        }
        if (!Array.isArray(names)) {
            names = [names];
        }

        for (let component of components) {
            if (isVNode(component)) {
                component = component.componentInstance;
            } else if (! isComponentInstance(component)) {
                continue;
            }

            if (names.includes(component.$options.name)) {
                return component;
            } else {
                const {$children} = component;
                if (Array.isArray($children) && $children.length > 0) {
                    const result = findComponent($children.map(
                        ({$vnode}) => $vnode
                    ), names);

                    if (result) {
                        return result;
                    }
                }
            }
        }

        return null;
    };

export default findComponent;