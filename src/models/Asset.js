const schema = require('./schema');
const { validateObject } = require('../utils/validator');
const { startOfDay, isSameDay, isBefore } = require('date-fns');

class Asset {
    constructor(asset) {
        validateObject(asset, schema.properties.assets.items, 'Asset');
        this.user = asset.user;
        this._id = asset._id;
        this.name = asset.name;
        this.description = asset.description; // Added description
        this.type = asset.type;
        // Ensure value is always an array of {date, value} objects
        this.value = Array.isArray(asset.value) ? asset.value : [];
        this.units = asset.units; // Added units
        this.code = asset.code; // Added code
        this.userWeight = asset.user_weight;
        this.acquired = asset.acquired;
        this.scope = asset.scope; // Added scope
        this.autoUpdate = asset.auto_update;
        this.inProgress = asset.in_progress;
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

    setUnits(units) {
        this.units = units;
    }
    getUnits() {
        return this.units;
    }

    getUserWeight() {
        return this.userWeight;
    }

    setUserWeight(userWeight) {
        this.userWeight = userWeight;
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

    getInProgress() {
        return this.inProgress;
    }

    setInProgress(inProgress) {
        this.inProgress = inProgress;
    }
    getScope() {
        return this.scope;
    }
    setScope(scope) {
        this.scope = scope; 
    }

    getCode() {
        return this.code;
    }
    setCode(code) {
        this.code = code;
    }

    setDescription(description) {
        this.description = description;
    }
    getDescription() {
        return this.description;
    }   

    toJSON() {
        return {
            user: this.user,
            _id: this._id,
            name: this.name,
            description: this.description,
            type: this.type,
            value: this.value,
            units: this.units,
            code: this.code,
            user_weight: this.userWeight,
            acquired: this.acquired,
            scope: this.scope,
            auto_update: this.autoUpdate,
            in_progress: this.inProgress
        };
    }
}

module.exports = Asset;
