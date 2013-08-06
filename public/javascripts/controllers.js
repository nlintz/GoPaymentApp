months = ["January", "February", "March", "April", "May", "June", "July", "August", 
			"September", "October", "November", "December"];

function DataReportController($scope, $http, uiService, Transactions, Revenue){
	
	$http.get('MASTER_CONTROLS.json').success(function(data) {
		$scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", 
			"September", "October", "November", "December"];
    	$scope.configuration = data;
    	$scope.insightsTop = data.insightsTop
    	$scope.insightsBottom = data.insightsBottom
    	$scope.username = $scope.configuration.username;
	  	$scope.month = $scope.configuration.month;
	  	$scope.year = $scope.configuration.year;
	  	$scope.businessName = $scope.configuration.businessName;
	  	$scope.dataReportDate = $scope.configuration.dataReportDate;
		$scope.salesTax = $scope.configuration.salesTax;
		$scope.monthIndex = months.indexOf($scope.month);

	  	$scope.updatePlots = function(){
			d3.selectAll("svg").remove();
		  	topDataInit();
		  	uiService.callTransactionsInit();
		  	uiService.callRevenueInit();
	  	}
	  	topDataInit();
	  	uiService.callTransactionsInit();
	  	uiService.callRevenueInit();
  	});
	function topDataInit(){
		Transactions.getTransactions.then(function(data){
			$scope.transactions = data.data[$scope.username];
			var thisMonthsTransactions = $scope.transactions[months.indexOf($scope.month)]
			$scope.transactionsThisMonth = _.reduce(thisMonthsTransactions, function(memo, num){ return memo + num; }, 0);
		});

		Revenue.getRevenue.then(function(data){
			$scope.revenue = data.data[$scope.username];
			var thisMonthsRevenue = $scope.revenue[months.indexOf($scope.month)]
			$scope.revenueThisMonth = _.reduce(thisMonthsRevenue, function(memo, num){ return memo + num; }, 0);
		});

	}

}

function TransactionsController($scope, $http, uiService, Transactions){
	var width = 186;
	var height = 170;
	var yAxisHeight = height - 15; // We need to offset the yaxis by 15px to accomadate the text
	var xAxisWidth = width + 15; // We need to offset the yaxis by 15px to accomadate the text
	var plotData = []

	$scope.inititalize = function(){
		plotData = []
		var TransactionsGraph = d3.select('#TransactionsGraph')
			.append('svg:svg')
			.attr('width', width)
			.attr('height', height)
		Transactions.getTransactions.then(function(data){
			var transactions = data.data;
			$scope.transactionsMaximum = 0;
			
			$scope.monthlyTransactions = [];
			for (var i=0; i<3; i++){
				$scope.monthlyTransactions.push(transactions[$scope.username][months.indexOf($scope.month) - i]);
			}

			$scope.weeklyTransactions = [];
			for (var i=0; i<7; i++){
				$scope.weeklyTransactions.push($scope.monthlyTransactions[0][i]+$scope.monthlyTransactions[1][i]+$scope.monthlyTransactions[2][i])
			}			

			angular.forEach($scope.weeklyTransactions, function(transaction){
				$scope.transactionsMaximum = Math.max(transaction, $scope.transactionsMaximum);
				plotData.push(transaction);
			})

			var yAxisIntervals = $scope.transactionsMaximum/3;
			$scope.intervalIndex = _.range(4).map(function(index){
				var revenue = index*yAxisIntervals;
				return  parseInt(index * yAxisIntervals);
			}).reverse();
			makePlot(TransactionsGraph);
		})
	}
	uiService.setTransactionsInit($scope.inititalize)

	function makePlot(TransactionsGraph){

		var x = d3.scale.linear().domain([0, 6]).range([0, xAxisWidth]);
		var y = d3.scale.linear().domain([0, $scope.transactionsMaximum]).range([height, 0]);

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
					.attr("y1", i*height/3 )
					.attr("y2", i*height/3 )
					.attr("class", "x-axis-multi")
				}

		TransactionsGraph.selectAll('rect')
			.data(plotData)
			.enter().append("rect")
			.attr("class", function(d, i){ return "dayOfWeek"+i})
			.attr("x", function(d, i) { return i*rectangleWidth + 1 } )
			.attr("y", function(d) { return y(d); })
			.attr("width", rectangleWidth)
			.attr("height", function(d, i){ return height-y(d) })
			.attr("transform", "translate(0 0)")



	}
}

function RevenueController($scope, $http, $filter, uiService, Revenue){

	var width = 304;
	var height = 254;
	var maximum = 0;
	// $http.get('MASTER_CONTROLS.json').success(function(data) {
 //    	$scope.configuration = data;
	// 	$scope.month = $scope.configuration.month;
	// })

	$scope.inititalize = function(){

		var RevenueGraph = d3.select('#RevenueGraph')
			.append('svg:svg')
			.attr('width', width)
			.attr('height', height)

		Revenue.getRevenue.then(function(data){
			var revenue = data.data[$scope.username];
			$scope.revenueMaximum = 0;

			$scope.monthlyRevenue = []
			for (var i=0; i<3; i++){
				$scope.monthlyRevenue.push(revenue[months.indexOf($scope.month) - i])
			}
			function cumulativeArray(array){
				cumuArray = [];
				for (var i in array){
					if (i > 0){
						cumuArray.push(array[i]+cumuArray[i-1]);
					}
					else{
						cumuArray.push(array[i]);
					}
				}
				return cumuArray;
			}

			var plotData = []
			for (var i in $scope.monthlyRevenue){
				plotData.push(cumulativeArray($scope.monthlyRevenue[i]))
			}

			for (var i in plotData){
				$scope.revenueMaximum = Math.max($scope.revenueMaximum, d3.max(plotData[i]));
			}
			$scope.revenueMaximum *= 1.1; //Slightly increase the maximum to make the data look better

			var yAxisIntervals = $scope.revenueMaximum/4;
			$scope.intervalIndex = _.range(5).map(function(index){
				var revenue = index*yAxisIntervals;
				if (revenue >= 1000){
					return "$" + parseInt(index * yAxisIntervals/100)/10 + "K"
				}
				else {
					return "$" + parseInt(index * yAxisIntervals)
				}
			}).reverse();
			makePlot(RevenueGraph, plotData);

		})
	}

  	uiService.setRevenueInit($scope.inititalize)

	function makePlot(RevenueGraph, plotData){
		var x = d3.scale.linear().domain([0, 4]).range([0, width]);
		var y = d3.scale.linear().domain([0, $scope.revenueMaximum]).range([0, height]);

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


		index = 0;
		angular.forEach(plotData, function(revenue){

			RevenueGraph.append("svg:path")
				.attr("d", dataLine(revenue))
				.attr("class", 'revenue'+index)
				.attr("transform", "translate("+ width/8 +")")
			index += 1;
		})
	}
}