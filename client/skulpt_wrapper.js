function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
    throw "File not found: '" + x + "'";
  }

  return Sk.builtinFiles["files"][x];
}

SkulptRunner = function (templ, question) {
  var self = this;
  self.templ = templ;
  self.outputDep = new Deps.Dependency();
  self.resultDep = new Deps.Dependency();
  self.ranDep = new Deps.Dependency();
  self.out="";
  self.question = question;
  self.ranCode = false;
};


var runQueue = [];
var running;

var getAndRun = function () {
  Meteor.defer(function () {
    running = runQueue.shift();
    if (running) {
      running.doRun();
    }
  });
};

_.extend(SkulptRunner.prototype, {
  setCode: function (code) {
    var self = this;
    self.code = code;
  },
  run: function () {
    var self = this;
    runQueue.push(self);
    getAndRun();
  },
  doRun: function () {
    var self = this;
    self.out= "";
    self.err = null;
    self.ranCode = true;
    self.outputDep.changed();
    self.ranDep.changed();
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
      self.testResults = {};
      var code = self.code;
      if (self.question.testType === "code suffix") {
        code = code + "\n" + self.question.test;
      }
      Sk.importMainWithBody("<stdin>", false, code);
      if (self.question.testType === "match") {
        self.testResults.match = {
          description: "Output matches expected output",
          status: self.question.test.trim() === self.out.trim() ? "pass" : "fail",
          expected: self.question.test,
          actual: self.out
        };
      }
    } catch (e) {
      self.outputDep.changed();
      self.err = e;
    }
  },
  ran: function () {
    var self = this;
    self.ranDep.depend();
    return self.ranCode;
  },
  output: function () {
    var self = this;
    self.outputDep.depend();
    return self.out;
  },
  getTestResults: function () {
    var self = this;
    self.resultDep.depend();
    return self.testResults;
  },
  error: function () {
    var self = this;
    self.outputDep.depend();
    return self.err;
  }
});

// Define a custom "Python builtin" for use in test reporting
Sk.builtin.report_test = function (test_name, test_result, test_description) {
  // do something with the arguments
  if (running) {
    running.testResults[test_name.v] = {
      status: test_result.v ? "pass": "fail"
    };
    if (test_description) {
      running.testResults[test_name.v].description = test_description.v;
    }
  }
  running.resultDep.changed();
};

Sk.builtins['report_test'] = Sk.builtin.report_test;

Sk.builtin.console_log = function (anything) {
  console.log(anything);
};

Sk.builtins['console_log'] = Sk.builtin.console_log;
