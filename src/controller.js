export default class Controller {
    #view;
    #worker;
    #service;
    #events = {
        alive: () => { },
        progress: ({ total }) => { this.#view.updateProgress(total); },
        ocurrenceUpdate: ({ found, linesLength, took }) => {
            const [[key, value]] = Object.entries(found)

            this.#view.updateDebugLog(
                `found ${value} occurencies of ${key} - over ${linesLength} lines - took: ${took}`
            );
        }
    }

    constructor({ view, service, worker }) {
        this.#view = view;
        this.#service = service;
        this.#worker = this.configureWorker(worker);
    }

    static init(deps) {
        var controller = new Controller(deps);
        controller.init();
        return controller;
    }

    init() {
        this.#view.configureOnFileChange(
            this.configureOnFileChange.bind(this)
        );

        this.#view.configureOnFileSubmit(
            this.configureOnFileSubmit.bind(this)
        );
    }

    configureWorker(worker) {
        worker.onmessage = ({ data }) => {
            const eventType = data.eventType;
            this.#events[eventType](data)
        }

        return worker;
    }

    configureOnFileChange(file) {
        var formattedFileSize = this.#formatBytes(file)

        this.#view.setFileSize(formattedFileSize)
    }

    configureOnFileSubmit({ description, file }) {
        const query = {}
        query["call description"] = new RegExp(
            description, "i"
        )

        if (this.#view.isWorkerEnabled()) {
            this.#worker.postMessage({ query, file });
            return;
        }

        this.#service.processFile({
            query,
            file,
            onProgress: (total) => {
                this.#events.progress({ total })
            },
            onOcurrenceUpdate: (...args) => {
                this.#events.ocurrenceUpdate(...args)
            }
        });
    }

    #formatBytes({ size }) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB']

        let i = 0

        for (i; size >= 1024 && i < 4; i++) {
            size /= 1024
        }

        return `${size.toFixed(2)} ${units[i]}`
    }
}