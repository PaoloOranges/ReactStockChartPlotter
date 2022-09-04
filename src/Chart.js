
import React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { LineSeries, ScatterSeries, SquareMarker, TriangleMarker } from "react-stockcharts/lib/series";

import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";

class CustomChart extends React.Component {
	render() {
		const { type, width, data, ratio} = this.props;
		const xAccessor = d => d.date;
		const xExtents = [
			xAccessor(last(data)),
			xAccessor(data[data.length - 250])
		];
		const buyOrderAccessor = d => {
			if(d.order !== undefined && d.order.Direction === 0)
			{
				return d.order.Price;
			}
		}

		const sellOrderAccessor = d => {
			if(d.order !== undefined && d.order.Direction === 1)
			{
				return d.order.Price;
			}
		}
		return (
			<ChartCanvas height={600}
					ratio={ratio}
					width={width}
					margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
					type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={xAccessor}
					xScale={scaleTime()}
					xExtents={xExtents}>

				<Chart id={1} yExtents={d => [d.close, d.close]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" ticks={5} />
					{/* <CandlestickSeries width={timeIntervalBarWidth(utcDay)}/> */}

					<LineSeries yAccessor={d => d.close} strokeDasharray="Solid" />
					<ScatterSeries yAccessor={buyOrderAccessor} marker={SquareMarker} markerProps={{ width: 10, stroke: "#34eb5e", fill: "#34eb93" }} />
					<ScatterSeries yAccessor={sellOrderAccessor} marker={TriangleMarker} markerProps={{ width: 10, stroke: "#eb3434", fill: "#eb7434" }} />
				</Chart>

			</ChartCanvas>
		);
	}
}

CustomChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CustomChart.defaultProps = {
	type: "svg",
};
CustomChart = fitWidth(CustomChart);

export default CustomChart;
