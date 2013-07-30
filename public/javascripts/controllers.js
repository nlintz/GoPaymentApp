function DataReportController($scope, $http){
	$http.get('MASTER_CONTROLS.json').success(function(data) {
    	$scope.configuration = data;
    	$scope.insightsTop = data.insightsTop
    	$scope.insightsBottom = data.insightsBottom
  	});
  	$scope.transactionsMonth = "May";
  	$scope.businessName = "Cashmere";
  	$scope.dataReportDate = "May 2013";

}

function RevenueController($scope){
	$scope.weeklyRevenue = {"week1":[1,2,3,4,5], "week2":[2,3,4,5,3]}
	var data = [1,2,3,2,5],
		data2 = [2,3,4,200,2],
		w = 304,
		h = 274,
		margin = 20,
		y = d3.scale.linear().domain([0, d3.max(data)]).range([0+margin, h-margin]),
		x = d3.scale.linear().domain([1, 4]).range([0+margin, w-margin])

	var vis = d3.select("#RevenueGraph")
	    .append("svg:svg")
	    .attr("width", w)
	    .attr("height", h)

	var g = vis.append("svg:g")
	    .attr("transform", "translate(0, 274)");
	
	var line = d3.svg.line()
	    .x(function(d,i) { return x(i) + 83; })
	    .y(function(d) { return -1 * y(d); })
	
	//Data lines
	angular.forEach($scope.weeklyRevenue, function(week){
		g.append("svg:path").attr("d", line([1,2,3,4]));
	})
	// g.append("svg:path").attr("d", line(data));
	// g.append("svg:path").attr("d", line(data2));
	// g.append("svg:path").attr("d", line(data));
	
	var xNumberOffset = 15;
	g.append("svg:line") // x-axes
	    .attr("x1", xNumberOffset)
	    .attr("y1", -1 * y(0))
	    .attr("x2", x(w))
	    .attr("y2", -1 * y(0))

	g.append("svg:line") // y-axes
	    .attr("x1", xNumberOffset)
	    .attr("y1", -1 * y(0))
	    .attr("x2", xNumberOffset)
	    .attr("y2", -1 * y(d3.max(data)))
	
	//Number Ticks
	g.selectAll(".xLabel")
	    .data(x.ticks(4))
	    .enter().append("svg:text")
	    .attr("class", "xLabel")
	    .text(String)
	    .attr("x", function(d) { return x(d) + 10})
	    .attr("y", -5)
	    .attr("text-anchor", "middle")

	g.selectAll(".yLabel")
	    .data(y.ticks(4))
	    .enter().append("svg:text")
	    .attr("class", "yLabel")
	    .text(String)
	    .attr("x", 0)
	    .attr("y", function(d) { return -1 * y(d) })
	    .attr("text-anchor", "right")
	    .attr("dy", 4)
	
	//Visual Ticks
	var xOffset = 35;
	g.selectAll(".xTicks")
	    .data(x.ticks(3))
	    .enter().append("svg:line")
	    .attr("class", "xTicks")
	    .attr("x1", function(d) { return x(d) - xOffset })
	    .attr("y1", -1 * y(0))
	    .attr("x2", function(d) { return x(d) - xOffset })
	    .attr("y2", -1 * y(0.15))

}