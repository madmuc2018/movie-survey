import React from "react";
import { Button, Container } from "react-bootstrap";
import AsyncAwareContainer from "../AsyncAwareContainer";
import api from "../../Data/api";

class AskEmailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleNext = () => {
      this.props.history.replace("/email");
    }

    this.handlExit = async () => {
      try {
        this.setState({loading: 'Submitting ...'});
        await api.submit();
        this.props.history.replace("/end");
      } catch (error) {
        alert(error.message);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }
  }

  componentWillUnmount() {
    this.componentUnmounted = true;
  }

  render() {
    return (
      <AsyncAwareContainer loading={this.state.loading}>
        <Container>
          <h6> In appreciation of your participation, we would like to offer you the opportunity to enter in a raffle to win $50 gift vouchers. You need to provide your email id if you  want to enter in the raffle draw. If you do not wish to participate in the raffle, you may skip this step and exit the survey.
          </h6>
          <h6>Do you wish to participate in the survey?</h6>
          <br/><br/>
          <Button style={{"float":"left"}} onClick={this.handleNext}>Yes and go to next page</Button>
          <Button style={{"float":"right"}} onClick={this.handlExit}>No and EXIT</Button>
        </Container>
      </AsyncAwareContainer>
    );
  }
}

export default AskEmailPage;