const schema = require('./schema');
const { validateObject } = require('../utils/validator');
const {
    startOfDay, endOfDay,
    startOfWeek, endOfWeek,
    startOfMonth, endOfMonth,
    startOfYear, endOfYear,
    addDays, addWeeks, addMonths, addYears,
    isBefore,isAfter, isEqual, format
} = require('date-fns');

class Transaction {
    constructor(transaction) {
        validateObject(transaction, schema.properties.transactions.items, 'Transaction');

        this.user = transaction.user;
        this._id = transaction._id;
        this.date = transaction.date;
        this.amount = transaction.amount;
        this.source = transaction.source;
        this.sourceId = transaction.source_id;
        this.category = transaction.category;
        this.name = transaction.name;
        this.description = transaction.description;
        this.target = transaction.target;
        this.targetId = transaction.target_id;
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
    }

    get_Id() {
        return this._id;
    }

    set_Id(_id) {
        this._id = _id;
    }

    getDate() {
        return this.date;
    }

    setDate(date) {
        this.date = date;
    }

    getAmount() {
        return this.amount;
    }

    setAmount(amount) {
        this.amount = amount;
    }


    getSource() {
        return this.source;
    }

    getSourceId() {
        return this.sourceId;
    }

    setSourceId(sourceId) {
        this.sourceId = sourceId;
    }

    getCategory() {
        return this.category;
    }

    setCategory(category) {
        this.category = category;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getTargetId() {
        return this.targetId;
    }

    setTargetId(targetId) {
        this.targetId = targetId;
    }

    toJSON() {
        return {
            user: this.user,
            _id: this._id,
            date: this.date,
            amount: this.amount,
            source: this.source,
            source_id: this.sourceId,
            category: this.category,
            name: this.name, // Corrected from title to name
            description: this.description,
            target: this.target,
            target_id: this.targetId
        };
    }

    /**
     * Aggregates transaction data into income and expenditure trends over a period.
     * @param {Array} transactions - Array of raw transaction objects.
     * @param {Date} startDate - The start date for the aggregation.
     * @param {Date} endDate - The end date for the aggregation.
     * @param {string} aggregation - 'daily', 'weekly', 'monthly', 'yearly'.
     * @returns {Array} An array of {date, income, expenditure} objects.
     */
    static getTrendData(transactions, startDate, endDate, aggregation) {
        const result = [];
        let currentDate = startDate;

        while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
            let periodStartDate, periodEndDate;
            let nextDate;

            switch (aggregation) {
                case 'daily':
                    periodStartDate = startOfDay(currentDate);
                    periodEndDate = endOfDay(currentDate);
                    nextDate = addDays(currentDate, 1);
                    break;
                case 'weekly':
                    periodStartDate = startOfWeek(currentDate, { weekStartsOn: 0 });
                    periodEndDate = endOfWeek(currentDate, { weekStartsOn: 0 });
                    nextDate = addWeeks(currentDate, 1);
                    break;
                case 'monthly':
                    periodStartDate = startOfMonth(currentDate);
                    periodEndDate = endOfMonth(currentDate);
                    nextDate = addMonths(currentDate, 1);
                    break;
                case 'yearly':
                    periodStartDate = startOfYear(currentDate);
                    periodEndDate = endOfYear(currentDate);
                    nextDate = addYears(currentDate, 1);
                    break;
                default:
                    throw new Error('Invalid aggregation type');
            }

            // Clamp period dates to the overall start and end dates
            const effectivePeriodStartDate = (isBefore(periodStartDate, startDate)) ? startDate : periodStartDate;
            const effectivePeriodEndDate = (isAfter(periodEndDate, endDate)) ? endDate : periodEndDate;

            let totalIncome = 0;
            let totalExpenditure = 0;

            transactions.forEach(transaction => {
                const transactionDate = new Date(transaction.date);
                if ((isAfter(transactionDate, effectivePeriodStartDate) || isEqual(transactionDate, effectivePeriodStartDate)) &&
                    (isBefore(transactionDate, effectivePeriodEndDate) || isEqual(transactionDate, effectivePeriodEndDate))) {
                    if (transaction.source === 'income') {
                        totalIncome += transaction.amount;
                    } else if (transaction.target === 'expense') {
                        totalExpenditure += transaction.amount;
                    }
                }
            });

            result.push({
                date: periodStartDate.getTime(), // Epoch milliseconds
                income: totalIncome,
                expenditure: totalExpenditure,
            });

            currentDate = nextDate;
        }

        return result;
    }
}

module.exports = Transaction;
