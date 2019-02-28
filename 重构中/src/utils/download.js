export default (blob, filename) => {
    const link = document.createElement("a");

    link.setAttribute("download", filename);
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("target", "_blank");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(URL.revokeObjectURL, 300, link.href);
};