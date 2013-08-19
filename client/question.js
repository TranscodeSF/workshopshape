var runners = {};

Template.question.created = function () {
  var self = this;
  console.log("created");
  self.save = function () {
    var code = self.find(".question-code textarea").value;
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
    templ.save();
    var codeElt = templ.find('.question-code textarea');
    var code = codeElt.value;
    templ.runner.setCode(code);
    console.log('running');
    templ.runner.run();
  },
  'blur .question-code textarea': function (evt, templ) {
    templ.save();
  }
});
