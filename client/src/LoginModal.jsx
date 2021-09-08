import React from 'react'
import { logIn } from './serverCommunication.js'

/* global bootstrap */

export class LoginModal extends React.Component {
  constructor(props) {
    super(props)
    this.modal = React.createRef()
    this.form = React.createRef()
    this.email = React.createRef()

    this.onSubmit = this.onSubmit.bind(this)

    this.state = {
      isLoggingIn: false
    }
  }

  componentDidMount() {
    this.modal.current.addEventListener('shown.bs.modal', () => {
      this.email.current.focus()
    })
  }

  async onSubmit(event) {
    event.preventDefault()
    this.setState({isLoggingIn: true})
    const formData = new FormData(this.form.current)
    const email = formData.get('email')
    const password = formData.get('password')
    try {
      const user = await logIn(email, password)
      this.props.onLogIn(user)
      const modal = bootstrap.Modal.getInstance(this.modal.current)
      modal.hide()
    } catch (error) {
      console.error(error)
    }
    this.setState({isLoggingIn: false})
  }

  render() {
    return (
      <div ref={this.modal} id="loginModal" className="modal fade" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form ref={this.form} onSubmit={this.onSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"/>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    ref={this.email}
                    type="email"
                    className="form-control"
                    id="loginEmail"
                    name="email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    name="password"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={this.state.isLoggingIn}>
                    Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
