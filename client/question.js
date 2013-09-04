var runners = {};

Template.question.created = function () {
  var self = this;
  self.save = function () {
    if (typeof self.codemirror === "boolean")
      return;
    var code;
    if (self.data.useRepl) {
      code = "";
      self.codemirror.eachLine(function (lh) {
        if (lh.gutterMarkers &&
            lh.gutterMarkers.replGutter &&
            (lh.gutterMarkers.replGutter.data === "-" ||
             lh.gutterMarkers.replGutter.data === "XXX")) {
          // it's output
        } else {
          code += lh.text + "\n";
        }
      });
    } else {
      code = self.codemirror.getValue();
    }
    Meteor.call('saveAnswer', self.data._id, code);
  };
  self.autosaveHandle = Meteor.setInterval(_.bind(self.save, self), 30*1000);
  runners[self.data._id] = self.runner = new SkulptRunner(self, self.data);
};

Template.question.answerText = function () {
  var self = this;
  var answer = Answers.findOne({
    user: Meteor.userId(),
    question: self._id
  });
  if (answer && answer.answer) {
    return answer.answer;
  }
  return self.initialCode;
};

var converter = new Showdown.converter();
Template.question.textHtml = function () {
  return converter.makeHtml(this.text);
};

Template.question.output = function () {
  var self = this;
  var runner = runners[self._id];
  if (runner.ran()) {
    return runners[self._id].output();
  } else {
    return "[Press \"Run\" to test your code...]";
  }
};

Template.question.testResults = function () {
  var self = this;
  var results = [];
  _.each(runners[self._id].getTestResults(), function (result, name) {
    results.push(_.extend({name: name}, result));
  });
  return results;
};

Template.question.error = function () {
  var self = this;
  var err = runners[self._id].error();
  return err && err.toString();
};

Template.question.destroyed = function () {
  var self = this;
  // clean up
  Meteor.clearInterval(self.autosaveHandle);
  delete runners[self._id];
};

Template.question.events({
  'click .runButton': function (evt, templ) {
    var self = this;
    templ.save();
    templ.runner.setCode(templ.codemirror.getValue());
    templ.runner.run();
  },
  'click .revertButton': function (evt, templ) {
    var self = this;
    templ.codemirror.setValue(self.initialCode || "");
    templ.save();
  },
  'blur .question-code textarea': function (evt, templ) {
    templ.save();
  }
});

var replEval = function (cm) {
  var sections = [];
  var currentSection = [];
  cm.eachLine(function (lh) {
    if (lh.gutterMarkers &&
        lh.gutterMarkers.replGutter &&
        (lh.gutterMarkers.replGutter.data === "-"
         || lh.gutterMarkers.replGutter.data === "XXX")) {
      if (!_.isEmpty(currentSection)) {
        sections.push(currentSection);
        currentSection = [];
      }
    } else if (lh.text === "" || lh.text.match(/^\S/)) {
      if (!_.isEmpty(currentSection)) {
        sections.push(currentSection);
        currentSection = [];
      }
      if (lh.text)
        currentSection.push(lh.text);
    } else {
      currentSection.push(lh.text);
    }
  });
  var i = 0;
  var code = "";
  var outBySection = {};
  Sk.configure({ output: function (out) {
    if (!outBySection[Sk.sectionNum])
      outBySection[Sk.sectionNum] = "";
    outBySection[Sk.sectionNum]+=out;
  }});
  _.each(sections, function (section) {
    code += "set_section(" + (i++) + ")\n";
    if (!_.isEmpty(section)) {
      var insertPrint = !section[0].match(/^\s*$/) && !section[0].match(/[:=]/);
      var joined = section.join('\n');
      if (insertPrint)
        joined = "__result = " + joined + "\nprint __result\n";
      code += joined + "\n";
    }
  });
  console.log(code);
  var error;
  var errorSection;
  try {
    Sk.importMainWithBody("repl", false, code);
  } catch (e) {
    error = e;
    errorSection = Sk.sectionNum;
    console.log(errorSection, error.toString());
  }
  var lineNum = 0;
  var lines = [];
  var markers = [];
  _.each(sections, function (section, secNum) {
    _.each(section, function (line, lineInSection) {
      lines.push(line);
      markers.push(lineInSection ? "..." : ">>>");
      lineNum++;
    });
    if (outBySection[secNum]) {
      _.each(outBySection[secNum].split("\n"), function (outLine) {
        lines.push(outLine);
        markers.push("-");
      });
    }
    if (error && errorSection === secNum) {
      _.each(error.toString().split('\n'), function (errLine) {
        lines.push(errLine);
        markers.push("XXX");
      });
    }
  });
  lines.push("");
  markers.push(">>>");
  console.log(lines);
  console.log(markers);
  cm.setValue(lines.join("\n"));
  _.each(markers, function (marker, i) {
    cm.setGutterMarker(i, "replGutter", document.createTextNode(marker));
  });
  cm.setCursor({line: cm.lastLine(), ch: cm.getLine(cm.lastLine()).length});
  console.log(outBySection);
};
// Re-renders textarea into a CodeMirror element
Template.question.rendered = function () {
  var self = this;
  if (!self.codemirror) {
    var codearea = self.find(".question-code textarea");
    if (!codearea) {
      self.codemirror = true;
      return;
    }
    var options = {};
    if (self.data.useRepl) {
      options.gutters = ["replGutter"];
    }
    self.codemirror = CodeMirror.fromTextArea(codearea, options);
    if (self.data.useRepl) {
      self.codemirror.addKeyMap({
        Enter: function (cm) {
          console.log("enter hit");
          var curs = cm.getCursor();
          if (curs.line === cm.lastLine() && curs.ch === cm.getLine(curs.line).length) {
            console.log("at end");
            cm.replaceRange("\n", curs);
            replEval(cm);
          } else {
            cm.replaceRange("\n", curs);
          }
        }
      });
      Meteor.defer(function () {
        replEval(self.codemirror);
      });
    }
    var code = Template.question.answerText.apply(self.data);
    self.codemirror.setValue(code || "");
    self.codemirror.on('change', function () {
      var code = Template.question.answerText.apply(self.data);
      var prevValid = self.resultsValid;
      self.resultsValid = (code.trim() === self.codemirror.getValue().trim());
      if (prevValid !== self.resultsValid) {
      }
    });
    var codemirror = self.find(".CodeMirror");
    codemirror.style.border = '1px solid blue';
  }
};

Template.question.getCanvasId = function () {
  var self = this;
  return self._id;
};

Template.testResult.statusLabel = function () {
  return {
    pass: "label-success",
    fail: "label-important"
  }[this.status];
};

Template.testResult.statusIcon = function () {
  console.log(this.status);
  return {
    pass: "icon-ok",
    fail: "icon-remove"
  }[this.status];
};
