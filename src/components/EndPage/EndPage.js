import React from "react";
import { Container } from "react-bootstrap";

class EndPage extends React.Component {
  render() {
    return (
      <div>
        <Container>
          <ul>
            <li>Does the presence/ absence of colour have any effect regardless of the icons used in the rating scale?</li>
            <li>Does the presence/ absence of colour  have any effect on user rating behavior when different (expressive vs non expressive ) icons are used in the rating scale?</li>
            <li>In terms of colorful rating scale, is there any distinction in the rating behaviour of users between gradient vs discrete rating scale?</li>
            <li>Does the level of emotional stability have any tangible influence on rating behaviour of users in interpreting the features of rating scales?</li>
            <li>Does informing the users about the importance of their rating have any effect on the rating behaviour?</li>
            <li>If the users choose to reconsider their primary ratings, which medium of rating would they choose?</li>
          </ul>
        </Container>
      </div>
    );
  }
}

export default EndPage;