function DataReportController($scope, $http, uiService){
	$http.get('MASTER_CONTROLS.json').success(function(data) {

    	$scope.configuration = data;
    	$scope.insightsTop = data.insightsTop
    	$scope.insightsBottom = data.insightsBottom
    	$scope.username = $scope.configuration.username;
	  	$scope.month = $scope.configuration.month;
	  	$scope.year = $scope.configuration.year;
	  	$scope.businessName = $scope.configuration.businessName;
	  	$scope.dataReportDate = $scope.configuration.dataReportDate;
		$scope.salesTaxThisQuarter = $scope.configuration.salesTax;

	  	$scope.updatePlots = function(){
			d3.selectAll("svg").remove();
		  	uiService.callTransactionsInit()
		  	uiService.callRevenueInit()
	  	}
  	});

  	$http.get('data/transaction.json').success(function(data){
		var weeklyTransactions = data[$scope.username];
		$scope.transactionsThisMonth = 0
		angular.forEach(weeklyTransactions, function(transaction){
			$scope.transactionsThisMonth += transaction
		});
	});

	$http.get('data/revenue.json').success(function(data) {
		var monthlyRevenue = data[$scope.username];
		$scope.revenueThisMonth = 0;
		angular.forEach(monthlyRevenue, function(revenue){
			$scope.revenueThisMonth += revenue.reduce(function(a,b){return a+b})
		})
		$scope.revenueThisMonth = "$" + $scope.revenueThisMonth
	});


}

function TransactionsController($scope, $http, uiService){
	var width = 186;
	var height = 170;
	var maximum = 0;	
	var yAxisHeight = height - 15; // We need to offset the yaxis by 15px to accomadate the text
	var xAxisWidth = width + 15; // We need to offset the yaxis by 15px to accomadate the text
	var plotData = []

	$scope.inititalize = function(){
		plotData = []
		var TransactionsGraph = d3.select('#TransactionsGraph')
			.append('svg:svg')
			.attr('width', width)
			.attr('height', height)

		$http.get('data/transaction.json').success(function(data){
					maximum = 0;
					$scope.weeklyTransactions = data[$scope.username];
					angular.forEach($scope.weeklyTransactions, function(transaction){
						maximum = Math.max(transaction, maximum);
						plotData.push(transaction);
					})
					var yAxisIntervals = maximum/3;
					$scope.intervalIndex = _.range(4).map(function(index){
						var revenue = index*yAxisIntervals;
						return  parseInt(index * yAxisIntervals);
					}).reverse();
					makePlot(TransactionsGraph);
				});
	}
	uiService.setTransactionsInit($scope.inititalize)
	uiService.callTransactionsInit()

	function makePlot(TransactionsGraph){

		var x = d3.scale.linear().domain([0, 6]).range([0, xAxisWidth]);
		var y = d3.scale.linear().domain([0, maximum]).range([height, 0]);

		var rectangleWidth = width/7
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

		//X Axes (repeated lines)
		for (i=0; i<4; i++){
				TransactionsGraph.append("svg:line")
					.attr("x1", 1)
					.attr("x2", 5)
					.attr("y1", i*height/3 - 1)
					.attr("y2", i*height/3 - 1)
					.attr("class", "x-axis-multi")
				}
		TransactionsGraph.selectAll('rect')
			.data(plotData)
			.enter().append("rect")
			.attr("class", function(d, i){ return "dayOfWeek"+i})
			.attr("x", function(d, i) { return i*rectangleWidth + 1 } )
			.attr("y", function(d) { return y(d); })
			.attr("width", rectangleWidth)
			.attr("height", function(d, i){ return height - y(d) })
			.attr("transform", "translate(0 -1)")



	}
}

function RevenueController($scope, $http, $filter, uiService){

	var width = 304;
	var height = 254;
	var maximum = 0;
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", 
		"September", "October", "November", "December"];
	$http.get('MASTER_CONTROLS.json').success(function(data) {
    	$scope.configuration = data;
		$scope.month = $scope.configuration.month;
		$scope.monthIndex = months.indexOf($scope.month);
	})

	$scope.inititalize = function(){

		var RevenueGraph = d3.select('#RevenueGraph')
			.append('svg:svg')
			.attr('width', width)
			.attr('height', height)

		$http.get('data/revenue.json').success(function(data) {
			$scope.monthlyRevenue = data[$scope.username];
			maximum = 0;
			angular.forEach($scope.monthlyRevenue, function(revenue){
				maximum = Math.max(maximum, d3.max(revenue));
			})
			var yAxisIntervals = maximum/4;
			$scope.intervalIndex = _.range(5).map(function(index){
				var revenue = index*yAxisIntervals;
				if (revenue >= 1000){
					return "$" + parseInt(index * yAxisIntervals/100)/10 + "K"
				}
				else {
					return "$" + parseInt(index * yAxisIntervals)
				}
			}).reverse();
			makePlot(RevenueGraph);
	  	});
  	}
  	uiService.setRevenueInit($scope.inititalize)
	uiService.callRevenueInit()

	function makePlot(RevenueGraph){
		var x = d3.scale.linear().domain([0, 4]).range([0, width]);
		var y = d3.scale.linear().domain([0, maximum]).range([0, height]);



		//Y Axes
		RevenueGraph.append("svg:line")
			.attr("x1", 0)
			.attr("x2", 0)
			.attr("y1", 0)
			.attr("y2", height - 1)

		//X Axes (repeated lines)
		for (i=0; i<5; i++){
				RevenueGraph.append("svg:line")
					.attr("x1", 0)
					.attr("x2", width)
					.attr("y1", i*height/4 + 1)
					.attr("y2", i*height/4 + 1)
					.attr("class", "x-axis-multi")
				}

		//X Axes (bottom line)
		RevenueGraph.append("svg:line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", height - 1)
			.attr("y2", height - 1)


		var dataLine = d3.svg.line()
	    	.x(function(d,i) { return x(i); })
		    .y(function(d) { return height-y(d); })


		// Tick Marks
		RevenueGraph.selectAll(".xTicks")
		    .data(x.ticks(4))
		    .enter().append("svg:line")
		    .attr("class", "xTick")
		    .attr("x1", function(d) { return x(d) - 1; }) // We need a 1 px offset so the last tick won't get cutoff
		    .attr("y1", height)
	    	.attr("x2", function(d) { return x(d) - 1; })
		    .attr("y2", height - 7) // 7px is the tick height


		$http.get('data/revenue.json').success(function(data) {
			$scope.monthlyRevenue = data[$scope.username];
			index = 0;
			angular.forEach($scope.monthlyRevenue, function(revenue){
				RevenueGraph.append("svg:path")
					.attr("d", dataLine(revenue))
					.attr("class", 'revenue'+index)
					.attr("transform", "translate("+ width/8 +")")
				index += 1;
			})
	  	});
	// RevenueGraph.append("svg:path").attr("d", dataLine(data)); //The graphs
	}
}