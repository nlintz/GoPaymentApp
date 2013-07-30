function DataReportController($scope, $http){
	$http.get('MASTER_CONTROLS.json').success(function(data) {
    	$scope.configuration = data;
    	$scope.insightsTop = data.insightsTop
    	$scope.insightsBottom = data.insightsBottom
  	});
  	$scope.transactionsMonth = "May";
  	$scope.businessName = "Cashmere";
  	$scope.dataReportDate = "May 2013"
}