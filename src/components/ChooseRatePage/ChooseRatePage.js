import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
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
      "choice": null
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.handleNext = () => {
      survey().chosenRate = this.state.choice;
      this.props.history.replace("/email");
    }
  }

  render() {
    return (
      <div>
        <Container>
          <h6>Your ratings will be considered very helpful into the final ratings provided by the studio, would you like to re-rate it again ? If so, which one of the rating scales would you use?</h6>
          {
            symbols.ratingStyles.map((r, i) =>
              <div key={i}>
                <Row className="justify-content-md-center">
                  <Col xs lg="1">
                    <input type="radio" name="choice" value={r} checked={this.state.choice === r} onChange={this.handleChange} />
                  </Col>
                  <Col xs lg="2">
                    {
                      r === "slider" ?
                        <Slider
                          disabled={true}
                          start={3}
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
                  </Col>
                </Row>
                <br/>
              </div>
            )
          }
          <Button style={{"float":"right"}} onClick={this.handleNext}>Submit</Button>
        </Container>
      </div>
    );
  }
}

export default LoginPage;