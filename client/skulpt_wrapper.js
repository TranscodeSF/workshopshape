function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
    throw "File not found: '" + x + "'";
  }

  return Sk.builtinFiles["files"][x];
}

SkulptRunner = function (templ) {
  var self = this;
  self.templ = templ;
  self.outputDep = new Deps.Dependency();
  self.out="";
};

_.extend(SkulptRunner.prototype, {
  setCode: function (code) {
    var self = this;
    self.code = code;
  },
  run: function () {
    var self = this;
    self.out= "";
    self.err = null;
    self.outputDep.changed();
    // Sk.canvas expects the id of a canvas element
    Sk.canvas = self.templ.data._id; 
    Sk.configure({
      output: function (s) {
        self.outputDep.changed();
        self.out = self.out + s;
      },
      read: builtinRead
    });
    try {
      Sk.importMainWithBody("<stdin>", false, self.code);
    } catch (e) {
      self.outputDep.changed();
      self.err = e;
    }
  },
  output: function () {
    var self = this;
    self.outputDep.depend();
    return self.out;
  },
  error: function () {
    var self = this;
    self.outputDep.depend();
    return self.err;
  }
});

// Define a custom "Python builtin" for use in test reporting
Sk.builtin.report_test = function (test_name, test_result) {
  // do something with the arguments
}
Sk.builtins['report_test'] = Sk.builtin.report_test;
