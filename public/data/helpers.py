import json
from datetime import date


def getMonthFromDate(date):
	date = date.split(" ")[0]
	month = date.split("-")[1]
	return month

def getDayFromDate(date):
	date = date.split(" ")[0]
	day = date.split("-")[0]
	return day


def getDayOfWeekFromDate(dateStr):
	months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
	monthNumerals = {month:index for month,index in zip(months, range(1,13))}
	dateStr = dateStr.split(' ')[0]
	month = int(monthNumerals[dateStr.split('-')[1]])
	year = int("20"+dateStr.split('-')[2])
	day = int(dateStr.split('-')[0])
	return date(year, month, day).weekday()


def monthToInt(month):
	months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
	return months.index(month)

def writeToJson(data, jsonFile):
	with open(jsonFile, 'w') as outfile:
		json.dump(data, outfile)
		outfile.close()

