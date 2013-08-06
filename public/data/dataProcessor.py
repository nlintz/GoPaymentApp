import csv
import json
import sys
import helpers
from datetime import date

class Processor(object):

	def __init__(self, infile=None):
		"""
		Infile is an open file
		"""
		self._infile = infile

	def getInfile(self, infile):
		return self._infile

	def setInfile(self, infile):
		self._infile = infile

	def getDataList(self):
		reader = csv.reader(self._infile, delimiter=',')
		return list(reader)

	def getDataDict(self):
		reader = csv.DictReader(self._infile, delimiter=',')
		return reader

	def getColumnNames(self):
		reader = self.getDataDict()
		# print reader.fieldnames
		return reader.fieldnames

class Resource(object):
	def __init__(self, infile):
		self._processor = Processor(infile)
		self._columnNames = self._processor.getColumnNames()
		self._rows = self._processor.getDataList()

	def getRows(self):
		return self._rows

	def getModels(self, username):
		dataRows = [row for row in self.getRows() if row[self._userNameIndex] == username]
		columnNames = self._columnNames
		return [dict(zip(columnNames, row)) for row in dataRows]


class UsersResource(Resource):
	def __init__(self, infile):
		Resource.__init__(self, infile)
		self._userNameIndex = self._columnNames.index("LOGIN_NAME")
		self._usernames = set([row[self._userNameIndex] for row in self._rows if row[self._userNameIndex]])

	def getUserNames(self):
		return self._usernames

	def getUserData(self, username):
		return {username: self.getModels(username)}

	def getUsers(self):
		return [self.getUserData(username) for username in self.getUserNames()]

class GoPaymentReportDataHandler(object):
	def __init__(self, infile):
		self._users = UsersResource(infile)
	
	def revenueJson(self, outfile):
		"""
		Creates a json object mapping username to revenue ordered by month eg "nlintz":[["0","100","200","200"],[...]]
		The size of the revenue ordering is 12 x 4 since there are 12 months and four weeks in a month
		"""
		revenueByUser = {}
		for user in self._users.getUsers():
			revenueByMonth = map(lambda x: map(lambda x: 0, range(4)), range(12))
			username = user.keys()[0]
			revenueByUser.setdefault(username, revenueByMonth)
			for transaction in user[username]:
				month = helpers.getMonthFromDate(transaction["PURCHASE_DATE"])
				day = helpers.getDayFromDate(transaction["PURCHASE_DATE"])

				if int(day) < 7:
					revenueByUser[username][helpers.monthToInt(month)][0] += float(transaction["TOTAL"])
				if int(day) >= 7 and int(day) < 14:
					revenueByUser[username][helpers.monthToInt(month)][1] += float(transaction["TOTAL"])
				if int(day) >= 14 and int(day) < 21:
					revenueByUser[username][helpers.monthToInt(month)][2] += float(transaction["TOTAL"])
				else:
					revenueByUser[username][helpers.monthToInt(month)][3] += float(transaction["TOTAL"])
		helpers.writeToJson(revenueByUser, outfile)


	def transactionsJson(self, outfile):
		"""
		Creates a json object mapping username to weekly transactions volume by month and by day of week eg "nlintz":[["0","100","1","0","100","1","2"],["200"...]]
		The size of the transactions ordering is 12 x 7 since there are 12 months amd 7 days in the week
		"""
		transactionByUser = {}
		for user in self._users.getUsers():
			username = user.keys()[0]
			transactionsByMonth = map(lambda x: map(lambda x: 0, range(7)), range(12))
			transactionByUser.setdefault(username, transactionsByMonth)

			for transaction in user[username]:
				month = helpers.getMonthFromDate(transaction["PURCHASE_DATE"])
				dayOfWeek = helpers.getDayOfWeekFromDate(transaction["PURCHASE_DATE"])
				transactionByUser[username][helpers.monthToInt(month)][dayOfWeek] += 1
		helpers.writeToJson(transactionByUser, outfile)


if __name__ == "__main__":
	infile = open('data338Screened.csv', 'rU')
	report = GoPaymentReportDataHandler(infile)
	report.transactionsJson('transactions.json')
	report.revenueJson('revenue.json')
	infile.close()

def ProcessRevenueData(infile, outfile):
	report = GoPaymentReportDataHandler(infile)
	report.revenueJson(outfile)

def ProcessTransactionsData(infile, outfile):
	report = GoPaymentReportDataHandler(infile)
	report.transactionsJson(outfile)
