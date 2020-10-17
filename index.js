require('dotenv').config()
const express = require('express')
const webPush = require('web-push')
const app = express()
const port = process.env.PORT || 3003

webPush.setVapidDetails(
  "mailto:guilhermess@pbtech.net.br",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

app.use(express.json())

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/send', async (req, res) => {
  try {
    const { title, body, url, subscription } = req.body

    const payload = JSON.stringify({
      title,
      body,
      url
    })

    const response = await webPush.sendNotification(subscription, payload, { TTL: 60 })

    res.json(response)
  } catch (error) {
    console.error(error)
    res.status(500)
    res.json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
