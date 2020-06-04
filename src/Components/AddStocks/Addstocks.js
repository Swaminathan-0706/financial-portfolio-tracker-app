import React, { Component } from 'react';
import './Addstocks.css';
import AddFormModal from '../Form/AddFormModal/AddFormModal'

class Addstocks extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             myCompanies:this.props.companies,
             showModal:this.props.showModal,
             id:this.props.id, 
             companyName:this.props.companyName,
             companySymbol:this.props.companySymbol
        }
        
    }
    //This will update the props in child whenever state changes in parent.
    static getDerivedStateFromProps(props, state) {
        return {
         myCompanies: props.companies,
         showModal:props.showModal,
         id:props.id, 
         companyName:props.companyName,
         companySymbol:props.companySymbol
         
        };
       }
    
    render() {
        
        let companyArray=[];
        let showMessage="";
            if(this.state.myCompanies.length>3)
            {
            companyArray=this.state.myCompanies.map((item,index)=>{
             const {symbol,name}= item;//Destructuring
                return(
                <li key={symbol}>
                    <button className="StockButton" type="button" onClick={()=>this.props.addStockHandler(index)} >{symbol}</button>
                    <span className="companyText">{name}</span>
                </li>
                )
            })
            }
            
            else
            {
                showMessage = 
                    <div className="msg">
                    <h3>
                    You cannot add more than 5 Stocks at a time,Remove
                    a stock if you want to add a new stock.
                  </h3>
                  </div>
             

            }
            
        
        return (
                
                <div className="AddStocksTitle" >
                <h2>Add stocks to My stocks</h2>
                {(this.state.myCompanies.length>0)?(this.state.myCompanies.length>3)?
                <ul id="companyList">
                {companyArray}
                </ul>
                :<div >{showMessage}</div>
                :<h1>Loading...</h1>}
                

                {(this.state.showModal)?
                <AddFormModal
                id={this.state.id}
                companyName={this.state.companyName}
                companySymbol={this.state.companySymbol}
                showModal={this.state.showModal}
                addStockToDb={(a,b,c)=>this.props.addStockToDb(a,b,c)}
                closeButton={()=>{this.props.closeButton()}}
                />:null}
                </div>
                

        )
    }
}

export default Addstocks
