import React, { Component } from 'react';
import axios from 'axios';

class ApiCall extends Component {
     constructor(props) {
         super(props)
     
         this.state = {
              livePrice:null,
              proLoss:null
         }
     }
     
     componentDidMount(){
        const{symbol,buyprice,share}=this.props; //Destructuring
        let sym = symbol;
        let buy =buyprice;
        let sh = share;
        const apikey="8ITBD22C4L2XEYPM";
        const api_url=`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${sym}&apikey=${apikey}`;
            axios.get(api_url)
            .then((response)=>{
                let lastRefreshed=response.data['Meta Data']["3. Last Refreshed"];
                let date=lastRefreshed.substring(0,10);
                console.log("final",date)
                let live = response.data['Time Series (Daily)'][date]["4. close"];
                let diff = ((live - buy)*sh);
                diff=diff.toFixed(2);
                this.setState({
                    livePrice : live,
                    proLoss:diff
                 });
                 
            })
            .catch((error)=>{
                console.log(error.response);
                alert('Only 5 API calls can be made per minute,Please reload after sometime for Live Prices');
                
            })
    }
    render() {
        return (
                <>
                <td>{this.state.livePrice}</td>
                <td>{this.state.proLoss}</td>
                </>
        )
    }
}

export default ApiCall;
