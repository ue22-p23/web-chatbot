// NOTE that the API endpoint is always /api/generate

const SERVERS = [
    // this one is fast because it has GPUs, but it requires a login / password
    { name: "GPU fast", url: "https://ollama-sam.inria.fr",
      username: "Bob", password: "hiccup", default: true},
    // this one is slow because it has no GPUs, but it does not require a login / password
    { name: "CPU slow", url: "http://ollama.pl.sophia.inria.fr:8080"},
]


window.addEventListener('DOMContentLoaded',
    (event) => {

        //// utility functions - optional and for convenience only

        // set the default mode
        const setDefaultModel = () => {
            document.getElementById("model").value = "gemma"
        }

        // add incoming messages to the chat
        const addMessage = (text) => {
            const messages = document.getElementById("messages")
            const message = document.createElement('div')
            message.innerText = text
            messages.appendChild(message)
        }
        const appendChunk = (text) => {
            document.getElementById("messages").lastChild.innerText += text
        }

        // enable / disable the send button
        const enableSend = () => {
            document.getElementById("send").disabled = false
        }
        const disableSend = () => {
            document.getElementById("send").disabled = true
        }

        // fill the dropdown to choose the server
        const setURLOptions = () => {
            for (const server of SERVERS) {
                const option = new Option(server.name, server.url)
                document.getElementById("server-name").appendChild(option)
                if (server.default) {
                    document.getElementById("server-name").value = server.url
                }
            }
        }

        // and locate the currently selected server specification
        const currentServer = () => {
            const url = document.getElementById("server-name").value
            for (const server of SERVERS) {
                if (server.url === url) {
                    server.prefix = `${url}/api/generate`
                    return server
                }
            }
        }



        const sendPrompt = async (event) => {
            // needed because we use a form
            // it prevents the form from being submitted
            event.preventDefault()

            // xxx your code goes here
            console.log("sendPrompt - WIP -- your code is needed here ...")
        }


        document.getElementById("streaming").checked = true
        setURLOptions()
        setDefaultModel()
        document.getElementById("send").addEventListener("click", sendPrompt)

        // convenience for development
        // if you are debugging a specific setting, it can be useful to have the page
        // send one request automatically upon reload
        // so for example, using non-streaming - gemma model - on the CPU box - with a prompt in german
        const autostart = () => {
            document.getElementById("prompt").value = `Hallo !`
            document.getElementById("model").value = `gemma`
            document.getElementById("streaming").checked = false
            document.getElementById("server-name").value = SERVERS[0].url
            sendPrompt()
        }
        // comment this off when you are done debugging
        // autostart()
    })
