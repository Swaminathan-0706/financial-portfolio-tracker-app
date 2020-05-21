import React, { Component } from 'react';
import Backdrop from '../Backdrop/Backdrop';
import firebase from './firebase';
import axios from 'axios';
import './AddFormModal.css';

class AddFormModal extends Component {
    constructor(props){        
        super(props)
        this.state={        
            closeLoader:false,
            myStocks:[],
            
        }
        
    }
    //Function for Close Button in Modal Form
    closeHandler(){
        
             this.setState({
                closeLoader:true
            })
            window.location.reload(false);
        }
        
        //Function for Form validation for all input fields   
        checkNumber(){
            let numberOutput=document.getElementById("number");  
            let n=document.myForm.shares;
            if(n.value.length===0){
                numberOutput.innerHTML="";
                n.style.backgroundColor="white";
            }

            else if(n.value<=0){
                numberOutput.innerHTML="Please enter a valid number:";
                n.style.backgroundColor="red";
            }
            else if(n.value>=99999){
                numberOutput.innerHTML=`More than 1Lakh shares not allowed`;
                n.style.backgroundColor="orange";
            }
            else{                
                numberOutput.innerHTML=`You are buying ${n.value} shares`;
                n.style.backgroundColor="green";
            }
        }
        checkPrice(){
            let priceOutput=document.getElementById("price");                      
            let p=document.myForm.price;
            if(p.value.length===0){
                priceOutput.innerHTML="";
                p.style.backgroundColor="white";
            }
            else if(p.value<=0){
                priceOutput.innerHTML="Please enter a valid number";
                p.style.backgroundColor="red";
            }
            else{
                let temp=document.myForm.shares.value;
                let totalCost=p.value*temp;
                priceOutput.innerHTML=`Your total buying cost:${totalCost}`;
                p.style.backgroundColor="green";
            }
         } 
        checkDate(){
            let dateOutput=document.getElementById("date");                      
            let d=document.myForm.date;
            if(d.value.length===0){
                dateOutput.innerHTML="";
                d.style.backgroundColor="white";
            }
            else{
                dateOutput.innerHTML=`${d.value}`;
                d.style.backgroundColor="green";
             }
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
                    myStocks:tempArray,
                    closeLoader:true
                 })
                 window.location.reload(false);
                 
             })
            }       
        //Function for adding stock data in Databse   
        addDatatoFirebase=()=>
        {
            let company_name=this.props.companyname;
            let noofshares=document.getElementById("noShares").value;
            let buyPrice=document.getElementById("buyPrice").value;
            let buyDate=document.getElementById("buyDate").value;
            let company_symbol=this.props.symbol;
                    if(noofshares>0&&buyPrice.length>0&&buyDate.length>0)
                    {
                            //Adding stocks to my stocks
                            axios.post('https://finance-portfolio-tracke-11608.firebaseio.com/mystocks.json', {
                                Company_Symbol:company_symbol,
                                Company_name:company_name,
                                No_of_Shares:noofshares,
                                Buy_Price:buyPrice
                            });
                            console.log(company_symbol,"Stock Added");    
                        //Setting delete up reference for databse
                        const reference = firebase.database().ref('companies');
                        reference.orderByChild('symbol').equalTo(company_symbol).once('value', snapshot => {
                        const updates = {};
                        snapshot.forEach(child => {
                        //Child gives DataSnapshot oject which has key property
                        //Child.Key gives unique ID generated while creating an item in firebase 
                        updates[child.key] = null
                        
                         });
                            //after making our object null using key we are updating that item in our collection
                            reference.update(updates)
                            .then(()=>{
                                console.log(company_symbol,"Stock deleted");
                                this.updateMyStocks();
                                
                             })
                        })
                    }
                else
                {
                    
                    if(document.myForm.shares.value.length===0)
                    {
                        document.getElementById("number").innerHTML="Please enter a valid number";
                    }
                    else if(document.myForm.price.value.length===0)
                    {
                        document.getElementById("price").innerHTML="Please enter your buy price";
                    }
                    else if(document.myForm.date.value.length===0){
                        document.getElementById("date").innerHTML="Please select date of purchase";
                    }
                    else{
                        alert("Please enter values for all fields");
                    }
                    
                }
        }

        render() {
        return (
            (!this.state.closeLoader)?
            <div>
                <Backdrop />
                <div class="AddStockForm" style={{height:'650px', textAlign:'center', position:'fixed', backgroundColor:'white' ,zIndex: 500, left: '15%', top: '15%', boxSizing: 'border-box', width: '70%'}}>
                    <button onClick={()=>this.closeHandler()} id="close">x</button>
                    <h1>{this.props.title}</h1>
                    <form id="addStock" name="myForm">
                    <div id="f1"><label>Company Name:</label><span></span><span>{this.props.companyname}</span></div>
                    <div id="f1"><label>No.of Shares:</label><span id="number"></span><input type="number" onChange={()=>this.checkNumber()} name="shares" id="noShares" placeholder="No.of Shares"/></div>
                    <div id="f1"><label>Buy Price:</label><span id="price"></span><input type="number" onInput={()=>this.checkPrice()} name="price" id="buyPrice" placeholder="Buy Price"/></div>
                    <div id="f1"><label>Buy Date:</label><span id="date"></span><input type="date" onInput={()=>this.checkDate()} name="date" id="buyDate"/></div>
                    </form>
                    <button onClick={()=>this.addDatatoFirebase()}className="AddButton">Add</button>
                </div>
        
            </div>:null
            
            
        )
    }
}

export default AddFormModal;