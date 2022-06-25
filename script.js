let user
let content
let message

function login() {
  let userName = prompt('Qual o seu nome?')
  user = { name: userName }
  let postPromise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants',
    user
  )
  postPromise.then(loginSucess)
  postPromise.catch(loginError)
}

//Leva para as constantes checagem de presença e atualização de mensagens
function loginSucess(postResponse) {
  setInterval(checkPresence, 5000)
  console.log('Entramos')

  setInterval(updateMessages, 3000)
}

function checkPresence() {
  let checkPromise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/status',
    user
  )
}

function updateMessages() {
  let serverPromise = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/messages'
  )
  serverPromise.then(showMessages)
}

//Altera o DOM para exibir as mensagens do chat
//REVER FORMATAÇÃO DAS MENSAGENS EXIBIDAS
function showMessages(messages) {
  content = messages.data
  document.querySelector('.chat').innerHTML = ''

  for (let i = 0; i < content.length; i++) {
    if (content[i].type === 'status') {
      document.querySelector(
        '.chat'
      ).innerHTML += `<div class="message state"><span class="time">(${content[i].time})</span> &nbsp <span class="bold">${content[i].from}</span> &nbsp${content[i].text}</div>`
    } else if (content[i].type === 'message') {
      document.querySelector(
        '.chat'
      ).innerHTML += `<div class="message normal"><span class="time">(${content[i].time})</span>&nbsp<span class="bold">${content[i].from}</span>&nbsp<span class="bold">${content[i].to}</span>: ${content[i].text}</div>`
    } else if (
      content[i].type === 'private_message' &&
      content[i].to === user.name //(Private)para mostrar apenas para o destinatário
    ) {
      document.querySelector(
        '.chat'
      ).innerHTML += `<div class="message private"><span class="time">(${content[i].time})</span>&nbsp<span class="bold">${content[i].from}</span> &nbsp <span> reservadamente para</span> &nbsp <span class="bold">${content[i].to}</span>: ${content[i].text}</div>`
    }
  }

  document.querySelector('.chat').lastChild.scrollIntoView()
}

function loginError(errorStatus) {
  let loginStatus = errorStatus.response.status
  if (loginStatus === 400) {
    alert(
      'Já existe um usuário com esse nome. Favor inserir um novo nome de usuário.'
    )
    login()
  } else {
    alert('Algo inesperado aconteceu')
  }
}

function sendMessage(sendButton) {
  message = { from: user.name, to: 'Todos', text: '', type: 'message' }
  message.text = document.querySelector('input').value
  document.querySelector('input').value = ''

  let send = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/messages',
    message
  )
  send.then(deuCerto)
}

function deuCerto() {
  console.log('Mensagem enviada')
}
