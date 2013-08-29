
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

// Worksheets are a set of questions that appear on a page together.
var worksheetSchema = {
  name: "Name of worksheet",
  questions: "List of question IDs"
};
Worksheets = new Meteor.Collection('worksheets');

// Workshops are a named ordered set of worksheets.  One worksheet can belong to
// more than one workshop.  You can join a workshop by typing its name.
var workshopSchema = {
  name: "Name of workshop",
  worksheets: "List of worksheet ids"
};
Workshops = new Meteor.Collection('workshops');
