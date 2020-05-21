import React, { Component } from 'react';
import firebase from '../Form/AddFormModal/firebase';
import axios from 'axios';
import Addstocks from '../AddStocks/Addstocks';
import'./Mystocks.css';
import ApiCall from '../ApiCall';

class Mystocks extends Component {
    constructor(props) {
        super(props)
         this.state = {
            myStocks:[],
            myStocksEmpty:false,
            myCompanies:[],
        }
    }
    componentDidMount(){
        //Retreiving Mystocks inventory
        const url="https://finance-portfolio-tracke-11608.firebaseio.com/mystocks.json";
        axios.get(url)
        .then((response)=>{
         if(response.data!=null)
         {
             let tempObject=response.data;
             let tempArray=Object.values(tempObject);
             this.setState({
                 myStocks:tempArray,                 
             })          
         }
         else
         {
             this.setState({
                 myStocksEmpty:true
             })
           }
        })
        const urlm="https://finance-portfolio-tracke-11608.firebaseio.com/companies.json";
        axios.get(urlm)
        .then((response)=>{
         let tempObject=response.data;
         let tempArray=Object.values(tempObject);
         this.setState({
            myCompanies:tempArray,
            
         })
        })
        
        
 }  
 updateCompanyStocks=()=>
    {  
    console.log('update companies called');   
     const urlm="https://finance-portfolio-tracke-11608.firebaseio.com/companies.json";
     axios.get(urlm)
     .then((response)=>{
         let tempObject=response.data;
         let tempArray=Object.values(tempObject);
         this.setState({
            myCompanies:tempArray,
            
         })
         
         
     })
    }         
 updateMyStocks=()=>
 {   
     console.log('update Mystocks called');   
     const urlm="https://finance-portfolio-tracke-11608.firebaseio.com/mystocks.json";
     axios.get(urlm)
     .then((response)=>{
         let tempObject=response.data;
         let tempArray=Object.values(tempObject);
         this.setState({
            myStocks:tempArray
         })
         
     })
    }
    //Function to delete the item in database by pressing Stop Tracking Button
    removeStock=(index)=>{
    console.log("remove Stock")
    let companyName=this.state.myStocks[index]["Company_name"];
    let companySymbol=this.state.myStocks[index]["Company_Symbol"];
        //Adding deleted stock to Companies database
        axios.post('https://finance-portfolio-tracke-11608.firebaseio.com/companies.json', {
            name:companyName,
            symbol:companySymbol
            })
        console.log(companySymbol,"stock added");
            
        //Deleting stocks from MyInventory
        //Setting up reference for databse
        let reference = firebase.database().ref('mystocks');
        reference.orderByChild('Company_Symbol').equalTo(companySymbol).once('value', snapshot => {
        const updates = {};
        snapshot.forEach(child => {
            //Child gives DataSnapshot oject which has key property
            //Child.Key gives unique ID generated while creating an item in firebase 
            updates[child.key] = null
        });
        //after making our object null using key we are updating that item in our collection
        reference.update(updates)
        .then(()=>{
            console.log(companySymbol,"Stock deleted");
            this.updateMyStocks();
            this.updateCompanyStocks();
          })
       }); 
    }
    //Function to trigger child method using refs
    triggerChildAdd(index){
        
        this.refs.child.addStockHandler(index);
    }
    render() {
            
            let renderArray=[];
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
                    <td><button className="StopTrackingBtn" onClick={()=>this.removeStock(index)}>Stop tracking</button></td>
                    </tr> 
                    )
                 }) ;
            let showMessage="";let companyArray=[];
            companyArray=this.state.myCompanies.map((item,index)=>{
            if(this.state.myCompanies.length>3) 
            {
                const {symbol,name}= item;//Destructuring
                return(
                <li key={symbol}>
                    <button className="StockButton" type="button" onClick={()=>this.triggerChildAdd(index)} >{symbol}</button>
                    <span className="companyText">{name}</span>
                </li>
            )
            }
            
            else
            {
                showMessage = (
                    <div className="msg">
                    <h3>
                    You cannot add more than 5 Stocks at a time,Remove
                    a stock if you want to add a new stock.
                  </h3>
                  </div>
             )

            }
            
        })
        
        return (
            <div>
                <div className="MyStocks">
                <h2>My Stocks</h2>
                {
                        (!this.state.myStocksEmpty)?<div className="table_res">
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
                        <br/><hr/>
                         </div>
                        :<h1>You don't own any Stocks!Please Add one by clicking the button below.</h1>
                      }
                        
                <div className="AddStocksTitle" >
                
                <h2>Add stocks to My stocks</h2>
                <ul id="companyList">
                {companyArray}
                </ul>
                <div>{showMessage}</div>
                </div>
                <Addstocks ref="child"
                />
                      
            
        </div>
        </div>
        )
    }
}

export default Mystocks
