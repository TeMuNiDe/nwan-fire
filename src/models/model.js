import db_manager from './db_manager.js';

//TODO: create data models
class UserManager {
    db_manager; 
    constructor() {
        this.db_manager = new db_manager();
    }

   async getUser(user) {
        return  this.db_manager.getUser(user);
    }
  async getInvestments(user) {
        let investments = await this.db_manager.getUserProperty("investment",user); 
        if (investments) {
        investments.forEach((investment,index)=>{
            investments[index].current_value = CalcUtils.calculateInvestmnetForTerm(investment,"current");
            investments[index]["5y_value"] = CalcUtils.calculateInvestmnetForTerm(investment,"y5");
            investments[index]["10y_value"] = CalcUtils.calculateInvestmnetForTerm(investment,"y10");
            investments[index].maturity = CalcUtils.calculateInvestmnetForTerm(investment,"maturity");
        });
        return investments;
        } else {
            return [];
        }
    }
   async getIncomes(user) {
       let incomes = await this.db_manager.getUserProperty("income",user);
       if (incomes) {return incomes} else {return []};
    }
  async getExpenditures(user) {
       let expenditures = await this.db_manager.getUserProperty("expenditure",user); 
       if (expenditures) {return expenditures} else {return []};
    }
   async getAssets(user) {
        let assets = await this.db_manager.getUserProperty("asset",user); 
        if(assets) { return assets} else { return []}
    }
   async getLiabilities(user) {
        let liabilities = await this.db_manager.getUserProperty("liability",user); 
        if (liabilities) {
            liabilities.forEach((liability,index)=>{
                liabilities[index].current_value = CalcUtils.calculateLiabilityBalance(liability,"current");
                liabilities[index]["5y_value"] = CalcUtils.calculateLiabilityBalance(liability,"y5");
                liabilities[index]["10y_value"] = CalcUtils.calculateLiabilityBalance(liability,"y10");    
        });
            
          return liabilities;
        } else  {
            return [];
        }
    }
}

class PropertyManager {
    
    db_manager;
    constructor() {
        this.db_manager= new db_manager();
    }

   static indexEntries(entries) {

        let dates = entries.map((entry)=>entry.date);
        let names = entries.map((entry)=>entry.name);
        dates = [...new Set(dates)];
        names = [...new Set(names)];
        dates.sort((a,b)=>b-a)
        let sorted = [];
        dates.forEach(function (date) {
                names.forEach((name) => {
                    if (!entries.some((entry) => entry.date == date && entry.name == name)) {
                        sorted.push({ "user": 0, "data": entries[0].data, "date": date, "name": name, "gross": 0, "net": 0 });
                    } else {
                       sorted.push(entries.filter((entry)=>entry.date==date&&entry.name==name)[0]);
                    }
                });
            });     
        return {"index":{"dates":dates,"names":names},"data":sorted.sort((a,b)=>b.date-a.date)};
    }

