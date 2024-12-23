import React, { useState } from "react";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChatHistory([...chatHistory, userMessage]);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/chat", { message });

      const aiMessage = { sender: "ai", text: res.data.response };
      setChatHistory([...chatHistory, userMessage, aiMessage]);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setChatHistory([
        ...chatHistory,
        {
          sender: "ai",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
    setMessage("");
  };

  const renderMarkdownContent = (text) => {
    // Check for tables using Markdown format
    const tableRegex = /\|(.+)\|(?:\n\|[-\s:]+\|)+\n((?:\|.*\|(?:\n)?)*)/g;
    const matches = tableRegex.exec(text);

    if (matches) {
      const rows = matches[2]
        .trim()
        .split("\n")
        .map((row) =>
          row
            .trim()
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim())
        );
      const headers = matches[1]
        .trim()
        .split("|")
        .slice(1, -1)
        .map((header) => header.trim());

      return (
        <TableContainer
  sx={{
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: "#333", // Background for the table container
    borderRadius: 3,
    overflowX: "auto",
    boxShadow: "0px 4px 8px rgba(192, 192, 192, 0.3)", // Light shadow for depth
    border: "1px solid #444", // Border for the entire container
  }}
>
  <Table
    sx={{
      border: "2px solid #444", // Solid border around the table
      borderRadius: 3, // Optional rounded corners
      color: "#c0c0c0",
    }}
  >
    <TableHead>
      <TableRow sx={{ backgroundColor: "#1abc9c" }}> {/* Custom color for heading */}
        {headers.map((header, idx) => (
          <TableCell
            key={idx}
            sx={{
              color: "#ffffff", // White text for the header
              fontWeight: "bold",
              padding: "12px",
              textAlign: "center",
              borderRight: "1px solid #444", // Border between columns
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row, idx) => (
        <TableRow
          key={idx}
          sx={{
            backgroundColor: idx % 2 === 0 ? "#34495e" : "#2c3e50", // Alternating row colors
            "&:hover": {
              backgroundColor: "#16a085", // Hover effect for rows
              transform: "scale(1.02)",
            },
            transition: "background-color 0.3s, transform 0.2s",
          }}
        >
          {row.map((cell, i) => (
            <TableCell
              key={i}
              sx={{
                color: "#ecf0f1", // Light text color for cells
                padding: "12px",
                textAlign: "center",
                borderRight:
                  i < row.length - 1 ? "1px solid #444" : "none", // Border between cells
              }}
            >
              {cell}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      );
    }

    // Render general Markdown content if no table is found
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 3,
        background:
          "linear-gradient(to bottom, #000066, #00004d, #000033, #000000)", // Dark Blue to Black
        color: "#c0c0c0", // Silver text
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          fontSize: "2.5rem",
          textAlign: "center",
          color: "#fff",
          textShadow:
            "0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.6)",
          letterSpacing: "2px",
          paddingBottom: "20px",
        }}
      >
        AI Chat Assistant
      </Typography>

      {/* Render the Paper component only after a message is sent */}
      {chatHistory.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 800,
            padding: 3,
            marginBottom: 2,
            maxHeight: "60vh",
            overflowY: "auto",
            backgroundColor: "transparent", // Semi-transparent black
            borderRadius: "16px",
            boxShadow: "0px 8px 30px rgba(255, 255, 255, 0.3)", // Subtle white glow
            border: "1px solid rgba(255, 255, 255, 0.2)", // Transparent border
            color: "#c0c0c0", // Silver text
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "95%",
              padding: 2,
              gap: 5, // Consistent spacing between messages
            }}
          >
            {chatHistory.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    padding: "5px 15px",
                    backgroundColor:
                      message.sender === "user" ? "#48c9b0" : "#3b3b3b", // Teal for user, dark gray for AI
                    borderRadius:
                      message.sender === "user"
                        ? "16px 16px 0 16px" // Rounded corners for user messages
                        : "16px 16px 16px 0", // Rounded corners for AI messages
                    maxWidth: "70%",
                    wordWrap: "break-word",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
                    color: "#ffffff", // White text for both
                    fontSize: "0.9rem",
                    transition: "transform 0.2s, background-color 0.3s",
                    "&:hover": {
                      transform: "scale(1.03)", // Slight zoom effect on hover
                      backgroundColor:
                        message.sender === "user" ? "#3db89a" : "#454545", // Darker shade on hover
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{
                      display: "inline-block",
                      fontWeight: message.sender === "user" ? "bold" : "normal",
                      fontSize: "1rem",
                    }}
                  >
                    {renderMarkdownContent(message.text)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 600,
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={message}
          onChange={handleChange}
          placeholder="Type your message..."
          sx={{
            flex: 1,
            marginRight: 1,
            padding: 1,
            backgroundColor: "transparent", // Transparent input background
            borderRadius: "16px",
            
             
            
          }}
          InputProps={{
            sx: {
              color: "#c0c0c0", // Silver text inside input
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White border color
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White border on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White border when focused
              },
            },
          }}
          inputProps={{
            style: {
              color: "#c0c0c0", // Silver text
            },
          }}
        />

        <Button
          variant="contained"
          type="submit"
          disabled={loading || !message.trim()}
          sx={{
            padding: "10px 20px",
            background: "linear-gradient(to right, #003366, #66ccff)", // Black-to-silver gradient
            fontWeight: "bold",
            color: "#fff",
            display: "flex",
            alignItems: "center", // Ensures the icon aligns with the text
            gap: 1, // Adds space between the icon and text
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon sx={{ color: "white" }} />
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default App;
