// Takes in python code, executes it with skulpt, outputs to
// a pre-element and a canvas-element
function runSkulpt(inputPre, outputPre, outputCanvas) {
  // output functions are configurable. This one just appends some text
  // to a pre element.
  function outf(text) {
    outputPre.innerHTML = outputPre.innerHTML + text;
  }
  function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
      throw "File not found: '" + x + "'";
    }

    return Sk.builtinFiles["files"][x];
  }
  // Here's everything you need to run a python program in skulpt
  // grab the code from your textarea
  // get a reference to your pre element for output
  // configure the output function
  // call Sk.importMainWithBody()
  function runit() {
    var prog = inputPre[0].value;
    outputPre.innerHTML = "";
    Sk.canvas = outputCanvas;
    Sk.pre = outputPre;
    Sk.configure({output:outf, read:builtinRead});
    try {
      Sk.importMainWithBody("<stdin>", false, prog);
    }
    catch (err) {
      outf(err.tp$str().v);
    }
  } 
  runit();
}
