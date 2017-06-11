class Messages extends React.Component {
    parseQueryString() {
        var str = window.location.search;
        var objURL = {};

        str.replace(
            new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
            function( $0, $1, $2, $3 ){
                objURL[ $1 ] = $3;
            }
        );
        return objURL;
    }

    constructor(props) {
        super(props);
        // this.state = {messages: props.data};
        var _loginHash = this.parseQueryString()["Login"];
        if(!_loginHash)
            window.location = '/';

        this.state = {messages: [], sender: _loginHash, location: {}};

        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.fetchComments = this.fetchComments.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.setMockLocation = this.setMockLocation.bind(this);
    }

    componentDidMount() {
        this.updateGeoLocation();
        // var intervalId = setInterval(this.fetchComments, 10000);

        // this.setState({intervalId: intervalId});
    }


    updateGeoLocation() {
        console.log("Setting geolocation watcher");
        navigator.geolocation.watchPosition((pos) =>
            {
                var crd = pos.coords;//{lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.latitude.accuracy};

                console.log('Position updated:');
                console.log(`Latitude : ${crd.latitude}`);
                console.log(`Longitude: ${crd.longitude}`);
                console.log(`More or less ${crd.accuracy} meters.`);

                this.setState({locationError: undefined});

                this.updateLocation(crd);
            },
            (error) =>{
                this.setState({locationError: 'Error while trying to get location: '});
            }
        );
    }

    updateLocation(coords) {
        console.log("Fetching updated location with coordinates lat:"+ coords.latitude +",lng:"+ coords.longitude);
        $.get('http://api.geonames.org/findNearbyJSON?lat='+coords.latitude+'&lng='+coords.longitude+'&username=timok', (location)=>{

            if(location.geonames && location.geonames[0].name){
                var _location = location.geonames[0].name;

                if(this.state.location != _location) {
                    console.log("Updating location to: " + _location);
                    this.setLocation(_location);
                }else{
                    console.log("Location same as before, not updating: " + _location);
                }
            }
        });
    }

    setLocation(locationName) {
        this.state.location.name = locationName;
        this.state.location.location_id = undefined;
        //this.setState({location: {name: _location, location_id: undefined}});
        this.fetchComments(true);
    }

    componentWillUnmount() {
        if(this.state.intervalId)
            clearInterval(this.state.intervalId);
    }

    fetchComments(clearComments) {
        var _instance = this;
        var intervalId = this.state.intervalId;

        if(clearComments || !intervalId)
            this.setState({fetchingMessages: true, messages:[]});

        if(!intervalId){
            intervalId = setInterval(this.fetchComments, 10000);

            this.setState({intervalId: intervalId});
        }

        var _getComments = function(location_id){
            $.get('/locations?location_id='+location_id, (data) =>{
                if(location_id===_instance.state.location.location_id) {
                    var _currentMessages = _instance.state.messages;

                    data.forEach(function (_newMessage) {
                        var _found = false;
                        for (var _i in _currentMessages) {
                            if (_currentMessages[_i].id === _newMessage.id) {
                                _found = true;
                                break;
                            }
                        }
                        if (!_found) {
                            _currentMessages.push(_newMessage);
                        }
                    });
                    _instance.setState({messages: _currentMessages, fetchingMessages: false});
                }
            }, 'JSON');
        };

        if(this.state.location.location_id!=undefined){
            _getComments(this.state.location.location_id);
        }else{
            getLocationID(this.state.location.name).then((data) => {
                var _currentLoc = this.state.location;
                _currentLoc.location_id = data.id;
                this.state.location.location_id = data.id;
                // this.setState({location: _currentLoc});
                _getComments(data.id);
            });
        }
    }

    handleNewMessage(message) {
        this.state.messages.push(message);
        this.setState(this.state);
    }

    setMockLocation() {
        this.setState({locationError: undefined});
        this.setLocation("Kaijonharju");
    }

    //type="submit"
    render() {
        var _dateDiff = function(dateString){
            var _now = new Date();
            var _date = new Date(dateString);
            var diffMs = (_now.getTime() - _date.getTime());
            var diffDays = Math.floor(diffMs / 86400000); // days
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

            var _dateString = "";
            if(diffDays>0){
                _dateString += diffDays+"days";
            }else if(diffHrs>2){
                _dateString += diffHrs+"hours";
            }else{
                _dateString += diffMins+"minutes";
            }
            return _dateString;
        };

        return (
            <div className="container">
                <nav className="navbar navbar-default lchat-navbar">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                LChat
                                {this.state.location.name ? ' Location: ' + this.state.location.name : ''}
                                {this.state.location.location_id ? ' (' + this.state.location.location_id + ')': ''}
                            </a>
                        </div>
                    </div>
                </nav>
                <div id="main" className="panel-body">
                    {this.state.error ? <div className="alert alert-danger">
                        <strong>Error</strong> <br/> {this.state.error}
                    </div> : ''}
                    {this.state.locationError ? <div className="alert alert-danger">
                        <strong>Location Error</strong> <br/> {this.state.error} <a onClick={this.setMockLocation}>Use Kaijonharju</a>
                    </div> : ''}

                    {this.state.location.location_id ?
                        this.state.fetchingMessages ?
                            <div className="loader">Loading Messages...</div>
                            : <ul className="chat">{this.state.messages.map((message) =>
                            <li className="left clearfix" key={message.id}><span className="chat-img pull-left">
                            <img src="http://popl17.sigplan.org/getDefaultImage/small-avatar?1403689208000" alt="User Avatar" className="img-circle" />
                        </span>
                                <div className="chat-body clearfix">
                                    <div className="header">
                                        <strong className="primary-font">{message.sender}</strong> <small className="pull-right text-muted">
                                        <span className="glyphicon glyphicon-time"></span>{_dateDiff(message.created_at)} ago</small>
                                    </div>
                                    <p>
                                        {message.message}
                                    </p>
                                </div>
                            </li>
                        )}</ul>
                         : !this.state.error ? <div className="loader">Loading Location...</div> : ''}
                </div>
                    {React.createElement(MessageInput, {handleAddMessage: this.handleNewMessage, sender: this.state.sender, location: this.state.location}, null)}
            </div>
        );
    }
}