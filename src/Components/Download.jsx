import { logDOM } from '@testing-library/react';
import React, { useEffect, useState } from 'react'
import { auth, common } from "../config/call";
import axios from "axios"
const Download = ({ data,passid,closemodel }) => {

console.log("ASSSSS-=-=-=-=",data?.imageData[0]?.imagineData.id);
const [details,setdetails] = useState(data)
const token = '';
const [searchValue ,setSearchValue] = useState()
const [selectedindex,setselected] = useState()
const [imagedata,setimagedata] = useState([])
const [loading, setLoading] = useState(false);
const [alldata,setalldata]= useState()

useEffect(()=>{
  getdetails(passid)
},[])


const removefav = async (id,fav) => {
  console.log(fav,"asdasss",id);
  try {
    let param ={favorite:0}
    const response = await axios.patch(
      `http://localhost:3000/api/v1/eikonify/removefavorite/${id}`,
      param,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMzLCJpYXQiOjE3MTUxNjE3Nzd9.-tJTGxFOiAxbXLS2zasOpNmGl4mRnl_L-o8sLsKNP2g`,
        }
      }
     
    );
    getdetails(passid)
    console.log('Patch request successful:', response.data);
    return response.data; // If you want to return the data from the response
  } catch (error) {
    console.error('Patch request failed:', error);
    throw error; // If you want to handle errors in the calling function
  }
};
const addfav = async (id,fav) => {
  console.log(fav,"asdasss",id);
  try {
    let param ={favorite:1}
    const response = await axios.patch(
      `http://localhost:3000/api/v1/eikonify/addfavorite/${id}`,
      param,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMzLCJpYXQiOjE3MTUxNjE3Nzd9.-tJTGxFOiAxbXLS2zasOpNmGl4mRnl_L-o8sLsKNP2g`,
        }
      }
     
    );
    getdetails(passid)
    console.log('Patch request successful:', response.data);
    return response.data; // If you want to return the data from the response
  } catch (error) {
    console.error('Patch request failed:', error);
    throw error; // If you want to handle errors in the calling function
  }
};

const getdetails = async (id) => {
  common.getDetails(id).then(({ data }) => {
    console.log("data-=-=-=-=-=-=-", data.data);
    setimagedata(data.data);

    // Initialize an array to hold all data
    let arr = [];

    // Loop through each imageData
    for (let index = 0; index < data.data?.imageData.length; index++) {
      // Loop through each imagineData within imageData
      for (let i = 0; i < data?.data?.imageData[index].imagineData.length; i++) {
        // Push each element of imagineData into arr
        arr.push(data?.data?.imageData[index].imagineData[i]);
      }
    }

    // Set the state with the collected data
    setalldata(arr);


    setLoading(false);
  });
};



  const Imagesdownload = (data,index) => {
    console.log("Asdasd",data.data.favorite);
    
    const downloadImage = (url) => {
      const imageUrl = `http://localhost:3000/`+`${url}`; 
      fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const objectURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectURL;
        a.download = url; 
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(objectURL);
        // toast.success("saved successfully");
  
      })
      .catch(error => {
        // toast.error("Fail to save");
  
        console.error('Error downloading image:', error);
      });
    };

    const  handleRegenerate = (param) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else {
        const formData = new FormData();
        const key = "prompt" ;
        formData.append(key, searchValue);
        common.regenerateImage(param, formData).then(closemodel(false));
      }
    };

    return (
      <div className="imagePopupContent">
        <img className="fullSizeImage" src={`http://localhost:3000/`+`${data.data.url}`} />
        <div className="imagePopupActions">
          <textarea placeholder="prompt" 
          onClick={()=> setselected(data.data.id) }
    onChange={(e) =>{ setSearchValue(e.target.value) }}  value={ selectedindex == data.data.id ? searchValue: data.data.prompt}> </textarea>
          <img
          onClick={()=>downloadImage(data.data.url)}
            className="actionIconDownload"
            alt="Download Image"
            src="assets/images/download-icon.svg"
          />
          <img
            className="actionIconAddToFolder"
            alt="Add to Collection"
            src="assets/images/add-to-folder.svg"
          />
          {data.data?.favorite == 1 ?<img


          onClick={()=>removefav(data.data.id,data.data?.favorite)}
            className="actionIconAddToFolder"
            alt="Add to Favourites"
            src="assets/images/mdi_heart-outline-3.svg"
          />:<img
          onClick={()=>addfav(data.data.id,data.data?.favorite)}
            className="actionIconAddToFolder"
            alt="Add to Favourites"
            src="assets/images/mdi_heart-outline.svg"
          />}
              
          <img  
           onClick={()=>handleRegenerate(details.id)}
          // onClick={()=>{console.log("as",details.id)}}
            className="actionRegenerate"
            alt="Re-Generate"
            src="assets/images/re-geenrate.svg"
          />
        </div>
      </div>

    )
  }
  return (
    <div className="dod">
    {loading && (
      <div className="loader-container">
        <div className="loader"><p>Loading</p></div>
      </div>
    )}
    <div className="imagePopup">
      {alldata && alldata.map((item, index) => (
        <Imagesdownload key={index} data={item} />
      ))}
      <a className="closePopup" style={{ backgroundColor: '#ffd338', color: 'black' }} onClick={() => { closemodel(false) }} >X</a>
    </div>
  </div>

  )
}

export default Download
