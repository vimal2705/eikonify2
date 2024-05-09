import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { auth, common } from "../config/call";
import Download from './Download'
import axios  from 'axios';
import { baseURL } from "../config/api";
import { toast } from "react-toastify";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("")
  // const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const token = `Bearer ${localStorage.getItem('token')}` ;
  const [user, setUser] = useState(undefined);
  
  const [imagedata,setimagedata] = useState([])
  const [loading, setLoading] = useState(false);
  const [alldata,setalldata] =useState()
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
      `http://20.55.71.246:3000/api/v1/eikonify/request/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
     
    ).then(({ data }) => {
      
        const sortedArray = data.data.sort(
          (a, b) => new Date(b.updateAt) - new Date(a.updateAt)
        );
        const groupedData = sortedArray.reduce((acc, obj) => {
          const date = new Date(obj.updateAt).toLocaleDateString("en-GB");
          const formattedDate = formatDate(obj.updateAt);
          const existingGroup = acc.find(
            (group) => group.Date === formattedDate
          );
          if (existingGroup) {
            existingGroup.data.push(obj);
          } else {
            acc.push({
              Date:
                formattedDate === new Date().toLocaleDateString("en-GB")
                  ? "Today"
                  : formattedDate,
              data: [obj],
            });
          }
          return acc;
        }, []);
        setLoading(false);
      

        setData(groupedData);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
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
    setpassid(id)
    setOpenModel(true);
  })
 
  };

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


  const getDetailsAndCreateZip = async (id) => {
    try {
   
      let token = localStorage.getItem('token')
      const data = await axios.get(
        `http://20.55.71.246:3000/api/v1/eikonify/requestId/`+`${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
       
      );
      console.log("data-=-=-=-=-=-=-", data.data);
      setimagedata(data.data);
  
      // Initialize an array to hold all URLs
      let urls = [];
  
      // Loop through each imageData
      for (let index = 0; index < data.data?.imageData.length; index++) {
        // Loop through each imagineData within imageData
        for (let i = 0; i < data?.data?.imageData[index]?.imagineData.length; i++) {
          // Push each URL into the urls array
          console.log("asdasd",data?.data?.imageData[index]?.imagineData[i]);
          urls.push(`http://20.55.71.246:3000/${data?.data?.imageData[index].imagineData[i].url}`);
        }
      }
  
      // Create a new JSZip instance
      const zip = new JSZip();
  
      // Fetch each URL and add it to the zip file
      for (let i = 0; i < urls.length; i++) {
        const response = await fetch(urls[i]);
        const blob = await response.blob();
        zip.file(`image${i + 1}.jpg`, blob); // You can change the file name as needed
      }
  
      // Generate the zip file asynchronously
      zip.generateAsync({ type: 'blob' }).then((content) => {
        // Save the zip file
        saveAs(content, 'images.zip'); // You may need to include the FileSaver.js library for the `saveAs` function
      });
  


    } catch (error) {
      console.error('Error fetching data:', error);

      // Handle error
    }
  };
  const onLogout = () => {
    navigate("/");
    localStorage.clear();
  };


  const Imagesview = (data) => {

    return (
      data.data?.imagine_status === "pending"  || data.data.url === null ? 
      <div className="image">
      <img className="generatedImage" src='assets/images/eikonify-symbol.png'/>
      <span className="count">{data.data.image_count}</span>
     
    </div>:
      <div className="image">
        <img className="generatedImage" onClick={() => getdetails(data.data.id)} src={data?.url?.includes('/')? '/public/eikonify-symbol.png': `http://20.55.71.246:3000/`+`${data.data.url}`} />
        <span className="count">{data.data.image_count}</span>
        <img onClick={()=> getDetailsAndCreateZip(data.data.id)} className="downloadIcon" src="assets/images/download-icon.svg" />
        <img
          className="addToFolderIcon"
          src="assets/images/add-to-folder.svg"
        />
      </div>
     
      )
  }

  return (
    <>
      {!openModel && (
        <div  >

          <div className="dashboardHeaderContainer fullWidth p-1">
            <div className="wrapper dashboardHeader">
              <img src="assets/images/eikonify-logo.png" />
              <div className="userInfo">
              
              {user &&  <span className="user" onClick={toggleMenu}>  {user?.first_name[0].toUpperCase()}
                          {user?.last_name[0].toUpperCase()}
                          </span>}
                <ul className={`userMenu ${menuVisible ? 'show' : ''} `}>
                  <li style={{cursor:"pointer"}} onClick={()=>{  navigate("/collections")}}>My Collections</li>
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
      
            <div className="generateBar">
            <input
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                id="file-input"
            />
              <input type="text"   value={
                  typeof searchValue === "string"
                    ? searchValue
                    : searchValue.name
                }
                disabled={typeof searchValue !== "string"}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onGenerate(searchValue);
                  }
                }} placeholder="keywords" />
              
             <label htmlFor="file-input" className="file-label">
  <img
    className="upload-image"

    onClick={onUpload}
    src="assets/images/upload-image.svg"
    alt="Upload Image Icon"
  />
</label>

              <button   onClick={() => onGenerate(searchValue)} >Generate</button>
            </div>
          </div>
          <div className="wrapper contentWrapper">
            {data.map((item,i) =>(
        <div className="imageGridContainer">

  <h1>{item.Date}</h1>

  <div className="imageGrid">
    {item.data.map((item) => {
      return (<Imagesview data={item} />)

    })}

  </div>
</div>
            )) }
     
      
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

export default Dashboard
