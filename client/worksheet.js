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
