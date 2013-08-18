Template.question.created = function (templ) {
  // templ.save = function () {
  //   console.log(templ.find('.question-code').value);
  // };
  // templ.autosaveHandle = Meteor.setInterval(_.bind(templ.save, templ), 30*1000);
};

Template.question.events({
  'click .runButton': function (evt, templ) {
    console.log(templ);
    var codeElt = templ.find('.question-code textarea');
    var canvas = templ.find('.question-canvas canvas');
    var outElt = templ.find('.question-output pre');
    runSkulpt(codeElt, outElt, canvas);
  }
});
