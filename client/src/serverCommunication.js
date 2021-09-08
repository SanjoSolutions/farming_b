const serverUrl = 'http://farming.loc:8081'

async function request(path, body) {
  return await (await fetch(
    `${serverUrl}${path}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )).json()
}

export async function register(email, password) {
  return await request('/register', {
    username: email,
    password
  })
}

export async function logIn(email, password) {
  return await request('/login', {
    username: email,
    password
  })
}

export async function logOut() {
  await request('/logout', {})
}
