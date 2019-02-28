export default {
    "faomatData": (input) => {
        var d = new Date(input);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate();
        var hour = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        return year + "-" + month + "-" + day;
    },
    "delBlank": (value) => {
        if (typeof value == "string") {
            return value.trim();
        }
    },
    "upc": (value) => {
        if (typeof value == "string") {
            return value.toUpperCase();
        }
    }

}