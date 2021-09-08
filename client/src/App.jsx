import React from 'react'
import { Entity } from './Entity.jsx'
import { LoginModal } from './LoginModal.jsx'
import { RegisterModal } from './RegisterModal.jsx'
import {
  getEntities,
  getEntity,
  getUser, getUserId,
  logOut,
  updateEntity,
} from './serverCommunication.js'

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.logOut = this.logOut.bind(this)
    this.renderEntity = this.renderEntity.bind(this)
  }

  logOut() {
    logOut()
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
        const userId = getUserId()
        if (userId) {
          const entity = this.props.entity || {
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
            updateEntity({
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

  render() {
    const user = this.props.user
    const { x, y } = this.props.entity || { x: 0, y: 0 }
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

        <LoginModal/>
        <RegisterModal/>
      </div>
    )
  }

  renderUserEmailAddress() {
    const user = this.props.user
    const email = user.emails ? user.emails[0].address : ''
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
    return this.props.entities.map(this.renderEntity)
  }

  renderEntity(entity) {
    const {userId, x, y} = entity
    return (
      <Entity key={userId} x={x} y={y}></Entity>
    )
  }
}

// export const App = withTracker(
//   ({}) => {
//     return {
//       user: getUser(),
//       entity: getEntity(),
//       entities: getEntities()
//     }
//   },
// )(AppBase)
