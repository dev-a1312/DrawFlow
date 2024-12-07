module.exports = function (io, db) {
  // Listen for a connection from a client
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for drawing events from the client
    socket.on('draw', (data) => {
      // Broadcast the drawing data to all other connected clients
      socket.broadcast.emit('draw', data);

      // Extract drawing data from the event payload
      const { sessionId, userId, drawingData } = data;

      // SQL query to save drawing data
      const query = `
        INSERT INTO drawings (session_id, user_id, drawing_data)
        VALUES (?, ?, ?)
      `;

      // Execute the query to store the data
      db.query(query, [sessionId, userId, JSON.stringify(drawingData)], (err) => {
        if (err) {
          console.error('Error saving drawing to database:', err);
        } else {
          console.log('Drawing saved to database');
        }
      });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};
