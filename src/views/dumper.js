let sample_data = require('../models/sample_data.json');

let incomes = sample_data.incomes;

//console.log(incomes.data);


console.log(incomes.data.filter(item=>item.name=="salary"));