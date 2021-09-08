import React from 'react'
import { Entity } from './Entity.jsx'
import { LoginModal } from './LoginModal.jsx'
import { RegisterModal } from './RegisterModal.jsx'
import {
  logOut,
} from './serverCommunication.js'

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      entity: null,
      entities: []
    }
    this.onRegister = this.onRegister.bind(this)
    this.onLogIn = this.onLogIn.bind(this)
    this.logOut = this.logOut.bind(this)
    this.renderEntity = this.renderEntity.bind(this)

    this.connection = new WebSocket('ws://farming.loc:8080')

    this.connection.onopen = () => {
      this.connection.send(JSON.stringify({message: 'test'}))
    }

    this.connection.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'entityUpdated') {
        onEntityUpdated(message.entity)
      }
    }

    const userIdToEntity = new Map()

    function getEntityByUserId(userId) {
      return userIdToEntity.get(userId)
    }

    const onEntityUpdated = ({id, userId, x, y}) => {
      let entity = getEntityByUserId(userId)
      if (entity) {
        entity.x = x
        entity.y = y
      } else {
        entity = {
          id,
          userId,
          x,
          y
        }
        userIdToEntity.set(userId, entity)
      }
      this.setState({entities: Array.from(userIdToEntity.values())})
      if (this.state.user && userId === this.state.user.id) {
        this.setState({
          entity: userIdToEntity.get(userId)
        })
      }
    }
  }

  onRegister(user) {
    this.setState({user})
  }

  onLogIn(user) {
    this.setState({user})
  }

  async logOut() {
    await logOut()
    this.setState({user: null})
  }

  componentDidMount() {
    const keyStates = new Map([
      ['ArrowUp', false],
      ['ArrowRight', false],
      ['ArrowDown', false],
      ['ArrowLeft', false],
    ])

    window.addEventListener('keydown', function (event) {
      const code = event.code
      if (isAKeyWhichIsTracked(code)) {
        setKeyStateToPressed(code)
        event.preventDefault()
      }
    })

    window.addEventListener('keyup', function (event) {
      const code = event.code
      if (isAKeyWhichIsTracked(code)) {
        setKeyStateToUnpressed(code)
        event.preventDefault()
      }
    })

    function isAKeyWhichIsTracked(code) {
      return keyStates.has(code)
    }

    function setKeyStateToPressed(code) {
      keyStates.set(code, true)
    }

    function setKeyStateToUnpressed(code) {
      keyStates.set(code, false)
    }

    function isKeyPressed(code) {
      return keyStates.get(code)
    }

    setInterval(
      () => {
        const userId = this.state.user?.id
        if (userId) {
          const entity = this.state.entity || {
            userId,
            x: 0,
            y: 0
          }
          let { x, y } = entity
          const previousX = x
          const previousY = y
          if (isKeyPressed('ArrowUp')) {
            y -= 1
          }
          if (isKeyPressed('ArrowRight')) {
            x += 1
          }
          if (isKeyPressed('ArrowDown')) {
            y += 1
          }
          if (isKeyPressed('ArrowLeft')) {
            x -= 1
          }
          if (
            hasPositionChanged(
              { x, y },
              { x: previousX, y: previousY },
            )
          ) {
            this.updateEntity({
              userId,
              x,
              y
            })
          }
        }
      }, 1000 / 60,
    )

    function hasPositionChanged(a, b) {
      return a.x !== b.x || a.y !== b.y
    }
  }

  updateEntity(entity) {
    const data = JSON.stringify(
      {
        type: 'updateEntity',
        entity
      }
    )
    this.connection.send(data)
  }

  render() {
    const user = this.state.user
    const { x, y } = this.state.entity || { x: 0, y: 0 }
    return (
      <div>
        <div className="container">
          <header
            className="d-flex flex-wrap align-items-center justify-content-end py-3 mb-4 border-bottom">
            <div className="col text-end">
              {user && this.renderUserEmailAddress()}
              {user && this.renderLogOutButton()}
              {!user && this.renderLogInButton()}
              {!user && this.renderRegisterButton()}
            </div>
          </header>
        </div>

        {this.renderEntities()}

        <LoginModal onLogIn={this.onLogIn} />
        <RegisterModal onRegister={this.onRegister} />
      </div>
    )
  }

  renderUserEmailAddress() {
    const user = this.state.user
    const email = user.email
    return (
      <div className="d-inline-block me-2">
        {email}
      </div>
    )
  }

  renderLogOutButton() {
    return (
      <button
        onClick={this.logOut}
        type="button"
        className="btn btn-outline-primary me-2"
      >
        Log out
      </button>
    )
  }

  renderLogInButton() {
    return (
      <button type="button" className="btn btn-outline-primary me-2"
              data-bs-toggle="modal" data-bs-target="#loginModal">Login
      </button>
    )
  }

  renderRegisterButton() {
    return (
      <button type="button" className="btn btn-primary" data-bs-toggle="modal"
              data-bs-target="#registerModal">Register
      </button>
    )
  }

  renderEntities() {
    return this.state.entities.map(this.renderEntity)
  }

  renderEntity(entity) {
    const {userId, x, y} = entity
    return (
      <Entity key={userId} x={x} y={y}></Entity>
    )
  }
}
