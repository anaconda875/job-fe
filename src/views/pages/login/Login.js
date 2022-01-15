import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import AuthService from '../../../services/AuthService'
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select/Select";

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginPerson: 'Employee',
      phoneNumber: '',
      pin: '',
      errorMessage: null,
    }

    this.loginService = new AuthService()
  }

  doLogin = () => {
    if (this.state.loginPerson === 'Employee') {
      this.loginService
        .employeeLogin(this.state.phoneNumber, this.state.pin)
        .then((response) => {
          console.log(response)
          window.location.href = '#/dashboard'
        })
        .catch((error) => {
          console.error(error)
          this.setState({
            errorMessage: 'Thông tin đăng nhập không chính xác',
          })
        })
    } else {
      this.loginService
        .employerLogin(this.state.phoneNumber, this.state.pin)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.error(error)
          this.setState({
            errorMessage: 'Thông tin đăng nhập không chính xác',
          })
        })
    }
  }

  onChangeFormValue = (field, value) => {
    let state = this.state
    state[field] = value
    this.setState({
      state
    })
  }

  render() {
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Đăng nhập</h1>
                      <p className="text-medium-emphasis">Đăng nhập vào hệ thống</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput value={this.state.phoneNumber}
                                    onChange={(e) => this.onChangeFormValue('phoneNumber', e.target.value)}
                                    placeholder="Số điện thoại"
                                    autoComplete="phoneNumber" />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput value={this.state.pin} placeholder="Pin" onChange={(e) => this.onChangeFormValue('pin', e.target.value)} />
                      </CInputGroup>

                      <div className="mb-4">
                        <Select
                            labelId="exp-label"
                            id="exp-select"
                            value={this.state.loginPerson}
                            onChange={(e) => this.setState({ loginPerson: e.target.value})}
                        >
                          <MenuItem value="Employee">Nhân viên</MenuItem>
                          <MenuItem value="Employer">Nhà tuyển dụng</MenuItem>
                        </Select>
                      </div>
                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4" onClick={this.doLogin}>
                            Đăng nhập
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Đăng ký</h2>
                      <p>Đăng ký mới tài khoản Nhà tuyển dụng hoặc ứng viên</p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          Đăng ký ngay!
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}
