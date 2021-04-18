const firebaseConfig = {
    apiKey: "AIzaSyDa65GTp7SbHvf0WO1P5qRHSfUdaPGDdoc",
    authDomain: "wsitewtest.firebaseapp.com",
    databaseURL: "https://wsitewtest.firebaseio.com",
    projectId: "wsitewtest",
    storageBucket: "wsitewtest.appspot.com",
    messagingSenderId: "983683153520",
    appId: "1:983683153520:web:89352a6415ee6a61697eb5",
    measurementId: "G-S9BV9W9NGS"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Database
let db = firebase.firestore();