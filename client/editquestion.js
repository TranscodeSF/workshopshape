var save = function (id, templ) {
  var setter = {
    name: templ.find('.questionName input').value,
    text: templ.find('.questionText textarea').value
  };
  if (templ.find('.questionInitialCode textarea')) {
    setter.initialCode = templ.find('.questionInitialCode textarea').value;
  }
  if (templ.find('.questionTest textarea')) {
    console.log("saving test");
    setter.test = templ.find('.questionTest textarea').value;
    setter.testType = templ.find('.testType').value;
  }
  Questions.update(id, {
    $set: setter
  });
};

Template.editquestion.rendered = function () {
  var self = this;
  var ques = Questions.findOne(self.data._id);

  // this is a sad hack because of how the meteor rendering code interacts with
  // testing and checking the value of a checkbox.
  self.find('.useRepl').checked = ques.useRepl;
  self.find('.useCode').checked = ques.useCode;
  self.find('.useTest').checked = ques.useTest;
  self.find('.useTest').disabled = !ques.useCode;
  self.find('.useCanvas').checked = ques.useCanvas;
  self.find('.useCanvas').disabled = !ques.useCode;
};


Template.editquestion.events({
  'blur': function (evt, templ) { // might as well save when *anything* is blurred.
    var self = this;
    save(self._id, templ);
  },
  'click .removeQuestion': function (evt, templ) {
    var self = this;
    Meteor.call('removeQuestion', Session.get('selectedWorksheet'), self._id);
  },
  'click .raiseQuestion': function (evt, templ) {
    var self = this;
    Meteor.call('raiseQuestion', Session.get('selectedWorksheet'), self._id);
  },
  'change .useRepl': function (evt, templ) {
    var self = this;
    var useRepl = !!templ.find('.useRepl').checked;
    var setter = {useRepl: useRepl};
    if (useRepl) {
      setter.useCode = false;
      setter.useTest = false;
      setter.useCanvas = false;
    }
    Questions.update(self._id, {$set: setter});
  },
  'change .useCode': function (evt, templ) {
    var self = this;
    var useCode = !!templ.find('.useCode').checked;
    var setter = {useCode: useCode};
    if (!useCode)
      setter.useTest = false;
    else
      setter.useRepl = false;
    Questions.update(self._id, {$set: setter});
  },
  'change .useTest': function (evt, templ) {
    var self = this;
    Questions.update(self._id, {$set: {useTest: templ.find('.useTest').checked}});
  },
  'change .useCanvas': function (evt, templ) {
    var self = this;
    Questions.update(self._id, {$set: {useCanvas: templ.find('.useCanvas').checked}});
  }
});

Template.editquestion.testTypeSel = function (elt) {
  return this.testType === elt ? "selected" : "";
};
