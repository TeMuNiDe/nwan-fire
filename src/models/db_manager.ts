
import {CloudantV1} from "@ibm-cloud/cloudant";

class db_manager {
     dbName = 'nwan-fire-db';
     cloudant:any ;
    constructor() {   
        if (process.env.CLOUDANT_URL){
           
            this.cloudant = CloudantV1.newInstance({serviceName:"CLOUDANT"});
            console.log("Connection Created");
        } else {
            this.cloudant = null;
        }
    } 
    async getUser(id:number) {
        if(!this.cloudant) {console.log("cloudant Not connected");return "Cant connect"}
        let selector = {
            data: {
              '$eq': "user"
            },  id: {
                '$eq': id
              }
          };         
         let result = await this.cloudant.postFind({
            db: 'nwan-fire-db',
            selector: selector,
          }).catch((err:any)=>{console.log(err)});
          //console.log(result);     
          if(result) {  
            return result.result.docs[0];
           } else {return null}
        }
    async getUserProperty(type:string,user:number) {
        if(!this.cloudant) {console.log("cloudant Not connected");return "Cant connect"}
        let selector = {
            "data": {
              '$eq':type
            },  "user": {
                '$eq': user
              }
          };         
         let result = await this.cloudant.postFind({
            db: 'nwan-fire-db',
            selector: selector,
          }).catch((err:any)=>{console.log(err)});      
         // console.log(result);
         if(result) {  
          return result.result.docs;
         } else {return null}
    }
    async getProperty(id:string) {
        if(!this.cloudant) {console.log("cloudant Not connected");return "Cant connect"}
        let selector = {
            "_id": {
                '$eq': id
              }
          };         
         let result = await this.cloudant.postFind({
            db: 'nwan-fire-db',
            selector: selector,
          }).catch((err:any)=>{console.log(err)});; 
         // console.log(result) ;
       if(result) {  
        return result.result.docs;
       } else {return null}
    }
    async postDocument(doc:CloudantV1.Document) {
      if(!this.cloudant) {console.log("cloudant Not connected");return "Cant connect"}
      return this.cloudant.postDocument({db: this.dbName,document: doc}).catch((err:any)=>{console.log(err)});;
    }    

}

export default db_manager;