var runners = {};

Template.question.created = function () {
  var self = this;
  self.save = function () {
    console.log(self.find('.question-code').value);
  };
  self.autosaveHandle = Meteor.setInterval(_.bind(self.save, self), 30*1000);
  runners[self.data._id] = self.runner = new SkulptRunner(self);
};

Template.question.output = function () {
  var self = this;
  return runners[self._id].output();
};

Template.question.destroyed = function () {
  var self = this;
  // clean up
  Meteor.clearInterval(self.autosaveHandle);
  delete runners[self._id];
};

Template.question.events({
  'click .runButton': function (evt, templ) {

    var codeElt = templ.find('.question-code textarea');
    var code = codeElt.value;
    templ.runner.setCode(code);
    console.log('running');
    templ.runner.run();
  }
});
