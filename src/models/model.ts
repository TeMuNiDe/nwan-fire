import sample_user from './sample_data.json';
    //TODO: create data models
class User {
    toJSON() {
        return sample_user.user;
    }
    
}
 class Investment {
    toJSON() {
        return sample_user.investment;
    }
    
}
 class Income {
    toJSON() {
        return sample_user.income;
    }
    
}
 class Expenditure {
    toJSON() {
        return sample_user.expenditure;
    }
}
 class Asset {
    toJSON() {
        return sample_user.asset;
    }
    
}
 class Liability {
    toJSON() {
        return sample_user.liability;
    }
    
}
export {User,Investment,Income,Expenditure,Asset,Liability}