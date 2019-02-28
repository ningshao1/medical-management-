import {TextEllipsis} from '@/components';

export default (key, className) => (h, {row: {[key]: content}}) => h(TextEllipsis, {class: className}, content);