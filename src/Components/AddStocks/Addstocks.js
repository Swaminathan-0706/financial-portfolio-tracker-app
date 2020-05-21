import React from 'react';
import AddFormModal from '../Form/AddFormModal/AddFormModal';
import axios from 'axios';
import './Addstocks.css';

class Addstocks extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
        companyName:null,
        companySymbol:null ,
        addStockBanner:false,
        myCompanies:[]
        }
    }
    //Function to retreive current company name and open form to fill AddformModal
    addStockHandler(index){
        const urlm="https://finance-portfolio-tracke-11608.firebaseio.com/companies.json";
        axios.get(urlm)
        .then((response)=>{
         let tempObject=response.data;
         let tempArray=Object.values(tempObject);
         this.setState({
            myCompanies:tempArray,
         })
        })
        .then(()=>{
            let currentCompany=this.state.myCompanies[index].name;
            let currentCompanySymbol=this.state.myCompanies[index].symbol;
            this.setState({
            addStockBanner:true,
            companyName:currentCompany,
            companySymbol:currentCompanySymbol
        })  

        })
            
    }
    render(){
        return(
                <div>
                    {
                        this.state.addStockBanner && 
                        <AddFormModal
                        symbol={this.state.companySymbol}                      
                        title={`Add ${this.state.companyName} to your stocks`}
                        companyname={this.state.companyName}
                        />
                    }
               </div>
             
        )

        
    }
    
}

export default Addstocks;