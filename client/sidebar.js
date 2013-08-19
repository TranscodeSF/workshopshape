Template.sidebar.worksheets = function () {
  return Worksheets.find();
};

Template.sidebar.worksheetActive = function () {
  return activeIfTrue(Session.equals('selectedWorksheet', this._id));
};


Template.sidebar.editing = function () {
  return Session.get('editingActive');
};

Template.sidebar.events({
  'click .selectWorksheet': function (evt, templ) {
    Session.set('selectedWorksheet', this._id);
  },
  'click .removeWorksheet': function (evt, templ) {
    var id = this._id;
    Worksheets.remove(id);
    if (Session.equals('selectedWorksheet', id)) {
      var worksheet = Worksheets.findOne();
      if (worksheet) {
        Session.set('selectedWorksheet', worksheet._id);
      }
    }
  },
  'click .addWorksheet': function (evt, templ) {
    var id = Worksheets.insert({
      name: "New worksheet",
      questions: []
    });
  }
});
