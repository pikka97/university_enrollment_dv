// Load data from CSV file
d3.csv('/university_enrollment_dv/data/num_students_over_years_by_region.csv').then(function(data) {
    // Set up the chart dimensions
    const margin = { top: 40, right: 20, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart-private-public-by-regions")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract years dynamically from the data
    const years = Object.keys(data[0]).filter(key => key !== 'region');

    // Set up color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Set up scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.region))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(years, year => +d[year]))])
        .range([height, 0]);

    // Draw bars
    svg.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", d => `translate(${xScale(d.region)},0)`)
        .selectAll("rect")
        .data(d => years.map(year => ({ region: d.region, year, value: +d[year] })))
        .enter().append("rect")
        .attr("x", d => xScale.bandwidth() / years.length * years.indexOf(d.year))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth() / years.length)
        .attr("height", d => height - yScale(d.value))
        .attr("fill", d => colorScale(d.year)); // Use color scale for fill

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 120}, 0)`);

    legend.selectAll("rect")
        .data(years)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => colorScale(d));

    legend.selectAll("text")
        .data(years)
        .enter().append("text")
        .attr("x", 20)
        .attr("y", (d, i) => i * 20 + 10)
        .text(d => d);

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Number of Private Universities Over the Years by Region");

});