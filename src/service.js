export default class Service {
    processFile({ query, file, onProgress, onOcurrenceUpdate }) {
        const linesLength = { counter: 0 };
        const progressFn = this.#setupProgress(file.size, onProgress);
        const startedAt = performance.now();
        const elepsed = () => `${((performance.now() - startedAt) / 1000).toFixed(2)} secs `;

        const onUpdate = () => {
            return (found) => {
                onOcurrenceUpdate({
                    found,
                    linesLength: linesLength.counter,
                    took: elepsed()
                });
            }
        }


        file.stream()
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(this.#csvToJSON({ linesLength, progressFn }))
            .pipeTo(this.#findOcurrencies({ query, onOcurrenceUpdate: onUpdate() }))
    }

    #csvToJSON({ linesLength, progressFn }) {
        let columns = [];
        return new TransformStream({
            transform: (chunk, controller) => {
                progressFn(chunk.length);
                const lines = chunk.split("\n");
                linesLength.counter = lines.length;

                if (!columns.length) {
                    const firstLine = lines.shift();
                    columns = firstLine.split(",");
                    linesLength.counter--;
                }

                for (const line of lines) {
                    if (!line.length) continue;
                    let currentItem = {};
                    const currentColumsItems = line.split(',');

                    for (const [index, column] of columns.entries()) {
                        if (!currentColumsItems[index]) continue;
                        const columnItem = currentColumsItems[index].trimEnd();
                        currentItem[column] = columnItem;
                    }
                    controller.enqueue(currentItem);
                }
            }
        });
    }

    #findOcurrencies({ query, onOcurrenceUpdate }) {
        let found = {};

        return new WritableStream({
            write: (chunkJson) => {
                for (const key in query) {
                    const queryValue = query[key];
                    found[queryValue] = found[queryValue] ?? 0;

                    if (queryValue.test(chunkJson[key])) {
                        found[queryValue]++;
                        onOcurrenceUpdate(found);
                    }
                }
            },
            close: () => onOcurrenceUpdate(found)
        });
    }

    #setupProgress(totalBytes, onProgress) {
        let totalUploaded = 0;
        onProgress(0);

        return (chunckSize) => {
            totalUploaded += chunckSize;
            const total = totalUploaded / totalBytes * 100
            onProgress(total);
        }
    }
}