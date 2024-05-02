import React, { useEffect, useState } from 'react'
import { Loan } from '../../routes/loans/loans'
import "./LoanItem.css"
import axios from 'axios'

function LoanItem({other_user, _id, current_amount, description, loan_document}: Loan) {
const [fileData, setFileData] = useState<File>()
  // get document data 
  useEffect(()=> {
    async function fetchData() {
      const res = await axios.get(`http://localhost:8000/loans/${_id}/files?token=${localStorage.getItem("token")}`)

      const data: File = await res.data

      console.log(data)

      setFileData(data)
      console.log(fileData)

    }

    fetchData()

    
  }, [])

  return (
    <div className="loan-container">
      <div className="loan-top">
        <div className="loan-name">{other_user}</div>
        <div className="loan-amount">${current_amount.toLocaleString("en", {useGrouping: true})}.00</div>
      </div>

      <div className="loan-description">{description}</div>
      <div className="loan-file">{fileData?.name}</div>
    </div>
  );
}

export default LoanItem