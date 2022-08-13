import fetch from 'node-fetch'
import 'dotenv/config'
import { writeFile } from 'fs/promises'

type DownloadFile = {url: string, name: string}

const getSlackMessage = async () => {
  const apiURL = `https://slack.com/api/conversations.history?channel=${process.env.CHANNEL_ID}`
  let cursor: string | undefined = undefined

  let downloads: Array<DownloadFile> = []
  try {
    do {
      const url = cursor ? apiURL + `&cursor=${cursor}` : apiURL
      const request = await fetch(url,
        {headers: {Authorization: `Bearer ${process.env.USER_OAUTH_TOKEN}`}})
      const response:any = await request.json()
      if (response.ok) {
        console.log(response.messages.length)
        response.messages.forEach((message:any) => {
          if (message.files) {
            message.files.forEach((file:any) => {
              console.log(`${file.url_private_download}`)
              downloads.push({url: file.url_private_download, name: file.name})
            })
          }
        });
        cursor = response?.response_metadata?.next_cursor
      } else {
        console.log("### Not ok", url)
        return downloads
      }
    } while (cursor)
    console.log("--- end")
    return downloads
  } catch (err) {
    console.log("### Error", err)
    return downloads
  }
}

const getSlackFile = async (url: string): Promise<any> => {
  const request = await fetch(url,
    {headers: {Authorization: `Bearer ${process.env.USER_OAUTH_TOKEN}`}})
  const data = await request.blob()
  return data
}

const getAndSave = async () => {
  const downloads: Array<DownloadFile> = await getSlackMessage()
  downloads.forEach(async(download:DownloadFile) => {
    console.log("---", download.url)
    const data:Blob = await getSlackFile(download.url)
    await writeFile(`/tmp/slack/${download.name}`, Buffer.from(await data.arrayBuffer()))
  })
}


getAndSave()
