var questionLock;
if (Meteor.isServer)
  questionLock = new Lock();

var questionSynch = function (f) {
  if (Meteor.isServer)
    return questionLock.synchronize(f);
  return f;
};

Meteor.methods({
  addQuestion: questionSynch(function (worksheet) {
    var q = Questions.insert({});
    Worksheets.update(worksheet, {
      $push: {
        questions: q
      }
    });
  }),
  raiseQuestion: questionSynch(function (worksheet, question) {
    var wkst = Worksheets.findOne(worksheet);
    var index = wkst.questions.indexOf(question);
    var newQuestions = wkst.questions;
    if (index < 0)
      return;
    if (index > 0) {
      newQuestions.splice(index, 1);
      newQuestions.splice(index-1, 0, question);
    }
    Worksheets.update(worksheet, {
      $set: {
        questions: newQuestions
      }
    });
  }),
  removeQuestion: questionSynch(function (worksheet, question) {
    var self = this;
    Questions.remove(question);
    var wkst = Worksheets.findOne(worksheet);
    var newQuestions = _.filter(wkst.questions, function (q) {
      return Questions.findOne(q);
    });
    Worksheets.update(worksheet, {
      $set: {
        questions: newQuestions
      }
    });
  })
});
