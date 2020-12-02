module.exports = class Generator {
    generateActualData() {
        return [
            {
                name: "usd",
                code: 1,
                date: new Date().toDateString(),
                price: Math.random().toFixed(2)
            },
            {
                name: "eur",
                code: 2,
                date: new Date().toDateString(),
                price: Math.random().toFixed(2)
            },
            {
                name: "lir",
                code: 3,
                date: new Date().toDateString(),
                price: Math.random().toFixed(2)
            },
            {
                name: "tui",
                code: 4,
                date: new Date().toDateString(),
                price: Math.random().toFixed(2)
            },
        ];
    }
}
