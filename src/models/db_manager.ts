
import fetch from "node-fetch";
class db_manager {
     dbName = process.env.DB_NAME;
     dbHost = process.env.DB_HOST;
    constructor() {   

    }
    async postFind(selector:any) {

      let result = await fetch(this.dbHost+"/"+this.dbName+"/_find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"selector":selector})
      }).then((res) => { if (res.status=="200") {return res.json()} else {return null}}); 
      return result;
    } 
    async getUser(id:number) {
        let selector = {
            data: {
              '$eq': "user"
            },  id: {
                '$eq': id
              }
          };         
          console.log(selector);
          let result = await this.postFind(selector)
          if(result) {  
            return result.docs[0];
           } else {return null}
        }

    async getUserProperty(type:string,user:number) {
        let selector = {
            "data": {
              '$eq':type
            },  "user": {
                '$eq': user
              }
          };         
        let result = await this.postFind(selector);
         // console.log(result);
         if(result) {  
          return result.docs;
         } else {return null}
    }
    async getProperty(id:string) {
        let selector = {
            "_id": {
                '$eq': id
              }
          };         
         let result = await this.postFind(selector)
 
         // console.log(result) ;
       if(result) {  
        return result.docs;
       } else {return null}
    }
    async postDocument(doc:any) {

      //check if document exists

      if (doc._id) {
        let get_result = await fetch(this.dbHost+"/"+this.dbName+"/"+doc._id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.status); 
        if (get_result=="200") {
          console.log("Document already exists");
          console.log(doc);
         let result =  await this.putDocument(doc._id,doc);
          return result;
        }
      }
      
      let result = await fetch(this.dbHost+"/"+this.dbName, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doc)
      }).then((res) => { if (res.status=="200") {return res.json()} else {return null}}); 
      return result;
    }
    async putDocument (id:string,doc:any) {
      let result = await fetch(this.dbHost+"/"+this.dbName+"/"+id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doc)
      }).then((res) => { if (res.status=="200") {return res.json()} else {return null}}); 
      return result;
    }

}

export default db_manager;