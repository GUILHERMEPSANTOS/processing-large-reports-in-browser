export default class Controller {
  #view;
  #worker;

  constructor({ view, worker }) {
    this.#view = view;
    this.#worker = worker;
  }

  static init(deps) {
    const controller = new Controller(deps);
    controller.init();
    return controller;
  }

  init() {
    this.#view.configureOnFileChange(this.#configureOnFileChange.bind(this));
  }

  #configureOnFileChange(file) {
    this.#view.setFileSize(this.#formatBytes(file?.size ?? 0));
    console.log(file);
  }

  #formatBytes(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB"];

    let i = 0;

    for (i; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024;
    }

    return `${bytes.toFixed(2)} ${units[i]}}`;
  }
}
