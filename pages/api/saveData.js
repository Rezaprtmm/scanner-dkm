const fs = require("fs").promises
const path = require("path")
const process = require("process")
const { google } = require("googleapis")
const { authenticate } = require("@google-cloud/local-auth")
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
const TOKEN_PATH = path.join(process.cwd(), "./token.json")
const CREDENTIALS_PATH = path.join(process.cwd(), "./credentials.json")

module.exports = async function handler(req, res) {
  try {
    const { name, email, inst, role, noreg } = req.body
    const now = new Date()
    const hrs = now.getHours()
    const mts = now.getMinutes()
    const scd = now.getSeconds()

    // event time
    const evHrs = 17
    const evMts = 44
    const evScd = 59

    let stat

    if (hrs <= evHrs && mts <= evMts && scd <= evScd) {
      stat = "Tepat Waktu"
    } else {
      stat = "Terlambat"
    }

    const regDate = now.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err)
      authorize(JSON.parse(content), writeData)
    })

    async function loadSavedCredentialsIfExist() {
      try {
        const content = await fs.readFile(TOKEN_PATH)
        const credentials = JSON.parse(content)
        return google.auth.fromJSON(credentials)
      } catch (err) {
        return null
      }
    }

    /**
     * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    async function saveCredentials(client) {
      const content = await fs.readFile(CREDENTIALS_PATH)
      const keys = JSON.parse(content)
      const key = keys.installed || keys.web
      const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
      })
      await fs.writeFile(TOKEN_PATH, payload)
    }
    /**
     * Prints the names and majors of students in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */

    async function authorize() {
      let client = await loadSavedCredentialsIfExist()
      if (client) {
        return client
      }
      client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
      })
      if (client.credentials) {
        await saveCredentials(client)
      }
      return client
    }

    function writeData(auth) {
      const sheets = google.sheets({ version: "v4", auth })
      let values = [
        [noreg, name, email, inst, role, regDate, stat],
        // Potential next row
      ]
      const resource = {
        values,
      }
      sheets.spreadsheets.values.append(
        {
          spreadsheetId: "14S7erNn9Bqxog6x5_KhCAtybbDf5wshS16pJrE4ua2s",
          range: "Sheet2!A1",
          valueInputOption: "RAW",
          resource: resource,
        },
        (err, result) => {
          if (err) {
            // Handle error
            console.log(err)
          } else {
            console.log(
              "%d cells updated on range: %s",
              result.data.updates.updatedCells,
              result.data.updates.updatedRange
            )
          }
        }
      )
    }

    function validate(auth) {
      const sheets = google.sheets({ version: "v4", auth })
      let val = "ada"
      let val1 = false
      sheets.spreadsheets.values.get(
        {
          spreadsheetId: "14S7erNn9Bqxog6x5_KhCAtybbDf5wshS16pJrE4ua2s",
          range: "Sheet2",
        },
        (err, result) => {
          if (err) {
            console.log(err)
            res.status(500).json({ message: "Error while searching data." })
          } else {
            const rows = result.data.values
            const searchData = []

            if (rows.length < 2) {
              authorize().then(writeData).catch(console.error)
              val1 = true
              res.send(val1)
            } else {
              for (let i = 1; i < rows.length; i++) {
                const row = rows[i]
                const regNumV = row[0] // Kolom Name (kolom A)
                const nameV = row[1] // Kolom Registration Number (kolom F)

                if (nameV === name && regNumV === noreg) {
                  res.send(val)
                  break
                }

                if (i === rows.length - 1) {
                  authorize().then(writeData).catch(console.error)
                  searchData.push(row)
                  val1 = true
                  res.send(val1)
                  break
                }
              }
            }
          }
        }
      )
    }

    function searchData(auth) {
      const sheets = google.sheets({ version: "v4", auth })
      let val = false
      sheets.spreadsheets.values.get(
        {
          spreadsheetId: "14S7erNn9Bqxog6x5_KhCAtybbDf5wshS16pJrE4ua2s",
          range: "Sheet1",
        },
        (err, result) => {
          if (err) {
            console.log(err)
            res.status(500).json({ message: "Error while searching data." })
          } else {
            const rows = result.data.values

            if (rows.length < 2) {
              res.send(val)
            } else {
              for (let i = 1; i < rows.length; i++) {
                const row = rows[i]
                const nameS = row[0] // Kolom Name (kolom A)
                const regNumS = row[5] // Kolom Registration Number (kolom F)

                if (nameS === name && regNumS === noreg) {
                  authorize().then(validate).catch(console.error)
                  break
                }

                if (i === rows.length - 1) {
                  console.log("data tidak ditemukan")
                  res.send(val)
                  break
                }
              }
            }
          }
        }
      )
    }

    authorize()
      .then(searchData)
      .catch((error) => {
        console.error(error)
        res.status(500).json({ message: "Error while searching data." })
      })
  } catch (error) {
    console.error(error)
    console.log("Terjadi kesalahan saat menyimpan data")
    return false
  }
}
