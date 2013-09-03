Meteor.publish('answersForUser', function () {
  return Answers.find({
    user: this.userId
  });
});

Meteor.publish('questionsForWorksheet', function (worksheet) {
  check(worksheet, String);
  var sheet = Worksheets.findOne(worksheet);
  if (!sheet)
    return null;
  return Questions.find({
    _id: {$in: sheet.questions}
  });
});


Meteor.publish('worksheetsForWorkshop', function (workshop) {
  check(workshop, String);
  var shop = Workshops.findOne(workshop);
  if (!shop)
    return null;
  return Worksheets.find({
    _id: {$in: shop.worksheets}
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
