from public.data.dataProcessor import *
import json

# def crunchNumbersToJson(infile):
# 	with open('public/data/revenue.json', 'w') as outfile:
# 			ProcessRevenueData(infile, outfile)
# 	with open('public/data/revenue.json', 'w') as outfile:
# 			ProcessTransactionsData(infile, outfile)

if __name__ == "__main__":
	configFile = open('public/MASTER_CONTROLS.json', 'r')
	config = json.loads(configFile.read())
	dataFile = config["dataFile"]
	infile = open(dataFile, 'rU')
	report = GoPaymentReportDataHandler(infile)
	report.transactionsJson('public/data/transactions.json')
	report.revenueJson('public/data/revenue.json')
	infile.close()
	configFile.close()
