import sample_data from './sample_data.json';
    //TODO: create data models
class User {
   
    toJSON() {
        return sample_data.user;
    }
    getInvestments() {
        return [sample_data.investment];
    }
    getIncomes() {
        return sample_data.incomes;
    }
    getExpenditures() {
        return sample_data.expenditures;
    }
    getAssets() {
        return [sample_data.asset];
    }
    getLiabilities() {
        return [sample_data.liability];
    }
    
}
 class Investment {
    toJSON() {
        return sample_data.investment;
    }
    
}
 class Income {
    toJSON() {
        return sample_data.incomes;
    }
    
}
 class Expenditure {
    toJSON() {
        return sample_data.expenditures;
    }
}
 class Asset {
    toJSON() {
        return sample_data.asset;
    }
    
}
 class Liability {
    toJSON() {
        return sample_data.liability;
    }
    
}
export {User,Investment,Income,Expenditure,Asset,Liability}