
Meteor.publish('answersForUser', function () {
  return Answers.find({
    user: this.userId
  });
});

Meteor.publish('questionsForWorksheet', function (worksheet) {
  var sheet = Worksheets.findOne(worksheet);
  if (!sheet)
    return null;
  return Questions.find({
    _id: {$in: sheet.questions}
  });
});


Meteor.publish('worksheetsForWorkshop', function (workshop) {
  var shop = Workshops.findOne(workshop);
  if (!shop)
    return null;
  return Worksheets.find({
    _id: {$in: shop.worksheets}
  });
});



Meteor.publish('allWorkshops', function () {
  return Workshops.find();
});
