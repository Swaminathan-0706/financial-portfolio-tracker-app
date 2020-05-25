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
             const dt=new Date();
             const day=dt.getDay();
             let dateMinus=dt.getDate();
             dateMinus=dateMinus.toString().padStart(2,'0');
             let date="";           
             //Condition to Check for Weekends and US time equivalent to India
             if(day===0||day===6 || day===1 ||day ===2)
             {   
             dateMinus=dateMinus-4;
             date=`${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${dateMinus}`;
             }
             else
             {
            date=`${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${dateMinus-1}`;   
             }
            const api_url=`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${sym}&apikey=${apikey}`;
            axios.get(api_url)
            .then((response)=>{
                let live = response.data['Time Series (Daily)'][date]['4. close'];
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
