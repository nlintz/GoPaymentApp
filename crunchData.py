from public.data.csvToJson import *
import json

def crunchNumbersToJson(month, infile):
	with open('public/data/revenue.json', 'w') as outfile:
			json.dump(nameMonthlyRevenueDict(month, infile), outfile)
			outfile.close()
	with open('public/data/transaction.json', 'w') as outfile:
			json.dump(nameMonthlyTransactionsDict(month, infile), outfile)
			outfile.close()

if __name__ == "__main__":
	monthsShortNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
	monthLongNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	monthNameDict = {longName:shortName for longName, shortName in zip(monthLongNames, monthsShortNames)}

	config_data = open('public/MASTER_CONTROLS.json')
	config = json.load(config_data)
	config_data.close()
	crunchNumbersToJson(monthNameDict[config["month"]], config["dataFile"])
