# chatbot

## assignment

create your own conversional bot, using the starter code that only has 

- a prompt area
- a send button
- and a "messages" area (empty on startup) where you are expected to keep track
  of the conversation (both prompts and answers)

## hints

- we have setup a ***ollama*** instance that serves various LLM models  
  NOTE that this service does not have a large pool of computing resources..
- the URL you need to use to join this service is defined `chatbot.js`
- for example, here's an example taken from the ollama documentation, adapted to our setup

  ```console
  # if you have curl installed, you can use this as-is in the terminal

  curl -X POST http://mistral.pl.sophia.inria.fr:8080/api/generate -d '{
    "model": "mistral",
    "prompt":"Here is a story about llamas eating grass"
   }'
  {"model":"mistral","created_at":"2024-03-06T10:42:41.922755311Z","response":" Title","done":false}
  {"model":"mistral","created_at":"2024-03-06T10:42:42.047344064Z","response":":","done":false}
  {"model":"mistral","created_at":"2024-03-06T10:42:42.21405405Z","response":" The","done":false}
  {"model":"mistral","created_at":"2024-03-06T10:42:42.378292723Z","response":" G","done":false}
  {"model":"mistral","created_at":"2024-03-06T10:42:42.541091495Z","response":"raz","done":false}
  ....
  ```
  which means: if I send a POST request on that URL with this (JSON) data, I am
  getting a stream of responses, each of them being a part of the answer to my
  request

### several models

the beauty of *ollama* is that several models are made available through the
same API; this means you are going to be in a position to compare the
performance of several popular LLMs by just changing the value for the `model`
field above; here are the available options for that field (see also the full list at <https://ollama.com/library>)

- mistral: is a.k.a. mistral-7B because it has 7 billion parameters
- xxx we need to find a simpler less CPU-consuming model...

### streaming or not streaming

in the above example, you can see that the answers come from the server "in small bits"  
this is because by default, the request is made in so-called *streaming* mode,
as opposed to the more usual non-streaming mode where the answer would come in a
single response - but at the very end of the processing, which typically takes
tens of seconds - so not very user-friendly !

so you have two options for this exercise - and like always, fast students are encouraged to tackle both:

- use a **non-streaming mode** - the easiest, but less rewarding:  
  to enable this you need to pass `streaming: "false"` in your request data  
  in this case your code expects a single response, so the code would look like
  any other exercise you have done so far with `fetch()`  
  it is less rewarding because the user possibly has to wait for a looooong time
  before they can see their answer
- use a **streaming mode** - more rewarding, but a little trickier  
  if you do not specify the `streaming` mode, the API will work in streaming
  mode  
  this means that your single intial request ends up in **several** response paquets  
  so it is a little trickier to code, because this not a unusual pattern when
  talking to more traditional APIs  
  but on the other hand it is (much) more user-friendly to see the answer pieces
  get displayed as they are churned out by the LLM model

  in order to address this situation, you will need to use something called an
  asynchronous iterator, and uing it boils down to using something like
  
  ```js
  // how to use an asynchronous iterator
  // xxx
  async for (let chunk of response) {
    // do something with that chunk
  }
  ```
