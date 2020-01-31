import React from "react";
import { Button, Container } from "react-bootstrap";
import utils from "../utils";
import survey from "../../Data/survey";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      talkative: 0,
      faultWithOthers: 0,
      thoroughJob: 0,
      depressed: 0
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: parseInt(value)
      });
    }

    this.handleNext = () => {
      survey.get().personality = utils.clone(this.state);
      this.props.history.replace("/select");
    }
  }

  render() {
    const radioRow = (option) => {
      return [0,1,2,3,4].map((v, i) =>
        <td key={i}>
          <input type="radio" name={option} value={v} checked={this.state[option] === v} onChange={this.handleChange} />
        </td>
      )
    }
    return (
      <div className="vertical-center">
        <Container>
          <p> Here are a number of characteristics that may or may not apply to you. For example, do you agree that you are someone who likes to spend time with others? Please select a box next to each statement to indicate the extent to which you agree or disagree with that statement. </p>
          <br/>
          <p> I see myself as someone who… </p>
          <table border="0" cellPadding="10">
            <tbody>
              <tr>
                <th></th>
                <th>Disagree Strongly</th>
                <th>Disagree a little</th>
                <th>Neither agree nor disagree</th>
                <th>Agree a little</th>
                <th>Agree Strongly</th>
              </tr>
              <tr>
                <td>Is talkative</td>
                { radioRow("talkative") }
              </tr>
              <tr>
                <td>Tends to find fault with others</td>
                { radioRow("faultWithOthers") }
              </tr>
              <tr>
                <td>Does a thorough job</td>
                { radioRow("thoroughJob") }
              </tr>
              <tr>
                <td>Is depressed, blue</td>
                { radioRow("depressed") }
              </tr>
            </tbody>
          </table>
          <Button style={{"float":"right"}} onClick={this.handleNext}>Next</Button>
        </Container>
      </div>
    );
  }
}

export default LoginPage;