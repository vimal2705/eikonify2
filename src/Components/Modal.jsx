import React, { useState } from 'react';
import './Modal.css'; // Import CSS for styling

const Modal = ({ children, id,onClose, data, addcollection,addtocollection }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedCollectionid, setSelectedCollectionid] = useState("");
  const handleCheckboxChange = (name) => {
    setSelectedCollection(name.name);
    setSelectedCollectionid(name.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-column">
          {/* Right side: List */}
          <h2 style={{ color: "#000" }}>Collections</h2>
          <ul>
            {data.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                <h5 style={{ color: "#000", marginLeft: "5px" }}>{item.name.toUpperCase()}</h5>
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={() => handleCheckboxChange(item)}
                  checked={selectedCollection === item.name}
                />
              </div>
            ))}
          </ul>
        </div>
        <div className="modal-columns">
          {/* Left side: Text Input and Button */}
          <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
            <input
              type="text"
              placeholder="add collection"
              className="modal-input"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
            <button
              className="modal-button"
              onClick={() => {
                addcollection(searchValue);
                setSearchValue("");
              }}
            >
              Add
            </button>
          </div>
          <button
        className="modal-button"
        disabled={selectedCollection.length >= 1 ? false:true}
        onClick={() => {
          // Add functionality for save button here
          addtocollection(selectedCollectionid)

        }}
        style={{ marginTop: "10px" ,width:"100%"}}
      >
        Save
      </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
