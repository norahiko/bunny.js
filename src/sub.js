function Subscriber(hub, ids, callback) {
    this.hub = hub;
    this.callback = callback;
    this.ids = ids.split(/[, ]+/g);
}

Subscriber.prototype.close = function() {
    var idx = this.hub._subscribers.indexOf(this);
    if(0 <= idx) {
        this.hub._subscribers.splice(idx, 1);
    }
    this.hub = null;
    this.callback = null;
};
