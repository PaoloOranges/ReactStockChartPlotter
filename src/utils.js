

import { tsvParse, csvParse,  } from  "d3-dsv";
import { timeParse } from "d3-time-format";
import { object } from "prop-types";

const jsonData = require('./data/data.json');

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");
const parseDateEpoch = timeParse("%s");

export function getData() {
	const promiseMSFT = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}

export function getDataLocal() {
	let newData = [];

	newData = jsonData.Charts.ETHEUR.Series.Price.Values.map( v => 
		({ date: parseDateEpoch(v.x),
		   close: v.y})
	);
	
	newData = parseAndFillOrders(newData, jsonData.Orders);
	parseAndFillIndicators(newData, jsonData.Charts.Indicators.Series);

	return newData;
}

function parseAndFillOrders(dataArray, orders)
{
	for (const [key, value] of Object.entries(orders))
	{
		const parseDateOrder = timeParse("%Y-%m-%dT%H:%M:%SZ");

		const date = parseDateOrder(value.Time);
		let index = dataArray.findIndex(d => d.date.getTime() === date.getTime());
		if(index !== -1)
		{
			const newObj = { ...dataArray[index], order: value};
			dataArray[index] = newObj;
		}
	}

	return dataArray
}

function parseAndFillIndicators(dataArray, indicators)
{
	for (const [key, value] of Object.entries(indicators))
	{
		console.log("Indicator: " + key);
		const indicator = value.Values.map( v =>
						({ date: parseDateEpoch(v.x),
						   value: v.y})
		);
		
		for(const entry of indicator)
		{
			let index = dataArray.findIndex(d => d.date.getTime() === entry.date.getTime());
			if(index !== -1)
			{	
				const indicatorSection = dataArray[index].indicators !== undefined ? dataArray[index].indicators : new Object();
				indicatorSection[key] = entry.value;
				const newObj = { ...dataArray[index], indicators : indicatorSection };
				dataArray[index] = newObj;
			}
		}
	}
}