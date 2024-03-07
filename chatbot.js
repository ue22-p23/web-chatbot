// the server that we have made available for you to use is at the following URL:
let HOSTNAME = "mistral.pl.sophia.inria.fr"
let PORT = 8080

const URL = () => `http://${HOSTNAME}:${PORT}/api/generate`

// only in non-streaming mode for now
let STREAMING_MODE = false

window.addEventListener('DOMContentLoaded',
    (event) => {
        // your code goes here

        const enableSend = () => {
            document.getElementById("send").disabled = false
        }
        const disableSend = () => {
            document.getElementById("send").disabled = true
        }

        // console.log("hello chatbot")
        let streaming_mode = STREAMING_MODE ? "streaming" : "non-streaming"
        document.querySelector("h1").innerText = `Chatbot (${streaming_mode})`

        document.getElementById("prompt").value = `Hi I am a human, what's your name ?`

        const addMessage = (text) => {
            const messages = document.getElementById("messages")
            const message = document.createElement('div')
            message.innerText = text
            messages.appendChild(message)
        }

        const sendPrompt = (event) => {
            let prompt = document.getElementById("prompt").value
            let data = {
                model: "mistral",
                stream: false,
                prompt
            }
            const messages = document.getElementById("messages")

            // show message as sent
            console.log("sending prompt:", prompt)
            addMessage(prompt)
            disableSend()

            const request = { method: 'POST', body: JSON.stringify(data) }
            if (! STREAMING_MODE) request.streaming = false
            fetch(URL(), request)
            .then( response => response.json())
            .then( json => {
                const text = json.response
                addMessage(text)
                enableSend()
            })

        }

        document.getElementById("send").addEventListener("click", sendPrompt)
        // tmp for debugging, avoid the need to click the button upon reload
        sendPrompt()
})
