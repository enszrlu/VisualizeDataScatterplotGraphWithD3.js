var dataset;

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then((data) => {
        dataset = data;
        dataset = dataset.map((d) => {
            var parsedTime = d.Time.split(':');
            d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
            if (d.Doping === "") {
                d.Doped = false;
            }
            else {
                d.Doped = true;
            }
            return d
        })

        const w = 800;
        const h = 600;
        const padding = 60;
        const radius = 5;
        var specifier = "%M:%S";

        yearsFromDataSet = dataset.map((d) => d.Year);
        timesFromDataSet = dataset.map((d) => d3.timeParse(specifier)(d.Time))

        timeMax = d3.max(timesFromDataSet)
        timeMin = d3.min(timesFromDataSet)


        // Define the div for the tooltip
        var div = d3.select("#d3Canvas").append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        const xScale = d3.scaleLinear()
            .domain([d3.min(yearsFromDataSet) - 1, d3.max(yearsFromDataSet) + 1])
            .range([padding, w - padding]);

        const yScale = d3.scaleTime()
            .domain(d3.extent(dataset, function (d) {
                return d.Time;
            }))
            .range([padding, h - padding]);

        const svg = d3.select("#d3Canvas")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", (d) => d.Doped ? "dot Doped" : "dot NotDoped")
            .attr("data-xvalue", (d) => d.Year)
            .attr("data-yvalue", (d) => d.Time)
            .attr("cx", (d) => xScale(d.Year))
            .attr("cy", (d) => yScale(d.Time))
            .attr("r", radius)
            .on("mouseover", function (d) {
                var year = this.getAttribute('data-xvalue');
                var time = new Date(this.getAttribute('data-yvalue'));
                var x = parseInt(this.getAttribute('cx')) + padding
                var y = parseInt(this.getAttribute('cy')) + padding

                div.attr('data-year', year);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html('Year: ' + year + "<br/>" + 'Time :' + time.getMinutes() + ":" + time.getSeconds())
                    .style("left", x + "px")
                    .style("top", y + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Create Axises
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

        // Append X Axis
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        // Append Y Axis
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis)

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', 300)
            .attr('y', 300)
            .style('font-size', 18)
            .text('Time in Minutes');


        svg.append("circle").attr("cx", w - 270).attr("cy", 130).attr("r", 6).attr("class", "NotDoped")
        svg.append("circle").attr("cx", w - 270).attr("cy", 160).attr("r", 6).attr("class", "Doped")
        svg.append("text").attr("id", "legend").attr("x", w - 250).attr("y", 130).text("No doping allegations").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("id", "legend").attr("x", w - 250).attr("y", 160).text("Riders with doping allegations").style("font-size", "15px").attr("alignment-baseline", "middle")


    });