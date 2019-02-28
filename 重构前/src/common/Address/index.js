import baseAddress from './base.js';
const addresses={
    "java":window.localStorage.getItem("java-addresses")||baseAddress,
    "test_out":location.protocol + "//" + location.hostname + ":8089",
    "default":baseAddress
}
const address=addresses[RUN_ENV]||addresses["default"]
export default address;