export default class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.setState({user:props.user});
    }
    componentDidMount () {
        fetch ("http://localhost:3000/api/user/"+this.state.user.id)
        .then(res=>res.json())
        .then((result)=>{
            this.setState({user:result});
        })
    }

    render() {
        


}