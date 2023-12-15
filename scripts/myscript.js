let action = "remove";

var data = [
  { District: "Dobong-gu", Count: 639, Charging_Stations: 801 },
  { District: "Dongdaemun-gu", Count: 659, Charging_Stations: 992 },
  { District: "Dongjak-gu", Count: 726, Charging_Stations: 1205 },
  { District: "Eunpyeong-gu", Count: 901, Charging_Stations: 1328 },
  { District: "Gangbuk-gu", Count: 514, Charging_Stations: 633 },
  { District: "Gangdong-gu", Count: 1293, Charging_Stations: 1352 },
  { District: "Gangnam-gu", Count: 12173, Charging_Stations: 2641 },
  { District: "Gangseo-gu", Count: 1776, Charging_Stations: 1976 },
  { District: "Geumcheon-gu", Count: 561, Charging_Stations: 1098 },
  { District: "Guro-gu", Count: 3799, Charging_Stations: 1634 },
  { District: "Gwanak-gu", Count: 777, Charging_Stations: 698 },
  { District: "Gwangjin-gu", Count: 623, Charging_Stations: 638 },
  { District: "Jongno-gu", Count: 611, Charging_Stations: 775 },
  { District: "Jung-gu", Count: 968, Charging_Stations: 984 },
  { District: "Jungnang-gu", Count: 778, Charging_Stations: 1425 },
  { District: "Mapo-gu", Count: 1086, Charging_Stations: 1570 },
  { District: "Nowon-gu", Count: 896, Charging_Stations: 1520 },
  { District: "Seocho-gu", Count: 3495, Charging_Stations: 2303 },
  { District: "Seodaemun-gu", Count: 669, Charging_Stations: 905 },
  { District: "Seongbuk-gu", Count: 926, Charging_Stations: 1794 },
  { District: "Seongdong-gu", Count: 1461, Charging_Stations: 2013 },
  { District: "Songpa-gu", Count: 1988, Charging_Stations: 2345 },
  { District: "Yangcheon-gu", Count: 998, Charging_Stations: 1023 },
  { District: "Yeongdeungpo-gu", Count: 2388, Charging_Stations: 1424 },
  { District: "Yongsan-gu", Count: 968, Charging_Stations: 876 }
];

//Width and height of svg
const w = 600;
const h = 500;
const padding = 30;

// axis min / max
const xmin = 0;
const xmax = 13000;
const ymin = 0;
const ymax = d3.max(data, d => d.Charging_Stations);

//		Scale functions
const xScale = d3.scaleLinear()
  .domain([xmin, xmax])
  .range([padding + 50, w - padding * 2 + 50]);;

const yScale = d3.scaleLinear()
	.domain([ymin, ymax])
	.range([h - padding, padding]);


//Define X axis
const xAxis = d3.axisBottom()
  .scale(xScale)
  .ticks(5);

//Define Y axis
const yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(10);

//Create SVG element
const svg = d3.select("div#correlation")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

const updatestats = function() {
	const data = d3.selectAll("circle").data();
	if(data.length < 2) {
		d3.select("p#r").text("Two points are needed to calculate r.");
		return;
		}

  x = data.map(d => d.Count);
	y = data.map(d => d.Charging_Stations);

	Sxx = d3.sum(x.map(d => Math.pow(d-d3.mean(x), 2)));
	Sxy = d3.sum(x.map( (d, i) => (x[i]-d3.mean(x))*(y[i]-d3.mean(y))));
	Syy = d3.sum(y.map(d => Math.pow(d-d3.mean(y), 2)));
  corrcoef = Sxy/(Math.sqrt(Sxx)*Math.sqrt(Syy));
  d3.select("p#r").text(`r = ${corrcoef.toFixed(2)}`);
}

svg.append("rect")
  .attr("width", w)
  .attr("height", h)
  .attr("fill", "none");

//Create X axis
svg.append("g")
	.attr("transform", `translate(0, ${yScale(0)})`)
	.call(xAxis);

//Create Y axis
svg.append("g")
	.attr("transform", `translate(${xScale(0)}, 0)`)
	.call(yAxis);

svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", d => xScale(d.Count))
    .attr("cy", d => yScale(d.Charging_Stations))
    .attr("r", "3")
    .attr("fill", "red")
    .on("click", function () {
        if (action === "remove") {
          d3.select(this).remove();
          updatestats();
        }
      });

svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", w- 150)
  .attr("y", h)
  .text("Number of Electric Vehicles");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -125)
    .attr("y", 6)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .text("Number of Charging Stations");

updatestats();
//On radio button change, update styling
d3.selectAll("input")
	.on("click", function() {
	  action = d3.select(this).node().value;
  });


svg.on("click", function(event) {
  if(action === "add") {
	// add a point
	  const new_x = xScale.invert(d3.pointer(event)[0]);
	  const new_y = yScale.invert(d3.pointer(event)[1]);
	  svg.append("circle")
    .data([[new_x, new_y]])
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScale(d[1]))
      .attr("r", "3")
      .attr("fill", "red")
      .on("mouseover", function () {
        if (action === "remove") {
          d3.select(this).remove();
          updatestats();
        }
      });
    updatestats();
  }
});







