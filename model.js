
// People's answers to each question
Answers = new Meteor.Collection('answers');

// Questions.  Each is assigned to a worksheet
var questionSchema =  {
  name: "Question name",
  text: "Question text",
  initialCode: "initial code for question",
  test: "text to use as test",
  testType: "match | code suffix"
};
Questions = new Meteor.Collection('questions');

Questions.allow({
  // you need to be an admin and have the right types to update a question.
  update: function (userId, doc, fieldNames, modifier) {
    check(modifier, {$set: {
      useCode: Match.Optional(Boolean),
      useTest: Match.Optional(Boolean),
      useCanvas: Match.Optional(Boolean),
      name: Match.Optional(String),
      initialCode: Match.Optional(String),
      testType: Match.Optional(String),
      text: Match.Optional(String)
    }});
    return userIsAdmin(userId);
  }
});

// Worksheets are a set of questions that appear on a page together.
var worksheetSchema = {
  name: "Name of worksheet",
  questions: "List of question IDs"
};
Worksheets = new Meteor.Collection('worksheets');

Worksheets.allow({
  // the only plain update is setting the worksheet name; everything else goes
  // through methods.
  update: function (userId, doc, fieldNames, modifier) {
    check(modifier, {
      $set: {name: String}
    });
    return userIsAdmin(userId);
  }
});

// Workshops are a named ordered set of worksheets.  One worksheet can belong to
// more than one workshop.  You can join a workshop by typing its name.
var workshopSchema = {
  name: "Name of workshop",
  worksheets: "List of worksheet ids"
};
Workshops = new Meteor.Collection('workshops');

Workshops.allow({
  // the only modification allowed is adding a workshop; everything else goes
  // through methods.
  insert: function (userId, doc) {
    check(doc, {
      _id: String,
      worksheets: [String]
    });
    return userIsAdmin(userId);
  }
});
