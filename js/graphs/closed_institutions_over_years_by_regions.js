// Load university data
d3.csv("/university_enrollment_dv/data/closed_university_over_time_by_region.csv", function(data) {

  // Create a dictionary to store enrollment data by year and region
  const enrollmentDataByRegion = {};
  for (const d of data) {
    const year = parseInt(d.year);
    const region = d.region;
    if (!enrollmentDataByRegion.hasOwnProperty(year)) {
      enrollmentDataByRegion[year] = {};
    }
    enrollmentDataByRegion[year][region] = parseFloat(d[region]) / 100;
  }

  // Extract data for visualization
  const years = Object.keys(enrollmentDataByRegion);
  const regions = Object.keys(enrollmentDataByRegion[years[0]]);
  const enrollmentData = [];
  for (const year of years) {
    for (const region of regions) {
      enrollmentData.push({
        year: year,
        region: region,
        enrollment_percentage: enrollmentDataByRegion[year][region],
      });
    }
  }

  // Create the chart dimensions
  const margin = {top: 20, right: 20, bottom: 20, left: 60};
  const width = 600 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // Create the SVG element
  const svg = d3.select("#closed_institutions_by_regions").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Create the x-axis
  const xScale = d3.scaleBand()
    .domain(years)
    .range([margin.left, width - margin.right]);

  const xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Create the y-axis
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(enrollmentData, (d) => d.enrollment_percentage)])
    .range([height - margin.top, margin.bottom]);

  const yAxis = svg.append("g")
    .call(d3.axisLeft(yScale));

  // Create stacked bar charts for each region
  //const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  const stacks = d3.stack(enrollmentData, regions);

  for (const region of regions) {
    const bars = svg.selectAll(`bar.${region}`)
      .data(stacks[region])
      .enter()
      .append("g")
      .attr("class", `bar ${region}`);

    bars.append("rect")
      .attr("x", (d) => xScale(d.data.year))
      .attr("y", yScale(0))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(d[1]) - yScale(d[0]));

    bars.append("title")
      .text(`Enrollment Percentage in ${region}: ${d3.sum(stacks[region], (d) => d[1]) * 100}%`);
  }
});


// // Load the data
// d3.csv("/university_enrollment_dv/data/closed_university_over_time_by_region.csv", function(data) {

//     // Normalize the data
//     const normalizedData = data.map(row => {
//       return {
//         year: row.year,
//         Africa: parseFloat(row.Africa) / 100,
//         Americas: parseFloat(row.Americas) / 100,
//         Asia: parseFloat(row.Asia) / 100,
//         Europe: parseFloat(row.Europe) / 100,
//         Oceania: parseFloat(row.Oceania) / 100,
//       };
//     });
  
//     // Create the chart dimensions
//     const margin = {top: 20, right: 20, bottom: 20, left: 60};
//     const width = 600 - margin.left - margin.right;
//     const height = 300 - margin.top - margin.bottom;
  
//     // Create the SVG element
//     const svg = d3.select("#closed_institutions_by_regions").append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom);
  
//     // Create the x-axis
//     const xScale = d3.scaleBand()
//       .domain(normalizedData.map(row => row.year))
//       .range([margin.left, width - margin.right]);
  
//     const xAxis = svg.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(d3.axisBottom(xScale));
  
//     // Create the y-axis
//     const yScale = d3.scaleLinear()
//       .domain([0, d3.max(normalizedData, row => d3.max(row, value => value))]);
  
//     const yAxis = svg.append("g")
//       .call(d3.axisLeft(yScale));
  
//     // Create stacked bars for each region
//     const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
//     const stack = d3.stack(normalizedData, regions);
  
//     const bars = svg.selectAll("bar")
//       .data(stack)
//       .enter()
//       .append("g")
//       .attr("class", (d, i) => `bar ${regions[i]}`);
  
//     bars.append("rect")
//       .attr("x", (d, i) => xScale(d.data.year))
//       .attr("y", yScale(0))
//       .attr("width", xScale.bandwidth())
//       .attr("height", (d) => yScale(d[i]));
  
//     // Create labels for each stacked bar
//     bars.append("text")
//       .text((d, i) => `${Math.round(d[i] * 100)}%`)
//       .attr("x", (d, i) => xScale(d.data.year) + xScale.bandwidth() / 2)
//       .attr("y", (d) => yScale(d[i]) + 10)
//       .attr("text-anchor", "middle");
//   });  