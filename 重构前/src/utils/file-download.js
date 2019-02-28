
const download = (blob, filename) => {
    const link = document.createElement("a");
    link.setAttribute("download", filename);
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // URL.revokeObjectURL(link.href);
};

export const downloadFile = (blob, filename,token=false) => {
    download(blob,filename)
};
