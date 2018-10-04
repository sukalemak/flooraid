class ImageBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {data:null,
        showFullImage:false};
    }
    componentDidMount () {
        var imgKey = this.props.name;
        var storageRef = fire_storage.ref();
        var ImageBoxObject = this;
        if (this.props.imagePresent){
            storageRef.child('user').child(userUid).child(imgKey+'.png').getDownloadURL()
            .then(function(result) {
                ImageBoxObject.setState({data:result});
            }).catch(function(error) {
                console.log('Download storage error');
                console.log(error);
            });
        }
    }
    handleImageClick(e){
        this.state.showFullImage ? this.setState({showFullImage:false}) : this.setState({showFullImage:true}); 
    }
    render(){
        if (this.props.imagePresent){
            if (this.state.data) {
                const sectionClassname = this.state.showFullImage ? "section medialarge":"section media";
                return (
                    <div className={sectionClassname} onClick={(e) => this.handleImageClick(e)}>
                        <img    
                            src={this.state.data} 
                            alt="Image from cloud storage" 
                        />
                    </div>)
                }
            return <div>Loading...</div>
        }
        return <div></div>
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
                    <ImageBox 
                        name={singleEntry.messageKey}
                        imagePresent={singleEntry.imagePresent}
                    />
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
                    <textarea className="doc noteInput" value={this.state.value} onChange={this.handleChange} placeholder="Type observation here"/>
                    <input type="file" id="file_upload3" ref={this.fileInput} name="file_upload" accept="image/*" capture="camera" onChange={this.handleFileInputChange} className="inputfile" multiple />
                    <label htmlFor="file_upload3"><span>{this.state.fileInputLabel}</span></label>
                    <button type="submit" id="addnote" className="primary">Save</button>
            </form></div>
        );
    }
}

class DisplayFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleFilterTodayChange = this.handleFilterTodayChange.bind(this);
    }
  

    handleFilterTodayChange(e){
        console.log("Trying to filter " + e.target.name);
        this.props.onFilterToday(e.target.name);
    }
  
    render() {
        return (
            <div className="col-sm-12 col-lg-12">
                <button name="filterShowAll" className="primary" onClick={this.handleFilterTodayChange}> All </button>
                <button name="filterToday" className="primary" onClick={this.handleFilterTodayChange}> Today </button>
            </div>
        );
    }
} 
  
class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.handleDisplayDelete = this.handleDisplayDelete.bind(this);
        this.handleDisplayUpdate = this.handleDisplayUpdate.bind(this);
        this.handleFilterTodayChange = this.handleFilterTodayChange.bind(this);
        this.state = {dataR:null,dataF:null,fileToUpload:null};
    }

    fetchData(){
        console.log('Fetching fresh data');
        var request = new XMLHttpRequest();
        request.open('GET',backendHostUrl + '/get',true);
        request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
        request.onload = function(){
            if (request.status >= 200 && request.status<400){ //Got a response
                this.setState({dataR: JSON.parse(request.response)});
            }else{
                console.log('Reached server, but some error');       
            }
        }.bind(this);
        request.onerror = function() {
            console.log('Connection error of some sort');
        }
        request.send();
    }

    handleInputSubmit(m) {
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
            'message': m,
            'timestamp': messageTimestamp.toISOString(),
            'messageKey': uniqueKey,
            'imagePresent': this.state.fileToUpload ? true:false
        });
        request.send(data);
    }

    uploadImage(key) { 
        var mainContext = this;
        console.log('Upload image' + this.state.fileToUpload.name);
        const file = this.state.fileToUpload;
        var metadata = {
            contentType: 'image/'+file.name.split('.')[1]
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
            this.setState({fileToUpload:curFiles[0]});
        }else{
            this.setState({fileToUpload:null})
        }
    }

    handleDisplayUpdate(key,oldText){
        console.log('Parent heard update ' + key);
        var newText = prompt("Please edit the note:", oldText);
        if (newText){
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
        }else{
            console.log("Update cancelled");
        }

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

    handleFilterTodayChange(filterType){
        console.log("Parent heard to filter for today");
        if (filterType == 'filterToday'){
            const rawRetrivedData = this.state.dataR;
            const filteredRetrivedData = rawRetrivedData.filter(singleItem => {
                const now = new Date();
                const d = new Date(singleItem.timestamp);
                if (d.toLocaleDateString() == now.toLocaleDateString()){
                    return (singleItem)
                }else{
                    return null
                }
            });
            this.setState({dataF:filteredRetrivedData})
        } else if(filterType =='filterShowAll'){
            this.setState({dataF:null});
        }
       
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        var dataToRender = null;
        if (this.state.dataF == null){
            dataToRender = this.state.dataR;
        }else{
            dataToRender = this.state.dataF;
        }
        if (this.state.dataR == null){
            return <div>Loading all observations...</div>;
        }
        return (
            <div className="container">
            <div className="row">
                <NewObservationInput
                    onChildSubmit={this.handleInputSubmit} 
                    onFileInputChange={this.handleFileInputChange}/>
            </div>
            <div className="row">
                <h2>Notes</h2> 
            </div>
            <div className="row">
                <DisplayFilter 
                    onFilterToday={this.handleFilterTodayChange}/> 
            </div>
            <div className="row">
                <CardsDisplay 
                    observationData={dataToRender}
                    onDisplayUpdate={this.handleDisplayUpdate}
                    onDisplayDelete={this.handleDisplayDelete}/>      
            </div>
            </div>
        );
    }
}

