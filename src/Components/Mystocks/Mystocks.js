import React, { Component } from 'react';
import'./Mystocks.css';
import ApiCall from '../ApiCall';

class Mystocks extends Component {
    constructor(props) {
        super(props)
         this.state = {
            myStocks:this.props.myStocks,
        }
        
    }
    //This will update the props in child whenever state changes in parent.
    static getDerivedStateFromProps(props, state) {
        return {
            myStocks: props.myStocks
        };
       }
    render() {
            let renderArray=[];
            let showMessage="";
            if(this.state.myStocks.length!==0)
            {
                renderArray=this.state.myStocks.map((item,index)=>{  
                    const {Buy_Price,Company_Symbol,Company_name,No_of_Shares}= item;//Destructuring
                     return(                   
                        <tr key={index}>   
                        <td>{Company_Symbol}</td>
                        <td>{Company_name}</td>
                        <td>{No_of_Shares}</td>
                        <td>{Buy_Price}</td>
                        <ApiCall
                        symbol={item.Company_Symbol}
                        buyprice={item.Buy_Price}
                        share={item.No_of_Shares} />
                        <td><button className="StopTrackingBtn" onClick={()=>this.props.stopTrackingHandler(index)}>Stop tracking</button></td>
                        </tr> 
                        )
                     }) ;
            }
            else{
                
                    showMessage=<h1>Loading...You don't own any Stocks!Please Add one by clicking the button below.</h1>;
                    
             }
            
            
        
        return (
            
                <div className="MyStocks">
                <h2>My Stocks</h2>
                {(this.state.myStocks.length!==0)?
                         <div className="table_res">
                         <table className="MyStocksTable">
                         <thead>
                         <tr className="heading_row">
                         <th>Stock symbol</th>
                         <th>Stock name</th>
                         <th>No.of share</th>
                         <th>Buy price</th>
                         <th>Current price</th>
                         <th>Profit/Loss</th>
                         <th>Tracking Status</th>
                         </tr>
                         </thead>
                         <tbody>
                         {renderArray}
                         </tbody>
                        </table>
                        </div>
                        :<div>{showMessage}</div>
                        
                }
        </div>
        
        )
    }
}

export default Mystocks;
