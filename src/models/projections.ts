import { PropertyManager } from "./model";
import regression from "regression";
class Projections {
    
static projectAll(entries:any) {
    let indexedEntries = PropertyManager.indexEntries(entries);
    let entries_data:any = [];
    indexedEntries.index.months.forEach((month: any) => {
    //    console.log(month);
        let monthly_entries = entries.filter((entry: { month: any; })=>entry.month==month);
        let entry_net  = 0;
        monthly_entries.forEach((entry: { net: number; }) => {
            entry_net += entry.net;
        });
        entries_data.push([new Date(month*1000).getFullYear()*12+new Date(month*1000).getMonth()-2018*12,entry_net]);
    });
    let month_5 = entries_data[0][0]+5*12;
    let month_10 = entries_data[0][0]+10*12;
    let result_linear:any = regression.linear(entries_data);
    result_linear.y5 = result_linear.equation[0]*month_5+result_linear.equation[1];
    result_linear.y10 = result_linear.equation[0]*month_10+result_linear.equation[1];
    let result_log:any = regression.logarithmic(entries_data);
    result_log.y5 = result_log.equation[0]+ result_log.equation[1]*Math.log(month_5);
    result_log.y10 = result_log.equation[0]+ result_log.equation[1]*Math.log(month_10);
    let result_exp:any = regression.exponential(entries_data);
    result_exp.y5 = result_exp.equation[0]*Math.exp(result_exp.equation[1]*month_5);
    result_exp.y10 = result_exp.equation[0]*Math.exp(result_exp.equation[1]*month_10);
    let results_poly:any = []
    for (let i = 1; i<=6 ; i ++ ) {
        let result_poly:any = regression.polynomial(entries_data,{order:i});
        result_poly.y5 = 0;
        result_poly.y10 = 0;
        for (let order = 0 ; order< result_poly.equation.length ; order ++ ) {
            result_poly.y5+=result_poly.equation[order]*Math.pow(month_5,result_poly.equation.length-order-1)
            result_poly.y10+=result_poly.equation[order]*Math.pow(month_10,result_poly.equation.length-order-1)
        }
      results_poly.push(result_poly) ;
    }
    //console.log(entries_data);
   
return {
    inputs:entries_data,
    results:{result_linear:result_linear,result_log:result_log,result_exp:result_exp,results_poly:results_poly,month_5:month_5,month_10:month_10}
};


} 


}

export {Projections}