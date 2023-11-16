export default class Service {
    processFile({ query, file, onProgress, onOcurrenceUpdate }) {
        console.log({ query, file });
        onProgress(10);
        onOcurrenceUpdate({ trste: "wkokeoc"});
    }
}