    getProperty(id) {
       return this.db_manager.getProperty(id);
    }
    async setProperty(doc) {
        let response = await this.db_manager.postDocument(doc); 
        let updatedUser = await this.updateUserProperty(doc.user,doc.data);
        let updatedProperties = await this.db_manager.getUserProperty(doc.data,doc.user);
        console.log(response);
        console.log(updatedProperties);
        if(doc.data=="income"||doc.data=="expenditure") {
            let indexedProperties =  PropertyManager.indexEntries(updatedProperties);
           return {response:response,user:updatedUser,properties:indexedProperties};
        }
        return {response:response,user:updatedUser,properties:updatedProperties};
    }
    async updateUserProperty(user,property) {
        let user_doc = await this.db_manager.getUser(user);
        switch(property) {
           case "expenditure" : {
            let expenditures = await this.db_manager.getUserProperty(property,user);
            let dates = expenditures.map((expenditure)=>expenditure.date);
            let last_month = Math.max(...dates);
            let last_month_expenditure = 0;
            let total_expenditure = 0;
            for(let i=0;i<dates.length;i++) {
                total_expenditure += expenditures[i].net
                if(expenditures[i].date == last_month) {last_month_expenditure += expenditures[i].net}
             }
             let average_income = total_expenditure/dates.length;
             user_doc.expenditure.average = average_income;
             user_doc.expenditure.last_month = last_month_expenditure;
             break;

           }
           case "income" : {
               let incomes = await this.db_manager.getUserProperty(property,user);
               let dates = incomes.map((income)=>income.date);
               let last_month = Math.max(...dates);
               let last_month_income = 0;
               let total_income = 0;
               for(let i=0;i<dates.length;i++) {
                   total_income += incomes[i].net
                   if(incomes[i].date == last_month) {last_month_income += incomes[i].net}
                }
                let average_income = total_income/dates.length;
                user_doc.income.average = average_income;
                user_doc.income.last_month = last_month_income;
                break;
            }
            case "investment" :{
                let investments = await this.db_manager.getUserProperty(property,user);
                if (investments) {
                    let current_value = 0;
                    let y5_value = 0;
                    let y10_value = 0;
                    investments.forEach((investment)=>{
                        current_value += CalcUtils.calculateInvestmnetForTerm(investment,"current");
                        y5_value += CalcUtils.calculateInvestmnetForTerm(investment,"y5");
                        y10_value += CalcUtils.calculateInvestmnetForTerm(investment,"y10");
                    });
                    user_doc.investments.current_value = current_value;
                    user_doc.investments["5y_value"] = y5_value;
                    user_doc.investments["10y_value"] = y10_value;
                    } else {
                        user_doc.investments.current_value = 0;
                        user_doc.investments["5y_value"] = 0;
                        user_doc.investments["10y_value"] =0;
                    }
                    break;
                }
            case "asset" :{
                    let assets = await this.db_manager.getUserProperty(property,user);
                    if (assets) {
                        let current_value = 0;
                        let y5_value = 0;
                        let y10_value = 0;
                        assets.forEach((asset)=>{
                            current_value += asset.current_value;
                            y5_value += CalcUtils.calculateSteadyGrowth(asset,"y5");
                            y10_value += CalcUtils.calculateSteadyGrowth(asset,"y10");
                        });
                        user_doc.assets.current_value = current_value;
                        user_doc.assets["5y_value"] = y5_value;
                        user_doc.assets["10y_value"] = y10_value;
                        } else {
                            user_doc.assets.current_value = 0;
                            user_doc.assets["5y_value"] = 0;
                            user_doc.assets["10y_value"] =0;
                        }
                        break;
                    }
            case "liability" :{
                        let liabilities = await this.db_manager.getUserProperty(property,user);
                        if (liabilities) {
                            let current_value = 0;
                            let y5_value = 0;
                            let y10_value = 0;
                            liabilities.forEach((liability)=>{
                                current_value += CalcUtils.calculateLiabilityBalance(liability,"current");
                                y5_value += CalcUtils.calculateLiabilityBalance(liability,"y5");
                                y10_value += CalcUtils.calculateLiabilityBalance(liability,"y10");
                            });
                            user_doc.liabilities.current_value = current_value;
                            user_doc.liabilities["5y_value"] = y5_value;
                            user_doc.liabilities["10y_value"] = y10_value;
                            } else {
                                user_doc.liabilities.current_value = 0;
                                user_doc.liabilities["5y_value"] = 0;
                                user_doc.liabilities["10y_value"] =0;
                            }
                            break;
                        }
        }
        user_doc.networth.current_value =   user_doc.investments.current_value+ user_doc.assets.current_value - user_doc.liabilities.current_value
        user_doc.networth["5y_value"] =   user_doc.investments["5y_value"]+ user_doc.assets["5y_value"] - user_doc.liabilities["5y_value"]
        user_doc.networth["10y_value"] =   user_doc.investments["10y_value"]+ user_doc.assets["10y_value"] - user_doc.liabilities["10y_value"]

        await this.db_manager.postDocument(user_doc);
        return user_doc;
    }
}

