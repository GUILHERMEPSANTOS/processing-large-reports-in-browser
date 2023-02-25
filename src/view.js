export default class View {
  #csvFile = document.querySelector("#csv-file");
  #fileSize = document.querySelector("#file-size");

  setFileSize(size) {
    this.#fileSize.innerText = `File size: ${size} \n`;
  }

  configureOnFileChange(fn) {
    this.#csvFile.addEventListener("change", (e) => {
      var file = e.target.files[0];
      fn(file);
    });
  }
}
