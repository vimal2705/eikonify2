import { logDOM } from '@testing-library/react';
import React, { useEffect, useState } from 'react'
import { auth, common } from "../config/call";
import axios from "axios"
import Modal from './Modal';

const Download = ({ data,passid,closemodel,user }) => {

console.log("ASSSSS-=-=-=-=",data?.imageData[0]?.imagineData.id);
const [details,setdetails] = useState(data)
const token = '';
const [list,setlist]=useState()
const [searchValue ,setSearchValue] = useState()
const [selectedindex,setselected] = useState()
const [imagedata,setimagedata] = useState([])
const [imageid,  setImageid]= useState()
const [loading, setLoading] = useState(false);
const [alldata,setalldata]= useState()
const [showModal, setShowModal] = useState(false);
const [collection,setCollection] =useState()

// Function to open the modal
const openModal = () => {
  setShowModal(true);
};

// Function to close the modal
const closeModal = () => {
  setShowModal(false);
};

useEffect(()=>{
  getdetails(passid)
  getcollection()
},[])

const getcollection = async ()=>{
   let token = localStorage.getItem('token')
  const response = await axios.get(
    `http://20.55.71.246:3000/api/v1/eikonify/collection/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
   
  );

  console.log("Asdasdss",response.data.data.collectionData.recordset);
  setCollection(response.data.data.collectionData.recordset)
}

const addcollection = async (value)=>{
  let token = localStorage.getItem('token')
  let param ={name: value}
  const response = await axios.post(
    `http://20.55.71.246:3000/api/v1/eikonify/collection`,
    param,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
   
  );
  console.log("Asdasd",response)
  getcollection()


}



const removefav = async (id,fav) => {

  try {
    let token = localStorage.getItem('token')
    let param ={favorite:0}
    const response = await axios.patch(
      `http://20.55.71.246:3000/api/v1/eikonify/removefavorite/${id}`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  try {
    let token = localStorage.getItem('token')
    let param ={favorite:1}
    const response = await axios.patch(
      `http://20.55.71.246:3000/api/v1/eikonify/addfavorite/${id}`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
const addtocollection =async(id)=>{
  console.log(":Asda",id);
  let token = localStorage.getItem('token')
  let param ={  "collection_id":id}
  await axios.patch(
    `http://20.55.71.246:3000/api/v1/eikonify/image/${imageid}`,
    param,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
   
  ).then(({data})=>{
     setShowModal(false)
    console.log("Asdasdss",data);

  })
}

const getdetails = async (id) => {
  let token = localStorage.getItem('token')
   await axios.get(
    `http://20.55.71.246:3000/api/v1/eikonify/requestId/`+`${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
   
  ).then(({ data }) => {
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

const collectionmodal =async(id)=>{
  setImageid(id)
  setShowModal(true)


}


  const Imagesdownload = (data,index) => {

    
    const downloadImage = (url) => {
      const imageUrl = `http://20.55.71.246:3000/`+`${url}`; 
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


    const  handleRegenerate = async(param) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else {
        const formData = new FormData();
        const key = "prompt" ;
        formData.append(key, searchValue);
        
        await axios.post(
          `http://20.55.71.246:3000/api/v1/eikonify/`+`${param}`,
       formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
         
        ).then(closemodel(false));
      }
    };



    return (
      <div className="imagePopupContent">
        <img className="fullSizeImage" src={`http://20.55.71.246:3000/`+`${data.data.url}`} />
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
           onClick={()=>collectionmodal(data.data.id)}
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
    {showModal && (
        <Modal onClose={closeModal} id={imageid} data={collection} addcollection={addcollection} addtocollection={addtocollection}>
          {/* Content of the modal */}
          <h2>Modal Title</h2>
          <p>This is the content of the modal.</p>
        </Modal>
      )}
      {alldata && alldata.map((item, index) => (
        <Imagesdownload key={index} data={item} />
      ))}
      <a className="closePopup" style={{ backgroundColor: '#ffd338', color: 'black' }} onClick={() => { closemodel(false) }} >X</a>
    </div>
  
  </div>

  )
}

export default Download
