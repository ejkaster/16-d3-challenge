// @TODO: YOUR CODE HERE!


// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  const svgArea = d3.select("body").select("svg");


// clear svg is not empty
if (!svgArea.empty()) {
  svgArea.remove();
}

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.
const svgWidth = window.innerWidth;
const svgHeight = window.innerHeight;

const margin = {
  top: 50,
  bottom: 50,
  right: 50,
  left: 50
};

const height = svgHeight - margin.top - margin.bottom;
const width = svgWidth - margin.left - margin.right;

// Append SVG element
const svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  // Append group element
  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv('assets/data/data.csv').then(function(stateData){
  console.log(stateData);


       stateData.forEach(data => {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });
      
        // set X-Scale to be linear
        const xLinearScale = d3.scaleLinear()
        .domain([(d3.min(stateData, d=> d.poverty)-2), d3.max(stateData, d => d.poverty)])  
        .range([0, width]);     

        //set Y-Scale to be linear
        const yLinearScale = d3.scaleLinear()
        .domain([(d3.min(stateData, d=> d.healthcare)-2), d3.max(stateData, d => d.healthcare)])
        .range([height, 0]); 

        // create axes
        const xAxis = d3.axisBottom(xLinearScale);
        const yAxis = d3.axisLeft(yLinearScale);

        // append axes
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        chartGroup.append("g")
        .call(yAxis);

        // append circles
        const circlesGroup = chartGroup.selectAll("circle")
          .data(stateData)
          .enter()
          .append("circle")
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", "10")
          .classed("stateCircle", true)
          .attr("opacity", "1");

        const sliceData1 = stateData.slice(0,10);
        const sliceData2 = stateData.slice(20,40);
        const sliceData3 = stateData.slice(40,51);

        sliceData1.forEach(data => {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
        });

        // Data Binding
        const textGroup = chartGroup.selectAll("null")
          .data(stateData)
          .enter()
          .append("text")         
          .attr("x", d => xLinearScale(d.poverty))
          .attr("y", d => yLinearScale(d.healthcare-0.1))
          .attr("font-size", "10px")
          .text(d => d.abbr)
          .classed("stateText", true);


    

        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .classed('axisText', true)
          .text("Lacks Healthcare (%)");

        chartGroup.append("text")
          .attr("transform", `translate(${(width / 2)}, ${height + margin.top -7 })`)
          .attr("class", "axisText")
          .classed('axisText', true)
          .text("In Poverty (%)");


  

    }).catch(function (error) {
      console.log(error);
        

  });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
