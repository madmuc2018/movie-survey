import React from "react";
import { Button, Jumbotron } from "react-bootstrap";
import survey from "../../Data/survey";

class SadHappyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "choice": null
    };

    this.handleChange = event => {
      const { value } = event.target;
      this.setState({
        choice: parseInt(value)
      });
    }

    this.handleNext = () => {
      survey.get()[this.props.saveAs] = this.state.choice;
      this.props.history.replace(this.props.nextRoute);
    }
  }

  render() {
    const radioRow = () =>
      [1,2,3].map((v, i) =>
        <td key={i}>
          <input type="radio" value={v} checked={this.state.choice === v} onChange={this.handleChange} />
        </td>
      )
    return (
      <div className="text-center">
        <Jumbotron fluid>
          <h5>On a scale of 1 to 3, how happy or sad are you feeling right now?</h5>
          <table style={{
            marginLeft: "auto",
            marginRight: "auto",
          }} border="0" cellPadding="10">
            <tbody>
              <tr>
                <th></th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th></th>
              </tr>
              <tr>
                <td>Sad</td>
                {radioRow()}
                <td>Happy</td>
              </tr>
            </tbody>
          </table>
          <Button style={{"float":"right"}} onClick={this.handleNext}>Next</Button>
        </Jumbotron>
      </div>
    );
  }
}

export default SadHappyPage;