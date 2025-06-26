class Asset {
    constructor(asset) {
        this.user = asset.user;
        this.id = asset.id;
        this.name = asset.name;
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

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
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
            id: this.id,
            name: this.name,
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
