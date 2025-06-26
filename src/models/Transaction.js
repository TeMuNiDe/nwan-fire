class Transaction {
    constructor(transaction) {
        this.user = transaction.user;
        this.id = transaction.id;
        this.date = transaction.date;
        this.amount = transaction.amount;
        this.type = transaction.type;
        this.source = transaction.source;
        this.sourceId = transaction.source_id;
        this.category = transaction.category;
        this.title = transaction.title;
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

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
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

    getType() {
        return this.type;
    }

    setType(type) {
        const validTypes = ["credit", "debit"];
        if (!validTypes.includes(type)) {
            throw new Error(`Invalid transaction type: ${type}. Must be one of ${validTypes.join(", ")}.`);
        }
        this.type = type;
    }

    getSource() {
        return this.source;
    }

    setSource(source) {
        const validSources = ["income", "expense", "asset", "liability"];
        if (!validSources.includes(source)) {
            throw new Error(`Invalid transaction source: ${source}. Must be one of ${validSources.join(", ")}.`);
        }
        this.source = source;
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

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getTarget() {
        return this.target;
    }

    setTarget(target) {
        const validTargets = ["income", "expense", "asset", "liability"];
        if (!validTargets.includes(target)) {
            throw new Error(`Invalid transaction source: ${target}. Must be one of ${validTargets.join(", ")}.`);
        }
        this.target = target;
    }

    getTargetId() {
        return this.targetId;
    }

    setTargetId(targetId) {
        this.targetId = targetId;
    }

    toJson() {
        return {
            user: this.user,
            id: this.id,
            date: this.date,
            amount: this.amount,
            type: this.type,
            source: this.source,
            source_id: this.sourceId,
            category: this.category,
            title: this.title,
            description: this.description,
            target: this.target,
            target_id: this.targetId
        };
    }
}

module.exports = Transaction;
