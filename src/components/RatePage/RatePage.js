import React from "react";
import { Button, Container } from "react-bootstrap";
import survey from "../../Data/survey";
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
      const m = parseInt(this.props.match.params.movieid);
      const r = this.props.match.params.ratingstyle;
       return { m, r };
    }

    this.handleChange = rating => {
      const { m, r } = this.parse();
      survey.get().selectedMovies[m][r] = rating;
    }

    this.handleNav = () => {
      const { m, r } = this.parse();
      if (typeof survey.get().selectedMovies[m][r] !== 'number') {
        return alert("Please rate the movie");
      }

      if (survey.get().navSequence.length > 0) {
        const { movieid, ratingstyle } = survey.get().navSequence.pop();
        return this.props.history.replace(`/rate/${movieid}/${ratingstyle}`);
      }
      return this.props.history.replace(`/reviewoverall`);
    }
  }

  render() {
    const {m, r} = this.parse();
    const {name, img} = survey.get().selectedMovies[m];
    const rated = survey.get().selectedMovies[m][r];
    return (
      <div className="text-center">
        <Container>
          <h6>Please rate the movie:</h6>
          <img src={img} alt="Poster" height="400" width="240" />
          <h6>{name}</h6>
          {
            <Rating
              stop={5}
              emptySymbol={symbols[r].empty}
              fullSymbol={symbols[r].full}
              onChange={this.handleChange}
              initialRating={rated}
            />
          }
          <br/>
          <span>
            <Button style={{"float":"right"}} onClick={this.handleNav}>Next</Button>
          </span>
        </Container>
      </div>
    );
  }
}

export default RatePage;