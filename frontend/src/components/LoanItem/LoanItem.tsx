import React, { useEffect, useState } from 'react'
import { Loan } from '../../routes/loans/loans'
import "./LoanItem.css"
import axios from 'axios'

function LoanItem({other_user, _id, current_amount, description, loan_document}: Loan) {
const [fileData, setFileData] = useState<string>()
  // get document data 
  useEffect(()=> {
    async function fetchData() {
      const res = await axios.get(`http://localhost:8000/loans/${_id}/files?token=${localStorage.getItem("token")}`)

      const data: File = await res.data



      setFileData(res.headers["content-disposition"].slice(22, -1))

    }

    fetchData()

    
  }, [])

  async function deleteFile() {
    console.log("hello")
    await axios.delete(`http://localhost:8000/loans/${_id}/files?token=${localStorage.getItem("token")}`)
    window.location.reload()
  }

  async function deleteLoan() {
    await axios.delete(`http://localhost:8000/loans/${_id}?token=${localStorage.getItem("token")}`)
    window.location.reload()
  }

  return (
    <div className="loan-container">
      <div className="loan-top">
        <div className="loan-name">{other_user}</div>
        <div className="loan-amount">
          ${current_amount.toLocaleString("en", { useGrouping: true })}.00
        </div>
      </div>

      <div className="loan-description">{description}</div>
      {fileData && (
        <div>
          <div className="loan-file">{fileData}</div>
          <button className='remove-file-button' onClick={deleteFile}>Remove File</button>
        </div>
      )}
      <div className='delete-button-container'>
        <button className='delete-button' onClick={()=> deleteLoan()}>Delete</button>
      </div>
    </div>
  );
}

export default LoanItem