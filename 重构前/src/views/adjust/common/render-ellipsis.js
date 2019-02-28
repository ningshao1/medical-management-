import {TextEllipsis} from '@/components';

export default (h, content, className = '') => h(TextEllipsis, {
    class: className
}, content);