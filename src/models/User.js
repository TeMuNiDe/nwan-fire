import schema from './schema.js';
import { validateObject } from '../utils/validator.js';
import {
    startOfDay, endOfDay,
    startOfWeek, endOfWeek,
    startOfMonth, endOfMonth,
    startOfYear, endOfYear,
    addDays, addWeeks, addMonths, addYears,
    isBefore, isAfter, isEqual, format
} from 'date-fns';

class User {
    constructor(user) {
        validateObject(user, schema.properties.users.items, 'User');

        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.authToken = user.auth_token;
        this.riskScore = user.risk_score;
        this.riskTolerance = user.risk_tolerance;
        this.dateOfBirth = user.date_of_birth;
    }

    get_Id() {
        return this._id;
    }

    set_Id(_id) {
        this._id = _id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getAuthToken() {
        return this.authToken;
    }

    setAuthToken(authToken) {
        this.authToken = authToken;
    }

    getRiskScore() {
        return this.riskScore;
    }

    setRiskScore(riskScore) {
        this.riskScore = riskScore;
    }

    getRiskTolerance() {
        return this.riskTolerance;
    }


    getDateOfBirth() {
        return this.dateOfBirth;
    }

    setDateOfBirth(dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            email: this.email,
            auth_token: this.authToken,
            risk_score: this.riskScore,
            risk_tolerance: this.riskTolerance,
            date_of_birth: this.dateOfBirth
        };
    }

    /**
     * Finds the most recent value for an asset or liability before or on a given date.
     * @param {Array} values - The array of {date, value} objects.
     * @param {Date} targetDate - The date to find the value for.
     * @returns {number} The most recent value, or 0 if no value is found.
     */
    static getMostRecentValue(values, targetDate) {
        if (!values || values.length === 0) {
            return 0;
        }

        let mostRecent = null;
        let mostRecentDate = null;

        for (const item of values) {
            const itemDate = new Date(item.date); // Assuming item.date is now epoch milliseconds
            if (isBefore(itemDate, targetDate) || isEqual(itemDate, targetDate)) {
                if (!mostRecentDate || isAfter(itemDate, mostRecentDate)) {
                    mostRecentDate = itemDate;
                    mostRecent = item.value;
                }
            }
        }
        return mostRecent !== null ? mostRecent : 0;
    }

    /**
     * Calculates the aggregated net worth over a period.
     * @param {Array} assets - Array of Asset objects.
     * @param {Array} liabilities - Array of Liability objects.
     * @param {Date} startDate - The start date for the calculation.
     * @param {Date} endDate - The end date for the calculation.
     * @param {string} aggregation - 'daily', 'weekly', 'monthly', 'yearly'.
     * @returns {Array} An array of {date, value} objects representing aggregated net worth.
     */
    static calculateNetWorth(assets, liabilities, startDate, endDate, aggregation) {
        const result = [];
        let currentDate = startDate;

        while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
            let periodStartDate, periodEndDate;
            let periodLabel;

            switch (aggregation) {
                case 'daily':
                    periodStartDate = startOfDay(currentDate);
                    periodEndDate = endOfDay(currentDate);
                    periodLabel = format(currentDate, 'MMM dd');
                    break;
                case 'weekly':
                    periodStartDate = startOfWeek(currentDate, { weekStartsOn: 0 });
                    periodEndDate = endOfWeek(currentDate, { weekStartsOn: 0 });
                    periodLabel = format(currentDate, 'w, yyyy');
                    break;
                case 'monthly':
                    periodStartDate = startOfMonth(currentDate);
                    periodEndDate = endOfMonth(currentDate);
                    periodLabel = format(currentDate, 'MMM yyyy');
                    break;
                case 'yearly':
                    periodStartDate = startOfYear(currentDate);
                    periodEndDate = endOfYear(currentDate);
                    periodLabel = format(currentDate, 'yyyy');
                    break;
                default:
                    throw new Error('Invalid aggregation type');
            }

            let totalAssetsValue = 0;
            if (assets) {
                assets.forEach(asset => {
                    const assetValue = User.getMostRecentValue(asset.value, periodEndDate);
                    totalAssetsValue += assetValue;
                });
            }

            let totalLiabilitiesValue = 0;
            if (liabilities) {
                liabilities.forEach(liability => {
                    const liabilityValue = User.getMostRecentValue(liability.value, periodEndDate);
                    totalLiabilitiesValue += liabilityValue;
                });
            }

            result.push({
                date: periodStartDate.getTime(), // Epoch milliseconds
                label: periodLabel,
                value: totalAssetsValue - totalLiabilitiesValue,
            });

            // Move to the next period
            switch (aggregation) {
                case 'daily':
                    currentDate = addDays(currentDate, 1);
                    break;
                case 'weekly':
                    currentDate = addWeeks(currentDate, 1);
                    break;
                case 'monthly':
                    currentDate = addMonths(currentDate, 1);
                    break;
                case 'yearly':
                    currentDate = addYears(currentDate, 1);
                    break;
            }
        }

        return result;
    }

    static calculateInvestmentCapacity(user, transactions) {
        let totalIncome = 0;
        let totalExpense = 0;

        if (transactions) {
            transactions.forEach(transaction => {
                if (transaction.source === 'income') {
                    totalIncome += transaction.amount;
                } else if (transaction.target === 'expense') {
                    totalExpense += transaction.amount;
                }
            });
        }

        const investmentCapacity = totalIncome - totalExpense;
        const riskScore = user.getRiskScore();
        const aggressiveCapacity = riskScore * investmentCapacity;
        const conservativeCapacity = investmentCapacity - aggressiveCapacity;

        return {
            investmentCapacity: investmentCapacity,
            aggressiveCapacity: aggressiveCapacity,
            conservativeCapacity: conservativeCapacity
        };
    }
}

export default User;
