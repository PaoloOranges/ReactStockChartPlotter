import React from "react";

import { LineSeries } from "react-stockcharts/lib/series";


class CharCustomIndicatorRender extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      hullMAAccessor: props.hullMAAccessor,
    };    
  }

  render() 
  {
    return [
    <LineSeries yAccessor={this.state.hullMAAccessor} strokeDasharray="Solid" />,
    <LineSeries yAccessor={this.state.hullMAAccessor} strokeDasharray="Solid" />
    ];
  }
}

export { CharCustomIndicatorRender } 