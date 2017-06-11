class Message extends React.Component {
    //type="submit"
    render() {
        return (
            <div className="message_template">
                <li className="message">
                    <div className="avatar"></div>
                    <div className="text_wrapper">
                        <strong>{this.props.sender}</strong><br/>
                        <div className="text">{this.props.message}</div>
                    </div>
                </li>
            </div>
        );
    }
}