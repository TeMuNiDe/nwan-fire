const schema = require('./schema');
const { validateObject } = require('../utils/validator');

class Liability {
    constructor(liability) {
        validateObject(liability, schema.properties.liabilities.items, 'Liability');

        this.user = liability.user;
        this._id = liability._id;
        this.name = liability.name;
        this.description = liability.description; // Added description
        this.type = liability.type;
        this.value = liability.value;
        this.acquired = liability.aquired;
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

    setValue(value) {
        this.value = value;
    }

    getAcquired() {
        return this.acquired;
    }

    setAcquired(acquired) {
        this.acquired = acquired;
    }

    getAutoUpdate() {
        return this.autoUpdate;
    }

    setAutoUpdate(autoUpdate) {
        this.autoUpdate = autoUpdate;
    }

    toJson() {
        return {
            user: this.user,
            _id: this._id,
            name: this.name,
            description: this.description,
            type: this.type,
            value: this.value,
            aquired: this.acquired,
            auto_update: this.autoUpdate
        };
    }
}

module.exports = Liability;
