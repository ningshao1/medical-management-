import iview from "iview";
export default {
    extends: iview.Select,
    name: iview.Select.name,
    watch: {
        query(query) {
            this.$emit("on-query-change", query);
            const { remoteMethod, lastRemoteQuery } = this;
            const hasValidQuery = query !== lastRemoteQuery || !lastRemoteQuery;
            const shouldCallRemoteMethod =
                remoteMethod && hasValidQuery && !this.preventRemoteCall;
            this.preventRemoteCall = false; // remove the flag

            if (shouldCallRemoteMethod) {
                this.focusIndex = -1;
                const promise = this.remoteMethod(query);
                this.initialLabel = "";
                if (promise && promise.then) {
                    promise.then(options => {
                        if (options) this.options = options;
                    });
                }
            }
            if (this.remote) this.lastRemoteQuery = query;
        }
    }
};
