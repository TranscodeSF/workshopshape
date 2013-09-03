Meteor.subscribe('allWorkshops');

Meteor.autorun(function () {
  Meteor.subscribe('questionsForWorksheet', Session.get('selectedWorksheet'));
});

Meteor.autorun(function () {
  Meteor.subscribe('worksheetsForWorkshop', Session.get('activeWorkshop'));
});

Meteor.autorun(function () {
  Meteor.userId(); // depend on it.
  Meteor.subscribe('answersForUser');
});

Meteor.autorun(function () {
  Meteor.userId(); // depend on it
  Meteor.subscribe('githubUsername');
});
