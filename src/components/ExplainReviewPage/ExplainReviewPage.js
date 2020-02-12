import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import survey from "../../Data/survey";
import utils from "../utils";

class ExplainReviewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.handleNext = () => {
      survey.get().reviewSequence = utils.numberList(survey.get().selectedMovies.length);
      this.props.history.replace(`/review/${survey.get().reviewSequence.shift()}`);
    }
  }

  render() {
    return (
      <div className="vertical-center">
        <Container>
          <h6>For the movies that you rated so far using 6 different scales, all the 6 numeric values of your ratings will appear for each movie. If the ratings appear different for different scales, please select the value you think is best suited for the movie.</h6>
          <h6>For example, let us assume you have given the movie Deadpool the following 6 different values for 6 rating scales:</h6>
          <img src={"https://www.dvd-trailers.gr/dvd/deadpool_2016.jpg"} alt="Poster" height="400" width="240" />
          {
            [3,3,4,3,4,4].map((r, i) =>
              <div key={i}>
                <Row className="justify-content-md-center">
                  <Col xs lg="1">
                    <input type="checkbox" />
                  </Col>
                  <Col xs lg="1">
                    <h5>{r}</h5>
                  </Col>
                </Row>
                <br/>
              </div>
            )
          }
          <h6>If you think out of these values, 4 is the best rate for this movie, then please select 3rd, 4th and last check boxes since they have the value 4. If you have provided same value for a movie, i.e. all 6 boxes are same, then kindly select all boxes</h6>
          <Button style={{"float":"right"}} onClick={this.handleNext}>Next</Button>
        </Container>
      </div>
    );
  }
}

export default ExplainReviewPage;