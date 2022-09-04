

import { tsvParse, csvParse,  } from  "d3-dsv";
import { timeParse } from "d3-time-format";

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

export function getData() {
	const promiseMSFT = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}

export function getDataLocal() {
	const parseDateEpoch = timeParse("%s");

	const dataParsed = new Object();
	let newData = [];

	newData = jsonData.Charts.ETHEUR.Series.Price.Values.map( v => 
		({ date: parseDateEpoch(v.x),
		   close: v.y})
	);
	
	dataParsed.Indicators = jsonData.Charts.Indicators;
	dataParsed.Orders = jsonData.Orders;

	let startIndex = 0;
	for (const [key, value] of Object.entries(jsonData.Orders))
	{
		// 2021-10-20T00:00:00Z
		const parseDateOrder = timeParse("%Y-%m-%dT%H:%M:%SZ");

		const date = parseDateOrder(value.Time);
		let index = newData.findIndex(d => d.date.getTime() === date.getTime());
		console.log(index);
	}
	return newData;
}