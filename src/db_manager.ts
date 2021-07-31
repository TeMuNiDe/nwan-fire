
import cfenv from "cfenv";
import Cloudant from "@cloudant/cloudant";
import { readFileSync } from 'fs';

class DBManager {
     dbName = 'nwan-fire-db';
     cloudant = null;
    constructor() {   
              
        var vcapLocal;
        try {
            vcapLocal = JSON.parse(readFileSync(new URL('./vcap-local.iam.json', import.meta.url)))
            console.log("Loaded local VCAP", vcapLocal);
        } catch (e) { }
            const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
            const appEnv = cfenv.getAppEnv(appEnvOpts);

        if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/[Cc][Ll][Oo][Uu][Dd][Aa][Nn][Tt]/)) {
            // Load the new Cloudant library.
        
            // Initialize database with credentials
            if (appEnv.services['cloudantNoSQLDB']) {
                this.cloudant = new Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
            } else {
            // user-provided service with 'cloudant' in its name
                this.cloudant = new Cloudant(appEnv.getService(/cloudant/).credentials);
            }
        } else if (process.env.CLOUDANT_URL){
            // Load the new Cloudant library.
        
            if (process.env.CLOUDANT_IAM_API_KEY){ // IAM API key credentials
                let cloudantURL = process.env.CLOUDANT_URL
                let cloudantAPIKey = process.env.CLOUDANT_IAM_API_KEY
                this.cloudant = new Cloudant({ url: cloudantURL, plugins: { iamauth: { iamApiKey: cloudantAPIKey } } });
            } else { //legacy username/password credentials as part of cloudant URL
                this.cloudant = new Cloudant(process.env.CLOUDANT_URL);
            }
        }
    }
    
    createDB() {
        this.appEnvcloudant.db.create(this.dbName, function(err, data) {
        if(!err) 
            console.log("Created database: " + dbName);
        else 
            console.log("Cound not create DB "+dbName+" "+err);
        });
    }

   
    async  getInvestments() {
        if(!this.cloudant) {console.log("cloudant Not connected");return "Cant connect"}
        let mydb = this.cloudant.db.use(this.dbName);
        if(!mydb) {console.log("DB Does not exist");return "Cant find db"}
       let data = await mydb.list({include_docs: true});
       console.log(data);
       return data.rows[0].doc.investments;
    }
}

export default DBManager;