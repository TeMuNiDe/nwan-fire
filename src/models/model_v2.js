import fs from 'fs';
import path from 'path';
import User from './User.js';
import Asset from './Asset.js';
import Transaction from './Transaction.js';
import Liability from './Liability.js';
import schema from './schema.js'; // Import the schema directly

const dataPath = path.resolve('./src/models/data.json');

let sample_data = null;

console.log('Schema loaded:', schema);

try {
    const sampleDataContent = fs.readFileSync(dataPath, 'utf-8');
    sample_data = JSON.parse(sampleDataContent);
    console.log('Sample data loaded.',sample_data);
} catch (err) {
    console.error('Failed to read data.json:', err);
}

function get_sample_user() {
    if (sample_data && sample_data.users && sample_data.users.length > 0) {
        return new User(sample_data.users[0]);
    }
    return null;
}

function get_sample_transactions() {
    if (sample_data && sample_data.transactions && sample_data.transactions.length > 0) {
        return sample_data.transactions.map(transaction=>new Transaction(transaction));
    }
    return null;
}

function get_sample_liabilities() {
    if (sample_data && sample_data.liabilities && sample_data.liabilities.length > 0) {
        return sample_data.liabilities.map(liabilityData => new Liability(liabilityData));
    }
    return null;
}

function get_sample_assets() {
    if (sample_data && sample_data.assets && sample_data.assets.length > 0) {
        return sample_data.assets.map(assetData => new Asset(assetData));
    }
    return [];
}

export  {
    schema,
    get_sample_user,
    get_sample_assets,
    get_sample_transactions,
    get_sample_liabilities
};
