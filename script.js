let userName
let user
let content
let message

//Página de Login (Página inicial)
function loginPage() {
  if (document.querySelector('.loginPage input').value !== '') {
    document.querySelector('.loadingPage').classList.remove('hidden')
    document.querySelector('.loginPage').classList.add('hidden')
    userName = document.querySelector('.loginPage input').value
    setTimeout(loadingPage, 2000)
  } else {
    alert('Nome de usuário não pode ser vazio')
  }
}

//Página que mostra o "carregando" (Ativado pelo clique no buttom "entrar")
function loadingPage() {
  document.querySelector('.operational').classList.remove('hidden')
  document.querySelector('.loadingPage').classList.add('hidden')
  login()
}

//Login propriamente dito - POST com o nome do usuário
function login() {
  user = { name: userName }
  let postPromise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants',
    user
  )
  postPromise.then(loginSucess)
  postPromise.catch(loginError)
}

//Leva para as constantes checagens de presença e atualização de mensagens
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

//GET das mensagens do servidor e direciona para renderizar
function updateMessages() {
  let serverPromise = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/messages'
  )
  serverPromise.then(showMessages)
}

//Altera o DOM para exibir as mensagens do chat
function showMessages(messages) {
  content = messages.data
  document.querySelector('.chat').innerHTML = ''

  for (let i = 0; i < content.length; i++) {
    if (content[i].type === 'status') {
      document.querySelector(
        '.chat'
      ).innerHTML += `<div class="message state"><p><span class="time">(${content[i].time})</span> <span class="bold">${content[i].from}</span> <span>${content[i].text}</span></p></div>`
    } else if (content[i].type === 'message') {
      document.querySelector(
        '.chat'
      ).innerHTML += `<div class="message normal"><p><span class="time">(${content[i].time})</span> <span class="bold">${content[i].from}</span> para <span class="bold">${content[i].to}</span>: ${content[i].text}</p></div>`
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

//Caso o login não funcione (reinicia página)
function loginError(errorStatus) {
  let loginStatus = errorStatus.response.status
  if (loginStatus === 400) {
    alert(
      'Já existe um usuário com esse nome. Favor inserir um novo nome de usuário.'
    )
    window.location.reload()
  } else {
    alert('Algo inesperado aconteceu')
  }
}

document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage()
  }
})

function sendMessage() {
  if (document.querySelector('.bottom input').value !== '') {
    message = { from: user.name, to: 'Todos', text: '', type: 'message' }
    message.text = document.querySelector('.bottom input').value
    document.querySelector('.bottom input').value = ''

    let send = axios.post(
      'https://mock-api.driven.com.br/api/v6/uol/messages',
      message
    )
    send.then(sendSucess)
    send.catch(sendFail)
  } else {
    alert('Impossível enviar mensagem vazia')
  }
}

//Tirar da versão final (apenas para teste)
function sendSucess() {
  console.log('Mensagem enviada')
}

function sendFail() {
  alert('Usuário deslogado')
  window.location.reload()
}
