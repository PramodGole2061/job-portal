import React from 'react'

export default function Alert(props) {
  const capitalizeFirstChar= (word)=>{
    if(word == "danger"){
      word = "error"
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase()+lower.slice(1);
  }
  return (
    <div style={{height: '40px'}}>
      {props.alert && <div className={`alert alert-${props.alert.type}`} role="alert">
          <strong>{capitalizeFirstChar(props.alert.type)}</strong>: {props.alert.msg}
      </div>
      }
    </div>
  )
}
