import Controller from "./controller.js";
import View from "./view.js";

var worker = new Worker("./src/worker.js", {
    type: "module"
});

Controller.init({
    view: new View(),
    worker: worker
});