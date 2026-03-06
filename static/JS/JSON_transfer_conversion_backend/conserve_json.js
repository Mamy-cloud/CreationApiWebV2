// conserve_json.js
let storedData = null;
let onDataSetCallback = null;

export function setData(data) {
    storedData = data;
    if (onDataSetCallback) onDataSetCallback(storedData);
}

export function getData() {
    return storedData;
}

export function onDataSet(callback) {
    onDataSetCallback = callback;
}