module.exports = class Generator {
    generateActualData() {
        return [
            {
            name: "usd",
            code: 1,
            date: new Date().getTime(),
            price: Math.random()
        },
            {
                name: "eur",
                code: 2,
                date: new Date().getTime(),
                price: Math.random()
            },
            {
                name: "lir",
                code: 3,
                date: new Date().getTime(),
                price: Math.random()
            },
            {
                name: "tui",
                code: 4,
                date: new Date().getTime(),
                price: Math.random()
            },

        ];
    }
}
