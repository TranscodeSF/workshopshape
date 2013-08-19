Template.editquestion.events({
  'click .saveQuestion': function (evt, templ) {
    var self = this;
    console.log("Saving...");
    var name = templ.find('.questionName input').value;
    var text = templ.find('.questionText textarea').value;
    var initialCode = templ.find('.questionInitialCode textarea').value;
    Questions.update(self._id, {
      $set: {
        name: name,
        text: text,
        initialCode: initialCode
      }
    });
  },
  'click .removeQuestion': function (evt, templ) {
    var self = this;
    Questions.remove(self._id);
  }
});
