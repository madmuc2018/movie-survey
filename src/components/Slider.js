import React, { Component } from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

class Slider extends Component {
  render() {
    return <div>
      <style type="text/css">
        {`
          .noUi-target {
            background-image: linear-gradient(to right, DarkRed,orange,yellow,green,SkyBlue);
          }
        `}
      </style>
      <Nouislider
        start={this.props.start}
        range={{
          min: 1,
          max: 5
        }}
        step={1}
        // pips={{
        //   mode: 'values',
        //   values: [1, 2, 3, 4, 5],
        //   density: 1
        // }}
        onEnd={this.props.onEnd()}
      />
    </div>;
  }
}

export default Slider;