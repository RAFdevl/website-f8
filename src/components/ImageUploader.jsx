import React, { useState } from "react";

export default function ImageUploader({ onImageUrlChange, currentUrl, label = "URL Gambar" }) {
  const [imageUrl, setImageUrl] = useState(currentUrl || "");
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    const isValid = url === "" || validateUrl(url);
    setIsValidUrl(isValid);
    
    if (isValid) {
      onImageUrlChange(url);
    }
  };

  const handlePasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (validateUrl(text)) {
        setImageUrl(text);
        onImageUrlChange(text);
        setIsValidUrl(true);
      } else {
        setIsValidUrl(false);
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        {label}
      </label>
      
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="url"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          style={{
            flex: 1,
            padding: "0.5rem",
            border: `2px solid ${isValidUrl ? "#ddd" : "#dc3545"}`,
            borderRadius: "4px",
            fontSize: "14px"
          }}
        />
        
        <button
          type="button"
          onClick={handlePasteUrl}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Paste URL
        </button>
      </div>
      
      {!isValidUrl && imageUrl && (
        <p style={{ color: "#dc3545", fontSize: "12px", marginTop: "0.5rem" }}>
          URL tidak valid. Pastikan format URL benar (contoh: https://example.com/image.jpg)
        </p>
      )}
      
      {imageUrl && isValidUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "0.5rem" }}>
            Preview:
          </p>
          <img
            src={imageUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "150px",
              borderRadius: "4px",
              border: "1px solid #ddd"
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
      
      <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
        <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
          <strong>Tips:</strong> Upload gambar ke{" "}
          <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
            Imgur
          </a>
          {" atau "}
          <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
            Postimages
          </a>
          , lalu copy URL gambar dan paste di atas.
        </p>
      </div>
    </div>
  );
}