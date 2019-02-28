import Page from 'element-ui/lib/pagination';
import './style.scss';
export default {
    extends: Page,
    name: Page.name,
    props: {
        layout: {
            type: String,
            default: 'total, prev, pager, next, jumper'
        },
        pagerCount: {
            type: Number,
            default: 5
        }
    }
}