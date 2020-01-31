import React from "react";
import { Button, Container, Card, CardColumns } from "react-bootstrap";
import movies from "../../Data/movies.json";
import survey from "../../Data/survey";

class SelectMoviesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {}
    };

    this.handleChange = event => {
      const { name, checked } = event.target;
      const selected = this.state.selected;

      if (!checked) {
        delete selected[name];
      } else if (Object.keys(selected).length === 20) {
        event.target.checked = undefined;
        return alert("You can only select up to 20 movies");
      } else {
        selected[name] = true;
      }

      this.setState({
        selected
      });
    }

    this.handleNext = () => {
      if (Object.keys(this.state.selected).length === 0) {
        return alert("Please select movies");
      }
      if (Object.keys(this.state.selected).length < 5) {
        return alert("Please select more than 4 movies"); 
      }
      survey.get().selectedMovies = Object
        .keys(this.state.selected)
        .map(i => movies[parseInt(i)]);
      this.props.history.replace("/common");
    }

    this.handleBack = () => {
      survey.reset();
      this.props.history.replace("/personality");
    }
  }

  render() {
    return (
      <div>
        <Container>
          <h6>Instructions:</h6>
          <h6>We are going to show you set of 5 movies at a time. Please choose the movies you have watched before from the given list.</h6>
          <CardColumns>
            {
              movies.map(({name, img}, i) =>
                <Card key={i}>
                  <Card.Body>
                    <img src={img} alt="Poster" height="400" width="240" />
                  </Card.Body>
                  <Card.Footer>
                    <h6>{name} <input type="checkbox" name={i} onChange={this.handleChange} /></h6>
                  </Card.Footer>
                </Card>
              )
            }
          </CardColumns>
          <Button style={{"float":"left"}} onClick={this.handleBack}>Back</Button>
          <Button style={{"float":"right"}} onClick={this.handleNext}>Next</Button>
        </Container>
      </div>
    );
  }
}

export default SelectMoviesPage;