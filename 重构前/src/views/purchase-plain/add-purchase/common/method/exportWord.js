import "@/views/annual-plain/add-annual/detail-annual/print-details/FileSaver";
import "@/views/annual-plain/add-annual/detail-annual/print-details/jquery.wordexport";
//文字转word方法
export function word(title = "详情文件", data) {
    $("<div></div>")
        .html(
            `<div class="Section0" style="layout-grid:15.6000pt;">
<h1 align=center style="text-align:center;"><b><span style="mso-spacerun:'yes';font-family:??;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:'Times New Roman';font-weight:bold;font-size:22.0000pt;mso-font-kerning:22.0000pt;">
            <font>${title}</font>
        </span></b><b><span style="mso-spacerun:'yes';font-family:??;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:'Times New Roman';font-weight:bold;font-size:22.0000pt;mso-font-kerning:22.0000pt;">
            <o:p></o:p>
        </span></b></h1>
<p class=MsoNormal><span style="mso-spacerun:'yes';font-family:??;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:'Times New Roman';font-size:10.5000pt;mso-font-kerning:1.0000pt;">
        <font>${data}</font>
    </span><span style="mso-spacerun:'yes';font-family:??;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:'Times New Roman';font-size:10.5000pt;mso-font-kerning:1.0000pt;">
        <o:p></o:p>
    </span></p>
</div>`
        )
        .wordExport(title);
}
//单个文件下载
export const downloadUrl = url => {
    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src =
        url + `?login-token=${JSON.parse(localStorage.getItem("token")).token}`;
    iframe.onload = function() {
        document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
};
