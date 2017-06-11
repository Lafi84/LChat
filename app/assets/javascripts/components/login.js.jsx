class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', sending: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    handleSubmit(event) {
        if(this.valid() && !this.state.sending) {
            this.setState({sending: true, loginError: undefined});
            console.log('A login was submitted: ' + this.state.message);
            if(event)
                event.preventDefault();

            $.post('/people', {person: this.state}, (data) => {
                this.setState({sending: false});
                window.location = '/messages?Login=' + data.loginhash;
            }, 'JSON')
                .fail((response) =>{
                    this.setState({loginError: JSON.stringify(response)});
                    this.setState({sending: false});
                });
        }
    }

    valid(){
        return this.state.name && this.state.name.length>=4;
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && this.valid()) {
            this.handleSubmit();
        }
    }

    //type="submit"
    render() {
        var _errorPadding = function(){
            if(this.state.loginError)
                return {paddingTop: "60px"};
            else return {};
        };

        return (
            <div id="login" className="col-xs-12 col-sm-4 col-sm-offset-4">
                {this.state.loginError ?
                    <div className="alert alert-danger">
                        <strong>Login error</strong> <br/> We were not able to log in<br/>Check internet connection and try again
                    </div> :''
                }
                <h1 style={!this.state.loginError ? {paddingTop: "60px"} : {}}>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <fieldset className="form-group">
                    <input className="col-xs-12 form-control" type="text" placeholder="Username" value={this.state.name} onChange={this.handleChange} onKeyUp={this.handleKeyPress} />
                    </fieldset>
                    <div className="col-xs-12 btn btn-primary" disabled={!this.valid()} onClick={this.handleSubmit}>{this.state.sending ? <span className="spin glyphicon glyphicon-refresh"></span> : ''} Login</div>
                </form>
            </div>
        );
    }
}