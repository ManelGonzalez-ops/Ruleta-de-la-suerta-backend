//const enimga = "comeme el culo marika de mierda"
const enigma = "los peces son amigos no comida"

const template = {
    uno: {
        spots: 10,
        letters: [],
        spotsRemaining: function () {
            return this.spots - this.letters.length
        }
    },
    dos: {
        spots: 12,
        letters: [],
        spotsRemaining: function () {
            return this.spots - this.letters.length
        }
    },
    tres: {
        spots: 12,
        letters: [],
        spotsRemaining: function () {
            return this.spots - this.letters.length
        }
    },
    cuatro: {
        spots: 10,
        letters: [],
        spotsRemaining: function () {
            return this.spots - this.letters.length
        }
    },
}



const spotsLeft = 44
let currentFila = 0

const isFirstWord = { uno: true, dos: true, tres: true, quatro: true }

const AsignarFila = (word) => {
    const keys = Array.from(Object.keys(template))
    for (const key of keys.slice(currentFila)) {
        const fila = template[key]
        console.log(key, word, word.length + 1, fila.spotsRemaining(), "cjone")
        if (word.length + 1 <= fila.spotsRemaining()) {
            // if (fila.spotsRemaining() !== fila.spots
            //     && fila.spotsRemaining <= 2
            // ){

            // }
            if (!isFirstWord[key]) {
                fila.letters.push(" ")
            }
            word.split("").forEach((letter) => {
                fila.letters.push(letter)
            })

            if (isFirstWord[key]){
                isFirstWord[key] = false
            }
            //fila.letters.push(" ")
            break

            // fila.letters.push(word)            
            // fila.letters.push(" ")
            // break
        }
        else {
            console.log("increase")
            currentFila += 1
        }
    }
}



const getWordsCombinedLength = (fila) => {
    // let length = 0
    // fila.letters.forEach((word) => {
    //     length += word.length
    // })
    //return length

    return fila.letters.length
}
const asignarSpacios = () => {
    const keys = Array.from(Object.keys(template))
    for (const key of keys) {

        const fila = template[key]
        //take into account spaces between words
        const wordCount = fila.letters.length

        const wordsCombinedLength = getWordsCombinedLength(fila)
        console.log(wordsCombinedLength, "wordsCombinedLength")
        const spacesRemaining = fila.spots - wordsCombinedLength // - wordCount + 1
        console.log(spacesRemaining, "spacesRemaining")
        if (spacesRemaining <= 0) {
            continue
        }
        Array(spacesRemaining).fill(null).forEach((_, idx) => {
            idx += 1
            if (idx % 2) {
                fila.letters.push(" ")
            } else {
                fila.letters.unshift(" ")
            }
        })
    }
}


 const getFilas = (enigma) => {
    const getWords = (enigma) => enigma.split(" ")
    const wordArr = getWords(enigma)
    wordArr.forEach((word, idx) => {
        //filas[0] nos da la primera 
        AsignarFila(word)
    })
    console.log(template, "template1")
    asignarSpacios()
    console.log(template, "template")
    return template
}


getFilas(enigma)