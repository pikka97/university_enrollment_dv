// // Load bar data
// Load bar data
d3.csv('/university_enrollment_dv/data/bar_data.csv').then(function(data) {
    const margin = { top: 40, right: 20, bottom: 30, left: 50 };
    const width = 800;
    const height = 400;

    /* const svg = d3.select("#bar_chart_total_fields_by_regions")
        .append("svg")
        .attr("width", width)
        .attr("height", height); */
    
    const svg = d3.select("#bar_chart_total_fields_by_regions")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

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

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("The total degree programs offered grouped by income groups");
});
