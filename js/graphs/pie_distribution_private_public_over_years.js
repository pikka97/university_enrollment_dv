const margin = { top: 50, right: 20, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create an SVG container
const svg = d3.select("#pie_chart_private_institutions_over_years")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// Load data from CSV file
d3.csv('/university_enrollment_dv/data/pie_percent_private_uni_over_years.csv').then(function(data) {
    // Extract unique regions and years
    const regions = Array.from(new Set(data.map(d => d.region)));
    const years = Array.from(new Set(data.map(d => d.year)));

    // Set up scales
    const xScale = d3.scaleBand()
        .domain(regions)
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const yScale = d3.scaleBand()
        .domain(years)
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    // Set up color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Distribution of Public and Private Universities by Region and Year");

    // Draw pie charts
    data.forEach(function(d) {
        const pieData = [d.public, d.private];
        
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(xScale.bandwidth(), yScale.bandwidth()) / 2);

        const pie = d3.pie();

        // Draw pie chart
        const g = svg.append("g")
            .attr("transform", `translate(${xScale(d.region) + xScale.bandwidth() / 2},${yScale(d.year) + yScale.bandwidth() / 2})`);

        g.selectAll()
            .data(pie(pieData))
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", (datum, index) => colorScale(index))
            .each(function(datum) {
                const center = arc.centroid(datum);
                g.append("text")
                    .attr("transform", `translate(${center[0]}, ${center[1]})`)
                    .attr("dy", "0.35em")
                    .text(`${(datum.data / d3.sum(pieData) * 100).toFixed(1)}%`)
                    .style("font-size", "12px")
                    .style("text-anchor", "middle");
            });
    });

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, 0)`);

    legend.selectAll("rect")
        .data(["Public", "Private"])
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", (d, i) => colorScale(i));

    legend.selectAll("text")
        .data(["Public", "Private"])
        .enter().append("text")
        .attr("x", 20)
        .attr("y", (d, i) => i * 20 + 10)
        .text(d => d);

});