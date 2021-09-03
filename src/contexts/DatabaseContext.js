import React, {useState} from 'react';

import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyCOAztES4XRbUpSKl4W1uhLfJg1cunblqc",
  authDomain: "trendy-essentials.firebaseapp.com",
  projectId: "trendy-essentials",
  storageBucket: "trendy-essentials.appspot.com",
  messagingSenderId: "429028692911",
  appId: "1:429028692911:web:c24d6c3090df74c6e5555a",
  measurementId: "G-JT7ESDXF6G"
};

const Datastore = require('nedb');
var dateFormat = require('dateformat');
var productsDB = new Datastore({
  filename: "path/to/products.db",
  autoload: true,
  onload: err => {
      if (err) {
          console.log("Error loading the DB: " + err);
      }
},
timestampData: true
}
);

var returnedDB = new Datastore({
  filename: "path/to/returned.db",
  autoload: true,
  onload: err => {
      if (err) {
          console.log("Error loading the DB: " + err);
      }
},
timestampData: true
}
);

var recordToUpdateDB = new Datastore({
  filename: "path/to/recordToUpdateDB.db",
  autoload: true,
  onload: err => {
      if (err) {
          console.log("Error loading the DB: " + err);
      }
},
timestampData: true
}
);

var productsID = new Datastore({
  filename: "path/to/productsID.db",
  autoload: true,
  onload: err => {
      if (err) {
          console.log("Error loading the DB: " + err);
      }
},
timestampData: true
}
);

var lastUpdateDB = new Datastore({
  filename: "path/to/lastUpdateDB.db",
  autoload: true,
  onload: err => {
      if (err) {
          console.log("Error loading the DB: " + err);
      }
},
timestampData: true
}
);



let firstProducts = [];

productsDB.find({},(err,docs) => {
  docs.forEach((doc) => {
    firstProducts.push(doc);
  })
});

let firstReturns = [];

returnedDB.find({},(err,docs) => {
  docs.forEach((doc) => {
    firstReturns.push(doc);
  })
});

let currentProductID = [];

let toBeUpdated = false;

// lastUpdateDB.remove({id: 'uid'},{multi:true},(err,removed) => {
//   if (err) {
//     console.log(err);
//   }else{
//     console.log("Removed ",removed);
//   }
// });

lastUpdateDB.findOne({id: 'uid'},(err,doc) => {

  if (doc !== null){
    let t2day = new Date();
    if (!doc.remindLater) {
      console.log("NOT REMIND LATER");

      let lastUpdated = doc.updateDate;
      var diff = Math.abs(t2day - lastUpdated);
      console.log("difference", diff);
      var ourdays = Math.round(diff/(1000*3600*24));
      // let toBeUpdated = false;
      console.log("OUR DAYS VAL", ourdays);
      if (ourdays >= 7) {
        toBeUpdated = true;
      }
    } else {
      console.log("REMIND LATER");
      let remindLaterDate = doc.remindLaterDate;
      let daysD = Math.round(Math.abs(t2day - remindLaterDate)/(1000*3600*24));
      if (daysD >= 1) {
        toBeUpdated = true;
      }else{
        console.log("BADO MBOGA");
      }
    }

  }else{
    const today = new Date();

    const newObj = {
      id : 'uid',
      updateDate: today,
      remindLater: false,
      remindLaterDate: today
    }
    lastUpdateDB.insert(newObj, (err,newDoc) => {
      if (err){
        console.log(err);
      }else{
        //lastUpdate.push(newDoc.updateDate);
      }
    });
  }
});



productsID.findOne({id: 'cid'},(err,doc) => {
  console.log("The doc",doc)
  if (doc !== null){
    currentProductID.push(doc.currentID);
  }else{
    const doc = {
      id: 'cid',
      currentID: 1000
    }
    productsID.insert(doc, (err,newDoc) => {
      if (err){
        console.log(err);
      }else{
        currentProductID.push(newDoc.currentID);

      }
    });
  }
})


// c0pied

var soldReportsDB = new Datastore({
  filename: "path/to/soldReports.db",
  autoload: true,
  onload: err => {
      if (err) {
          console.log("Error loading the DB: " + err);
      }
},
timestampData: true
}
);

var reportsID = new Datastore({
  filename: "path/to/reportsID.db",
  autoload: true,
  onload: err => {
      if (err) {
          console.log("Error loading the DB: " + err);
      }
},
timestampData: true
}
);


let firstReports = [];

soldReportsDB.find({},(err,docs) => {
  if(err){
    console.log(err);
  }else{
    docs.forEach((doc) => {
      firstReports.push(doc);
    })
  }
});

console.log("first reports",firstReports);

let currentReportID = [];