class CalcUtils {

static  calculateLiabilityBalance(liability,term) {
    let current_date = new Date();
    let effective_date;
    let start_date = new Date(liability.start_date*1000);

    switch(term) {
        case "y5" : {
            effective_date = new Date(current_date.getFullYear()+5,current_date.getDate(),current_date.getDate());
            break;
        }
        case "y10" : {
            effective_date = new Date(current_date.getFullYear()+10,current_date.getDate(),current_date.getDate());
            break;
        }
        default : {
            effective_date = new Date();
        }
    }
    let term_dates = DateDiff.indates(start_date,effective_date);
    let balance = liability.amount;
    for(let i=0;i<term_dates;i++) {
        let interest = balance*liability.growth_rate/1200;
        balance += interest;
        if(i%liability.installment_frequency==0) {
            balance-=liability.installment;
        }
        if(balance<=0) {balance= 0;break};
    }

    return balance;
}    
static calculateSteadyGrowth(asset,term) {
    let current_date = new Date();
    let effective_date;
    
    let term_dates = 0;

    switch(term) {
        case "y5" : {
            effective_date = new Date(current_date.getFullYear()+5,current_date.getDate(),current_date.getDate());
            break;
        }
        case "y10" : {
            effective_date = new Date(current_date.getFullYear()+10,current_date.getDate(),current_date.getDate());
            break;
        }
        default : {
            effective_date = new Date();
        }
    }
    term_dates = DateDiff.indates(current_date,effective_date);
    return asset.current_value*(1+(term_dates*asset.growth_rate)/1200);
}
static calculateInvestmnetForTerm(investment,term) {

    let growthRate = investment.growth_rate;
    let exitGrowthRate = growthRate;
    let compoundAtEnd = false;
    let term_dates = 0;
    let exit_regexp = /(\S)([+|-])(\d+)%/;
    let exit_logic = exit_regexp.exec(investment.exit_load) || "I-0%";
    if (exit_logic[1] === "I") {
      exitGrowthRate = eval (investment.growth_rate+" "+exit_logic[2]+" "+exit_logic[3]);
    }
    let current_date = new Date();
    let effective_date ;
    let end_date = new Date(investment.end_date*1000);
    let start_date = new Date(investment.start_date*1000);
    switch (term) {
                        
        case "y5" : {
                            effective_date = new Date(current_date.getFullYear()+5,current_date.getDate(),current_date.getDate());
                            break;
                        }
        case "y10" : {
                            effective_date = new Date(current_date.getFullYear()+10,current_date.getDate(),current_date.getDate());
                            break;
                     }
        case "maturity" : {
                            effective_date = end_date;
                            break;
                        }
        default : {     
                             effective_date = current_date;           
                    }    
    }
    if (DateDiff.indates(effective_date,end_date)>0) {
        growthRate = exitGrowthRate;
    } else {
        compoundAtEnd = true
    }
    term_dates =  Math.min(DateDiff.indates(start_date,effective_date),DateDiff.indates(start_date,end_date));

  let accumulatedInterest = 0;
  let accumulatedPrincipal= investment.initial;
  let effectivePrincipal = investment.initial;
  let effectiveInterest = 0;
  for (let i=1;i<term_dates;i++) {
    effectiveInterest += effectivePrincipal*growthRate/1200
    accumulatedInterest += effectivePrincipal*growthRate/1200
     if (i%investment.increment_frequency==0) {
     accumulatedPrincipal += investment.increment;
     effectivePrincipal +=  investment.increment;
      }
     if (i%investment.compound_frequency==0) {
     effectivePrincipal += effectiveInterest
     effectiveInterest = 0;
     }
}

  if(compoundAtEnd){  
    accumulatedInterest += effectivePrincipal*growthRate/1200
  }
  return Math.ceil(accumulatedPrincipal+accumulatedInterest);

}
}

class DateDiff {    
    static inDays(d1, d2) {
         let t2 = d2.getTime();
         var t1 = d1.getTime();
 
         return (t2-t1)/(24*3600*1000);
     }
      static inWeeks (d1, d2) {
         var t2 = d2.getTime();
         var t1 = d1.getTime();
 
         return (t2-t1)/(24*3600*1000*7);
      }
      static indates (d1, d2) {
         var d1Y = d1.getFullYear();
         var d2Y = d2.getFullYear();
         var d1M = d1.getDate();
         var d2M = d2.getDate();
 
         return (d2M+12*d2Y)-(d1M+12*d1Y);
      }
      static inYears (d1, d2) {
         return d2.getFullYear()-d1.getFullYear();
     }
 }
 

export {UserManager,PropertyManager}
