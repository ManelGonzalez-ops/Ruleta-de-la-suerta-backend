const init = () => {

    console.log("comeme el culo")

    const eventSource = new EventSource("http://localhost:8001/stream")

    eventSource.onmessage = (event) => {
        console.log("eventtttu")
        console.log(event.data, "eventouu")
    }
}





window.addEventListener("load", init)