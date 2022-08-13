import fetch from 'node-fetch'
import 'dotenv/config'
import { writeFileSync } from 'fs'



const getSlackMessage = async () => {
  const apiURL = `https://slack.com/api/conversations.history?channel=${process.env.CHANNEL_ID}`
  let cursor: string | undefined = undefined
  let messages: Array<any> = []

  try {
    do {
      const url = cursor ? apiURL + `&cursor=${cursor}` : apiURL
      const request = await fetch(url,
        {headers: {Authorization: `Bearer ${process.env.USER_OAUTH_TOKEN}`}})
      const response:any = await request.json()
      if (response.ok) {
        console.log(response.messages.length)
        messages = messages.concat(response.messages)
        cursor = response?.response_metadata?.next_cursor
      } else {
        console.log("### Not ok", url)
        return messages
      }
    } while (cursor)
    console.log("--- end", messages.length)
    return messages
  } catch (err) {
    console.log("### Error", err)
    return messages
  }
}

const getAndSave = async () => {
  const messages = await getSlackMessage()
  writeFileSync("/tmp/slack/SLACK.json", JSON.stringify(messages.reverse()))
}


getAndSave()
