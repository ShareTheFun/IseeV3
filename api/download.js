const express = require("express")
const fetch = require("node-fetch") // Works with node-fetch@2
const router = express.Router()
const { ytdown } = require("nayan-videos-downloader")

router.get("/download", async (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: "URL is required" })
  }

  try {
    const result = await ytdown(url)
    if (result.status) {
      res.json({
        success: true,
        data: result.data,
      })
    } else {
      res.status(400).json({ error: "Failed to fetch video data" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Endpoint for downloading the video file
router.get("/download-file", async (req, res) => {
  const { videoUrl, title } = req.query

  if (!videoUrl || !title) {
    return res.status(400).json({ error: "Video URL and title are required" })
  }

  try {
    // Fetch the video content
    const response = await fetch(videoUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`)
    }

    // Sanitize the filename
    const filename = `${title.replace(/[^\w\s]/gi, "")}.mp4`

    // Set appropriate headers for file download
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.setHeader("Content-Type", "video/mp4")

    // Stream the video content to the response
    response.body.pipe(res)
  } catch (error) {
    console.error("Download error:", error)
    res.status(500).json({ error: "Failed to download video" })
  }
})

module.exports = router

