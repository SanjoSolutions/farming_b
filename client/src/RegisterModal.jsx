import React from 'react'
import { register } from './serverCommunication.js'

/* global bootstrap */

export class RegisterModal extends React.Component {
  constructor(props) {
    super(props)
    this.modal = React.createRef()
    this.form = React.createRef()
    this.email = React.createRef()

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.modal.current.addEventListener('shown.bs.modal', () => {
      this.email.current.focus()
    })
  }

  async onSubmit(event) {
    event.preventDefault()
    const formData = new FormData(this.form.current)
    const email = formData.get('email')
    const password = formData.get('password')
    try {
      const user = await register(email, password)
      this.props.onRegister(user)
      const modal = bootstrap.Modal.getInstance(this.modal.current)
      modal.hide()
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div ref={this.modal} id="registerModal" className="modal fade" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form ref={this.form} onSubmit={this.onSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Register</h5>
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
                    id="registerEmail"
                    name="email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    name="password"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
