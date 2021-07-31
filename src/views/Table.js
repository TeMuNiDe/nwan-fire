
import React, {Component} from 'react';
class Table extends React.Component {
    render() {
        return (<div><table><TableHead head={this.props.data.head}/><TableBody data={this.props.data.data}/><TableFoot head={this.props.data.head}/></table></div>);
    }
}

class TableHead extends React.Component {
    render () {
    
        const cells = this.props.head ;
        console.log(cells);
        const headRow  = cells.map((cell) => { return <td>{cell}</td> });
        const thead = <thead><tr>{headRow}</tr></thead>;
        return thead;
    }
}

class TableBody extends React.Component {
    render() {
        const rows = this.props.data;
        const body = rows.map((row)=>{  
            const cells = row.map( (cell) => {
                return <td>{cell}</td>;
            });
            return <tr>{cells}</tr>
        });
        return <tbody>{body}</tbody>;
    }
}

class TableFoot extends TableHead {
    
}

export { Table }