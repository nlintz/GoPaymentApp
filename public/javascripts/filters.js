angular.module('Filters', [])
	.filter('monthFilter', function(){
		return function(monthIndex){
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", 
				"September", "October", "November", "December"];
			// var monthIndex = months.indexOf(monthIndex)
			return months[monthIndex]
		};
	});
	