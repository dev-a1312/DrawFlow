import React, { useEffect, useRef, useState } from 'react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [penColor, setPenColor] = useState('black');
  const [penWidth, setPenWidth] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let lastX = 0;
    let lastY = 0;
    let isDrawing = false;

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      lastX = e.offsetX;
      lastY = e.offsetY;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const x = e.offsetX;
      const y = e.offsetY;

      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(x, y);
      context.strokeStyle = penColor;
      context.lineWidth = penWidth;
      context.stroke();
      context.closePath();

      lastX = x;
      lastY = y;
    });

    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });

    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
    });

  }, [penColor, penWidth]);

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL();  // Capture canvas content as base64 string

    // Send the base64 string to the backend
    fetch('http://localhost:5000/save-drawing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drawingData }),
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);  // Alert message from the backend
    })
    .catch(error => {
      console.error('Error saving drawing:', error);
    });
  };

  const loadDrawings = () => {
    // Fetch all saved drawings from the backend
    fetch('http://localhost:5000/load-drawings')
      .then((response) => response.json())
      .then((data) => {
        // Check if there are any saved drawings
        if (data.length > 0) {
          const latestDrawing = data[0].drawing_data;  // Get the latest drawing data (base64)
  
          // Ensure the canvas is cleared before drawing the new image
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          const img = new Image();
  
          // When the image is loaded, draw it onto the canvas
          img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
            context.drawImage(img, 0, 0);  // Draw the image onto the canvas
          };
  
          // Set the source of the image to the base64 string from the DB
          img.src = latestDrawing;
        } else {
          alert('No drawings found.');
        }
      })
      .catch((error) => {
        console.error('Error loading drawings:', error);
        alert('There was an error loading the drawing.');
      });
  };
  

  return (
    <div className="whiteboard-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '20px' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="whiteboard-canvas"
        style={{ border: '1px solid #000', backgroundColor: '#fff' }}
      />
      
      <div className="toolbar" style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '10px', width: '150px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3 style={{ textAlign: 'center', fontSize: '18px' }}>Toolbar</h3>
        <button onClick={() => setPenColor('red')} style={{ backgroundColor: 'red', color: 'white', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: 'none' }}>Red</button>
        <button onClick={() => setPenColor('blue')} style={{ backgroundColor: 'blue', color: 'white', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: 'none' }}>Blue</button>
        <button onClick={() => setPenColor('green')} style={{ backgroundColor: 'green', color: 'white', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: 'none' }}>Green</button>
        <button onClick={() => setPenColor('black')} style={{ backgroundColor: 'black', color: 'white', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: 'none' }}>Black</button>

        <label htmlFor="pen-width" style={{ marginBottom: '5px' }}>Pen Width:</label>
        <input 
          type="range" 
          id="pen-width"
          min="1" 
          max="10" 
          value={penWidth}
          onChange={(e) => setPenWidth(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <button onClick={() => {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
        }} style={{ backgroundColor: 'gray', color: 'white', padding: '10px', borderRadius: '5px', border: 'none' }}>Clear</button>

        {/* Save Button */}
        <button onClick={saveDrawing} style={{ backgroundColor: 'purple', color: 'white', padding: '10px', borderRadius: '5px', border: 'none' }}>Save Drawing</button>

        {/* Load Button */}
        <button onClick={loadDrawings} style={{ backgroundColor: 'orange', color: 'white', padding: '10px', borderRadius: '5px', border: 'none' }}>Load Drawing</button>
      </div>
    </div>
  );
};

export default Whiteboard;
