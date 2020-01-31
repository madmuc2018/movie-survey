import React from "react";
import { Button, Container } from "react-bootstrap";
import FormRow from "../FormRow";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.handleNext = () => {
      this.props.history.replace("/select");
    }
  }

  render() {

    return (
      <div>
        <Container>
          <h6> In appreciation of your participation, we would like to offer you the opportunity to enter in a raffle to win $50 gift vouchers. You need to provide your email id if you  want to enter in the raffle draw. If you do not wish to participate in the raffle, you may skip this step and exit the survey. </h6>
          <br/><br/>
          <FormRow name="email" onChange={this.handleChange} />
          <Button style={{"float":"right"}} onClick={this.handleNext}>Submit</Button>
        </Container>
      </div>
    );
  }
}

export default LoginPage;