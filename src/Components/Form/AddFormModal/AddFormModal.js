import React, { Component } from 'react';
import './AddFormModal.css';
import Backdrop from '../Backdrop/Backdrop';

class AddFormModal extends Component {
    constructor(props){        
        super(props)
        this.state={        
            showModal:this.props.showModal,
         }
         console.log(props);
    }
   //This will update the props in child whenever state changes in parent.
   static getDerivedStateFromProps(props, state) {
    return {
        showModal:props.showModal
    };
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
               
        

        render() {
            
        return (
            (this.state.showModal)?
            <div>
                <Backdrop/>
                <div className="AddStockForm" style={{height:'650px', textAlign:'center', position:'fixed', backgroundColor:'white' ,zIndex: 500, left: '15%', top: '15%', boxSizing: 'border-box', width: '70%'}}>
                    <button onClick={()=>this.props.closeButton()} id="close">x</button>
                    <h1>Add {this.props.companyName}   to My Stocks</h1>
                    <form id="addStock" name="myForm">
                    <div id="f1"><label>Company Name:</label><span></span><span>{this.props.companyName}</span></div>
                    <div id="f1"><label>No.of Shares:</label><span id="number"></span><input type="number" onChange={()=>this.checkNumber()} name="shares" id="noShares" placeholder="No.of Shares"/></div>
                    <div id="f1"><label>Buy Price:</label><span id="price"></span><input type="number" onInput={()=>this.checkPrice()} name="price" id="buyPrice" placeholder="Buy Price"/></div>
                    <div id="f1"><label>Buy Date:</label><span id="date"></span><input type="date" onInput={()=>this.checkDate()} name="date" id="buyDate"/></div>
                    </form>
                    <button onClick={(a,b,c)=>this.props.addStockToDb(this.props.companyName,this.props.companySymbol,this.props.id)}className="AddButton">Add</button>
                </div>
                
            </div>:null
            
            
        )
    }
}

export default AddFormModal;