(function(global, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(exports) {
            global.bunny = factory(exports);
        });
    } else if(typeof module !== 'undefined' && module.exports) {
        factory(exports);
    } else {
        global.bunny = factory({});
    }
}(this, function (bunny) {
