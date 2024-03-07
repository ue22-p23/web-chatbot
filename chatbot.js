// the server that we have made available for you to use is at the following URL:
let HOSTNAME = "mistral.pl.sophia.inria.fr"
let PORT = 8080

const URL = () => `http://${HOSTNAME}:${PORT}/api/generate`

// only in streaming mode for now
// let STREAMING_MODE = false

window.addEventListener('DOMContentLoaded',
    (event) => {
        // your code goes here

        const enableSend = () => {
            document.getElementById("send").disabled = false
        }
        const disableSend = () => {
            document.getElementById("send").disabled = true
        }

        const addMessage = (text) => {
            const messages = document.getElementById("messages")
            const message = document.createElement('div')
            message.innerText = text
            messages.appendChild(message)
        }

        const addPiece = (text) => {
            document.getElementById("messages").lastChild.innerText += text
        }

        const sendPrompt = (event) => {
            const streaming = document.getElementById("streaming").checked
            const model = document.getElementById("model").value

            let prompt = document.getElementById("prompt").value
            let data = {
                model: model,
                // stream: false,
                prompt
            }
            if (! streaming)
                request.stream = false

            // const messages = document.getElementById("messages")

            // show message as sent
            console.log("sending prompt:", prompt)
            addMessage(prompt)
            disableSend()

            const request = { method: 'POST', body: JSON.stringify(data) }
            console.log(request)
            fetch(URL(), request)
                .then(response => {
                    addMessage("")
                    const reader = response.body.getReader()
                    const stream = new ReadableStream({
                        start(controller) {
                            const decoder = new TextDecoder()
                            const pump = () => {
                                reader.read()
                                    .then(({ done, value }) => {
                                        if (done) {
                                            console.log('Stream complete')
                                            enableSend()
                                            controller.close()
                                            return
                                        }
                                        const piece = JSON.parse(decoder.decode(value)).response
                                        addPiece(piece)
                                        // console.log('Stream value:', piece)
                                        controller.enqueue(value)
                                        pump()
                                    })
                                    .catch(error => {
                                        console.error('Stream error:', error)
                                        controller.error(error)
                                    })
                                }
                                pump()
                            }
                        })
                    return new Response(stream, { headers: response.headers })
                })
                .then(response => console.log("the end"))
                .catch(error => console.error('Fetch error:', error))
            }

        document.getElementById("send").addEventListener("click", sendPrompt)
        // tmp for debugging, avoid the need to click the button upon reload
        document.getElementById("prompt").value = `Hi I am a human, what's your name ?`
        document.getElementById("streaming").checked = true
        // sendPrompt()
})
