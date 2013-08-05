angular.module('Services', [])
	.service('uiService', function(){
		this.revenueInit = null;
		this.transactionsInit = null;
		this.setRevenueInit = function(initializeFunction){
			this.revenueInit = initializeFunction;
		}
		this.setTransactionsInit = function(initializeFunction){
			this.transactionsInit = initializeFunction;
		}
		this.callRevenueInit = function(){
			this.revenueInit();
		}
		this.callTransactionsInit = function(){
			this.transactionsInit();
		}
	});