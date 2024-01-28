d3.csv('/university_enrollment_dv/data/education_data_choropleth.csv').then(function(data) {
    const margin = { top: 40, right: 20, bottom: 30, left: 50 };
    const width = 800;//1000;
    const height = 800;
  
    const svg = d3.select('#choropleth-map')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
    // Set up a projection
    const projection = d3.geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);
  
    // Create a path generator
    const path = d3.geoPath().projection(projection);
  
    // Load world GeoJSON data
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(function(world) {
      // Match countries in GeoJSON with data from the CSV file
      const dataMap = new Map(data.map(d => [d.countrycode, +d.institution_count]));
  
      // Set up a color scale
      const colorScale = d3.scaleSequential(d3.interpolateOranges)//interpolateBlues)
        .domain([0, d3.max(data, d => +d.institution_count)]);
  
      // Draw the map
      svg.selectAll("path")
        .data(world.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => colorScale(dataMap.get(d.id) || 0))
        .attr("stroke", "white")
        .attr("stroke-width", 1);
  
      // Add a legend
      const legend = svg.append("g")
        .attr("transform", "translate(50,100)");
  
      legend.selectAll("rect")
        .data(colorScale.ticks(6).map(d => colorScale(d)))
        .enter()
        .append("rect")
        .attr("x", (d, i) => 20 * i)
        .attr("height", 10)
        .attr("width", 20)
        .attr("fill", d => d);
  
      legend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text("Institution Count");
  
      // Tooltip
      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
  
      svg.selectAll("path")
        .on("mouseover", function (event, d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(event.id + "<br/>" + (dataMap.get(event.id) || 0) + " institutions")
            .style("left", (d3.mouse(this)[0] - 10) +  "px")
            .style("top", (d3.mouse(this)[1] + 100) + "px");
        })
        .on("mouseout", function (d) {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

    // Add a title
    svg.append('text')
      .text('The Institutions Distribution on the map')
      .attr('x', (width / 2))
      .attr('y', margin.top)
      
      .attr("text-anchor", "middle")
      .style("font-size", "16px")

    });
  });
  