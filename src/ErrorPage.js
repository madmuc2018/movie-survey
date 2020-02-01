import React from "react";
import { Container } from "react-bootstrap";

class ErrorPage extends React.Component {
  render() {
    return (
      <div className="vertical-center">
        <Container>
          <h3>Error :(</h3>
        </Container>
      </div>
    );
  }
}

export default ErrorPage;