import React, { Component } from "react";
import AuthService from "../../../services/AuthService";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
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
              errorMessage: '????ng k?? kh??ng th??nh c??ng'
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
              errorMessage: '????ng k?? kh??ng th??nh c??ng'
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
            Th??ng b??o
          </DialogTitle>
          <DialogContent dividers>
            B???n ???? ????ng k?? th??nh c??ng. B???n h??y ????ng nh???p ????? s??? d???ng h??? th???ng
          </DialogContent>
        </Dialog>
    );
  }
  render() {
    return (
        <>
          {this.alertDiag()}
          <form>
            <h3>Sign Up</h3>

            <div className="form-group">
              <label>H??? t??n</label>
              <input type="text" className="form-control" placeholder="Enter name" onChange={(e) => this.setState({ name: e.target.value})} />
            </div>

            <div className="form-group">
              <label>?????a ch???</label>
              <input type="text" className="form-control" placeholder="Enter address" onChange={(e) => this.setState({ address: e.target.value})} />
            </div>

            <div className="form-group">
              <label>S??? ??i???n tho???i</label>
              <input type="text" className="form-control" placeholder="Enter phone number" onChange={(e) => this.setState({ phone: e.target.value})} />
            </div>

            <div className="form-group">
              <label>V??? tr??</label>
              <input type="text" className="form-control" placeholder="Enter location" onChange={(e) => this.setState({ location: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Kinh nghi???m</label><br/>
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
              <label>Ng??nh ngh???</label><br/>
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

            <div className="form-group">
              <Select
                  labelId="exp-label"
                  id="exp-select"
                  value={this.state.loginPerson}
                  onChange={(e) => this.setState({ loginPerson: e.target.value})}
              >
                <MenuItem value="Employee">Nh??n vi??n</MenuItem>
                <MenuItem value="Employer">Nh?? tuy???n d???ng</MenuItem>
              </Select>
            </div>

            <Button variant="contained" color="primary" onClick={this.doRegister}>
              ????ng k??
            </Button>
            <p className="forgot-password text-right">
              Already registered <a href="#/login">sign in?</a>
            </p>
          </form>
        </>

    );
  }
}



