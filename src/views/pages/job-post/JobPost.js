import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CForm,
  CFormInput,
  CButton,
  CTableHeaderCell,
  CCard,
  CRow,
  CCol,
  CFormLabel,
  CFormTextarea,
} from '@coreui/react'
import JobService from '../../../services/JobService'
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select/Select";
import MasterDataService from "../../../services/MasterDataService";

export default class JobPost extends Component {
  constructor(props) {
    super(props)
    this.state = {
      job: {},
      exp_levels: [],
      cats: [],
      errorMessage: null,
      showAddJobDialog: false,
    }

    this.jobService = new JobService()
    this.masterDataService = new MasterDataService();
  }

  componentDidMount() {
    this.masterDataService.experienceLevels().then(res => {
      this.setState({exp_levels: res})
    })
    this.masterDataService.jobCategories().then(res => {
      this.setState({cats: res})
    })
  }

  doSubmit = () => {
    console.log(this.state.job)
    let user = JSON.parse(localStorage.getItem('user'))
    console.log(user.id)
    console.log(user)
    this.jobService
      .createJob(user.id, this.state.job)
      .then((response) => {
        console.log(response)
        this.onHideDialog()
      })
      .catch((error) => {
        console.error(error)
        this.setState({
          errorMessage: 'Lỗi hệ thống',
        })
      })
  }

  onShowDialog = () => {
    this.setState({
      showAddJobDialog: true,
    })
  }

  onHideDialog = () => {
    this.setState({
      showAddJobDialog: false,
    })
  }

  onChangeFormValue = (field, value) => {
    let job = this.state.job
    job[field] = value
    console.log(job)
    this.setState({
      job: job,
    })
  }

  createJobDialog = () => {
    return (
      <Modal show={this.state.showAddJobDialog} onHide={this.onHideDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CForm>
            <div className="mb-3">
              {this.state.errorMessage != null && (
                <CFormLabel htmlFor="title" color="danger">
                  {this.state.errorMessage}
                </CFormLabel>
              )}
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="title">Tiêu đề</CFormLabel>
              <CFormInput
                type="text"
                id="title"
                value={this.state.job.name}
                onChange={(e) => this.onChangeFormValue('title', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="description">Mô tả</CFormLabel>
              <CFormTextarea
                id="description"
                rows="3"
                value={this.state.job.description}
                onChange={(e) => this.onChangeFormValue('description', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="loc">Vị trí</CFormLabel>
              <CFormInput
                  type="text"
                  id="loc"
                  value={this.state.job.location}
                  onChange={(e) => this.onChangeFormValue('location', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="exp">Kinh nghiệm</CFormLabel><br/>
              <Select
                  labelId="exp"
                  id="exp"
                  value={this.state.exp}
                  onChange={(e) => this.onChangeFormValue('experienceLevel', { id: e.target.value })}
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
            <div className="mb-3">
              <CFormLabel htmlFor="abc">Ngành nghề</CFormLabel><br/>
              <Select
                  labelId="abc"
                  id="abc"
                  value={this.state.cat}
                  onChange={(e) => this.onChangeFormValue('jobCategory', { id: e.target.value })}
              >
                {this.state.cats.map(option => {
                  return (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                  )
                })}
              </Select>
            </div>
          </CForm>
        </Modal.Body>
        <Modal.Footer>
          <CButton color="secondary" onClick={this.onHideDialog}>
            Close
          </CButton>
          <CButton color="primary" onClick={this.doSubmit}>
            Lưu
          </CButton>
        </Modal.Footer>
      </Modal>
    )
  }
  render() {
    return (
      <>
        {this.createJobDialog()}
        <CRow className="justify-content-center">
          <CCol md={8}>
            <h1>Danh sách tuyển dụng</h1>
          </CCol>
          <CCol md={4}>
            <CButton color="info" onClick={this.onShowDialog}>
              Thêm job
            </CButton>
          </CCol>
        </CRow>
        <CCard style={{ width: '100%' }}>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Job</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ngành nghề</CTableHeaderCell>
                <CTableHeaderCell scope="col">Level</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">1</CTableHeaderCell>
                <CTableDataCell>Mark</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>@mdo</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">2</CTableHeaderCell>
                <CTableDataCell>Jacob</CTableDataCell>
                <CTableDataCell>Thornton</CTableDataCell>
                <CTableDataCell>@fat</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">3</CTableHeaderCell>
                <CTableDataCell colSpan="2">Larry the Bird</CTableDataCell>
                <CTableDataCell>@twitter</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCard>
      </>
    )
  }
}
