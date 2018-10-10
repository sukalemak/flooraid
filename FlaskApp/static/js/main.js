import Parent from "./learnReact";

//START Utility functions
function returnUniqueKey(){
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0];
}
//END Utility functions

//console.log(location.hostname);

// [START firenotes_config]
// Obtain the following from the "Add Firebase to your web app" dialogue
var config = {
    apiKey: "AIzaSyDub9pBkaa9WLUf_qYcCg17leBLrQlLaUY",
    authDomain: "flooraid-3a654.firebaseapp.com",
    databaseURL: "https://flooraid-3a654.firebaseio.com",
    projectId: "flooraid-3a654",
    storageBucket: "flooraid-3a654.appspot.com"
};
// [END firenotes_config]

// This is passed into the backend to authenticate the user.
var userIdToken = null;
var userUid = null;
firebase.initializeApp(config);
window.fire_storage = firebase.storage();

// START Firebase log-in
function configureFirebaseLogin() {    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            document.getElementById('logged-out').style.display = 'none';
            var name = user.displayName;
            /* If the provider gives a display name, use the name for the
            personal welcome message. Otherwise, use the user's email. */
            var welcomeName = name ? name : user.email;
            user.getToken().then(function(idToken) {
                window.userIdToken = idToken;
                window.userUid = user.uid;
                /* Now that the user is authenicated, fetch the notes. */
                ReactDOM.render( <Parent />,document.getElementById('logged-in') );
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
    'signInSuccessUrl': '/',
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

// Sign out a user
signOutBtn.onclick = function() {
    firebase.auth().signOut().then(function() {
        console.log("Sign out successful");
    }, function(error) {
        console.log(error);
    });
};

//Dummy button for tests
// testDLBtn.onclick = clickedDLBtn;
// function clickedDLBtn(){
//     console.log("Test DL button pressed")
// }

// Code on how to use event.target
// document.querySelector('.notelist').addEventListener('click', function (event) {
//     if (event.target.classList.contains('dlImage')) {
//       console.log('Something happended')
//       if (event.target.style.visibility == 'hidden'){
//           event.target.style.visibility = '';
//       }
//       else {
//         event.target.style.visibility = 'hidden';
//       }
//       //event.target.setAttribute("style", "border: 1px solid blue;");
//     }
//   })

configureFirebaseLogin();
configureFirebaseLoginWidget();