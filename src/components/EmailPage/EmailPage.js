import React from "react";
import { Button, Container } from "react-bootstrap";
import FormRow from "../FormRow";
import survey from "../../Data/survey";
import api from "../../Data/api";

class EmailPage extends React.Component {
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

    this.handleSubmit = async () => {
      try {
        this.setState({loading: 'Submitting ...'});
        survey.get().email = this.state.email;
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
      <div>
        <Container>
          <h6> Please provide your email id to participate in the raffle draw selection: </h6>
          <br/><br/>
          <FormRow name="email" onChange={this.handleChange} />
          <Button style={{"float":"right"}} onClick={this.handleSubmit}>Submit</Button>
        </Container>
      </div>
    );
  }
}

export default EmailPage;