reportsID.findOne({id: 'rid'},(err,doc) => {
  if (doc !== null){
    currentReportID.push(doc.currentID);
  }else{
    const doc = {
      id: 'rid',
      currentID: 9000
    }
    reportsID.insert(doc, (err,newDoc) => {
      if (err){
        console.log(err);
      }else{
        currentReportID.push(newDoc.currentID);

      }
    });
  }
})

//copied


const DatabaseContext = React.createContext();

export const ProductProvider = (props) => {
  const [products,setProducts] = useState(firstProducts);
  const [returnedGoods,setReturnedGoods] = useState(firstReturns);
  const [productID,setProductID] = useState(currentProductID);
  const [updateBool, setUpdateBool] = useState(toBeUpdated);
  const [writeFail, setWriteFail] = useState(false);


  const setRD = (bool) => {
    if (bool){
      productsDB.find({},(err,docs) => {
        setProducts(docs);
      });
    }
  }

  const setRRG = () => {
      returnedDB.find({},(err,docs) => {
        setReturnedGoods(docs);
      });
  }

  const setUP = () => {
    lastUpdateDB.findOne({id: 'uid'},(err,doc) => {

      if (doc !== null){
        let t2day = new Date();
        if (!doc.remindLater) {
          console.log("NOT REMIND LATER");

          let lastUpdated = doc.updateDate;
          var diff = Math.abs(t2day - lastUpdated);
          console.log("difference", diff);
          var ourdays = Math.round(diff/(1000*3600*24));
          // let toBeUpdated = false;
          console.log("OUR DAYS VAL", ourdays);
          if (ourdays >= 7) {
            setUpdateBool(true);
          }else{
            setUpdateBool(false);
          }
        } else {
          console.log("REMIND LATER");
          let remindLaterDate = doc.remindLaterDate;
          let daysD = Math.round(Math.abs(t2day - remindLaterDate)/(1000*3600*24));
          if (daysD >= 1) {
            setUpdateBool(true);
          }else{
            setUpdateBool(false);
          }
        }

      }else{
        const today = new Date();

        const newObj = {
          id : 'uid',
          updateDate: today,
          remindLater: false,
          remindLaterDate: today
        }
        lastUpdateDB.insert(newObj, (err,newDoc) => {
          if (err){
            console.log(err);
          }
        });
      }
    });
  }

  const setRemindLater = () => {
    let t2 = new Date();
    lastUpdateDB.update({id: 'uid'}, {$set: {remindLater: true, remindLaterDate: t2}}, {multi: true}, (err, replaced) => {
      if (err) {
        console.log(err);
      }else{
        console.log("Updated", replaced);
      }
    });
  }

  const setUpdateFalse = () => {
    setUpdateBool(false);
  }




  const setProductsID = (sentID) => {
    let pid = sentID + 1;

    productsID.update({id : 'cid'},{$set: {currentID: pid}},{multi: true},(err,replaced) => {
      if(err){
        console.log(err);
      }else{
        console.log("replaced",replaced);
      }
    });

    let updatedID = [];

    productsID.findOne({id: 'cid'}, (err,doc) => {
      if(err){
        console.log(err);
      }else{
        updatedID.push(doc.currentID);
      }
    });

    setProductID(updatedID);
  }

  const setLastUpdateDateFunc =() => {
      let reportsToUpdate = [];
      recordToUpdateDB.find({},(err,docs) => {
        reportsToUpdate = docs;
        console.log(reportsToUpdate);
        if (reportsToUpdate.length > 0) {
          const firebaseApp = firebase.initializeApp(firebaseConfig);
          const firestoredb = firebase.firestore();
          const batch = firestoredb.batch();

          reportsToUpdate.map((rp) => {
            const docRef = firestoredb.collection("reports").doc(rp._id);
            batch.set(docRef,{
              color: String(rp.color),
              name: String(rp.name),
              soldQuantity: String(rp.makeSellQuantity),
              price: String(rp.price),
              size: String(rp.size),
              tillNo: String(rp.tillNo),
              type: String(rp.type),
              servedBy: String(rp.servedBy),
              year: String(rp.year),
              month: String(rp.month),
              day: String(rp.day)
            });
          });


          const addData = async() => {
            await batch.commit().then(res => {
              console.log("SUCESSFULL WRITE");

              reportsToUpdate.forEach((rp) => {
                recordToUpdateDB.remove({_id: rp._id},{multi:true},(err,removed) => {
                  if (err) {
                    console.log(err);
                  }else{
                    console.log("Removed after update",removed);
                  }
                });
              });

              let t2 = new Date();
              lastUpdateDB.update({id: 'uid'}, {$set: {updateDate: t2,remindLater: false}}, {multi: true}, (err, replaced) => {
                if (err) {
                  console.log(err);
                }else{
                  console.log("Updated", replaced);
                }
              });
            });

          }

          addData();
          //setWriteFail(true);

        }
      });




  }

  const addProduct = (product) => {
    product.pID = productID[0];
    productsDB.insert(product,(err,newDoc)=> {
      if(err){
        console.log(err);
      }else{
        console.log('Inserted ', newDoc.pName, newDoc.type);
      }
    });

    let updatedProducts = [];
    productsDB.find({},(err,docs) => {
      setProducts(docs);
      // docs.forEach((doc) => {
      //   updatedProducts.push(doc);
      // })
    });

    setProductsID(product.pID);
  }

  const addReturnedGood = (good) => {
    returnedDB.insert(good,(err,newDoc)=> {
      if(err){
        console.log(err);
      }else{
        console.log('Inserted ', newDoc);
      }
    });
    returnedDB.find({},(err,docs) => {
      setReturnedGoods(docs);
    });
  }

  const removeReturnedGood = (goodID) => {
    returnedDB.remove({_id: goodID},{multi: true}, (err,rme) => {
      if (err){
        console.log("error",err);
      }else{
        console.log("removed",rme);
      }
    });

    returnedDB.find({},(err,docs) => {
      setReturnedGoods(docs);
    });
  }
  const removeProduct = (pctID) => {
    productsDB.remove({_id: pctID},{multi: true}, (err,pRemoved) => {
      if (err){
        console.log("error",err);
      }else{
        console.log("removed",pRemoved);
      }
    });

    productsDB.find({},(err,docs) => {
      setProducts(docs);
      // docs.forEach((doc) => {
      //   updatedProducts.push(doc);
      // })
    });


    // setProducts((products) => {
    //   const updatedProducts = products.filter((obj) => obj.pID !== productID);
    //   return (updatedProducts);
    // });
  }

  const [reports,setReports] = useState(firstReports);
  const [reportID,setReportID] = useState(currentReportID);

  const setRRD = (bool) => {
    if (bool) {
      soldReportsDB.find({},(err,docs) => {
        if(err){
          console.log(err);
        }else{
          console.log("I am reloading");
          setReports(docs);
        }
      });
    }
  }

  const recordSell = (rp) =>{
    soldReportsDB.insert(rp, (err,doc) => {
      if(err){
        console.log(err);
      }else{
        console.log("inserted", doc);
      }
    });

    recordToUpdateDB.insert(rp,(err,doc) => {
      if (err) {
        console.log(err);
      }else{
        console.log("inserted in update", doc);
      }
    });

    let updatedReports = [];
    soldReportsDB.find({},(err,docs) => {
      setReports(docs);
      // docs.forEach((doc) => {
      //   updatedReports.push(doc);
      // });
    });

  }

  const removeReport = (reportID) => {
    soldReportsDB.remove({_id: reportID}, {multi: true}, (err,removed) => {
      if(err){
        console.log(err);
      }else{
        console.log("removed report",removed, reportID);
      }
    });

    recordToUpdateDB.remove({_id: reportID}, {multi: true}, (err,removed) => {
      if(err){
        console.log(err);
      }else{
        console.log("removed report",removed, reportID);
      }
    });
    setReports((reports) => {
      const updatedProducts = reports.filter((obj) => obj._id !== reportID);
      return (updatedProducts);
    });
  }
  const updateProduct = (productID, obj) => {
    productsDB.update({_id : productID},{$set :{
      pName: obj.pName,
      type: obj.type,
      quantity: parseInt(obj.quantity),
      size: obj.size,
      color: obj.color,
      price: obj.price,
    }},{}, (err,replaced) => {
      if(err){
        console.log(err);
      }else{
        console.log(replaced);
      }
    });
    productsDB.find({},(err,docs) => {
      setProducts(docs);
    });
    //setProducts(updatedProducts);
  }

  const updateProduct2 = (productID, newQ) => {
    productsDB.update({_id : productID},{$set :{
      quantity: parseInt(newQ)
    }},{}, (err,replaced) => {
      if(err){
        console.log(err);
      }else{
        console.log(replaced);
      }
    });
    productsDB.find({},(err,docs) => {
      setProducts(docs);
    });
    //setProducts(updatedProducts);
  }
  return (
    <DatabaseContext.Provider value={
      {productID,products,addProduct,updateProduct,updateProduct2,removeProduct,reports,recordSell,removeReport,setRD,setUpdateFalse,setRRD,updateBool,
        setRemindLater,setLastUpdateDateFunc,writeFail,setWriteFail,setUP,returnedGoods,addReturnedGood,removeReturnedGood,setRRG}
    }>
      {props.children}
    </DatabaseContext.Provider>

  )
}

export {productsDB};

export default DatabaseContext;
