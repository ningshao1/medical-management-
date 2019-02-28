export default (url, filename) => {
    const link = document.createElement('a');
    link.setAttribute('download', filename || '');
    link.setAttribute('href', url);
    // link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};