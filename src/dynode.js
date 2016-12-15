var mobx = require('mobx');

module.exports = function(key, fn) {
    return function(target) {
        if (!target.hasOwnProperty(key)) {
            var x = {};
            x[key] = mobx.computed(function() { return fn(target) });
            mobx.extendObservable(target, x);
        }
        return target[key];
    };
}
