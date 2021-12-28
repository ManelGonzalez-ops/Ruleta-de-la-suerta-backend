const getDataset = require("./excelReader")
const removeAccents = require("remove-accents")

class Ruleta {

    questions = []
    gameQuestions = []
    currentRound
    totalRounds
    currentQuestion = { question: "", answer: "" }
    letter = ""
    lettersCalled = []
    ocurrences
    success
    currentPlayer
    players
    nextQuestion
    //as an array of letter
    scapedAnswer
    //bolean
    roundFinished = false
    nextPlayer
    gameFinished = false
    //when someone resolves the panel before guessing all letters
    resolved = false
    roundInfo = () => ({ currentRound: this.currentRound, currentPlayer: this.currentPlayer, lettersCalled: this.lettersCalled, ocurrences: this.ocurrences, roundFinished: this.roundFinished, currentQuestion: this.currentQuestion, nextQuestion: this.nextQuestion, gameFinished: this.gameFinished, resolved: this.resolved })

    startGame = (players, rounds) => {
        this.setPlayers(players)
        this.chooseFirstPlayer()

        this.totalRounds = rounds
        this.currentRound = 1
        this.setQuestions()
        //this.setFakeQuestions()
        this.currentQuestion = this.gameQuestions[0]
        this.makeScapedAnswer(this.currentQuestion)
        //console.log("first question")
        return { firstEnigma: this.gameQuestions[0], currentPlayer: this.currentPlayer, totalRounds: this.totalRounds }
    }

    setQuestions = () => {
        const allEnigmas = getDataset()
        const datasetLength = Array.from(Object.keys(allEnigmas)).length
        //console.log(datasetLength, "datasetLength")
        for (const _ of Array(this.totalRounds).fill(null)) {
            const randomkey = Math.round(Math.random() * datasetLength) - 1
            //console.log(randomkey)
            this.gameQuestions.push(allEnigmas[randomkey.toString()])
        }
     
    }

    setFakeQuestions = () => {
        this.gameQuestions = [
            //{ answer: "Parchís, Oca y Escalera", question: "que as" },
            { answer: "hola", question: "prueba0" },
            { answer: "yo soy tu padre", question: "prueba1" },
            { answer: "los peces son amigos no comida", question: "prueba2" },
            { answer: "mapa", question: "que as" },
        ]
    }

    setPlayers = (players) => {
        this.players = players
    }
    chooseFirstPlayer = () => {
        const numPlayers = this.players.length
        const randomIdx = Math.round(Math.random() * numPlayers) - 1
        this.currentPlayer = this.players[randomIdx]
    }


    handleTurn = (letter) => {
        if (this.roundFinished) {
            this.lettersCalled = []
            this.currentQuestion = this.nextQuestion
            this.nextPlayer = this.currentPlayer
            this.currentRound += 1
            this.nextQuestion = null
            this.nextPlayer = null
            //in case someone resolved the previous panel
            this.resolved = false
        }

        const { alreadyCalled } = this.checkRepeated(letter)
        if (alreadyCalled) {
            this.selectNextPlayer()
            return { success: false, error: "repeated", roundInfo: this.roundInfo() }
        }
        const { isValid } = this.checkLetter(letter)

        if (!isValid) {
            this.selectNextPlayer()
            return { success: false, error: "notthere", roundInfo: this.roundInfo() }
        }


        const roundFinished = this.checkIfRoundFinished()
        if (roundFinished) {
            this.prepareNextRound()
        }

        return { success: true, error: null, roundInfo: this.roundInfo() }
    }
    checkLetter = (letter) => {
        if (this.roundFinished) {
            this.roundFinished = false
        }
        let ocurrences = 0
        this.lettersCalled.push(letter)
        this.scapedAnswer.forEach(_letter => {
            if (_letter === removeAccents(letter)) {
                console.log("coincide")
                ocurrences += 1
            }
        })

        this.ocurrences = ocurrences
        if (!ocurrences) {
            return { isValid: false }
        }

        return { isValid: true }
    }


    checkRepeated = (letter) => {

        if (this.lettersCalled.includes(letter)) {
            return { alreadyCalled: true }
        }
        return { alreadyCalled: false }
    }

    checkIfRoundFinished = () => {
        let isFinished = true;
        this.scapedAnswer.forEach((letter) => {
            if (!this.lettersCalled.includes(letter)) {
                //console.log("false", letter)
                isFinished = false
            }
        })
        if (!isFinished) {
            return false
        }
        return true
    }
    nextPlayer = () => {
        this.selectNextPlayer()
        this.letter = null

    }

    makeScapedAnswer = (question) => {
        console.log(question, "quesiton")
        let scapedAnswer = []
        question.answer.toLowerCase().split("").forEach(string => {
            let pattern = /([A-z])/
            const isALetter = pattern.test(string)
            if (isALetter) {
                scapedAnswer.push(string)
            }
        })
        console.log(scapedAnswer, "scapedAnswer")
        this.scapedAnswer = scapedAnswer
    }

    loseTurn = (reason) => {

    }


    prepareNextRound = () => {
        if (this.totalRounds === this.currentRound - 1) {
            return this.gameFinished = true
        }
        this.roundFinished = true
        this.nextQuestion = this.gameQuestions[this.currentRound]
        this.makeScapedAnswer(this.nextQuestion)
        this.nextPlayer = this.selectNextPlayer()

    }

    resolvePanel = () => {
        this.resolved = true
        this.prepareNextRound()
    }

    inscribePLayers = (playerList) => {
        this.players = playerList
    }

    selectNextPlayer = () => {
        const playerIndex = this.players.indexOf(this.currentPlayer)
        if (playerIndex === this.players.length - 1) {
            this.currentPlayer = this.players[0]
        }
        else {
            this.currentPlayer = this.players[playerIndex + 1]
        }
    }
}

module.exports = Ruleta