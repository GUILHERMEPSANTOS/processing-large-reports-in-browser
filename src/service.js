export default class Service {
    processFile({ query, file, onProgress, onOcurrenceUpdate }) {
        const linesLength = { counter: 0 };

        file.stream()
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(this.#csvToJSON({ linesLength, onProgress }))
            .pipeTo(new WritableStream({
                write: (chunk) => {
                    console.log(chunk);
                }
            }))
    }

    #csvToJSON({ linesLength, progressFn }) {
        let columns = [];
        return new TransformStream({
            transform: (chunk, controller) => {
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
                        const columnItem = currentColumsItems[index].trimEnd();
                        currentItem[column] = columnItem;
                    }
                    controller.enqueue(currentItem);
                }
            }
        });
    }
}