import csv
import json
import sys
from datetime import date

def getNames(infile):
	result = set()
	file = open(infile, 'rU')
	reader = csv.reader(file, delimiter=',', quotechar='|')
	for row in reader:
		result.add(row[2])
	return result

def buildCsvDict(loginName, infile): #TODO REFACTOR
	result = []
	file = open(infile, 'rU')
	reader = csv.reader(file, delimiter=',', quotechar = '|')
	for row in reader:
		if row[2] == loginName: #row2 is the login name field
			result.append({'LOGIN_NAME': row[2], 'PURCHASE_DATE': row[3], 'PRICE': row[9]})
	file.close()
	return result

def monthlyRevenue(csvDict, month):
	months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

	monthIndexA = months.index(month)
	monthIndexB = (months.index(month) - 1) % 11
	monthIndexC = (months.index(month) - 2) % 11
	monthIndexD = (months.index(month) - 3) % 11

	monthlyRevenueDict = {months[monthIndexA]: [], months[monthIndexB]: [], months[monthIndexC]: [], months[monthIndexD]: []}

	for entry in csvDict:
		date = entry['PURCHASE_DATE']
		dateStr = date.split(' ')[0]
		month = dateStr.split('-')[1]
		day = dateStr.split('-')[0]
		if (month == months[monthIndexA]):
			monthlyRevenueDict[months[monthIndexA]].append((int(day),float(entry['PRICE'])))
		if (month == months[monthIndexB]):
			monthlyRevenueDict[months[monthIndexB]].append((int(day),float(entry['PRICE'])))
		if (month == months[monthIndexC]):
			monthlyRevenueDict[months[monthIndexC]].append((int(day),float(entry['PRICE'])))
		if (month == months[monthIndexD]):
			monthlyRevenueDict[months[monthIndexD]].append((int(day),float(entry['PRICE'])))

	week1 = 0
	week2 = 0
	week3 = 0
	week4 = 0
	for month in monthlyRevenueDict:
		if monthlyRevenueDict[month]:
			for transaction in monthlyRevenueDict[month]:
				if (transaction[0] <= 7):
					week1 += transaction[1]
				elif (transaction[0] > 7 and transaction[0] <= 14):
					week2 += transaction[1]
				elif (transaction[0] > 14 and transaction[0] <= 21):
					week3 += transaction[1]
				else:
					week4 += transaction[1]
		monthlyRevenueDict[month] = [week1, week2, week3, week4]
		# monthlyRevenueDict[month] = sum(monthlyRevenueDict[month])
	return monthlyRevenueDict

def monthlyTransactions(csvDict, month):
	months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
	monthNumerals = {month:index for month,index in zip(months, range(1,13))}
	monthlyTransactionsDict = {0:0,1:0,2:0,3:0,4:0,5:0,6:0}
	for entry in csvDict:
		purchaseDate = entry['PURCHASE_DATE']
		dateStr = purchaseDate.split(' ')[0]
		month = int(monthNumerals[dateStr.split('-')[1]])
		year = int("20"+dateStr.split('-')[2])
		day = int(dateStr.split('-')[0])
		dayOfWeek = date(year, month, day).weekday()
		monthlyTransactionsDict[dayOfWeek] += 1

	return monthlyTransactionsDict


def nameMonthlyRevenueDict(month, infile): #Returns a dictionary of names: revenue for the last 4 month
	nameMonthlyRevenueDict = {}
	for name in getNames(infile):
		if name != "LOGIN_NAME":
			nameMonthlyRevenueDict[name] = monthlyRevenue(buildCsvDict(name, infile), month)
	return nameMonthlyRevenueDict

def nameMonthlyTransactionsDict(month, infile): #Returns a dictionary of names: revenue for the last 4 month
	mockDict = {"hi":"world"}
	nameMonthlyTransactionsDict = {}
	for name in getNames(infile):
		if name != "LOGIN_NAME":
			nameMonthlyTransactionsDict[name] = monthlyTransactions(buildCsvDict(name, infile), month)

	return nameMonthlyTransactionsDict

if __name__ == "__main__":
	function = sys.argv[1]
	month = sys.argv[2]

	if function == "revenue":
		with open('revenue.json', 'w') as outfile:
			json.dump(nameMonthlyRevenueDict(month, 'data338Screened.csv'),outfile)
			outfile.close()
	if function == "transaction":
		with open('transaction.json', 'w') as outfile:
			json.dump(nameMonthlyTransactionsDict(month, 'data338Screened.csv'),outfile)
			outfile.close()

