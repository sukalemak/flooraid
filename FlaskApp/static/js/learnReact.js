class ImageBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {data:null};
    }
    componentDidMount () {
        var imgKey = this.props.name;
        var storageRef = fire_storage.ref();
        var ImageBoxObject = this;
        storageRef.child('user').child(userUid).child(imgKey+'.png').getDownloadURL()
        .then(function(result) {
            ImageBoxObject.setState({data:result});
        }).catch(function(error) {
            console.log('Download storage error');
            console.log(error);
        });
    }
    render(){
        if (this.state.data) {
            return (<img src={this.state.data} alt="Image from cloud storage"></img>)
        }
        return <div>Loading...</div>
    }
}

class ReadAbleTime extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <small>{new Date(this.props.date).toLocaleDateString()} {new Date(this.props.date).toLocaleTimeString('en-us')}</small>
        )
    }
}

class Parent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {renderText: null, 
            dataR: null,
            value: "",
            fileInputLabel: "Upload image"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.fileInput = React.createRef();
    }

    updateRow(id,oldText,e){
        console.log('Update '+id);
        var newText = prompt("Please edit the note:", oldText);
        var request = new XMLHttpRequest();
        request.open('POST', backendHostUrl+'/update', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', 'Bearer ' + userIdToken);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                this.fetchData();
           }
        }.bind(this);
        var data = JSON.stringify({
            'messageKey': id,
            'message':newText
        });
        request.send(data);
    }

    deleteRow(id,e){
        console.log('Delete' +id);
        var request = new XMLHttpRequest();
        request.open('POST', backendHostUrl+'/del', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                this.fetchData();
           }
        }.bind(this);
        var data = JSON.stringify({
            'messageKey': id
        });
        request.send(data);    
    }
    fetchData(){
        var request = new XMLHttpRequest();
        request.open('GET',backendHostUrl + '/get',true);
        request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
        request.onload = function(){
            if (request.status >= 200 && request.status<400){ //Got a response
                var requestData = JSON.parse(request.response);
                this.setState({dataR: requestData});
                this.renderCards();
            }else{
                console.log('Reached server, but some error');       
            }
        }.bind(this);
        request.onerror = function() {
            console.log('Connection error of some sort');
        }
        request.send();
    }

    uploadImage(key) {
        var curFiles = this.fileInput.current.files;
        var mainContext = this;
        if (curFiles.length > 0){
            console.log('Upload image');
            console.log(curFiles[0].name);
            var file = curFiles[0];
            var fileextension = file.name.split('.')[1];
            var metadata = {
                contentType: 'image/'+fileextension
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
                    mainContext.fetchData();
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    //uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    //    console.log('File available at', downloadURL);
                    //});
            });
            // Listen for state changes, errors, and completion of the upload.
        }else{
            console.log("No file selected");
            mainContext.fetchData();
        }
    };

    handleSubmit(event){
        event.preventDefault();
        console.log('Trying to save');
        var messageTimestamp = new Date();
        var uniqueKey = returnUniqueKey();
        var request = new XMLHttpRequest();
        request.open('POST', backendHostUrl+'/post', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', 'Bearer ' + userIdToken);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                this.uploadImage(uniqueKey);  
                console.log('Mission done')                  
            }
        }.bind(this);
        var data = JSON.stringify({
            'message': this.state.value,
            'timestamp': messageTimestamp.toISOString(),
            'messageKey': uniqueKey,
        });
        request.send(data);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleFileInputChange(event){
        var curFiles = this.fileInput.current.files;
        if (curFiles.length > 0){
            this.setState({fileInputLabel: curFiles.length+" files selected"});
        }else{
            this.setState({fileInputLabel: "No file selected"});
        }
    }

    someMethod(childwords) {
        console.log("Love you "+childwords);
    }

    componentDidMount() {
        this.fetchData();  
    }

    renderCards(){
        var listItems = this.state.dataR.map((singleEntry) =>
        (<div className="col-md-6 col-sm-12" key={singleEntry.messageKey}>
            <div className="card fluid" >
                <div className="section">
                    <h3>{singleEntry.message}  <ReadAbleTime date={singleEntry.timestamp}/></h3>
                    <div className="posTopRight">
                        <span className="w3-hover-red w3-padding" 
                        onClick={(e) => this.updateRow(singleEntry.messageKey, singleEntry.message,e)}>edit</span>
                        <span className="w3-hover-red w3-padding" 
                        onClick={(e) => this.deleteRow(singleEntry.messageKey, e)}>X</span>
                    </div>
                </div>
                <div className="section media">
                    <ImageBox name={singleEntry.messageKey}/>
                </div>
            </div>
        </div>)
        ); //End map
        this.setState({renderText:listItems});
    }

    render() {
        if (this.state.renderText) {
            return (
            <div className="container">
                <div className="row">
                    <NewParent /> 
                </div>
                <div className="row">
                    <div className="col-sm-12 col-lg-12">
                        <form onSubmit={this.handleSubmit}>
                            <fieldset>
                                <legend>Observation</legend>
                                <textarea id="note-content" className="doc noteInput" value={this.state.value} onChange={this.handleChange} placeholder="Type observation here"/>
                                <input type="file" id="file_upload" ref={this.fileInput} name="file_upload" accept="image/*" capture="camera" onChange={this.handleFileInputChange} className="inputfile" multiple />
                                <label htmlFor="file_upload"><span>{this.state.fileInputLabel}</span></label>
                                <button type="submit" id="addnote" className="primary">Save</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <h2>Notes</h2> 
                </div>
                <div className="row">
                    {this.state.renderText}
                </div>
                
            </div>
            );
        }
        return <div>Loading...</div>;
    }
};
  
class CardsDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateRow = this.handleUpdateRow.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
    }
    
    handleDeleteRow(key,e){
        console.log('Child Delete ' +key);
        this.props.onDisplayDelete(key);
    }

    handleUpdateRow(key,message,e){
        console.log('Child Update' +key);
        this.props.onDisplayUpdate(key,message);
    }

    render(){
        if (this.props.observationData){
            //return <p>{props.observationData[0].message}</p>
            return this.props.observationData.map((singleEntry) =>
            (<div className="col-md-6 col-sm-12" key={singleEntry.messageKey}>
                <div className="card fluid" >
                    <div className="section">
                        <h3>{singleEntry.message}  <ReadAbleTime date={singleEntry.timestamp}/></h3>
                        <div className="posTopRight">
                            <span className="w3-hover-red w3-padding" 
                            onClick={(e) => this.handleUpdateRow(singleEntry.messageKey, singleEntry.message,e)}>edit</span>
                            <span className="w3-hover-red w3-padding" 
                            onClick={(e) => this.handleDeleteRow(singleEntry.messageKey, e)}>X</span>
                        </div>
                    </div>
                    <div className="section media">
                        <ImageBox name={singleEntry.messageKey}/>
                    </div>
                </div>
            </div>)
            ); //End map
        }
        return <p>The water would not boil. </p>;
    }
}
  
class NewObservationInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            fileInputValue:null,
            fileInputLabel:'Upload image'
        };
        this.fileInput = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
    }
  
    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.onChildSubmit(this.state.value);
    }

    handleFileInputChange(e){
        console.log("File input changed");
        var curFiles = this.fileInput.current.files;
        if (curFiles.length > 0){
            this.setState({fileInputLabel: curFiles.length+" files selected"});
            this.props.onFileInputChange(curFiles);
        }else{
            this.setState({fileInputLabel: "No file selected"});
        }
    }
  
    render() {
        return (
            <div className="col-sm-12 col-lg-12"><form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>Observation</legend>
                    <textarea className="doc noteInput" value={this.state.value} onChange={this.handleChange} placeholder="Type observation here"/>
                    <input type="file" id="file_upload3" ref={this.fileInput} name="file_upload" accept="image/*" capture="camera" onChange={this.handleFileInputChange} className="inputfile" multiple />
                    <label htmlFor="file_upload3"><span>{this.state.fileInputLabel}</span></label>
                    <button type="submit" id="addnote" className="primary">Save</button>
                </fieldset>
            </form></div>
        );
    }
  }
  
