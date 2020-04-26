const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = new express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3001
var fs = require('fs');
var admin = require("firebase-admin");
var serviceAccount = require("./words-movies-firebase-adminsdk-udl0t-722049ea9f.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://words-movies.firebaseio.com"
});
let db = admin.firestore();




// fetching sayings

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.get('/api/random', (req, res) => {
    var docRef = db.collection("words").doc("pulp-fiction");

    docRef.get().then(function(doc) {
        if (doc.exists) {
            let sayings = doc.data().data;
            let totalSayings = sayings.length-1;
            let randomSaying= Math.floor(Math.random() * totalSayings) + 1
            console.log('total sayings',sayings.length)
            console.log('random saying id', randomSaying)
            console.log(sayings[randomSaying])
            res.json({ status: true, sayings: sayings[randomSaying]})

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            res.json({ status: false})
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

})


// extracting words 


// fs.readFile('./subtitlefiles/Dunkirk.2017.720p.BluRay.x264-[YTS.AG].srt', 'utf8', function (err, data) {
//     if (err) throw err;
//     let arrowSplitData = data.split('-->')
//     let dataRemovedData = arrowSplitData.filter(data => data !== 'data');
//     let dialogue = []
//     dataRemovedData.forEach((data) => {
//         let onlyDialogue = data.replace(/[^A-Za-z, .?!']+/g, '');
//         let removedComma = onlyDialogue.slice(2, onlyDialogue.length - 2);
//         dialogue.push(removedComma.trim(' '));
//     })
//     let removeFirstAndLast = dialogue.slice(10, dialogue.length - 10)
//     console.log('removeFirstAndLast', removeFirstAndLast)
//     // db.collection("words").doc('pulp-fiction').set({
//     //     data: removeFirstAndLast
//     // }, { merge: true }).then(() => {
//     //     console.log('data saved')
//     // }).catch((err) => console.log(err))
// });

app.listen(port, () => {
    console.log('server is running up')
})

