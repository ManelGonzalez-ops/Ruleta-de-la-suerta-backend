const express = require("express")


const app = express()

app.get("/", (req, res) => {
    return res.send("comemela")
})


const content = "buenas"
const eventName = "mensajeando"
let error = false
const hayError = () => {

    setInterval(() => {
        error = !error
    }, 3000)
    return error
}

app.get("/choose", (req, res) => {

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

    let counter = 0;
    let interValID = setInterval(() => {
        const error = hayError() ? "bien" : "mal"
        console.log(error, "err")
        counter++;
        if (counter >= 10) {
            clearInterval(interValID);
            res.end(); // terminates SSE session
            return;
        }
        res.write(`data: ${error}` + "\n\n");// res.write() instead of res.send() añadir \n\n al final si no no fucniona xd
    }, 1000);

    // If client closes connection, stop sending events
    res.on('close', () => {
        console.log('client dropped me');
        clearInterval(interValID);
        res.end();
    });
});

const port = 8001
app.listen(port, () => {
    console.log("app running in port", port)
})
