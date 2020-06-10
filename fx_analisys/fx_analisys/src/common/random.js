class MyRandom {
    static createRandom() {
        return 10 + Math.round(Math.random()*30)
    }
}

module.exports = MyRandom;
