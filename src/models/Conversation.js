class Conversation {
    constructor({ _id = null, user, contents = [], timestamp }) {
        this._id = _id;
        this.user = user;
        this.contents = contents;
        this.timestamp = timestamp;
    }

    toJSON() {
        return {
            _id: this._id,
            user: this.user,
            contents: this.contents,
            timestamp: this.timestamp
        };
    }

    // Getters
    getId() {
        return this._id;
    }

    getUser() {
        return this.user;
    }

    getContents() {
        return this.contents;
    }

    getTimestamp() {
        return this.timestamp;
    }

    // Setters
    setId(id) {
        this._id = id;
    }

    setUser(user) {
        this.user = user;
    }

    setContents(contents) {
        this.contents = contents;
    }

    addMessage(role, parts) {
        this.contents.push({ role, parts });
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }
}

export default Conversation;
