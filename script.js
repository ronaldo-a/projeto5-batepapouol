let user
let content

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

function loginSucess(postResponse) {
  setInterval(checkPresence, 5000)
  console.log('Entramos')
  let serverPromise = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/messages'
  )
  serverPromise.then(showMessages)
}

function checkPresence() {
  let checkPromise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/status',
    user
  )
}

function showMessages(messages) {
  content = messages.data

  for (let i = 0; i < content.length; i++) {
    if (content[i].type === 'status') {
      document.querySelector(
        '.chat'
      ).innerHTML += `<div class="message state">${content[i].time} ${content[i].from} ${content[i].type}</div>`
    } else if (content[i].type === 'message') {
      document.querySelector(
        '.chat'
      ).innerHTML += `<div class="message normal">${content[i].time} ${content[i].from} para ${content[i].to}: ${content[i].text}</div>`
    } else if (content[i].type === 'private_message') {
      document.querySelector(
        '.chat'
      ).innerHTML += `<div class="message private">${content[i].time} ${content[i].from} reservadamente para ${content[i].to}: ${content[i].text}</div>`
    }
  }
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
