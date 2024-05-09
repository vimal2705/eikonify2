import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { auth, common } from "../config/call";
import Download from './Download'
import axios  from 'axios';
import { baseURL } from "../config/api";
import { toast } from "react-toastify";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useLocation } from 'react-router-dom';


const Collectionslist = () => {
    const location = useLocation();
const { state } = location;
console.log("Asdssssss",location);
  const [searchValue, setSearchValue] = useState("")
  // const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const token = `Bearer ${localStorage.getItem('token')}` ;
  const [user, setUser] = useState(undefined);
  
  const [imagedata,setimagedata] = useState([])
  const [loading, setLoading] = useState(false);
  const [alldata,setalldata] =useState([])
  const [collections,setCollections] = useState()
  const [passid,setpassid] =useState()
  const [openModel, setOpenModel] = useState(false);
  const images = [
    { id: 1, src: '1.jpg', count: 10 },
    { id: 2, src: '2.jpg', count: 10 },
    { id: 3, src: '3.jpg', count: 10 },
    { id: 4, src: '4.jpg', count: 10 },
    { id: 5, src: '5.jpg', count: 10 },
    { id: 6, src: '6.jpg', count: 10 },
    { id: 7, src: '7.jpg', count: 10 },
    { id: 8, src: '8.jpg', count: 10 },
    { id: 9, src: '9.jpg', count: 10 },
    { id: 10, src: '10.jpg', count: 10 },

  ];
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    console.log("Selected image:", selectedImage);
    setSearchValue(selectedImage);
  };
  
  const onUpload = () => {
    console.log("Upload button clicked");
    const input = document.getElementById("file-input");
    input.click();
    console.log("Asdas",input);
  };
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  function generateRandomName(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  // Close the menu when clicking outside of it
  const handleOutsideClick = (event) => {
    if (!event.target.closest('.userInfo')) {
      setMenuVisible(false);
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else {
      const options = { day: "2-digit", month: "long", year: "numeric" };
      return date.toLocaleDateString("en-GB", options);
    }
  }

const getuser = async ()=>{
  let token = localStorage.getItem('token')
    await axios.get(
      `http://20.55.71.246:3000/api/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then(({data})=>{
        fetchListing(data.data?.user.id)
      console.log("Asdasdss",data);
      setUser(data.data?.user)
    })
  
}
const getObjectKeys = (obj) => {
    return Object.keys(obj);
  };
  const fetchListing = async (id) => {
 
    // setRequestData(response.data);
    let token = localStorage.getItem('token')
    await axios.get(
      `http://20.55.71.246:3000/api/v1/eikonify/bycollection/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
     
    ).then(({ data }) => {
      
      console.log("Asdasd",data.data);
       
       setCollections(data.data)
   
    //   setalldata(data)
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
      });
  };

  const removefav = async (id,fav) => {

    try {
        let token = localStorage.getItem('token')
        let param ={  "collection_id":null}
        await axios.patch(
          `http://20.55.71.246:3000/api/v1/eikonify/image/${id}`,
          param,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        ).then((response)=>{
        fetchListing()
     
        console.log('Patch request successful:', response.data);
      })
    
 // If you want to return the data from the response
    } catch (error) {
      console.error('Patch request failed:', error);
      throw error; // If you want to handle errors in the calling function
    }
  };

     
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
  useEffect(()=>{
    getuser()

  },[])

  // Attach the handleOutsideClick to the document click event
  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);



  



  const onLogout = () => {
    navigate("/");
    localStorage.clear();
  };


  const Imagesview = (data) => {
console.log("asdas",data);
    return (
     
      <div className="image">
        <img className="generatedImage"  src={ `http://20.55.71.246:3000/`+`${data.data.url}`} />
        
        <img onClick={()=> downloadImage(data.data.url)} className="downloadIcon" src="assets/images/download-icon.svg" />
       <img


onClick={()=>removefav(data.data.id)}
className="addToFolderIcon"
  src="assets/images/remove-from-folder.svg"
/>
        {/* <img
          className="addToFolderIcon"
          src="assets/images/add-to-folder.svg"
        /> */}
      </div>
     
      )
  }

  if (collections == null ) {
    return(
    <div>
        loading
    </div>)
  }
  else{
  return (
    <>
      { (
        <div  >

          <div className="dashboardHeaderContainer fullWidth p-1">
            <div className="wrapper dashboardHeader">
              <img onClick={()=> navigate("/dashboard")} style={{cursor:"pointer"}} src="assets/images/eikonify-logo.png" />
              <div className="userInfo">
              
              {user &&  <span className="user" onClick={toggleMenu}>  {user?.first_name[0].toUpperCase()}
                          {user?.last_name[0].toUpperCase()}
                          </span>}
                <ul className={`userMenu ${menuVisible ? 'show' : ''} `}>
                <li  style={{cursor:"pointer"}} onClick={()=>{  navigate("/favourites")}} >Favourites</li>
                  {/* <li  style={{cursor:"pointer"}}>Archive</li> */}
                  <li  style={{cursor:"pointer"}} onClick={()=>{
onLogout()
                  }}>Logout</li>
                </ul>
                <img src="assets/images/Logout.svg" onClick={()=>{
onLogout()
                  }} />
              </div>
            </div>
          </div>
          <div className="con4">
      
         
          </div>
          <div className="wrapper contentWrapper">
     
        <div className="imageGridContainer">
<h2>{state.key.toUpperCase()}</h2>
  <div className="imageGrid">

  {state.value.map((item) => {
      return (<Imagesview data={item} />)

    })
}
  

  </div>
</div>
           
     
      
            {/* <div className="imageGridContainer">
              <h1>Today</h1>

              <div className="imageGrid">
                {images.map((item) => {
                  return (<Imagesview data={item} />)

                })}

              </div>
            </div> */}

          </div>

        </div>
      )}
      {/* <div>
        {openModel && <Download user={user} passid={passid} data={imagedata}  closemodel={setOpenModel} />}
      </div> */}
    </>

  )}
}

export default Collectionslist;
