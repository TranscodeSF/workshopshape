var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

Lock = function () {
  var self = this;
  self.fut = null;
  self.depth = 0;
  self.owned = null;
};

_.extend(Lock.prototype, {
  take: function () {
    var self = this;
    if (self.owned === Fiber.current) {
      self.depth++;
      return;
    }
    while (self.fut) {
      self.fut.wait();
    }
    self.fut = new Future();
    self.owned = Fiber.current;
  },

  release: function () {
    var self = this;
    if (self.owned !== Fiber.current)
      throw new Error("Can't unlock a lock we don't own");
    if (self.depth) {
      self.depth--;
      return;
    } else {
      self.owned = null;
      var fut = self.fut;
      self.fut = null;
      fut.return();
    }
  },

  synchronize: function (f) {
    var self = this;
    return function (/* arguments*/) {
      self.take();
      try {
        // in here, `this` is whatever the returned function was called on
        f.apply(this, arguments);
      } finally {
        self.release();
      }
    };
  }
});
