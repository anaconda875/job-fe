import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
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
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import JobService from '../../../services/JobService'

export default class JobList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      job: {},
      errorMessage: null,
      showAddJobDialog: false,
      tabKey: 'jobList',
      jobs: [],
    }

    this.jobService = new JobService()
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const qs = {}
    this.jobService
      .getAll(qs)
      .then((response) => {
        if (response.content) {
          this.setState({
            jobs: response.content,
          })
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
          errorMessage: error,
        })
      })
  }

  doSubmit = () => {
    this.jobService
      .createJob(this.state.job)
      .then((response) => {
        console.log(response)
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
              <CFormLabel htmlFor="title">Tên job</CFormLabel>
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
              ></CFormTextarea>
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
        <Tabs
          id="controlled-tab-example"
          activeKey={this.state.tabKey}
          onSelect={(k) => this.setState({ tabKey: k })}
          className="mb-3"
        >
          <Tab eventKey="jobList" title="Jobs">
            <CRow className="justify-content-center">
              <CCol md={8}>
                <h1>Danh sách tuyển dụng</h1>
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
                  {this.state.jobs.map((item, index) => {
                    return (
                      <CTableRow key={index}>
                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{item.title}</CTableDataCell>
                        <CTableDataCell>
                          {item.jobCategory ? item.jobCategory.name : ''}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.experienceLevel ? item.experienceLevel.name : ''}
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCard>
          </Tab>
          <Tab eventKey="appliedJob" title="Đã ứng tuyển"></Tab>
        </Tabs>
      </>
    )
  }
}
