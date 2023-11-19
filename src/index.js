import Controller from "./controller.js";
import Service from "./service.js";
import View from "./view.js";

var worker = new Worker("./src/worker.js", {
    type: "module"
});

Controller.init({
    view: new View(),
    service: new Service(),
    worker: worker
});