class NewParent extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.handleDisplayDelete = this.handleDisplayDelete.bind(this);
        this.handleDisplayUpdate = this.handleDisplayUpdate.bind(this);
        this.state = {temperature: '', scale: 'c',dataR:null,fileToUpload:null};
    }

    fetchData(){
        var request = new XMLHttpRequest();
        request.open('GET',backendHostUrl + '/get',true);
        request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
        request.onload = function(){
            if (request.status >= 200 && request.status<400){ //Got a response
                var requestData = JSON.parse(request.response);
                this.setState({dataR: requestData});
            }else{
                console.log('Reached server, but some error');       
            }
        }.bind(this);
        request.onerror = function() {
            console.log('Connection error of some sort');
        }
        request.send();
    }

    handleInputSubmit(temperature) {
        //this.setState({scale: 'c', temperature:temperature}, () => this.fetchData());
        console.log('Trying to save');
        var messageTimestamp = new Date();
        var uniqueKey = returnUniqueKey();
        var request = new XMLHttpRequest();
        request.open('POST', backendHostUrl+'/post', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', 'Bearer ' + userIdToken);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                if (this.state.fileToUpload){
                    console.log('Image to upload');
                    this.uploadImage(uniqueKey);
                }else{
                    console.log('No image to upload');
                    this.fetchData();
                }
                console.log('Mission done')                  
            }
        }.bind(this);
        var data = JSON.stringify({
            'message': temperature,
            'timestamp': messageTimestamp.toISOString(),
            'messageKey': uniqueKey,
        });
        request.send(data);
    }

    uploadImage(key) { 
        var mainContext = this;
        console.log('Upload image');
        console.log(this.state.fileToUpload.name);
        var file = this.state.fileToUpload;
        var fileextension = file.name.split('.')[1];
        var metadata = {
            contentType: 'image/'+fileextension
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
                mainContext.fetchData();
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                //uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                //    console.log('File available at', downloadURL);
                //});
        });
        // Listen for state changes, errors, and completion of the upload.
    };

    handleFileInputChange(curFiles){
        if (curFiles.length > 0){
            console.log('Upload image');
            console.log(curFiles[0].name);
            this.setState({fileToUpload:curFiles[0]});
        }else{
            this.setState({fileToUpload:null})
        }
    }

    handleDisplayUpdate(key,oldText){
        console.log('Parent heard update ' + key);
        var newText = prompt("Please edit the note:", oldText);
        var request = new XMLHttpRequest();
        request.open('POST', backendHostUrl+'/update', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', 'Bearer ' + userIdToken);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                this.fetchData();
           }
        }.bind(this);
        var data = JSON.stringify({
            'messageKey': key,
            'message':newText
        });
        request.send(data);
    }

    handleDisplayDelete(key){
        console.log('Parent heard delete ' + key)
        var request = new XMLHttpRequest();
        request.open('POST', backendHostUrl+'/del', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                this.fetchData();
           }
        }.bind(this);
        var data = JSON.stringify({
            'messageKey': key
        });
        request.send(data); 
    }

    render() {
        if (this.state.dataR == null){
            this.fetchData();
            return <div>Loading all observations...</div>;
        }
            return (
                <div>
                <div className="row">
                    <NewObservationInput
                        onChildSubmit={this.handleInputSubmit} 
                        onFileInputChange={this.handleFileInputChange}/>
                </div>
                <div className="row">
                        <h2>Notes</h2> 
                </div>
                <div className="row">
                    <CardsDisplay 
                        observationData={this.state.dataR}
                        onDisplayUpdate={this.handleDisplayUpdate}
                        onDisplayDelete={this.handleDisplayDelete}/>      
                </div>
                </div>
            );
        
        //return <div>Loading all observations...</div>
        //const scale = this.state.scale;
        //const temperature = this.state.temperature;
        //const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
        //const celsius = temperature;
    

    }
  }

