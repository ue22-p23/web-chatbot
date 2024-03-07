// the server that we have made available for you to use is at the following URL:
let HOSTNAME = "mistral.pl.sophia.inria.fr"
let PORT = 8080

const URL = () => `http://${HOSTNAME}:${PORT}/api/generate`



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

        // for streaming mode
        const appendChunk = (text) => {
            document.getElementById("messages").lastChild.innerText += text
        }

        const sendPrompt = async (event) => {
            const streaming = document.getElementById("streaming").checked
            const model = document.getElementById("model").value

            let prompt = document.getElementById("prompt").value
            let data = {
                model: model,
                prompt
            }
            if (! streaming)
                request.stream = false

            // console.log("sending prompt:", prompt)
            // add the prompt to the messages
            addMessage(prompt)
            disableSend()

            const request = { method: 'POST', body: JSON.stringify(data) }
            console.log(request)
            const response = await fetch(URL(), request)
            if (! streaming) {
                // regular one-shot response: wait and display
                const json = await response.json()
                console.log("non streaming response:", json)
                addMessage(json.response)
            } else {
                // streaming response
                const reader = response.body.getReader()
                const decoder = new TextDecoder()
                // create an empty message to avoid appending to the prompt
                addMessage("")
                while (true) {
                    const {value, done} = await reader.read()
                    if (done)
                        break
                    // console.log("value:", value)
                    // decode bytes as (json)text
                    const json = decoder.decode(value, {stream: true})
                    // decode as json
                    const data = JSON.parse(json)
                    appendChunk(data.response)
                }
            }
            enableSend()
            console.log("the end")
        }

        document.getElementById("streaming").checked = true
        document.getElementById("send").addEventListener("click", sendPrompt)
        // tmp for debugging, avoid the need to click the button upon reload
        // document.getElementById("prompt").value = `Hi I am a human, what's your name ?`
        // for development, send the prompt automatically
        // sendPrompt()
})
