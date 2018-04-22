import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiPollActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import PollCard from "./PollCard";
// import editIcon from "../img/edit.svg";

class ViewPoll extends React.Component {
  componentWillMount() {
    const token =
      this.props.appState.authToken ||
      JSON.parse(window.localStorage.getItem("authToken"));
    const pollId = this.props.match.params.id;
    // retrieve requested poll & save to app state
    this.props.api.viewPoll(token, pollId).then(result => {
      if (result.type === "VIEW_POLL_SUCCESS") {
        this.props.actions.setLoggedIn();
      }
    });
  }

  render() {
    return (
      <div>
        <Spinner cssClass={this.props.poll.spinnerClass} />
        <ModalSm
          modalClass={this.props.poll.modal.class}
          modalText={this.props.poll.modal.text}
          modalType={this.props.poll.modal.type}
          modalTitle={this.props.poll.modal.title}
          inputName={this.props.poll.modal.inputName}
          inputPlaceholder={this.props.poll.modal.inputPlaceholder}
          inputLabel={this.props.poll.modal.inputLabel}
          inputType={this.props.poll.modal.inputType}
          buttonText={this.props.poll.modal.buttonText}
          dismiss={() => {
            this.props.actions.dismissModal();
            if (
              this.props.poll.modal.type === "modal__error" &&
              this.props.poll.modal.buttonText !== "Delete"
            ) {
              this.props.history.push("/login");
            }
          }}
          redirect={this.props.poll.modal.redirect}
          action={() => {
            if (this.props.poll.modal.action) {
              this.props.poll.modal.action();
            } else {
              this.props.actions.dismissModal();
              if (this.props.poll.modal.type === "modal__error") {
                this.props.history.push("/login");
              }
            }
          }}
        />
        <div className="container poll__container">
          <PollCard
            single={true}
            owner={this.props.profile.user._id === this.props.poll.form.ownerId}
            poll={this.props.poll.form}
            history={this.props.history}
            deletePoll={this.props.api.deletePoll}
            token={this.props.appState.authToken}
            setModalError={this.props.actions.setModalError}
          />
        </div>
      </div>
    );
  }
}

ViewPoll.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    user: PropTypes.shape({
      _id: PropTypes.string
    }),
    authToken: PropTypes.string
  }).isRequired,
  actions: PropTypes.shape({
    setLoggedIn: PropTypes.func,
    dismissModal: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    viewPoll: PropTypes.func,
    deletePoll: PropTypes.func
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string
    })
  }).isRequired,
  poll: PropTypes.shape({
    form: PropTypes.shape({
      question: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
          _id: PropTypes.string
        })
      ).isRequired,
      ownerId: PropTypes.string,
      _id: PropTypes.string
    }).isRequired,
    errorMsg: PropTypes.string,
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  poll: state.poll,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewPoll)
);
