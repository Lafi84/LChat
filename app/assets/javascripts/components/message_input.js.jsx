class MessageInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {message: '', sender: props.sender, location: props.location};
        this.props = props;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event) {
        this.setState({message: event.target.value});
    }

    handleSubmit(event) {
        console.log('A Message was submitted: ' + JSON.stringify(this.state.message));
        if(event)
            event.preventDefault();

        var _postMessage = {message: this.state.message, sender: this.state.sender, location_id: this.state.location.location_id};

        $.post('/messages',{newmessage: _postMessage}, (data) =>{
            this.state.message = '';
            this.props.handleAddMessage(data);
        }, 'JSON')
            .fail((response)=>{
                if(response.status==401){
                    window.alert('Login error');
                    window.location = '/';
                }else{
                    window.alert(JSON.stringify(response));
                }
            });
    }

    valid(){
        return this.state.message && this.state.location.location_id;
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && this.valid()) {
            this.handleSubmit();
        }
    }

    //type="submit"
    render() {
        return (
            <div className="col-lg-6 col-lg-offset-3 footer">
            <div className="input-group">
            <input type="text" className="form-control" placeholder="Write message.." value={this.state.message} onChange={this.handleChange} onKeyUp={this.handleKeyPress}/>
            <span className="input-group-btn">
            <button className="btn btn-primary" type="button" disabled={!this.valid()} onClick={this.handleSubmit}>Send</button>
    </span>
    </div>
    </div>
    );
    }
}