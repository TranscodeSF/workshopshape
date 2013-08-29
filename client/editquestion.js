Template.editquestion.events({
  'click .saveQuestion': function (evt, templ) {
    var self = this;
    console.log("Saving...");
    var name = templ.find('.questionName input').value;
    var text = templ.find('.questionText textarea').value;
    var initialCode = templ.find('.questionInitialCode textarea').value;
    var test = templ.find('.questionTest textarea').value;
    var testType = templ.find('.testType').value;
    Questions.update(self._id, {
      $set: {
        name: name,
        text: text,
        initialCode: initialCode,
        test: test,
        testType: testType
      }
    });
  },
  'click .removeQuestion': function (evt, templ) {
    var self = this;
    Questions.remove(self._id);
  }
});

Template.editquestion.testTypeSel = function (elt) {
  return this.testType === elt ? "selected" : "";
};
