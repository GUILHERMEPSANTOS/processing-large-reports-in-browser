import Controller from "./controller.js";
import Service from "./service.js";
import View from "./View.js";

const worker = new Worker("./src/worker.js", {
  type: "module",
});

worker.postMessage("fala maninho!");

Controller.init({
  view: new View(),
  worker,
});
