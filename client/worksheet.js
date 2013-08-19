Template.worksheet.selectedWorksheet = function () {
  return Session.get('selectedWorksheet') &&
    Worksheets.findOne(Session.get('selectedWorksheet'));
};

Template.worksheet.getQuestion = function (id)  {
  return Questions.findOne(id);
};

Template.worksheet.editing = function () {
  return Session.get('editingActive');
};

Template.worksheet.events({
  'click .addQuestion': function (evt, templ) {
    var q = Questions.insert({
    });
    Worksheets.update(Session.get('selectedWorksheet'), {
      $push: {
        questions: q
      }
    });
  }
});
