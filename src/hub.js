function Hub() {
    var hub = this;
    this.delay = 4;
    this._publishers = Object.create(null);
    this._subscribers = [];
    this._published = [];
    this._timerID = 0;
    this._timeoutFunc = function() {
        hub._timerID = 0;
        hub._changed();
    };

    this.Publisher = function(id, initValue) {
        var p = new Publisher(hub, id, initValue);
        hub._publishers[id] = p;
        return p;
    };

    this.Subscriber = function(publisherIds, callback) {
        var s = new Subscriber(hub, publisherIds, callback);
        hub._subscribers.push(s);
        return s;
    };
}

Hub.prototype.notify = function(id) {
    if(id === '*') {
        for(var i = 0; i < this._subscribers.length; i++) {
            this._published.push(this._subscribers[i].ids[0]);
        }
    } else {
        this._published.push(id);
    }
    if(this._timerID === 0) {
        this._timerID = setTimeout(this._timeoutFunc, this.delay);
    }
};

Hub.prototype._changed = function() {
    var ids = this._published;
    this._published = [];
    var params = Object.create(null);
    for(var id in this._publishers) {
        params[id] = this._publishers[id].get();
    }

    var called = [];
    for(var s = 0; s < this._subscribers.length; s++) {
        var sub = this._subscribers[s];
        if(0 <= called.indexOf(sub)) { continue; }
        for(var i = 0; i < ids.length; i++) {
            if(0 <= sub.ids.indexOf(ids[i])) {
                this._call(sub, params);
                called.push(sub);
            }
        }
    }
};

Hub.prototype._call = function(sub, params) {
    var ps = [];
    for(var i = 0; i < sub.ids.length; i++) {
        ps.push(params[sub.ids[i]]);
    }
    sub.callback.apply(sub, ps);
};

var defaultHub = new Hub();
bunny.Hub = Hub;
bunny.Publisher = function(id) {
    return new Publisher(defaultHub, id);
};

bunny.Subscriber = function(id) {
    return new Subscriber(defaultHub, id);
};
