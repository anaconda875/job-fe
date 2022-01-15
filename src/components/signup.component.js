import React, { Component } from "react";
import AuthService from "../services/AuthService";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

export default class SignUp extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            loginPerson : "Employee",
            phoneNumber: '',
            pin: '',
            errorMessage: null,
            openAlertDialog: false
        };

        this.authService = new AuthService();
    }

    doRegister = () => {
        const postData = {
            name: this.state.name,
            phone: this.state.phone,
            address: this.state.address
        };
        if (this.state.loginPerson == "Employee") {
            this.authService.employeeRegister(postData)
                .then((response) => {
                    console.log(response)
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
        } else {
            this.authService.employerRegister(postData)
                .then((response) => {
                    console.log(response)
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
                <form>
                    <h3>Sign Up</h3>

                    <div className="form-group">
                        <label>Họ tên</label>
                        <input type="text" className="form-control" placeholder="First name" onChange={(e) => this.setState({ name: e.target.value})} />
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" className="form-control" placeholder="Enter address" onChange={(e) => this.setState({ address: e.target.value})} />
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="text" className="form-control" placeholder="Enter phone number" onChange={(e) => this.setState({ phone: e.target.value})} />
                    </div>

                    <div className="form-group">
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

                    <Button variant="contained" color="primary" onClick={this.doRegister}>
                        Đăng ký
                    </Button>
                    <p className="forgot-password text-right">
                        Already registered <a href="#">sign in?</a>
                    </p>
                </form>
            </>

        );
    }
}