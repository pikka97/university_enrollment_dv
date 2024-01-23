// // Load bar data
// Load bar data
d3.csv('/data/bar_data.csv').then(function(data) {
    const width = 800;
    const height = 400;

    const svg = d3.select("#stacked-bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Set up scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.incomegroup))
        .range([50, width - 50])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total_fields)])
        .range([height - 50, 50]);

    // Set up color scale
    const colorScale = d3.scaleOrdinal()
        .range(d3.schemeCategory10);

    // Draw stacked bars
    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", d => xScale(d.incomegroup))
        .attr("y", d => yScale(d.total_fields))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.total_fields) - 50)
        .attr("fill", d => colorScale(d.incomegroup))
        .on("mouseover", function(d) {
            let tooltip = d3.select("body").select(".tooltip");
            if (!tooltip.empty()) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                tooltip.remove();
            }

            tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            tooltip.transition()
                .duration(250)
                .style("opacity", 1);

            tooltip.html(`Income Group: ${d.incomegroup}<br>Total Fields: ${parseInt(d.total_fields)}`)
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1] + 120 ) + "px");
        })
        .on("mouseout", function() {
            const tooltip = d3.select("body").select(".tooltip");
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(yScale));
});

// d3.csv('/data/bar_data.csv').then(function(data) {
//     const width = 800;
//     const height = 400;

//     const svg = d3.select("#stacked-bar-chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Set up scales
//     const xScale = d3.scaleBand()
//         .domain(data.map(d => d.incomegroup))
//         .range([50, width - 50])
//         .padding(0.1);

//     const yScale = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d.total_fields)])
//         .range([height - 50, 50]);

//     // Set up color scale
//     const colorScale = d3.scaleOrdinal()
//         .range(d3.schemeCategory10);

//     // Draw stacked bars
//     svg.selectAll("rect")
//         .data(data)
//         .enter().append("rect")
//         .attr("x", d => xScale(d.incomegroup))
//         .attr("y", d => yScale(d.total_fields))
//         .attr("width", xScale.bandwidth())
//         .attr("height", d => height - yScale(d.total_fields) - 50)
//         .attr("fill", d => colorScale(d.incomegroup))
//         .on("mouseover", function(d) {
//             const tooltip = d3.select("body")
//                 .append("div")
//                 .attr("class", "tooltip")
//                 .style("opacity", 0);

//             tooltip.transition()
//                 .duration(250)
//                 .style("opacity", 1);

//             tooltip.html(`Income Group: ${d.incomegroup}\nTotal Fields: ${d.total_fields}`)
//                 .style("left", (d3.mouse(this)[0]) + "px")
//                 .style("top", (d3.mouse(this)[1] + 150)  + "px");
//         })
//         .on("mouseout", function() {
//             const tooltip = d3.select("stacked-bar-chart").select(".tooltip");
//             tooltip.transition()
//                 .duration(500)
//                 .style("opacity", 0);
//         });

//     // Add axes
//     svg.append("g")
//         .attr("transform", `translate(0, ${height - 50})`)
//         .call(d3.axisBottom(xScale));

//     svg.append("g")
//         .attr("transform", "translate(50, 0)")
//         .call(d3.axisLeft(yScale));
// });
