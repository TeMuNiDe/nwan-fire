const schema = require('./schema');
const { validateObject } = require('../utils/validator');
const { startOfDay, isSameDay, isBefore } = require('date-fns');

class Liability {
    constructor(liability) {
        validateObject(liability, schema.properties.liabilities.items, 'Liability');

        this.user = liability.user;
        this._id = liability._id;
        this.name = liability.name;
        this.description = liability.description; // Added description
        this.type = liability.type;
        // Ensure value is always an array of {date, value} objects
        this.value = Array.isArray(liability.value) ? liability.value : [];
        this.acquired = liability.acquired;
        this.autoUpdate = liability.auto_update;
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

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getValue() {
        return this.value;
    }

    setValue(newValue) {
        const today = startOfDay(new Date());
        const todayEpoch = today.getTime(); // Get epoch timestamp

        if (!Array.isArray(this.value)) {
            this.value = [];
        }

        if (this.value.length > 0) {
            const lastEntry = this.value[this.value.length - 1];
            // Convert lastEntry.date to Date object for comparison, assuming it's an epoch timestamp
            if (isSameDay(new Date(lastEntry.date), today)) {
                // Update the last entry if it's from today
                lastEntry.value = newValue;
                lastEntry.date = todayEpoch; // Ensure date is start of today
            } else {
                // Append new entry if not from today
                this.value.push({ date: todayEpoch, value: newValue });
            }
        } else {
            // If no entries, add the first one
            this.value.push({ date: todayEpoch, value: newValue });
        }
    }

    getAcquired() {
        return this.acquired;
    }

    setAcquired(acquiredDate) {
        this.acquired = acquiredDate;
        if (this.value && Array.isArray(this.value)) {
            const acquiredStartOfDay = startOfDay(new Date(acquiredDate));
            this.value = this.value.filter(entry => {
                const entryDate = startOfDay(new Date(entry.date));
                return !isBefore(entryDate, acquiredStartOfDay);
            });
        }
    }

    getAutoUpdate() {
        return this.autoUpdate;
    }

    setAutoUpdate(autoUpdate) {
        this.autoUpdate = autoUpdate;
    }

    toJSON() {
        return {
            user: this.user,
            _id: this._id,
            name: this.name,
            description: this.description,
            type: this.type,
            value: this.value,
            acquired: this.acquired,
            auto_update: this.autoUpdate
        };
    }
}

module.exports = Liability;
