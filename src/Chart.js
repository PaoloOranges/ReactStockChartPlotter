
import React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { curveMonotoneX } from "d3-shape";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { utcDay } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries, LineSeries, ScatterSeries, SquareMarker, TriangleMarker } from "react-stockcharts/lib/series";

import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY
  } from "react-stockcharts/lib/coordinates";

  import {
	MovingAverageTooltip
  } from "react-stockcharts/lib/tooltip";

import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { createVerticalLinearGradient, hexToRGBA } from "react-stockcharts/lib/utils";

import { CharCustomIndicatorRender } from "./CharCustomIndicatorRender.js"

const canvasGradient = createVerticalLinearGradient([
	{ stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
	{ stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
	{ stop: 1, color: hexToRGBA("#4286f4", 0.8) },
]);

function indicatorAccess(indicatorName, element)
{
	if(element.indicators !== undefined && element.indicators[indicatorName] !== undefined)
	{
		return element.indicators[indicatorName];
	}
}

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

		const hullMAAccessor = d => indicatorAccess('HullMA', d);
		const lsmaAccessor = d => indicatorAccess('LSMA', d);
		const wmaAccessor = d => indicatorAccess('WMA', d);

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

					<MovingAverageTooltip
						onClick={(e) => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: hullMAAccessor,
								type: "HullMA",
								stroke: "#ff7f0e",								
								echo: "some echo here"
							},
						]}
					/>

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
					/>
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format("r")}
					/>

					<AreaSeries yAccessor={d => d.close} strokeDasharray="Solid" strokeWidth={2} interpolation={curveMonotoneX}	canvasGradient={canvasGradient} />
					<ScatterSeries yAccessor={buyOrderAccessor} marker={SquareMarker} markerProps={{ width: 10, stroke: "#34eb5e", fill: "#34eb93" }} />
					<ScatterSeries yAccessor={sellOrderAccessor} marker={TriangleMarker} markerProps={{ width: 10, stroke: "#eb3434", fill: "#eb7434" }} />
					
					{/* <CharCustomIndicatorRender hullMAAccessor={hullMAAccessor}/> */}
					<LineSeries yAccessor={hullMAAccessor} strokeDasharray="Solid" stroke="#ff7f0e"/>
					<LineSeries yAccessor={lsmaAccessor} strokeDasharray="Solid" stroke="#fcf63d"/>
					<LineSeries yAccessor={wmaAccessor} strokeDasharray="Solid" stroke="#46fc3d"/>

				</Chart>
				<CrossHairCursor />
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
