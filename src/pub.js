function Publisher(hub, id, initValue) {
    this.hub = hub;
    this.id = id;
    this._value = initValue;
    this._oldValue = initValue;
    this.filters = [];
}

Publisher.prototype.get = function() {
    return this._value;
};

Publisher.prototype.set = function(value) {
    for(var i = 0; i < this.filters.length; i++) {
        value = this.filters[i](value, this);
    }
    this._oldValue = this._value;
    this._value = value;
};

Publisher.prototype.pub = function(value, force) {
    if(force || this._changed(value)) {
        this.set(value);
        this.hub.notify(this.id);
    }
};

Publisher.prototype._changed = function(newValue) {
    if(newValue !== null && typeof newValue === 'object') {
        return true;
    }
    return newValue !== this._oldValue;
};

Publisher.prototype.addFilter = function(filter) {
    this.filters.push(filter);
    return this;
};
