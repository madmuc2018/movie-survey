import React from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import survey from "../../Data/survey";
import utils from "../utils";
import Rating from "react-rating";
import "./style.css";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = mi => r => {
      survey.get().selectedMovies[mi].commonRate = r;
    }

    this.handleNext = () => {
      if (survey.get().selectedMovies.filter(m => typeof m.commonRate !== 'number').length > 0) {
        return alert("Please rate all the movies");
      }
      this.props.history.replace(`/rate/0/color-circle`);
    }

    this.handleBack = () => {
      if (window.confirm('Are you sure? All selected movies will be cleared')) {
        survey.retain("personality");
        this.props.history.replace(`/select`);
      }
    }
  }

  render() {
    return (
      <div>
        <Container>
          <h6>Please rate the movies you have selected :</h6>
          <ListGroup 
            style={{
              overflow: "auto"
            }}
            horizontal
          >
            {
              survey.get()
                .selectedMovies
                .map((m, i) => {
                  const {name, img, commonRate} = m;
                  return <ListGroup.Item key={i}>
                    <img src={img} alt="Poster" height="400" width="240" /> <br/>
                    <h6> {name} </h6>
                      <Rating
                        initialRating={commonRate}
                        stop={5}
                        emptySymbol={utils.numberList(5).map(i => 'fa fa-star-o fa-2x survey-yellow')}
                        fullSymbol={utils.numberList(5).map(i => 'fa fa-star fa-2x survey-yellow')}
                        onChange={this.handleChange(i)}
                      />
                  </ListGroup.Item>
                })
            }
          </ListGroup>
          <br/>
          <Button style={{"float":"left"}} onClick={this.handleBack}>Previous</Button>
          <Button style={{"float":"right"}} onClick={this.handleNext}>Next</Button>
        </Container>
      </div>
    );
  }
}

export default LoginPage;