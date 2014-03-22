if(typeof window === 'object') {
    var assert = chai.assert;
} else {
    var assert = require('chai').assert;
    var sinon = require('sinon');
    var bunny = require('../bunny.js');
}

describe('Publisher Subscriber', function() {
    var hub;
    beforeEach(function() {
        hub = new bunny.Hub();
    });

    it('1 subscriber, 1 publisher', function(done) {
        var pub = hub.Publisher('num', 10);
        hub.Subscriber('num foo', function(num) {
            assert.equal(num, 5);
            done();
        });
        pub.pub(5);
    });

    it('2 subscribers, 1 publisher', function(done) {
        setTimeout(done, 20);
        var user = hub.Publisher('user');
        hub.Subscriber('user foo bar', function(user, foo, bar) {
            assert.equal(this.hub, hub);
            assert.deepEqual([user, foo, bar], ['neko', undefined, undefined]);
        });

        hub.Subscriber('foo user user user', function(foo, user, user_, user__) {
            assert.equal(this.hub, hub);
            assert.deepEqual([foo, user, user_, user__], [undefined, 'neko', 'neko', 'neko']);
        });

        user.pub('X_X');
        user.pub('neko'); // override
    });

    it('1 subscriber, 2 publisher', function(done) {
        var one = hub.Publisher('one', 1);
        hub.Publisher('two', 2);
        hub.Subscriber('one two', function(one, two) {
            assert.equal(one + two, 3);
            done();
        });
        one.pub(1, true); // forced notify
    });

    it('not changed', function(done) {
        var value = 1;
        var a = sinon.spy();
        var b = sinon.spy();
        hub.Publisher('A', value).pub(value);
        hub.Publisher('B', value).pub(value, true);
        hub.Subscriber('A', a);
        hub.Subscriber('B', b);

        setTimeout(function() {
            assert(a.notCalled);
            assert(b.calledOnce);
            done();
        }, 30);
    });

    it('always published object', function(done) {
        var obj = {};
        hub.Publisher('obj', obj).pub(obj);
        hub.Subscriber('obj', function(o) {
            assert.equal(obj, o);
            done();
        });
    });

    it('closed Subscriber', function(done) {
        var spy = sinon.spy();
        setTimeout(function() {
            assert(spy.notCalled);
            done();
        }, 30);

        var data = hub.Publisher('data');
        var sub = hub.Subscriber('data', spy);
        data.pub('incr');
        sub.close();
    });

    it('notify all subscribers', function(done) {
        var spy = sinon.spy(function() {
            if(spy.calledTwice) {
                done();
            }
        });
        hub.Subscriber('foo', spy);
        hub.Subscriber('bar', spy);
        hub.notify('*');
    });

    it('validator', function() {
        var user = hub.Publisher('user');
        user.addFilter(function(user) {
            if(user !== 'admin') { throw new Error('invalid user'); }
            return user;
        });
        assert.throws(function() {
            user.pub('hacker');
        });
    });

    it('filter', function(done) {
        var width = hub.Publisher('width', 0);
        width.addFilter(function(w) { return w * 2 });
        width.addFilter(function(w) { return w + 'px' });
        width.pub(123);
        hub.Subscriber('width', function(width) {
            assert.equal(width, '246px');
            done();
        });
    });
});
