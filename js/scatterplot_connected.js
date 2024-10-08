// --------------------------------------
//  Canvas
// --------------------------------------

const svg6 = d3
  .select("#chart6")
  .append("svg")
  .attr("viewBox", [0, 0, width2, height2]);

const innerChart6 = svg6
  .append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

var count = 0;

function uid(name) {
  return new Id("O-" + (name == null ? "" : name + "-") + ++count);
}

function Id(id) {
  this.id = id;
  this.href = new URL(`#${id}`, location) + "";
}

Id.prototype.toString = function () {
  return "url(" + this.href + ")";
};

// --------------------------------------
// Data loading
// --------------------------------------

const data6 = d3
  .csv("../data/metros.csv", (d) => {
    return {
      POP_1980: +d.POP_1980,
      POP_2015: +d.POP_2015,
      R90_10_1980: +d.R90_10_1980,
      R90_10_2015: +d.R90_10_2015,
      highlight: +d.highlight,
      nyt_display: d.nyt_display,
    };
  })
  .then((data) => {
    // console.log(data);

    const startColor = d3.schemeCategory10[2];
    // console.log(startColor);
    const endColor = d3.schemeCategory10[4];
    // console.log(endColor);
    const gradientIds = data.map(() => uid("gradient"));
    // console.log(gradientIds);
    // const arrowId = DOM.uid("arrow");
    // console.log(arrowId);

    // --------------------------------------
    //  Scales
    // --------------------------------------

    const x = d3
      .scaleLog()
      .domain(d3.extent(data.flatMap((d) => [d.POP_1980, d.POP_2015])))
      .range([0, innerwidth2]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data.flatMap((d) => [d.R90_10_1980, d.R90_10_2015])))
      .range([innerheight2, 0]);

    // --------------------------------------
    //  Axes
    // --------------------------------------

    innerChart6
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerheight2})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(10));

    innerChart6
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(0, 5)`)
      .call(d3.axisLeft(y).tickSize(0).tickPadding(10).ticks(3));

    innerChart6
      .append("defs")
      .selectAll()
      .data(data)
      .join("linearGradient")
      .attr("id", (d, i) => gradientIds[i].id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", (d) => x(d.POP_1980))
      .attr("x2", (d) => x(d.POP_2015))
      .attr("y1", (d) => y(d.R90_10_1980))
      .attr("y2", (d) => y(d.R90_10_2015))
      .call((g) =>
        g.append("stop").attr("stop-color", "#F20666").attr("stop-opacity", 0.3)
      )
      .call((g) =>
        g.append("stop").attr("offset", "100%").attr("stop-color", "#06D6A0")
      );

    innerChart6
      .selectAll()
      .data(data)
      .join("circle")
      .attr("r", 1)
      .attr("fill", "#F20666")
      .attr("cx", (d) => x(d.POP_1980))
      .attr("cy", (d) => y(d.R90_10_1980));

    innerChart6
      .selectAll()
      .data(data)
      .join("circle")
      .attr("r", 1)
      .attr("fill", "#06D6A0")
      .attr("cx", (d) => x(d.POP_2015))
      .attr("cy", (d) => y(d.R90_10_2015));

    innerChart6
      .attr("text-anchor", "middle")
      .attr("font-size", 9)
      .selectAll()
      .data(data.filter((d) => d.highlight))
      .join("text")
      .attr("fill", "white")
      .attr("dy", (d) => (d.R90_10_1980 > d.R90_10_2015 ? "1.2em" : "-0.5em"))
      .attr("dx", (d) => "-1.5em")
      .attr("x", (d) => x(d.POP_2015))
      .attr("y", (d) => y(d.R90_10_2015))
      .text((d) => d.nyt_display);

    function arc(x1, y1, x2, y2) {
      const r = Math.hypot(x1 - x2, y1 - y2) * 2;
      return `M${x1},${y1} A${r},${r} 0,0,1 ${x2},${y2}`;
    }

    innerChart6
      .append("g")
      .attr("fill", "none")
      .selectAll()
      .data(data)
      .join("path")
      .attr("stroke", "green")
      .attr(
        "stroke",
        (d, i) => /*console.log(gradientIds[i]) ||*/ gradientIds[i]
      )
      .attr("d", (d) =>
        arc(x(d.POP_1980), y(d.R90_10_1980), x(d.POP_2015), y(d.R90_10_2015))
      );
  });
