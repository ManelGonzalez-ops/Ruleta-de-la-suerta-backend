const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const Ruleta = require("./GameLogic")
const app = express()
app.use(cors())
app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

let ruleta;

let error = false

let res = {}
const setRes = (resp) => {
    res = resp
}

app.post("/startGame", (req, resp) => {
    console.log("hit start")
    ruleta = new Ruleta()
    const { players, rounds } = req.body
    const { firstEnigma, currentPlayer, totalRounds } = ruleta.startGame(players, rounds)
    const mobileData = { firstEnigma, currentPlayer, totalRounds }
    res.write(`data: ${JSON.stringify(mobileData)}` + "\n\n");
    resp.json({ firstEnigma, currentPlayer, totalRounds })
})


app.get("/choice/:letter", (req, resp) => {
    console.log("letter clicked")
    const { letter } = req.params
    const { success, error, roundInfo } = ruleta.handleTurn(letter)
    if (roundInfo.roundFinished) {

    }
    console.log(letter, "LETRA")
    const mobileData = {
        success, error, roundInfo,
        letter,
    }
    //disable when testing whitout mobile
    res.write(`data: ${JSON.stringify(mobileData)}` + "\n\n");

    resp.send({ success, error, roundInfo })
})
app.get("/resolve", (req, resp) => {
    console.log("letter clicked")
    ruleta.resolvePanel()
    const roundInfo = ruleta.roundInfo()
    console.log(roundInfo, "lapuroundinfo")
 

    const mobileData = {
        success: true, error: null, roundInfo,
    }
    //disable when testing whitout mobile
    res.write(`data: ${JSON.stringify(mobileData)}` + "\n\n");

    resp.send({ success: true, error: null, roundInfo })
})





const prepareStream = (res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
}


app.get('/stream', (req, res) => {
    console.log("reqested")
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client
    setRes(res)
    res.on('close', () => {
        console.log('client dropped me');
        //clearInterval(interValID);
        res.end();
    });
});


const port = process.env.PORT || 8001
app.listen(port, () => {
    console.log("app running in port", port)
})


