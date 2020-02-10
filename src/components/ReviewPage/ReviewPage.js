import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import survey from "../../Data/survey";
import symbols from "../symbols.json";

class ReviewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {}
    };

    this.getMovie = () => survey.get().selectedMovies[parseInt(this.props.match.params.movieid)]

    this.getSelected = () => Object.keys(this.state.selected).map(i => parseInt(i))

    this.handleChange = event => {
      const { name, checked } = event.target;
      const selected = this.state.selected;

      if (!checked) {
        delete selected[name];
      } else {
        selected[name] = true;
      }

      this.setState({
        selected
      });
    }

    this.handleNext = () => {
      if (Object.keys(this.state.selected).length === 0) {
        return alert("Please select");
      }

      const movie = this.getMovie();
      const selectedScores = this.getSelected();
      const chosenScores = [];
      symbols.allRatingStyles
        .forEach((r, i) => selectedScores.indexOf(movie[r]) > -1 && chosenScores.push(i));
      this.getMovie().chosenRatings = chosenScores;

      if (survey.get().reviewSequence.length > 0) {
        this.props.history.replace(`/review/${survey.get().reviewSequence.shift()}`);
        return this.setState({selected: {}});
      }
      this.props.history.replace(`/askemail`);
    }
  }

  render() {
    const movie = this.getMovie();
    return (
      <div className="text-center">
        <Container>
          <h6>For the movies that you rated so far using 6 different scales, all the 6 numeric values of your ratings will appear for each movie. please select all the boxes which have the value you think is best suited for the movie:</h6>
          <img src={movie.img} alt="Poster" height="400" width="240" />
          <h6>{movie.name}</h6>
          {
            symbols.allRatingStyles.map((r, i) =>
              <div key={i}>
                <Row className="justify-content-md-center">
                  <Col xs lg="1">
                    <input type="checkbox" name={movie[r]} checked={this.getSelected().indexOf(movie[r]) > -1} onChange={this.handleChange} />
                  </Col>
                  <Col xs lg="1">
                    <h5>{movie[r]}</h5>
                  </Col>
                </Row>
                <br/>
              </div>
            )
          }
          <Button style={{"float":"right"}} onClick={this.handleNext}>Next</Button>
        </Container>
      </div>
    );
  }
}

export default ReviewPage;