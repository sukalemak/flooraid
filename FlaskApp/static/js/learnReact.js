class Parent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {data: null};
    }
    deleteRow(id,e){
        console.log('Click clic'+id);
    }
    componentDidMount() {
    var request = new XMLHttpRequest();
    request.open('GET',backendHostUrl + '/get',true);
    request.setRequestHeader('Authorization', 'Bearer ' + window.userIdToken);
    request.onload = function(){
        if (request.status >= 200 && request.status<400){ //Got a response
            var requestData = JSON.parse(request.response);
            var listItems = requestData.map((number) =>
            (<div className="col-md-6 col-sm-12" key={number.messageKey}>
                <div className="card fluid" >
                    <div className="section">
                            <h3>{number.message}<small>{Date(number.timestamp)}</small></h3>
                            <div className="posTopRight">
                                <span className="w3-hover-red w3-padding">edit</span>
                                <span className="w3-hover-red w3-padding" 
                                onClick={(e) => this.deleteRow(number.messageKey, e)}>X</span>
                            </div>
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