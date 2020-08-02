// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 30,
  bottom: 120,
  left: 120
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);
  
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label ------------------------------ X
function xScale(csvData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([
        d3.min(csvData, d => d[chosenXAxis]) * 0.9,
        d3.max(csvData, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating y-scale var upon click on axis label ------------------------------ Y
function yScale(csvData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([
            d3.min(csvData, d => d[chosenYAxis]) * 0.9, 
            d3.max(csvData, d => d[chosenYAxis]) * 1.1
        ])
        .range([height, 0]);
  
    return yLinearScale;
  
  }
  
// function used for updating xAxis var upon click on axis label ------------------------------ X
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
// function used for updating yAxis var upon click on axis label ------------------------------ Y
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to------------------------------ X
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
      console.log("renderCirclesX");
    return circlesGroup;
}

function renderCirclesXText(circlesGroupText, newXScale, chosenXAxis) {

    circlesGroupText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
    console.log("renderCirclesXText");
    return circlesGroupText;
}

// function used for updating circles group with a transition to ------------------------------ Y
// new circles
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
      console.log("renderCirclesY");
    return circlesGroup;
}

function renderCirclesYText(circlesGroupText, newYScale, chosenYAxis) {

    circlesGroupText.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis])+4);
    console.log("renderCirclesYText");
    return circlesGroupText;
}


// function used for updating circles group with a transition to------------------------------ X
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
      console.log("renderCirclesX");
    return circlesGroup;
}

function renderCirclesXText(circlesGroupText, newXScale, chosenXAxis) {

    circlesGroupText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
    console.log("renderCirclesXText");
    return circlesGroupText;
}



function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesGroupText) {

    var label;

    if (chosenXAxis === "poverty") {
        xLabel = "Poverty: ";
    }
    else if (chosenXAxis === "age") {
        xLabel = "Age: ";
    }
    else {
        xLabel = "Income: ";
    };

    if (chosenYAxis === 'healthcare'){
        yLabel = "Healthcare: ";
    }
    else if (chosenYAxis === 'smokes'){
        yLabel = "Smokes: ";
    }
    else{
        yLabel = "Obesity: ";
    };

    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    // .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>
                ${xLabel} ${d[chosenXAxis]}<br>
                ${yLabel} ${d[chosenYAxis]}<br>
                `);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    circlesGroupText.call(toolTip);

    circlesGroupText.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  return circlesGroup;
}





d3.csv("./assets/data/data.csv").then(function(csvData, err) {

    if(err) throw err;

    // Print the csvData
    console.log(csvData);
  
    // Cast the value to a number for each piece of csvData
    csvData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.abbr = data.abbr;
        data.income = +data.income;
    });

    var xLinearScale = xScale(csvData, chosenXAxis);
    
    var yLinearScale = yScale(csvData, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
        
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", function() {
            return "hsl(" + Math.random() * 360 + ",100%,50%)";
            })
        .attr("opacity", ".7");

    var circlesGroupText = chartGroup.selectAll("stateText")
        .data(csvData)
        .enter()
        .append("text")
        .classed('stateText', true)
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+4)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px");

    // Create group for three x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");


    // Create group for Three y-axis labels
    var labelsGroupY = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var healthcareLabel = labelsGroupY.append("text")
        // .attr("transform", "rotate(-90)")
        .attr("y", 60 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    var smokeLabel = labelsGroupY.append("text")
        // .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smoke (%)");
    var obeseLabel = labelsGroupY.append("text")
        // .attr("transform", "rotate(-90)")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesGroupText);

    // x axis labels event listener  ------------------------------ X
    labelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(csvData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

            circlesGroupText = renderCirclesXText(circlesGroupText, xLinearScale, chosenXAxis);
            
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesGroupText);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                .classed("active", true)
                .classed("inactive", false);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenXAxis === "age") {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", true)
                .classed("inactive", false);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            }
        }
    });

    // y axis labels event listener ------------------------------ Y
    labelsGroupY.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenYAxis with value
            chosenYAxis = value;

            // console.log(chosenYAxis)

            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(csvData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroupY = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

            circlesGroupYText = renderCirclesYText(circlesGroupText, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesGroupText);

            // changes classes to change bold text
            if (chosenYAxis === "healthcare") {
                healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
                smokeLabel
                .classed("active", false)
                .classed("inactive", true);
                obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
                smokeLabel
                .classed("active", true)
                .classed("inactive", false);
                obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
                healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
                smokeLabel
                .classed("active", false)
                .classed("inactive", true);
                obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            }
        }
    });

  })
  
  .catch(function(error) {
    console.log(error);
  });
  