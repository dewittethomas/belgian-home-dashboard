function getResults(data, number=5) {
    if (data.length < number) return data.slice(0, data.length);
    if (number <= 0) return data.slice(0, 0);
    return data.slice(0, number)
}

export default getResults;