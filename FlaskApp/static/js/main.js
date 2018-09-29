document.addEventListener("DOMContentLoaded", function(){

//START Utility functions
function returnUniqueKey(){
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0];
}
//END Utility functions

// START UIcomponents
var app1 = new Vue({
    el: '#app1',
    data: {
        details: [],
        messageKeys: [],
        imgURLs: [],
        dataReady: [],
        allDataReady: false
    },
    methods:{
        idObject: function (index) {
            return 'img'+index
        },
        updateIndex(index){
            var updatedMessage = prompt("Please edit the note:", this.details[index]);
            updateNotes(this.messageKeys[index],updatedMessage)
        },
        deleteIndex(index){
            deleteNotes(this.messageKeys[index]);
        }
    } 
})    

//Interation for the sidebar
var layout   = document.getElementById('layout');
var menu     = document.getElementById('menu');
var menuLink = document.getElementById('menuLink');
var content  = document.getElementById('main');
function toggleClass(element, className) {
    var classes = element.className.split(/\s+/);
    var length = classes.length;
    for(var i=0; i < length; i++) {
        if (classes[i] === className) {
            classes.splice(i, 1);
            break;
        }
    }
    // The className is not found
    if (length === classes.length) {
        classes.push(className);
    }
    element.className = classes.join(' ');
}
function toggleAll(e) {
    var active = 'active';
    e.preventDefault();
    toggleClass(layout, active);
    toggleClass(menu, active);
    toggleClass(menuLink, active);
}

menuLink.onclick = function (e) {
    toggleAll(e);
    if (location.hostname == 'localhost'){
    console.log("Need to go home");}
    console.log(location.hostname);
};

content.onclick = function(e) {
    if (menu.className.indexOf('active') !== -1) {
        toggleAll(e);
    }
};
// END UIcomponents

// This is the host for the backend.
// TODO: When running Firenotes locally, set to http://localhost:8081. Before
// deploying the application to a live production environment, change to
// https://backend-dot-<PROJECT_ID>.appspot.com as specified in the
// backend's app.yaml file.
if (location.hostname == 'localhost'){
    var backendHostUrl = 'http://localhost:5000';
} else {
    var backendHostUrl = 'http://flask.jgorasia.com:80';
}
//console.log(location.hostname);

// [START gae_python_firenotes_config]
// Obtain the following from the "Add Firebase to your web app" dialogue
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDub9pBkaa9WLUf_qYcCg17leBLrQlLaUY",
    authDomain: "flooraid-3a654.firebaseapp.com",
    databaseURL: "https://flooraid-3a654.firebaseio.com",
    projectId: "flooraid-3a654",
    storageBucket: "flooraid-3a654.appspot.com"
};
// [END gae_python_firenotes_config]

// This is passed into the backend to authenticate the user.
var userIdToken = null;

// START Firebase log-in
function configureFirebaseLogin() {
    firebase.initializeApp(config);
    fire_storage = firebase.storage();
    // [START gae_python_state_change]
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            document.getElementById('logged-out').style.display = 'none';
            var name = user.displayName;
            /* If the provider gives a display name, use the name for the
            personal welcome message. Otherwise, use the user's email. */
            var welcomeName = name ? name : user.email;
            user.getToken().then(function(idToken) {
                userIdToken = idToken;
                userUid = user.uid;
                //console.log(userIdToken);
                //console.log(userUid);
                /* Now that the user is authenicated, fetch the notes. */
                fetchNotes();
                /* Now that the user is authenticated, fetch the image. */
                //fetchStorage('myimg');
                document.getElementById('user').textContent = welcomeName;
                document.getElementById('logged-in').style.display = '';    
            });

        } else {
            document.getElementById('logged-in').style.display = 'none';
            document.getElementById('logged-out').style.display = '';
        }
    });
} // END Firebase log-in

