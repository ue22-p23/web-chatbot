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

        const appendChunk = (text) => {
            document.getElementById("messages").lastChild.innerText += text
        }

        const sendPrompt = async (event) => {
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
            const response = await fetch(URL(), request)
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            addMessage("")
            while (true) {
                const {value, done} = await reader.read()
                if (done)
                    break
                // decode bytes as (json)text
                const json = decoder.decode(value, {stream: true})
                // decode as json
                const data = JSON.parse(json)
                console.log("value:", data.response)
                appendChunk(data.response)
            }
            enableSend()
            console.log("the end")
        }

        document.getElementById("send").addEventListener("click", sendPrompt)
        // tmp for debugging, avoid the need to click the button upon reload
        document.getElementById("prompt").value = `Hi I am a human, what's your name ?`
        document.getElementById("streaming").checked = true
        sendPrompt()
})
