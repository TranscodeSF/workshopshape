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
    if (!userIsAdmin())
      throw new Error("must be admin user");
    check(workshop, String);
    if (!Workshops.findOne(workshop))
      throw new Error("no such workshop " + workshop);
    var id = Worksheets.insert({
      name: "New worksheet",
      questions: []
    });
    Workshops.update(workshop, {$push: { worksheets: id} });
  }),
  removeWorksheet: worksheetSynch(function (workshop, sheet) {
    if (!userIsAdmin())
      throw new Error("must be admin user");
    var self = this;
    check(workshop, String);
    check(sheet, String);
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
    if (!userIsAdmin())
      throw new Error("must be admin user");
    check(shop, String);
    check(sheet, String);
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
    if (!userIsAdmin())
      throw new Error("must be admin user");
    check(worksheet, String);
    var q = Questions.insert({});
    Worksheets.update(worksheet, {
      $push: {
        questions: q
      }
    });
  }),
  raiseQuestion: questionSynch(function (worksheet, question) {
    if (!userIsAdmin())
      throw new Error("must be admin user");
    check(worksheet, String);
    check(question, String);
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
    if (!userIsAdmin())
      throw new Error("must be admin user");
    check(worksheet, String);
    check(question, String);
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
