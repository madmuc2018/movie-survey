import React from "react";
import { Button, Container } from "react-bootstrap";
import utils from "../utils";
import survey from "../../Data/survey";
import Rating from "react-rating";
import "../survey.css";
import symbols from "../symbols.json";
import Slider from "../Slider";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "color-circle": 0,
      "color-star": 0,
      "color-emoji": 0,
      "slider": 0,
      "circle": 0,
      "emoji": 0
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: parseInt(value)
      });
    }

    this.handleNext = () => {
      survey.get().review = utils.clone(this.state);
      this.props.history.replace("/choose");
    }

    this.handleBack = () => {
      survey.get().review = utils.clone(this.state);
      if (survey.get().selectedMovies.length > 0) {
        return this.props.history.replace(`/rate/${survey.get().selectedMovies.length - 1}/${symbols.ratingStyles[symbols.ratingStyles.length - 1]}`);
      } 
      this.props.history.replace('/select');
    }
  }

  render() {
    const radioRow = (option) => {
      return [0,1,2,3,4].map(v =>
        <td>
          <input type="radio" name={option} value={v} checked={this.state[option] === v} onChange={this.handleChange} />
        </td>
      )
    }
    return (
      <div>
        <Container>
          <h6>How would you rate your effort in rating the movies using the following scale?</h6>
          <table border="0" cellPadding="30">
            <tbody>
              <tr>
                <th></th>
                <th>Very Easy</th>
                <th>Easy</th>
                <th>Medium</th>
                <th>Hard</th>
                <th>Very Hard</th>
              </tr>
              {
                symbols.ratingStyles.map(r =>
                  <tr>
                    <td>
                    {
                      r === "slider" ?
                        <Slider
                          disabled={true}
                          start={5}
                          onEnd={() => {}}
                        />
                      :
                        <Rating
                          style={{width: "100%"}}
                          readonly
                          stop={5}
                          initialRating={5}
                          fullSymbol={symbols[r].full}
                        />
                    }
                    </td>
                    { radioRow(r) }
                  </tr>
                )
              }
            </tbody>
          </table>
          <Button style={{"float":"left"}} onClick={this.handleBack}>Back</Button>
          <Button style={{"float":"right"}} onClick={this.handleNext}>Next</Button>
        </Container>
      </div>
    );
  }
}

export default LoginPage;