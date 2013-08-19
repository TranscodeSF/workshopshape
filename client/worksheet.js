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
  },
  'blur .worksheetName': function (evt, templ) {
    console.log("keypress");
    Meteor.defer(function () {
      var val = templ.find('.worksheetName').value;
      Worksheets.update(Session.get('selectedWorksheet'), {
        $set: {name: val}
      });
    });

  }
});
