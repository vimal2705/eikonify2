import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { auth, common } from "../config/call";
import Download from './Download'
import axios  from 'axios';
import { baseURL } from "../config/api";
import { toast } from "react-toastify";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Favourites = () => {
  const [searchValue, setSearchValue] = useState("")
  // const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const token = `Bearer ${localStorage.getItem('token')}` ;
  const [user, setUser] = useState(undefined);
  
  const [imagedata,setimagedata] = useState([])
  const [loading, setLoading] = useState(false);
  const [alldata,setalldata] =useState([])
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
     
      console.log("Asdasdss",data);
      setUser(data.data?.user)
    })
  
}
  const fetchListing = async () => {
 
    // setRequestData(response.data);
    let token = localStorage.getItem('token')
    await axios.get(
      `http://20.55.71.246:3000/api/v1/eikonify/getfavorites`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
     
    ).then(({ data }) => {
      
      console.log("Asdasd",data.data.recordset);
      setalldata(data.data.recordset)
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
      });
  };

  const removefav = async (id,fav) => {

    try {
      let token = localStorage.getItem('token')
      let param ={favorite:0}
      await axios.patch(
        `http://20.55.71.246:3000/api/v1/eikonify/removefavorite/${id}`,
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
    fetchListing()
  },[])

  // Attach the handleOutsideClick to the document click event
  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);



  const onGenerate = async (param) => {
    setLoading(true);
    console.log("Param", param);
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      setLoading(false);
    } else {
      const formData = new FormData();

      const key = typeof param === "string" ? "prompt" : "image";
      formData.append(key, param);
      if (typeof param === "string") {
    await axios.post(
          `http://20.55.71.246:3000/api/v1/eikonify/check/`,
         formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
         
        ).then(() => {
            fetchListing();
            // toast.success("Success");
            setLoading(true);
          })
          .catch((err) => {
            console.log("err", err);
            toast.error("Something went wrong");
            setLoading(true);
          });
      } else {
        var myHeaders = new Headers();
        const Bearer = `Bearer ${token}`;
        myHeaders.append("Authorization", Bearer);

        var formdata = new FormData();
        const FineName = await generateRandomName(20);
        formdata.append("image", param, FineName);
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };
        const Base = baseURL;
        fetch(`${Base}/api/v1`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log("result===", result);
            fetchListing();
            toast.success("Image uploaded");
            setLoading(false);
          })
          .catch((error) => {
            console.log("error", error);
            toast.error("Something went wrong");
            setLoading(false);
          });
      }
      setSearchValue("");
    }
  };



  const onLogout = () => {
    navigate("/");
    localStorage.clear();
  };


  const Imagesview = (data) => {

    return (
     
      <div className="image">
        <img className="generatedImage"  src={ `http://20.55.71.246:3000/`+`${data.data.url}`} />
        
        <img onClick={()=> downloadImage(data.data.url)} className="downloadIcon" src="assets/images/download-icon.svg" />
       <img


onClick={()=>removefav(data.data.id[1])}
className="addToFolderIcon"
  src="assets/images/mdi_heart-outline-3.svg"
/>
        {/* <img
          className="addToFolderIcon"
          src="assets/images/add-to-folder.svg"
        /> */}
      </div>
     
      )
  }

  return (
    <>
      {!openModel && (
        <div  >

          <div className="dashboardHeaderContainer fullWidth p-1">
            <div className="wrapper dashboardHeader">
              <img onClick={()=> navigate("/dashboard")} style={{cursor:"pointer"}} src="assets/images/eikonify-logo.png" />
              <div className="userInfo">
              
              {user &&  <span className="user" onClick={toggleMenu}>  {user?.first_name[0].toUpperCase()}
                          {user?.last_name[0].toUpperCase()}
                          </span>}
                <ul className={`userMenu ${menuVisible ? 'show' : ''} `}>
                  <li style={{cursor:"pointer"}} onClick={()=>{  navigate("/collections")}} >My Collections</li>
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
<h2>Favourites</h2>
  <div className="imageGrid">
    {alldata?.map((item) => {
      return (<Imagesview data={item} />)

    })}

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
      <div>
        {openModel && <Download user={user} passid={passid} data={imagedata}  closemodel={setOpenModel} />}
      </div>
    </>

  )
}

export default Favourites;
