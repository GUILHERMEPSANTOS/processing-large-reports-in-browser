export default class View {
    #fileSize = document.getElementById("file-size");
    #csvFile = document.getElementById("csv-file");
    #form = document.getElementById("form");
    #debug = document.getElementById("debug");
    #progress = document.getElementById("progress");
    #worker = document.getElementById("worker");

    setFileSize(size) {
        this.#fileSize.innerText = `File Size: ${size}`;
    }

    configureOnFileChange(fn) {
        this.#csvFile.addEventListener("change", (event) => {
            fn(event.target.files[0])
        });
    }

    configureOnFileSubmit(fn) {
        this.#form.reset();
        this.#form.addEventListener("submit", (event) => this.getFormData(event, fn));
    }

    getFormData(event, fn) {
        event.preventDefault();
        const file = this.#csvFile.files[0];
        const form = new FormData(event.currentTarget);
        const description = form.get("description");

        if (!file) {
            alert("Please select a file!")
        }

        this.updateDebugLog("");
        fn({ description, file })
    }

    updateDebugLog(text, reset = true) {
        if (reset) {
            this.#debug.innerText = text;
            return;
        }
        this.#debug.innerHTML += text;
    }

    updateProgress(value) {
        this.#progress.value = value;
    }

    isWorkerEnabled() {
        return this.#worker.checked;
    }
}