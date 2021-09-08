const serverUrl = 'http://farming.loc:8081'

async function request(path, body) {
  return await fetch(
    `${serverUrl}${path}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )
}

export async function register(email, password) {
  await request('/register', {
    username: email,
    password
  })
}

export async function logIn(email, password) {
  await request('/login', {
    username: email,
    password
  })
}

export function updateEntity(entity) {
  const {userId, x, y} = entity

}

export function getUserId() {
  return null
}

export function getUser() {
  return null
}

export function getEntity() {
  return null
}

export function getEntities() {
  return []
}

export function logOut() {

}
