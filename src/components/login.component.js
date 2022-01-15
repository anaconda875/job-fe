import React, { Component } from "react";
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import AuthService from "../services/AuthService";

export default class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            loginPerson : "Employee",
            phoneNumber: '',
            pin: '',
            errorMessage: null
        };

        this.loginService = new AuthService();
    }



    doLogin = () => {
        if (this.state.loginPerson == "Employee") {
            this.loginService.employeeLogin(this.state.phoneNumber, this.state.pin)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({
                        errorMessage: 'Thông tin đăng nhập không chính xác'
                    })
                });
        } else {
            this.loginService.employerLogin(this.state.phoneNumber, this.state.pin)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({
                        errorMessage: 'Thông tin đăng nhập không chính xác'
                    })
                });
        }
    }
    render() {

        return (
            <form>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Phone number</label>
                    <input type="text" className="form-control" placeholder="Enter phone number" onChange={(e) => this.setState({ phoneNumber: e.target.value})} />
                </div>

                <div className="form-group">
                    <label>Pin</label>
                    <input type="text" className="form-control" placeholder="Enter pin" onChange={(e) => this.setState({ pin: e.target.value})} />
                </div>

                <div style={{ margin: 10 }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.loginPerson}
                        onChange={(e) => this.setState({ loginPerson: e.target.value})}
                    >
                        <MenuItem value="Employee">Nhân viên</MenuItem>
                        <MenuItem value="Employer">Nhà tuyển dụng</MenuItem>
                    </Select>
                </div>


                <Button variant="contained" color="primary" onClick={this.doLogin}>
                    Đăng nhập
                </Button>
                {this.state.errorMessage != null && (
                    <span>{this.state.errorMessage}</span>
                )}
                <p className="forgot-password text-right">
                    <Link to="/sign-up">Đăng ký</Link>
                </p>
            </form>
        );
    }
}
