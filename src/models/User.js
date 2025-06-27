import schema from './schema.js';
import { validateObject } from '../utils/validator.js';

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
        this.netWorth = user.net_worth;
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

    getNetWorth() {
        return this.netWorth;
    }

    setNetWorth(netWorth) {
        this.netWorth = netWorth;
    }

    toJson() {
        return {
            _id: this._id,
            name: this.name,
            email: this.email,
            auth_token: this.authToken,
            risk_score: this.riskScore,
            risk_tolerance: this.riskTolerance,
            date_of_birth: this.dateOfBirth,
            net_worth: this.netWorth
        };
    }
}

export default User;
