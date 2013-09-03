Meteor.publish('answersForUser', function () {
  return Answers.find({
    user: this.userId
  });
});

Meteor.publish('questionsForWorksheet', function (questions) {
  check(questions, [String]);
  return Questions.find({
    _id: {$in: questions}
  });
});


Meteor.publish('worksheetsForWorkshop', function (worksheets) {
  check(worksheets, [String]);
  return Worksheets.find({
    _id: {$in: worksheets}
  });
});

Meteor.publish('githubUsername', function () {
  return Meteor.users.find({_id: this.userId}, {fields: {
    _id: 1,
    "services.github.username": 1
  }});
});


Meteor.publish('allWorkshops', function () {
  return Workshops.find();
});
