Meteor.subscribe('allWorkshops');

Meteor.autorun(function () {
  Meteor.subscribe('questionsForWorksheet', Session.get('selectedWorksheet'));
});

Meteor.autorun(function () {
  Meteor.subscribe('worksheetsForWorkshop', Session.get('activeWorkshop'));
});

Meteor.autorun(function () {
  Meteor.subscribe('answersForUser', Meteor.userId());
});
