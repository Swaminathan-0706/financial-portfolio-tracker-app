import React, { Component } from 'react';
import axios from 'axios';
import Header from '../Components/Header/Header';
import Mystocks from '../Components/Mystocks/Mystocks';
import Addstocks from '../Components/AddStocks/Addstocks';

 class Main extends Component {
     constructor(props) {
         super(props)
         this.state = {
              companies:[],
              myStocks:[],
              showModal:false,
              id:null, 
              companyName:null,
              companySymbol:null
         }
     }
     //Initial retreival of stocks and companies
     componentDidMount(){
        axios.get("https://finance-portfolio-tracke-11608.firebaseio.com/companies.json")
        .then((response)=>{
            const updatedCompanies = [];
             for (let key in response.data)
              {
                updatedCompanies.push({...response.data[key],id: key,});
             }
             this.setState({
                 companies:updatedCompanies                
             })
             
        })
        .catch(error=>console.log(error));

        axios.get("https://finance-portfolio-tracke-11608.firebaseio.com/mystocks.json")
        .then((response)=>{
        if(response.data!=null)
         {  
             const updatedMystocks = [];
             for (let key in response.data)
              {
                updatedMystocks.push({...response.data[key],id: key,});
             }
             this.setState({
                 myStocks:updatedMystocks                
             })          
         }
     })
     .catch(error=>console.log(error));
     
    }
    //Function to get Final Stocks after addition.
    getFinalMystocks=()=>{
        console.log("Final myStocks update function called");
        axios.get('https://finance-portfolio-tracke-11608.firebaseio.com/mystocks.json')
            .then((response)=>{
                const updatedMystocks = [];
                for (let key in response.data)
                 {
                    updatedMystocks.push({...response.data[key],id: key,});
                }
                this.setState({
                    myStocks:updatedMystocks
                })
            })
            .catch(error=>console.log(error));
            }
    //Function to get Final Companies after addition.        
    getFinalCompanies=()=>{
                console.log("Final Companies update function called");
                axios.get('https://finance-portfolio-tracke-11608.firebaseio.com/companies.json')
                .then((response)=>{
                const updatedCompanies  = [];
                for (let key in response.data)
                {
                    updatedCompanies.push({...response.data[key],id: key,});
                }
                this.setState({
                    companies:updatedCompanies               
                })
                
            })
            .catch(error=>console.log(error));

            }
    //Function to delete the item in database by pressing Stop Tracking Button
    removeStock=(index)=>{
        console.log(index);
        let id=this.state.myStocks[index]["id"];
        let companyName=this.state.myStocks[index]["Company_name"];
        let companySymbol=this.state.myStocks[index]["Company_Symbol"];
            //Adding deleted stock to Companies database
            axios.post('https://finance-portfolio-tracke-11608.firebaseio.com/companies.json', {
                name:companyName,
                symbol:companySymbol
                })
            .then((response)=>{
                    console.log(companySymbol,"Stock Added to Firebase");
                    if(response.statusText==="OK"){
                    this.getFinalCompanies();
                    }
                    
                })
            .catch(error=>{console.log(error)})
            //Deleting stocks from my Stocks
             axios.delete(`https://finance-portfolio-tracke-11608.firebaseio.com/mystocks/${id}.json`)
             .then((response)=>{
                console.log(companySymbol,"Stock Deleted from Firebase");
                if(response.statusText==="OK"){
                    this.getFinalMystocks();
                    }
                })
             .catch(error=>console.log(error))
       }
       //Function for Close Button in Modal Form
        closeHandler(){
        this.setState({
            showModal:false
        })
    }
       //Add stock handler
       async addStockHandler(index){
        let id=this.state.companies[index]["id"];
        let currentCompany=this.state.companies[index].name;
        let currentCompanySymbol=this.state.companies[index].symbol;
        console.log(id,currentCompany,currentCompanySymbol);
        this.setState({
            showModal:true,
            id:id, 
            companyName:currentCompany,
            companySymbol:currentCompanySymbol
        })
     }
        //Function for adding new stocks in firebase database
        addDatatoFirebase=(a,b,c)=>
        {
            let company_name=a;
            let company_symbol=b;
            let id=c;
            let noofshares=document.getElementById("noShares").value;
            let buyPrice=document.getElementById("buyPrice").value;
            let buyDate=document.getElementById("buyDate").value;
                    if(noofshares>0&&buyPrice.length>0&&buyDate.length>0)
                    {
                            //Adding stocks to my stocks
                            axios.post('https://finance-portfolio-tracke-11608.firebaseio.com/mystocks.json', {
                                Company_Symbol:company_symbol,
                                Company_name:company_name,
                                No_of_Shares:noofshares,
                                Buy_Price:buyPrice
                            })
                            .then((response)=>{
                                console.log(company_symbol,"Stock Added to Firebase");
                                if(response.statusText==="OK"){
                                    this.getFinalMystocks();
                                    }
                                    
                                
                            })
                            .catch(error=>console.log(error));

                            //Deleting Stocks from Companies 
                            axios.delete(`https://finance-portfolio-tracke-11608.firebaseio.com/companies/${id}.json`)
                            .then((response)=>{
                            console.log(company_symbol,"Stock Deleted from Firebase");
                            if(response.statusText==="OK"){
                                this.getFinalCompanies();
                                }
                                this.setState({
                                    showModal:false
                                })
                            }) 
                            .catch(error=>console.log(error)); 
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
            <div>
                <Header/>
                
                <Mystocks myStocks={this.state.myStocks} 
                stopTrackingHandler={(index)=>this.removeStock(index)}/>
                <br/><hr/>
                
                <Addstocks 
                companies={this.state.companies} 
                showModal={this.state.showModal}
                addStockHandler={(index)=>this.addStockHandler(index)}
                addStockToDb={(a,b,c)=>this.addDatatoFirebase(a,b,c)}
                closeButton={()=>{this.closeHandler()}}
                id={this.state.id}
                companyName={this.state.companyName}
                companySymbol={this.state.companySymbol}
                
                />
                
            </div>
        )
    }
}

export default Main