// [START configureFirebaseLoginWidget]
// https://github.com/firebase/firebaseui-web
// Firebase log-in widget
function configureFirebaseLoginWidget() {
    var uiConfig = {
    'signInSuccessUrl': '/index',
    'signInOptions': [
        //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    //credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    // Terms of service url
    'tosUrl': '<your-tos-url>',
    };

    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
}
// [END gae_python_firebase_login]

var signOutBtn = document.getElementById('sign-out');
var testDLBtn = document.getElementById('testDL');
var saveNoteBtn = document.getElementById('addnote');
var fileInpit = document.getElementById('file_upload');

// Sign out a user
signOutBtn.onclick = function() {
    firebase.auth().signOut().then(function() {
        console.log("Sign out successful");
    }, function(error) {
        console.log(error);
    });
};

//Dummy button for tests
testDLBtn.onclick = function (){
    console.log("Test DL button pressed")
}

// Fetch notes from the backend.
function fetchNotes() {
    console.log('Fetchnotes in the house');
    var request = new XMLHttpRequest();
    request.open('GET',backendHostUrl + '/get',true);
    //console.log('AGain');
    //console.log(userIdToken);
    request.setRequestHeader('Authorization', 'Bearer ' + userIdToken);
    request.onload = function(){
        if (this.status >= 200 && this.status<400){
            var data = JSON.parse(this.response);
            app1.details = [];
            app1.messageKeys = [];
            app1.dataReady = [];
            app1.imgURLs = [];
            for (var i = 0; i < data.length; i++) {
                app1.details.push(data[i].message);
                app1.messageKeys.push(data[i].messageKey);
                app1.imgURLs.push("");
            }
            for (i = 0; i < data.length; i++) { 
                fetchImageWithIndex(i);
            }
        }else{
            console.log('Reached server, but some error');       
        }
    }
    request.onerror = function() {
        console.log('Connection error of some sort');
    }
    request.send();

} //fetchNotes

function fetchImageWithIndex (imgIndex) {
    var imgKey = app1.messageKeys[imgIndex];
    var storageRef = fire_storage.ref();
    storageRef.child('user').child(userUid).child(imgKey+'.png').getDownloadURL().then(function(url) {
        console.log('Img dl success');
        app1.imgURLs[imgIndex] = url;
        app1.dataReady.push(true);
        if (app1.dataReady.length == app1.messageKeys.length){
            app1.allDataReady = true;
            console.log("All data Ready is "+app1.allDataReady);
            for (i = 0; i < app1.messageKeys.length; i++) { 
                var img = document.getElementById('img'+i);
                img.src = app1.imgURLs[i];
            }
        }
    }).catch(function(error) {
        console.log('Download storage error');
        console.log(error);
        app1.dataReady.push(true);
    });
}

function deleteNotes(messageKey){
    var request = new XMLHttpRequest();
    request.open('POST', backendHostUrl+'/del', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.setRequestHeader('Authorization', 'Bearer ' + userIdToken);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            fetchNotes();
       }
    };
    data = JSON.stringify({
        'messageKey': messageKey
    });
    request.send(data);    
}

function updateNotes(messageKey,newText){
    var request = new XMLHttpRequest();
    request.open('POST', backendHostUrl+'/update', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.setRequestHeader('Authorization', 'Bearer ' + userIdToken);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            fetchNotes();
       }
    };
    data = JSON.stringify({
        'messageKey': messageKey,
        'message':newText
    });
    request.send(data);
}

// Save a note to the backend
saveNoteBtn.addEventListener("click", function(event){
    event.preventDefault();
    console.log('Trying to save');
    var uniqueKey = returnUniqueKey();
    var noteField = document.getElementById('note-content');
    var note = noteField.value;
    var request = new XMLHttpRequest();
    request.open('POST', backendHostUrl+'/post', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.setRequestHeader('Authorization', 'Bearer ' + userIdToken);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            uploadImage(uniqueKey);                    
        }
    };
    data = JSON.stringify({'message': note,'messageKey': uniqueKey});
    request.send(data);
},false);

function uploadImage(key) {
    var curFiles = fileInpit.files;
    if (curFiles.length > 0){
        console.log('Upload image');
        console.log(curFiles[0].name);
        var file = curFiles[0];
        // Create the file metadata
        var metadata = {
            contentType: 'image/png'
        };
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = fire_storage.ref().child('user/'+userUid+'/').child(key+'.png').put(file, metadata);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },  function(error) {
            // Handle unsuccessful uploads
            switch (error.code) {
                case 'storage/unauthorized':
                console.log("User doesn't have permission to access the object");
                break;
                case 'storage/canceled':
                // User canceled the upload
                break;
                case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
        },  function() {
                fetchNotes();
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                });
        });
        // Listen for state changes, errors, and completion of the upload.
    }else{
        console.log("No file selected");
        fetchNotes();
    }
};

configureFirebaseLogin();
configureFirebaseLoginWidget();

}); //End onload
