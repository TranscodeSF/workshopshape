if (Meteor.isClient) {
  Template.worksheet.questions = function () {
    return Questions.find();
  };
}
