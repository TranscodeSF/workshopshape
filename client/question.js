var runners = {};

Template.question.created = function () {
  var self = this;
  console.log("created");
  self.save = function () {
    var code = self.codemirror.getValue();
    var answer = Answers.findOne({
      user: Meteor.userId(),
      question: self.data._id
    });
    if (!answer) {
      Answers.insert({
        user: Meteor.userId(),
        question: self.data._id,
        answer: code
      });
    } else {
      Answers.update(answer._id, {$set: {
        answer: code
      }});
    }
  };
  self.autosaveHandle = Meteor.setInterval(_.bind(self.save, self), 30*1000);
  runners[self.data._id] = self.runner = new SkulptRunner(self);
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

Template.question.output = function () {
  var self = this;
  return runners[self._id].output() ||
    "[Press \"Run\" to test your code...]";
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
    console.log('pre-run');
    templ.save();
    templ.runner.setCode(templ.codemirror.getValue());
    console.log('running');
    templ.runner.run();
  },
  'click .revertButton': function (evt, templ) {
    var self = this;
    templ.codemirror.setValue(self.initialCode);
    templ.save();
  },
  'blur .question-code textarea': function (evt, templ) {
    templ.save();
  }
});

// Re-renders textarea into a CodeMirror element
Template.question.rendered = function () {
  var self = this;
  console.log("rendered");
  if (!self.codemirror) {
    var codearea = self.find(".question-code textarea");
    self.codemirror = CodeMirror.fromTextArea(codearea);
    self.codemirror.setValue(Template.question.answerText.apply(self.data));
    var codemirror = self.find(".CodeMirror");
    codemirror.style.border = '1px solid blue';
  }
};

Template.question.getCanvasId = function () {
  var self = this;
  return self._id;
};
