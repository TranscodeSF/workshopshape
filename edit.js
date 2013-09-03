var questionLock;
var worksheetLock;
if (Meteor.isServer) {
  worksheetLock = new Lock();
  questionLock = new Lock();
}

var worksheetSynch = function (f) {
  if (Meteor.isServer)
    return worksheetLock.synchronize(f);
  return f;
};

var questionSynch = function (f) {
  if (Meteor.isServer)
    return questionLock.synchronize(f);
  return f;
};

Meteor.methods({
  addWorksheet: worksheetSynch(function (workshop) {
    if (!Workshops.findOne(workshop))
      throw new Error("no such workshop " + workshop);
    var id = Worksheets.insert({
      name: "New worksheet",
      questions: []
    });
    Workshops.update(workshop, {$push: { worksheets: id} });
  }),
  removeWorksheet: worksheetSynch(function (workshop, sheet) {
    var self = this;
    Worksheets.remove(sheet);
    var wksp = Workshops.findOne(workshop);
    var newWorksheets = _.filter(wksp.worksheets, function (q) {
      return Worksheets.findOne(q);
    });
    Workshops.update(workshop, {
      $set: {
        worksheets: newWorksheets
      }
    });
  }),
  raiseWorksheet: worksheetSynch(function (shop, sheet) {
    var wksp = Workshops.findOne(shop);
    var index = wksp.worksheets.indexOf(sheet);
    var newWorksheets = wksp.worksheets;
    if (index < 0)
      return;
    if (index > 0) {
      newWorksheets.splice(index, 1);
      newWorksheets.splice(index-1, 0, sheet);
    }
    Workshops.update(shop, {
      $set: {worksheets: newWorksheets}
    });
  }),
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
