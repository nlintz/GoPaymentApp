function DataReportController($scope, $http){
	$http.get('MASTER_CONTROLS.json').success(function(data) {
    	$scope.configuration = data;
    	$scope.insightsTop = data.insightsTop
    	$scope.insightsBottom = data.insightsBottom
    	$scope.username = $scope.configuration.username;
  	});
  	
  	$scope.transactionsMonth = "May";
  	$scope.businessName = "Cashmere";
  	$scope.dataReportDate = "May 2013";
	$scope.transactionsThisMonth = 100;
	$scope.revenueThisMonth = 100;
	$scope.salesTaxThisQuarter = "N/A"


}

function TransactionsController($scope, $http){
	var width = 186;
	var height = 170;
	var maximum = 0;	
	var yAxisHeight = height - 15; // We need to offset the yaxis by 15px to accomadate the text
	var xAxisWidth = width + 15; // We need to offset the yaxis by 15px to accomadate the text
	var plotData = []

	$http.get('data/transaction.json').success(function(data){
		$scope.weeklyTransactions = data[$scope.username];
		angular.forEach($scope.weeklyTransactions, function(transaction){
			// console.log(transaction)
			maximum = Math.max(transaction, maximum);
			plotData.push(transaction);
		})
		makePlot()

	});

	function makePlot(){
		var x = d3.scale.linear().domain([0, 6]).range([0, xAxisWidth]);
		var y = d3.scale.linear().domain([0, maximum]).range([height, 0]);

		var rectangleWidth = width/7
		var TransactionsGraph = d3.select('#TransactionsGraph')
			.append('svg:svg')
			.attr('width', width)
			.attr('height', height)

							//Y Axes
		TransactionsGraph.append("svg:line")
			.attr("x1", 1)
			.attr("x2", 1)
			.attr("y1", 0)
			.attr("y2", height - 1)
			.attr("class", "transactionsAxes")

		//X Axes
		TransactionsGraph.append("svg:line")
			.attr("x1", 1)
			.attr("x2", width)
			.attr("y1", height - 1 )
			.attr("y2", height - 1 )
			.attr("class", "transactionsAxes")

		//Tick Marks
		TransactionsGraph.selectAll(".yTicks")
		    .data(y.ticks(3))
		    .enter().append("svg:line")
		    .attr("class", function(d) { return "yTick "})
		    .attr("x1", function(d) { return 1 }) // We need a 1 px offset so the last tick won't get cutoff
		    .attr("y1", function(d) {return y(d) + 1 })
		    	.attr("x2", function(d) { return 5 })
		    .attr("y2", function(d) {return y(d) + 1}) // 7px is the tick height

		TransactionsGraph.selectAll('rect')
			.data(plotData)
			.enter().append("rect")
			.attr("class", function(d, i){ return "dayOfWeek"+i})
			.attr("x", function(d, i) { return i*rectangleWidth + 1 } )
			.attr("y", function(d) { return height - y(d) - 1; })
			.attr("width", rectangleWidth)
			.attr("height", function(d, i){ return y(d) })



	}
}

function RevenueController($scope, $http){

	// var data = [0, 1, 5, 4];

	var width = 304;
	var height = 254;
	var maximum = 0;

	$http.get('data/revenue.json').success(function(data) {
		$scope.monthlyRevenue = data[$scope.username];
		angular.forEach($scope.monthlyRevenue, function(revenue){
			maximum = Math.max(maximum, d3.max(revenue));
		})
		makePlot();
  	});

	function makePlot(){
		var x = d3.scale.linear().domain([0, 4]).range([0, width]);
		var y = d3.scale.linear().domain([0, maximum]).range([0, height]);


		var RevenueGraph = d3.select('#RevenueGraph')
			.append('svg:svg')
			.attr('width', width)
			.attr('height', height)

		$http.get('data/revenue.json').success(function(data) {
			$scope.monthlyRevenue = data[$scope.username];
			index = 0;
			angular.forEach($scope.monthlyRevenue, function(revenue){
				RevenueGraph.append("svg:path")
					.attr("d", dataLine(revenue))
					.attr("class", 'revenue'+index)
				index += 1;
			})
	  	});

		//Y Axes
		RevenueGraph.append("svg:line")
			.attr("x1", 0)
			.attr("x2", 0)
			.attr("y1", 0)
			.attr("y2", height - 1)

		//X Axes
		RevenueGraph.append("svg:line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", height - 1)
			.attr("y2", height - 1)

		var dataLine = d3.svg.line()
	    	.x(function(d,i) { return x(i); })
		    .y(function(d) { return y(d); })

		// //Tick Numbers
		// var xTickSpacing = width/8 //Spacing between each tick is the total width/4, to center ticks we want half the spacing
		// RevenueGraph.selectAll(".xLabel")
		//     .data(x.ticks(4))
		//     .enter().append("svg:text")
		//     .attr("class", "xLabel")
		//     .text(String)
		//     .attr("x", function(d) { return x(d) - xTickSpacing })
		//     .attr("y", height)
		//     .attr("text-anchor", "middle")

		// Tick Marks
		RevenueGraph.selectAll(".xTicks")
		    .data(x.ticks(4))
		    .enter().append("svg:line")
		    .attr("class", "xTick")
		    .attr("x1", function(d) { return x(d) - 1; }) // We need a 1 px offset so the last tick won't get cutoff
		    .attr("y1", height - 1)
	    	.attr("x2", function(d) { return x(d) - 1; })
		    .attr("y2", height - 7) // 7px is the tick height

	// RevenueGraph.append("svg:path").attr("d", dataLine(data)); //The graphs
	}
}