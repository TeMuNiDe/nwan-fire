import db_manager from './db_manager';

   //TODO: create data models
class UserManager {
    db_manager:db_manager; 
    constructor() {
        this.db_manager = new db_manager();
    }

   async getUser(user:number) {
        return  this.db_manager.getUser(user);
    }
  async getInvestments(user:number) {
        let investments:any = await this.db_manager.getUserProperty("investment",user); 
        if (investments) {
        //console.log(investments);
        investments.forEach((investment:any,index:number)=>{
            //console.log("Main Loop");
            //console.log(investment);
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
   async getIncomes(user:number) {
       let incomes = await this.db_manager.getUserProperty("income",user);
       if (incomes) {return incomes} else {return []};
    }
  async getExpenditures(user:number) {
       let expenditures = await this.db_manager.getUserProperty("expenditure",user); 
       if (expenditures) {return expenditures} else {return []};
    }
   async getAssets(user:number) {
        let assets = await this.db_manager.getUserProperty("asset",user); 
        if(assets) { return assets} else { return []}
    }
   async getLiabilities(user:number) {
        let liabilities = await this.db_manager.getUserProperty("liability",user); 
        if (liabilities) {
            liabilities.forEach((liability:any,index:number)=>{
                //console.log("Main Loop");
                //console.log(investment);
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
    
    db_manager:db_manager;
    constructor() {
        this.db_manager= new db_manager();
    }

   static indexEntries(entries:any) {

        let months = entries.map((entry: { month: number; })=>entry.month);
        let names = entries.map((entry: { name: string; })=>entry.name);
        months = [...new Set(months)];
        names = [...new Set(names)];
        months.sort((a:any,b:any)=>b-a)
        let sorted: { user: number; data: string; month: any; name: any; gross: number; net: number; }[] = [];
        months.forEach(function (month: any) {
                names.forEach((name: any) => {
                    if (!entries.some((entry: { month: any; name: any; data:string}) => entry.month == month && entry.name == name)) {
                        sorted.push({ "user": 0, "data": entries[0].data, "month": month, "name": name, "gross": 0, "net": 0 });
                    } else {
                       sorted.push(entries.filter((entry:any)=>entry.month==month&&entry.name==name)[0]);
                    }
                });
            });     
        return {"index":{"months":months,"names":names},"data":sorted.sort((a,b)=>b.month-a.month)};
    }

    getProperty(id:string) {
       return this.db_manager.getProperty(id);
    }
    async setProperty(doc:any) {
        let response:any = await this.db_manager.postDocument(doc); 
        let updatedUser = await this.updateUserProperty(doc.user,doc.data);
        let updatedProperties = await this.db_manager.getUserProperty(doc.data,doc.user);
        console.log(response);
        console.log(updatedProperties);
        if(doc.data=="income"||doc.data=="expenditure") {
            let indexedProperties =  PropertyManager.indexEntries(updatedProperties);
         //   console.log("ID PROP");
           // console.log(indexedProperties);
           return {response:response,user:updatedUser,properties:indexedProperties};
        }
        return {response:response,user:updatedUser,properties:updatedProperties};
    }
    async updateUserProperty(user:number,property:string) {
        let user_doc:any = await this.db_manager.getUser(user);
        switch(property) {
           case "expenditure" : {
            let expenditures:any = await this.db_manager.getUserProperty(property,user);
            let months = expenditures.map((expenditure: { month: number; })=>expenditure.month);
           //  console.log(months);
             //console.log(expenditures);
            let last_month = Math.max(...months);
            let last_month_expenditure = 0;
            let total_expenditure = 0;
            for(let i=0;i<months.length;i++) {
                total_expenditure += expenditures[i].net
                if(expenditures[i].month == last_month) {last_month_expenditure += expenditures[i].net}
             }
             let average_income = total_expenditure/months.length;
             user_doc.expenditure.average = average_income;
             user_doc.expenditure.last_month = last_month_expenditure;
           //  console.log("Updated expenditure");
            // console.log(user_doc);
             break;

           }
           case "income" : {
               let incomes:any = await this.db_manager.getUserProperty(property,user);
               let months = incomes.map((income: { month: number; })=>income.month);
               // console.log(months);
              //  console.log(incomes);
               let last_month = Math.max(...months);
               let last_month_income = 0;
               let total_income = 0;
               for(let i=0;i<months.length;i++) {
                   total_income += incomes[i].net
                   if(incomes[i].month == last_month) {last_month_income += incomes[i].net}
                }
                let average_income = total_income/months.length;
                user_doc.income.average = average_income;
                user_doc.income.last_month = last_month_income;
              //  console.log(user_doc);
                break;
            }
            case "investment" :{
                let investments:any = await this.db_manager.getUserProperty(property,user);
                if (investments) {
                    let current_value = 0;
                    let y5_value = 0;
                    let y10_value = 0;
                    investments.forEach((investment:any)=>{
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
                    let assets:any = await this.db_manager.getUserProperty(property,user);
                    if (assets) {
                        let current_value = 0;
                        let y5_value = 0;
                        let y10_value = 0;
                        assets.forEach((asset:any)=>{
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
                        let liabilities:any = await this.db_manager.getUserProperty(property,user);
                        if (liabilities) {
                            let current_value = 0;
                            let y5_value = 0;
                            let y10_value = 0;
                            liabilities.forEach((liability:any)=>{
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

static  calculateLiabilityBalance(liability:any,term:string) {
    let current_date:Date = new Date();
    let effective_date:Date;
    let start_date = new Date(liability.start_date*1000);

    switch(term) {
        case "y5" : {
            effective_date = new Date(current_date.getFullYear()+5,current_date.getMonth(),current_date.getDate());
            break;
        }
        case "y10" : {
            effective_date = new Date(current_date.getFullYear()+10,current_date.getMonth(),current_date.getDate());
            break;
        }
        default : {
            effective_date = new Date();
        }
    }
    let term_months = DateDiff.inMonths(start_date,effective_date);
    let balance = liability.amount;
    for(let i=0;i<term_months;i++) {
        let interest = balance*liability.growth_rate/1200;
        balance += interest;
        if(i%liability.installment_frequency==0) {
            balance-=liability.installment;
        }
        if(balance<=0) {balance= 0;break};
    }

    return balance;
}    
static calculateSteadyGrowth(asset:any,term:string) {
    let current_date:Date = new Date();
    let effective_date:Date;
    
    let term_months:number = 0;

    switch(term) {
        case "y5" : {
            effective_date = new Date(current_date.getFullYear()+5,current_date.getMonth(),current_date.getDate());
            break;
        }
        case "y10" : {
            effective_date = new Date(current_date.getFullYear()+10,current_date.getMonth(),current_date.getDate());
            break;
        }
        default : {
            effective_date = new Date();
        }
    }
    term_months = DateDiff.inMonths(current_date,effective_date);
    return asset.current_value*(1+(term_months*asset.growth_rate)/1200);
}
static calculateInvestmnetForTerm(investment:any,term:string) {

    
    let growthRate = investment.growth_rate;
    let exitGrowthRate = growthRate;
    let compoundAtEnd = false;
    let term_months = 0;
    let exit_regexp = /(\S)([+|-])(\d+)%/;
  //  console.log(investment.exit_load);
    let exit_logic = exit_regexp.exec(investment.exit_load) || "I-0%";
  //  console.log(exit_logic);
    if (exit_logic[1] === "I") {
  
      exitGrowthRate = eval (investment.growth_rate+" "+exit_logic[2]+" "+exit_logic[3]);
   //  console.log(exitGrowthRate);
      
    }
    let current_date = new Date();
    let effective_date:Date ;
    let end_date = new Date(investment.end_date*1000);
    let start_date = new Date(investment.start_date*1000);
    switch (term) {
                        
        case "y5" : {
                            effective_date = new Date(current_date.getFullYear()+5,current_date.getMonth(),current_date.getDate());
                            break;
                        }
        case "y10" : {
                            effective_date = new Date(current_date.getFullYear()+10,current_date.getMonth(),current_date.getDate());
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
    if (DateDiff.inMonths(effective_date,end_date)>0) {
        growthRate = exitGrowthRate;
    } else {
        compoundAtEnd = true
    }
    term_months =  Math.min(DateDiff.inMonths(start_date,effective_date),DateDiff.inMonths(start_date,end_date));


  let accumulatedInterest = 0;
  let accumulatedPrincipal= investment.initial;
  let effectivePrincipal = investment.initial;
  let effectiveInterest = 0;
  for (let i=1;i<term_months;i++) {
    effectiveInterest += effectivePrincipal*growthRate/1200
    accumulatedInterest += effectivePrincipal*growthRate/1200
  //  console.log(i%investment.increment_frequency);
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
    static inDays(d1:Date, d2:Date) {
         let t2:number = d2.getTime();
         var t1:number = d1.getTime();
 
         return (t2-t1)/(24*3600*1000);
     }
      static inWeeks (d1:Date, d2:Date) {
         var t2 = d2.getTime();
         var t1 = d1.getTime();
 
         return (t2-t1)/(24*3600*1000*7);
      }
      static inMonths (d1:Date, d2:Date) {
         var d1Y = d1.getFullYear();
         var d2Y = d2.getFullYear();
         var d1M = d1.getMonth();
         var d2M = d2.getMonth();
 
         return (d2M+12*d2Y)-(d1M+12*d1Y);
      }
      static inYears (d1:Date, d2:Date) {
         return d2.getFullYear()-d1.getFullYear();
     }
 }
 

export {UserManager,PropertyManager}