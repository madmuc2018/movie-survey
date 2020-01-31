import React from "react";
import { Button, Container } from "react-bootstrap";
import survey from "../../Data/survey";
import Slider from "../Slider";
import Rating from "react-rating";
import "../survey.css";
import symbols from "../symbols.json";

class RatePage extends React.Component {
  constructor(props) {
    super(props);

    // do NOT do this or the router stops working, WTF?
    // const movieid = parseInt(this.props.match.params.movieid);
    // const ratingstyle = this.props.match.params.ratingstyle;

    this.parse = () => {
      const movieid = parseInt(this.props.match.params.movieid);
      const ratingstyle = this.props.match.params.ratingstyle;
      return {movieid, ratingstyle};
    }

    this.handleChange = r => {
      const {movieid, ratingstyle} = this.parse();
      survey.get().selectedMovies[movieid][ratingstyle] = r;
    }

    this.onSliderEnd = () => (render, handle, value, un, percent) => {
      const {movieid, ratingstyle} = this.parse();
      survey.get().selectedMovies[movieid][ratingstyle] = value[0];
    };

    this.handleNav = nav => () => {
      const {movieid, ratingstyle} = this.parse();
      const current = symbols.ratingStyles.indexOf(ratingstyle);

      if (current < 0) {
        return this.props.history.replace("/");
      }

      if (nav === "next") {
        if (typeof survey.get().selectedMovies[movieid][ratingstyle] !== 'number') {
          return alert("Please rate the movie");
        }
        if (current < symbols.ratingStyles.length - 1) {
          return this.props.history.replace(`/rate/${movieid}/${symbols.ratingStyles[current + 1]}`);
        }

        const nextMovieid = movieid + 1;
        if (survey.get().selectedMovies[nextMovieid]) {
          return this.props.history.replace(`/rate/${nextMovieid}/${symbols.ratingStyles[0]}`);
        }
        return this.props.history.replace(`/review`);
      }

      // Back
      if (current > 0) {
        return this.props.history.replace(`/rate/${movieid}/${symbols.ratingStyles[current - 1]}`);
      }

      const prevMovieid = movieid - 1;
      if (survey.get().selectedMovies[prevMovieid]) {
        return this.props.history.replace(`/rate/${prevMovieid}/${symbols.ratingStyles[symbols.ratingStyles.length - 1]}`);
      }
      return this.props.history.replace(`/common`);
    }
  }

  render() {
    const {movieid, ratingstyle} = this.parse();
    const {name, img} = survey.get().selectedMovies[movieid];
    const rated = survey.get().selectedMovies[movieid][ratingstyle];
    return (
      <div className="text-center">
        <Container>
          <h6>Please rate the movie:</h6>
          <img src={img} alt="Poster" height="400" width="240" />
          <h6>{name}</h6>
          {
            ratingstyle === "slider" ?
              <div style={{
                marginLeft: '35%',
                marginRight: '35%'
              }}>
                <Slider
                  start={typeof rated === 'number' ? rated : 3}
                  onEnd={this.onSliderEnd}
                />
              </div>
            :
              <Rating
                stop={5}
                emptySymbol={symbols[ratingstyle].empty}
                fullSymbol={symbols[ratingstyle].full}
                onChange={this.handleChange}
                initialRating={rated}
              />
          }
          <br/>
          <span>
            <Button style={{"float":"left"}} onClick={this.handleNav("back")}>Previous</Button>
            <Button style={{"float":"right"}} onClick={this.handleNav("next")}>Next</Button>
          </span>
        </Container>
      </div>
    );
  }
}

export default RatePage;