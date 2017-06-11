class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.messages = props.data;
    }

    //type="submit"
    render() {
        return (
            <div>
                {this.messages.map((message) => <div>{message.message}</div>)}
            </div>
        );
    }
}