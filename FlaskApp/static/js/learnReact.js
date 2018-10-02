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
        this.state = {data: null};
    }
    deleteRow(id,e){
        console.log('Delete '+id);
        this.fetchData();
    }
    updateRow(id,e){
        console.log('Update '+id);
    }
    fetchData(){
        this.state = {data:null};
    }
    componentDidMount() {
    var request = new XMLHttpRequest();
    request.open('GET',backendHostUrl + '/get',true);
    request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
    request.onload = function(){
        if (request.status >= 200 && request.status<400){ //Got a response
            var requestData = JSON.parse(request.response);
            var listItems = requestData.map((singleEntry) =>
            (<div className="col-md-6 col-sm-12" key={singleEntry.messageKey}>
                <div className="card fluid" >
                    <div className="section">
                        <h3>{singleEntry.message}  <ReadAbleTime date={singleEntry.timestamp}/></h3>
                        <div className="posTopRight">
                            <span className="w3-hover-red w3-padding" 
                            onClick={(e) => this.updateRow(singleEntry.messageKey, e)}>edit</span>
                            <span className="w3-hover-red w3-padding" 
                            onClick={(e) => this.deleteRow(singleEntry.messageKey, e)}>X</span>
                        </div>
                    </div>
                    <div className="section">
                        <ImageBox name={singleEntry.messageKey}/>
                    </div>
                </div>
            </div>)
            );
            this.setState({data: listItems});
        }else{
            console.log('Reached server, but some error');
            this.setState({data: requestData});       
        }
    }.bind(this);
    request.onerror = function() {
        console.log('Connection error of some sort');
    }
    request.send();
    
  }

  render() {
    if (this.state.data) {
      return <div>{this.state.data}</div>;
    }

    return <div>Loading...</div>;
  }
};

//configureFirebaseLogin();
//configureFirebaseLoginWidget();



// ReactDOM.render( <Parent />,document.getElementById('rooter') );

//ReactDOM.render(<App />, document.getElementById('rooter'));