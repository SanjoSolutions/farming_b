import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { v4 as uuidv4 } from 'uuid'
import { WebSocketServer } from 'ws'
import cors from 'cors'
import fs from 'fs/promises'

const webServer = express()

const usersDatabasePath = 'users.json'
const users = await loadUsers()
const emailToUser = new Map(
  Array.from(users.values()).map(user => [user.email, user])
)

passport.use(new LocalStrategy(
  function (email, password, done) {
    if (emailToUser.has(email)) {
      const user = emailToUser.get(email)
      if (password === user.password) {
        const sentUser = generateSentUser(user)
        done(null, sentUser)
      } else {
        done(null, false, { message: 'Incorrect password.' })
      }
    } else {
      done(null, false, { message: 'Cannot find user.' })
    }
  },
))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  done(null, users.get(id))
})

function generateSentUser(user) {
  const sentUser = { ...user }
  delete sentUser.password
  return sentUser
}

webServer.use(cors())
webServer.use(session({ secret: 'chickenmcnuggets' }))
webServer.use(express.json())
webServer.use(express.urlencoded({ extended: false }))
webServer.use(passport.initialize())
webServer.use(passport.session())
webServer.use(passport.initialize())

webServer.post(
  '/register',
  async function (request, response) {
    const { body } = request
    const { username, password } = body
    if (isUsernameFree(username)) {
      await createUser(username, password)
      response.json(
        {
          success: true,
        },
      )
    } else {
      response.json({
        success: false,
        error: 'User with username already exists.',
      })
    }
  },
)

function isUsernameFree(username) {
  return !emailToUser.has(username)
}

async function createUser(username, password) {
  const user = {
    id: uuidv4(),
    username,
    email: username,
    password,
  }
  users.set(user.id, user)
  emailToUser.set(user.email, user)
  await persistUsers()
}

async function persistUsers() {
  await writeJSON(usersDatabasePath, Array.from(users.values()))
}

async function loadUsers() {
  let users
  try {
    users = new Map(
      (await readJSON(usersDatabasePath)).map(user => [user.id, user])
    )
  } catch (error) {
    users = new Map()
  }
  return users
}

async function writeJSON(path, data) {
  await fs.writeFile(path, JSON.stringify(data, null, 2))
}

async function readJSON(path) {
  return JSON.parse(await fs.readFile(path, {encoding: 'utf-8'}))
}

webServer.post(
  '/login',
  passport.authenticate('local'),
  function (request, response) {
    response.json({})
  }
)

webServer.listen(8081)

const webSocketServer = new WebSocketServer({ port: 8080 })

webSocketServer.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
  })

  ws.send('something')
})
