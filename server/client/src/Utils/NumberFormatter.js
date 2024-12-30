const numberFormatter = (num) => {
    if (num < 1000) {
        return num.toString();
    } else if (num < 1_000_000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    } 
}

export default numberFormatter;