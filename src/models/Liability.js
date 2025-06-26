class Liability {
    constructor(liability) {
        this.user = liability.user;
        this.id = liability.id;
        this.name = liability.name;
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
            id: this.id,
            name: this.name,
            type: this.type,
            value: this.value,
            aquired: this.acquired,
            auto_update: this.autoUpdate
        };
    }
}

module.exports = Liability;
