export default (callback, wait = 0, {leading = false} = {}) => {
    if (wait <= 0) {
        return callback;
    } else {
        const bindCallback = Function.prototype.apply.bind(callback);

        let timer = 0;

        if (leading) {
            const
                resetTimer = () => timer = 0,
                timerCallback = (...arg) => {
                    bindCallback(...arg);
                    resetTimer();
                };

            return function (...argList) {
                if (timer === 0) {
                    bindCallback(this, argList);
                    timer = setTimeout(resetTimer, wait);
                } else {
                    clearTimeout(timer);
                    timer = setTimeout(timerCallback, wait, this, argList);
                }
            };
        } else {
            return function (...argList) {
                clearTimeout(timer);
                timer = setTimeout(bindCallback, wait, this, argList);
            };
        }
    }
};