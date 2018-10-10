/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _learnReact = __webpack_require__(1);
	
	var _learnReact2 = _interopRequireDefault(_learnReact);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//START Utility functions
	function returnUniqueKey() {
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
	    firebase.auth().onAuthStateChanged(function (user) {
	        if (user) {
	            document.getElementById('logged-out').style.display = 'none';
	            var name = user.displayName;
	            /* If the provider gives a display name, use the name for the
	            personal welcome message. Otherwise, use the user's email. */
	            var welcomeName = name ? name : user.email;
	            user.getToken().then(function (idToken) {
	                window.userIdToken = idToken;
	                window.userUid = user.uid;
	                /* Now that the user is authenicated, fetch the notes. */
	                ReactDOM.render(React.createElement(_learnReact2.default, null), document.getElementById('logged-in'));
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
	        firebase.auth.EmailAuthProvider.PROVIDER_ID],
	        //credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
	        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
	        // Terms of service url
	        'tosUrl': '<your-tos-url>'
	    };
	
	    var ui = new firebaseui.auth.AuthUI(firebase.auth());
	    ui.start('#firebaseui-auth-container', uiConfig);
	}
	// [END gae_python_firebase_login]
	
	var signOutBtn = document.getElementById('sign-out');
	var testDLBtn = document.getElementById('testDL');
	
	// Sign out a user
	signOutBtn.onclick = function () {
	    firebase.auth().signOut().then(function () {
	        console.log("Sign out successful");
	    }, function (error) {
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// This is the host for the backend.
	if (location.hostname == 'localhost') {
	    var backendHostUrl = 'http://localhost:5000';
	} else {
	    var backendHostUrl = 'http://flask.jgorasia.com:80';
	}
	
	var ImageBox = function (_React$Component) {
	    _inherits(ImageBox, _React$Component);
	
	    function ImageBox(props) {
	        _classCallCheck(this, ImageBox);
	
	        var _this = _possibleConstructorReturn(this, (ImageBox.__proto__ || Object.getPrototypeOf(ImageBox)).call(this, props));
	
	        _this.state = { data: null,
	            showFullImage: false };
	        return _this;
	    }
	
	    _createClass(ImageBox, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var imgKey = this.props.name;
	            var storageRef = window.fire_storage.ref();
	            var ImageBoxObject = this;
	            if (this.props.imagePresent) {
	                storageRef.child('user').child(window.userUid).child(imgKey + '.png').getDownloadURL().then(function (result) {
	                    ImageBoxObject.setState({ data: result });
	                }).catch(function (error) {
	                    console.log('Download storage error');
	                    console.log(error);
	                });
	            }
	        }
	    }, {
	        key: 'handleImageClick',
	        value: function handleImageClick(e) {
	            this.state.showFullImage ? this.setState({ showFullImage: false }) : this.setState({ showFullImage: true });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;
	
	            if (this.props.imagePresent) {
	                if (this.state.data) {
	                    var sectionClassname = this.state.showFullImage ? "section medialarge" : "section media";
	                    return React.createElement(
	                        'div',
	                        { className: sectionClassname, onClick: function onClick(e) {
	                                return _this2.handleImageClick(e);
	                            } },
	                        React.createElement('img', {
	                            src: this.state.data,
	                            alt: 'Image from cloud storage'
	                        })
	                    );
	                }
	                return React.createElement(
	                    'div',
	                    null,
	                    'Loading...'
	                );
	            }
	            return React.createElement('div', null);
	        }
	    }]);
	
	    return ImageBox;
	}(React.Component);
	
	var ReadAbleTime = function (_React$Component2) {
	    _inherits(ReadAbleTime, _React$Component2);
	
	    function ReadAbleTime(props) {
	        _classCallCheck(this, ReadAbleTime);
	
	        return _possibleConstructorReturn(this, (ReadAbleTime.__proto__ || Object.getPrototypeOf(ReadAbleTime)).call(this, props));
	    }
	
	    _createClass(ReadAbleTime, [{
	        key: 'render',
	        value: function render() {
	            return React.createElement(
	                'small',
	                null,
	                new Date(this.props.date).toLocaleDateString(),
	                ' ',
	                new Date(this.props.date).toLocaleTimeString('en-us')
	            );
	        }
	    }]);
	
	    return ReadAbleTime;
	}(React.Component);
	
	var CardsDisplay = function (_React$Component3) {
	    _inherits(CardsDisplay, _React$Component3);
	
	    function CardsDisplay(props) {
	        _classCallCheck(this, CardsDisplay);
	
	        var _this4 = _possibleConstructorReturn(this, (CardsDisplay.__proto__ || Object.getPrototypeOf(CardsDisplay)).call(this, props));
	
	        _this4.handleUpdateRow = _this4.handleUpdateRow.bind(_this4);
	        _this4.handleDeleteRow = _this4.handleDeleteRow.bind(_this4);
	        return _this4;
	    }
	
	    _createClass(CardsDisplay, [{
	        key: 'handleDeleteRow',
	        value: function handleDeleteRow(key, e) {
	            console.log('Child Delete ' + key);
	            this.props.onDisplayDelete(key);
	        }
	    }, {
	        key: 'handleUpdateRow',
	        value: function handleUpdateRow(key, message, e) {
	            console.log('Child Update' + key);
	            this.props.onDisplayUpdate(key, message);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this5 = this;
	
	            if (this.props.observationData) {
	                return this.props.observationData.map(function (singleEntry) {
	                    return React.createElement(
	                        'div',
	                        { className: 'col-md-6 col-sm-12', key: singleEntry.messageKey },
	                        React.createElement(
	                            'div',
	                            { className: 'card fluid' },
	                            React.createElement(
	                                'div',
	                                { className: 'section' },
	                                React.createElement(
	                                    'h3',
	                                    null,
	                                    singleEntry.message,
	                                    '  ',
	                                    React.createElement(ReadAbleTime, { date: singleEntry.timestamp })
	                                ),
	                                React.createElement(
	                                    'div',
	                                    { className: 'posTopRight' },
	                                    React.createElement(
	                                        'span',
	                                        { className: 'w3-hover-red w3-padding',
	                                            onClick: function onClick(e) {
	                                                return _this5.handleUpdateRow(singleEntry.messageKey, singleEntry.message, e);
	                                            } },
	                                        'edit'
	                                    ),
	                                    React.createElement(
	                                        'span',
	                                        { className: 'w3-hover-red w3-padding',
	                                            onClick: function onClick(e) {
	                                                return _this5.handleDeleteRow(singleEntry.messageKey, e);
	                                            } },
	                                        'X'
	                                    )
	                                )
	                            ),
	                            React.createElement(ImageBox, {
	                                name: singleEntry.messageKey,
	                                imagePresent: singleEntry.imagePresent
	                            })
	                        )
	                    );
	                }); //End map
	            }
	            return React.createElement(
	                'p',
	                null,
	                'The water would not boil. '
	            );
	        }
	    }]);
	
	    return CardsDisplay;
	}(React.Component);
	
	var NewObservationInput = function (_React$Component4) {
	    _inherits(NewObservationInput, _React$Component4);
	
	    function NewObservationInput(props) {
	        _classCallCheck(this, NewObservationInput);
	
	        var _this6 = _possibleConstructorReturn(this, (NewObservationInput.__proto__ || Object.getPrototypeOf(NewObservationInput)).call(this, props));
	
	        _this6.state = {
	            value: '',
	            fileInputValue: null,
	            fileInputLabel: 'Upload image'
	        };
	        _this6.fileInput = React.createRef();
	        _this6.handleChange = _this6.handleChange.bind(_this6);
	        _this6.handleSubmit = _this6.handleSubmit.bind(_this6);
	        _this6.handleFileInputChange = _this6.handleFileInputChange.bind(_this6);
	        return _this6;
	    }
	
	    _createClass(NewObservationInput, [{
	        key: 'handleChange',
	        value: function handleChange(e) {
	            this.setState({ value: e.target.value });
	        }
	    }, {
	        key: 'handleSubmit',
	        value: function handleSubmit(e) {
	            e.preventDefault();
	            this.props.onChildSubmit(this.state.value);
	        }
	    }, {
	        key: 'handleFileInputChange',
	        value: function handleFileInputChange(e) {
	            console.log("File input changed");
	            var curFiles = this.fileInput.current.files;
	            if (curFiles.length > 0) {
	                this.setState({ fileInputLabel: curFiles.length + " files selected" });
	                this.props.onFileInputChange(curFiles);
	            } else {
	                this.setState({ fileInputLabel: "No file selected" });
	            }
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return React.createElement(
	                'div',
	                { className: 'col-sm-12 col-lg-12' },
	                React.createElement(
	                    'form',
	                    { onSubmit: this.handleSubmit },
	                    React.createElement('textarea', { className: 'doc noteInput', value: this.state.value, onChange: this.handleChange, placeholder: 'Type observation here' }),
	                    React.createElement('input', { type: 'file', id: 'file_upload3', ref: this.fileInput, name: 'file_upload', accept: 'image/*', capture: 'camera', onChange: this.handleFileInputChange, className: 'inputfile', multiple: true }),
	                    React.createElement(
	                        'label',
	                        { htmlFor: 'file_upload3' },
	                        React.createElement(
	                            'span',
	                            null,
	                            this.state.fileInputLabel
	                        )
	                    ),
	                    React.createElement(
	                        'button',
	                        { type: 'submit', id: 'addnote', className: 'primary' },
	                        'Save'
	                    )
	                )
	            );
	        }
	    }]);
	
	    return NewObservationInput;
	}(React.Component);
	
	var DisplayFilter = function (_React$Component5) {
	    _inherits(DisplayFilter, _React$Component5);
	
	    function DisplayFilter(props) {
	        _classCallCheck(this, DisplayFilter);
	
	        var _this7 = _possibleConstructorReturn(this, (DisplayFilter.__proto__ || Object.getPrototypeOf(DisplayFilter)).call(this, props));
	
	        _this7.state = {
	            value: ''
	        };
	        _this7.handleFilterTodayChange = _this7.handleFilterTodayChange.bind(_this7);
	        return _this7;
	    }
	
	    _createClass(DisplayFilter, [{
	        key: 'handleFilterTodayChange',
	        value: function handleFilterTodayChange(e) {
	            console.log("Trying to filter " + e.target.name);
	            this.props.onFilterToday(e.target.name);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return React.createElement(
	                'div',
	                { className: 'col-sm-12 col-lg-12' },
	                React.createElement(
	                    'button',
	                    { name: 'filterShowAll', className: 'primary', onClick: this.handleFilterTodayChange },
	                    ' All '
	                ),
	                React.createElement(
	                    'button',
	                    { name: 'filterToday', className: 'primary', onClick: this.handleFilterTodayChange },
	                    ' Today '
	                )
	            );
	        }
	    }]);
	
	    return DisplayFilter;
	}(React.Component);
	
	var Parent = function (_React$Component6) {
	    _inherits(Parent, _React$Component6);
	
	    function Parent(props) {
	        _classCallCheck(this, Parent);
	
	        var _this8 = _possibleConstructorReturn(this, (Parent.__proto__ || Object.getPrototypeOf(Parent)).call(this, props));
	
	        _this8.handleInputSubmit = _this8.handleInputSubmit.bind(_this8);
	        _this8.handleFileInputChange = _this8.handleFileInputChange.bind(_this8);
	        _this8.handleDisplayDelete = _this8.handleDisplayDelete.bind(_this8);
	        _this8.handleDisplayUpdate = _this8.handleDisplayUpdate.bind(_this8);
	        _this8.handleFilterTodayChange = _this8.handleFilterTodayChange.bind(_this8);
	        _this8.state = { dataR: null, dataF: null, fileToUpload: null };
	        return _this8;
	    }
	
	    _createClass(Parent, [{
	        key: 'fetchData',
	        value: function fetchData() {
	            console.log('Fetching fresh data');
	            var request = new XMLHttpRequest();
	            request.open('GET', backendHostUrl + '/get', true);
	            request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
	            request.onload = function () {
	                if (request.status >= 200 && request.status < 400) {
	                    //Got a response
	                    this.setState({ dataR: JSON.parse(request.response) });
	                } else {
	                    console.log('Reached server, but some error');
	                }
	            }.bind(this);
	            request.onerror = function () {
	                console.log('Connection error of some sort');
	            };
	            request.send();
	        }
	    }, {
	        key: 'handleInputSubmit',
	        value: function handleInputSubmit(m) {
	            console.log('Trying to save');
	            var messageTimestamp = new Date();
	            var uniqueKey = returnUniqueKey();
	            var request = new XMLHttpRequest();
	            request.open('POST', backendHostUrl + '/post', true);
	            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	            request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
	            request.onreadystatechange = function () {
	                if (request.readyState == 4 && request.status == 200) {
	                    if (this.state.fileToUpload) {
	                        console.log('Image to upload');
	                        this.uploadImage(uniqueKey);
	                    } else {
	                        console.log('No image to upload');
	                        this.fetchData();
	                    }
	                    console.log('Mission done');
	                }
	            }.bind(this);
	            var data = JSON.stringify({
	                'message': m,
	                'timestamp': messageTimestamp.toISOString(),
	                'messageKey': uniqueKey,
	                'imagePresent': this.state.fileToUpload ? true : false
	            });
	            request.send(data);
	        }
	    }, {
	        key: 'uploadImage',
	        value: function uploadImage(key) {
	            var mainContext = this;
	            console.log('Upload image' + this.state.fileToUpload.name);
	            var file = this.state.fileToUpload;
	            var metadata = {
	                contentType: 'image/' + file.name.split('.')[1]
	            };
	            // Upload file and metadata to the object 'images/mountains.jpg'
	            var uploadTask = window.fire_storage.ref().child('user/' + window.userUid + '/').child(key + '.png').put(file, metadata);
	            // Register three observers:
	            // 1. 'state_changed' observer, called any time the state changes
	            // 2. Error observer, called on failure
	            // 3. Completion observer, called on successful completion
	            uploadTask.on('state_changed', function (snapshot) {
	                // Observe state change events such as progress, pause, and resume
	                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	                var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
	                console.log('Upload is ' + progress + '% done');
	                switch (snapshot.state) {
	                    case firebase.storage.TaskState.PAUSED:
	                        // or 'paused'
	                        console.log('Upload is paused');
	                        break;
	                    case firebase.storage.TaskState.RUNNING:
	                        // or 'running'
	                        console.log('Upload is running');
	                        break;
	                }
	            }, function (error) {
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
	            }, function () {
	                mainContext.fetchData();
	                // Handle successful uploads on complete
	                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
	                //uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
	                //    console.log('File available at', downloadURL);
	                //});
	            });
	            // Listen for state changes, errors, and completion of the upload.
	        }
	    }, {
	        key: 'handleFileInputChange',
	        value: function handleFileInputChange(curFiles) {
	            if (curFiles.length > 0) {
	                console.log('Upload image');
	                this.setState({ fileToUpload: curFiles[0] });
	            } else {
	                this.setState({ fileToUpload: null });
	            }
	        }
	    }, {
	        key: 'handleDisplayUpdate',
	        value: function handleDisplayUpdate(key, oldText) {
	            console.log('Parent heard update ' + key);
	            var newText = prompt("Please edit the note:", oldText);
	            if (newText) {
	                var request = new XMLHttpRequest();
	                request.open('POST', backendHostUrl + '/update', true);
	                request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	                request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
	                request.onreadystatechange = function () {
	                    if (request.readyState == 4 && request.status == 200) {
	                        this.fetchData();
	                    }
	                }.bind(this);
	                var data = JSON.stringify({
	                    'messageKey': key,
	                    'message': newText
	                });
	                request.send(data);
	            } else {
	                console.log("Update cancelled");
	            }
	        }
	    }, {
	        key: 'handleDisplayDelete',
	        value: function handleDisplayDelete(key) {
	            console.log('Parent heard delete ' + key);
	            var request = new XMLHttpRequest();
	            request.open('POST', backendHostUrl + '/del', true);
	            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	            request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
	            request.onreadystatechange = function () {
	                if (request.readyState == 4 && request.status == 200) {
	                    this.fetchData();
	                }
	            }.bind(this);
	            var data = JSON.stringify({
	                'messageKey': key
	            });
	            request.send(data);
	        }
	    }, {
	        key: 'handleFilterTodayChange',
	        value: function handleFilterTodayChange(filterType) {
	            console.log("Parent heard to filter for today");
	            if (filterType == 'filterToday') {
	                var rawRetrivedData = this.state.dataR;
	                var filteredRetrivedData = rawRetrivedData.filter(function (singleItem) {
	                    var now = new Date();
	                    var d = new Date(singleItem.timestamp);
	                    if (d.toLocaleDateString() == now.toLocaleDateString()) {
	                        return singleItem;
	                    } else {
	                        return null;
	                    }
	                });
	                this.setState({ dataF: filteredRetrivedData });
	            } else if (filterType == 'filterShowAll') {
	                this.setState({ dataF: null });
	            }
	        }
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this.fetchData();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var dataToRender = null;
	            if (this.state.dataF == null) {
	                dataToRender = this.state.dataR;
	            } else {
	                dataToRender = this.state.dataF;
	            }
	            if (this.state.dataR == null) {
	                return React.createElement(
	                    'div',
	                    null,
	                    'Loading all observations...'
	                );
	            }
	            return React.createElement(
	                'div',
	                { className: 'container' },
	                React.createElement(
	                    'div',
	                    { className: 'row' },
	                    React.createElement(NewObservationInput, {
	                        onChildSubmit: this.handleInputSubmit,
	                        onFileInputChange: this.handleFileInputChange })
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'row' },
	                    React.createElement(
	                        'h2',
	                        null,
	                        'Note'
	                    )
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'row' },
	                    React.createElement(DisplayFilter, {
	                        onFilterToday: this.handleFilterTodayChange })
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'row' },
	                    React.createElement(CardsDisplay, {
	                        observationData: dataToRender,
	                        onDisplayUpdate: this.handleDisplayUpdate,
	                        onDisplayDelete: this.handleDisplayDelete })
	                )
	            );
	        }
	    }]);
	
	    return Parent;
	}(React.Component);
	
	exports.default = Parent;

/***/ })
/******/ ]);
//# sourceMappingURL=browser-bundle.js.map