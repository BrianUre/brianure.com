import { createServer } from "http"
import { OAuth2Client } from "google-auth-library"

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const PORT = 3801
const REDIRECT_URI = `http://localhost:${PORT}`

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.send",
]

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
})

console.log("\nVisit this URL to authorize:\n")
console.log(authUrl)
console.log()

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get("code")

  if (!code) {
    res.writeHead(400)
    res.end("Missing code parameter.")
    return
  }

  res.writeHead(200, { "Content-Type": "text/html" })
  res.end("<h2>Authorization successful — you can close this tab.</h2>")

  server.close()

  const { tokens } = await client.getToken(code)
  console.log("\nYour new refresh token:\n")
  console.log(tokens.refresh_token)
  console.log("\nUpdate GOOGLE_REFRESH_TOKEN in .env.local and Vercel.\n")
})

server.listen(PORT, () => {
  console.log(`Waiting for Google to redirect to ${REDIRECT_URI}...`)
})
