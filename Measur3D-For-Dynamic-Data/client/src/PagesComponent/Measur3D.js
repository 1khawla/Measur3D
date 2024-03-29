import React, { Component } from "react";
import axios from "axios";

import SplitPane from "react-split-pane";

import ThreeScene from "../Measur3DComponent/ThreeScene";
import Modal from "../Measur3DComponent/Modal";
import AttributesManager from "../Measur3DComponent/AttributesManager";
import Chart from "../Measur3DComponent/Chart";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";

import { EventEmitter } from "../Measur3DComponent/events";

import logo_ugeom from "../images/logo_geomatics.png";
import logo_app from "../images/logo_app_white.png";

// eslint-disable-next-line
import styles from "./Measur3D.css";

class Measur3D extends Component {
  constructor() {
    super();

    this.showSuccess = this.showSuccess.bind();
    this.showInfo = this.showInfo.bind();
    this.showModal = this.showModal.bind();

    this.showError = this.debounce(this.showError.bind(this), 3000);

    this.uploadFile = this.uploadFile.bind();

    EventEmitter.subscribe("error", (event) => this.showError(event));
    EventEmitter.subscribe("success", (event) => this.showSuccess(event));
    EventEmitter.subscribe("info", (event) => this.showInfo(event));

    EventEmitter.subscribe("showModal", (event) => this.showModal(event));
  }

  state = {
    show: false,
    modal_label: "",
    errorMessage: "",
    successMessage: "",
    infoMessage: "",
    showingAlert: false,
  };

  debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  showError = (err) => {
    this.setState({
      errorMessage: err,
      showingAlert: true,
    });

    setTimeout(() => {
      this.setState({
        showingAlert: false,
      });
    }, 3000);
  };

  showSuccess = (msg) => {
    this.setState({
      successMessage: msg,
      showingAlert: true,
    });

    setTimeout(() => {
      this.setState({
        showingAlert: false,
      });
    }, 3000);
  };

  showInfo = (msg) => {
    this.setState({
      infoMessage: msg,
      showingAlert: true,
    });

    setTimeout(() => {
      this.setState({
        showingAlert: false,
      });
    }, 3000);
  };

  showModal = (label) => {
    // eslint-disable-next-line
    if (this.state.show == false) {
      this.setState({
        modal_label: label,
      });
    }

    this.setState({
      show: !this.state.show,
    });
  };

  uploadFile = (file) => {
    this.setState({ file: file });
  };

  render() {
    return (
      <Container>
        <React.Fragment>
          <div id="ThreeScene">
            <a href="http://geomatics.ulg.ac.be/home.php" rel="noopener">
              <img src={logo_ugeom} className="logo_ugeom" alt="logo_ugeom" />
            </a>
            <ThreeScene />
          </div>
          <div id="bottomPane">
            <SplitPane split="vertical" minSize="50%" defaultSize="69%">
             
             <SplitPane split="vertical" minSize="50%" defaultSize="43.8%">
              <div id="AttributesManager">
                <AttributesManager />
              </div>
              <div id="Chart">
                <Chart />
              </div>
            </SplitPane>
            <img id="logo_app" src={logo_app} className="logo_app" alt="logo_app" />
            </SplitPane>
          </div>
          <Modal
            onClose={this.showModal}
            show={this.state.show}
            onClickOutside={this.showModal}
          >
            {this.state.modal_label}
          </Modal>
        </React.Fragment>
        <Collapse in={this.state.showingAlert}>
          {this.state.errorMessage && this.state.showingAlert ? (
            <Alert className="Alert" severity="error">
              {this.state.errorMessage}
            </Alert>
          ) : null}
          {this.state.successMessage && this.state.showingAlert ? (
            <Alert className="Alert" severity="success">
              {this.state.successMessage}
            </Alert>
          ) : null}
          {this.state.infoMessage && this.state.showingAlert ? (
            <Alert className="Alert" severity="info">
              {this.state.infoMessage}
            </Alert>
          ) : null}
        </Collapse>
      </Container>
    );
  }
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error || !error?.response) return;

    if (error.response.status === 429) {
      EventEmitter.dispatch("error", error.response.data);
    }
    return Promise.reject(error.message);
  }
);

export default Measur3D;
