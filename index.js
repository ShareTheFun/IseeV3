const express = require("express")
const path = require("path")
const downloadRoute = require("./api/download")

const app = express()

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Increase the request timeout for large downloads
app.use((req, res, next) => {
  // Set timeout to 10 minutes for download requests
  if (req.url.includes("/api/download-file")) {
    req.setTimeout(600000) // 10 minutes in milliseconds
  }
  next()
})

// API routes
app.use("/api", downloadRoute)

// Fallback to serve index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Listen on port 3000
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app

