const abecedario = "abcdefghijklmnopqrstuvwxyz"

const fraseEjmplo = "comeme el culo baby"

const checkLetter = (letter) => {
    let freq = 0
    fraseEjmplo.forEach(let => {
        if (let === letter) {
            freq++
        }
    })
    console.log(`letter has ${freq} ocurrences`)
}