import $ from 'jquery';

export default (index, content, style = {}) => {
    const table = $('.el-table__body');
    const colspan = table.children('colgroup').children().length;

    table.find('.custom-insert-row').remove();

    if (content) {
        const row = $(`
            <tr class="custom-insert-row">
                <td colspan="${colspan}" style="background-color: #eee;" class="px-10">
                    ${content}
                </td>
            </tr>
        `);
        row.children('td').css(style);
        table.children('tbody').children().eq(index).after(row)
    }
};