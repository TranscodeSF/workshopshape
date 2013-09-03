Meteor.startup(function () {

  Meteor.subscribe('allWorkshops');

  Meteor.autorun(function () {
    var worksheet = Worksheets.findOne(Session.get('selectedWorksheet'));
    worksheet && Meteor.subscribe('questionsForWorksheet', worksheet.questions);
  });

  Meteor.autorun(function () {
    var workshop = Workshops.findOne(Session.get('activeWorkshop'));
    workshop && Meteor.subscribe('worksheetsForWorkshop', workshop.worksheets);
  });

  Meteor.autorun(function () {
    Meteor.userId(); // depend on it.
    Meteor.subscribe('answersForUser');
  });

  Meteor.autorun(function () {
    Meteor.userId(); // depend on it
    Meteor.subscribe('githubUsername');
  });

});
