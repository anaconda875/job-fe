import React, { Component } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import AuthService from "../../../services/AuthService";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import MasterDataService from "../../../services/MasterDataService";

export default class Register extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      loginPerson : "Employee",
      phoneNumber: '',
      pin: '',
      exp_levels: [],
      categories: [],
      categories_name: [],
      location: '',
      errorMessage: null,
      openAlertDialog: false
    };

    this.authService = new AuthService();
    this.masterDataService = new MasterDataService();
  }

  componentDidMount() {
    this.masterDataService.experienceLevels().then(res => {
      this.setState({exp_levels: res})
    })
    this.masterDataService.jobCategories().then(res => {
      this.setState({categories: res})
    })
  }

  doRegister = () => {
    let categories_id = [];
    this.state.categories.forEach(item => {
      if(this.state.categories_name.filter(name => name === item.name).length > 0) {
        categories_id.push({ id: item.id })
      }
    })

    const postData = {
      name: this.state.name,
      phone: this.state.phone,
      address: this.state.address,
      location: this.state.location,
      experienceLevel: {id: this.state.exp},
      jobCategories: categories_id
    };
    console.log(postData)
    if (this.state.loginPerson === "Employee") {
      this.authService.employeeRegister(postData)
          .then((response) => {
            console.log(response)
            window.location.href = "#/login";
            this.setState({
              // openAlertDialog: true
            })
          })
          .catch((error) => {
            console.error(error);
            this.setState({
              errorMessage: 'Đăng ký không thành công'
            })
          });
    } else {
      this.authService.employerRegister(postData)
          .then((response) => {
            console.log(response)
            window.location.href = "#/login";
            this.setState({
              openAlertDialog: true
            })
          })
          .catch((error) => {
            console.error(error);
            this.setState({
              errorMessage: 'Đăng ký không thành công'
            })
          });
    }
  }

  handleClose = () => {

  }

  alertDiag = () => {
    return (
        <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.openAlertDialog}>
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            Thông báo
          </DialogTitle>
          <DialogContent dividers>
            Bạn đã đăng ký thành công. Bạn hãy đăng nhập để sử dụng hệ thống
          </DialogContent>
        </Dialog>
    );
  }
  render() {
    return (
        <>
          {this.alertDiag()}
          <CContainer className="mt-5">
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Đăng ký</h1>
                    <p className="text-medium-emphasis">Đăng ký tài khoản</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        {/* <CIcon icon={cilUser} /> */}
                        Họ tên
                      </CInputGroupText>
                      <CFormInput value={this.state.name}
                                  onChange={(e) => this.setState({ name: e.target.value})}
                                  placeholder="Nhập họ &#38; tên"
                                  autoComplete="name" />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        {/* <CIcon icon={cilLockLocked} /> */}
                        Địa chỉ
                      </CInputGroupText>
                      <CFormInput value={this.state.address} placeholder="Nhập địa chỉ" onChange={(e) => this.setState({address: e.target.value})}/>
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        {/* <CIcon icon={cilLockLocked} /> */}
                        Số điện thoại
                      </CInputGroupText>
                      <CFormInput value={this.state.phone} placeholder="Nhập số điện thoại" type="number" onChange={(e) => this.setState({phone: e.target.value})}/>
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        {/* <CIcon icon={cilLockLocked} /> */}
                        Vị trí
                      </CInputGroupText>
                      <CFormInput value={this.state.location} placeholder="Nhập tọa độ" onChange={(e) => this.setState({location: e.target.value})}/>
                    </CInputGroup>

                    <div className="form-group">
                      <label>Kinh nghiệm</label><br/>
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={this.state.exp}
                          onChange={(e) => this.setState({ exp: e.target.value})}
                      >
                        {this.state.exp_levels.map(option => {
                          return (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                          )
                        })}
                      </Select>
                    </div>

                    <div className="form-group">
                      <label>Ngành nghề</label><br/>
                      <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={this.state.categories_name}
                          onChange={(e) => {
                            let val = e.target.value;
                            val = typeof val === 'string' ? val.split(',') : val
                            this.setState({categories_name: val})
                          }}
                          renderValue={(selected) => selected.join(', ')}
                      >
                        {this.state.categories.map((name) => (
                            <MenuItem
                                key={name.id}
                                value={name.name}
                            >
                              {name.name}
                            </MenuItem>
                        ))}
                      </Select>
                    </div>

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
                        <CButton color="primary" className="px-4" onClick={this.doRegister}>
                          Đăng kí
                        </CButton>
                        <p className="forgot-password text-right">
                          Already registered <a href="#/login">sign in?</a>
                        </p>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
        </>

    );
  }
}


// <form>
//             <h3>Sign Up</h3>

//             <div className="form-group">
//               <label>Họ tên</label>
//               <input type="text" className="form-control" placeholder="Enter name" onChange={(e) => this.setState({ name: e.target.value})} />
//             </div>

//             <div className="form-group">
//               <label>Địa chỉ</label>
//               <input type="text" className="form-control" placeholder="Enter address" onChange={(e) => this.setState({ address: e.target.value})} />
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input type="text" className="form-control" placeholder="Enter phone number" onChange={(e) => this.setState({ phone: e.target.value})} />
//             </div>

//             <div className="form-group">
//               <label>Vị trí</label>
//               <input type="text" className="form-control" placeholder="Enter location" onChange={(e) => this.setState({ location: e.target.value})} />
//             </div>

//             <div className="form-group">
//               <label>Kinh nghiệm</label><br/>
//               <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   value={this.state.exp}
//                   onChange={(e) => this.setState({ exp: e.target.value})}
//               >
//                 {this.state.exp_levels.map(option => {
//                   return (
//                       <MenuItem key={option.id} value={option.id}>
//                         {option.name}
//                       </MenuItem>
//                   )
//                 })}
//               </Select>
//             </div>

//             <div className="form-group">
//               <label>Ngành nghề</label><br/>
//               <Select
//                   labelId="demo-multiple-checkbox-label"
//                   id="demo-multiple-checkbox"
//                   multiple
//                   value={this.state.categories_name}
//                   onChange={(e) => {
//                     let val = e.target.value;
//                     val = typeof val === 'string' ? val.split(',') : val
//                     this.setState({categories_name: val})
//                   }}
//                   renderValue={(selected) => selected.join(', ')}
//               >
//                 {this.state.categories.map((name) => (
//                     <MenuItem
//                         key={name.id}
//                         value={name.name}
//                     >
//                       {name.name}
//                     </MenuItem>
//                 ))}
//               </Select>
//             </div>

//             <div className="form-group">
//               <Select
//                   labelId="exp-label"
//                   id="exp-select"
//                   value={this.state.loginPerson}
//                   onChange={(e) => this.setState({ loginPerson: e.target.value})}
//               >
//                 <MenuItem value="Employee">Nhân viên</MenuItem>
//                 <MenuItem value="Employer">Nhà tuyển dụng</MenuItem>
//               </Select>
//             </div>

//             <Button variant="contained" color="primary" onClick={this.doRegister}>
//               Đăng ký
//             </Button>
//             <p className="forgot-password text-right">
//               Already registered <a href="#/login">sign in?</a>
//             </p>
//           </form>
