const schema = require('./schema');
const { validateObject } = require('../utils/validator');

class Asset {
    constructor(asset) {
        validateObject(asset, schema.properties.assets.items, 'Asset');

        this.user = asset.user;
        this._id = asset._id;
        this.name = asset.name;
        this.description = asset.description; // Added description
        this.type = asset.type;
        this.value = asset.value;
        this.userWeight = asset.user_weight;
        this.acquired = asset.aquired;
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

    setValue(value) {
        this.value = value;
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

    setAcquired(acquired) {
        this.acquired = acquired;
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

    toJson() {
        return {
            user: this.user,
            _id: this._id,
            name: this.name,
            description: this.description,
            type: this.type,
            value: this.value,
            user_weight: this.userWeight,
            aquired: this.acquired,
            auto_update: this.autoUpdate,
            in_progress: this.inProgress
        };
    }
}

module.exports = Asset;
