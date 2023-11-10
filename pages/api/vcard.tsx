import {NextApiRequest, NextApiResponse} from 'next'

import VCard from 'vcard-creator'

const gistUrl = 'https://gist.githubusercontent.com/matkoch/d91ef81818e94d98e7964cb7714d80cd'

async function getGistContent(item: string, postfix: string) {
  const rawBaseUrl = `${gistUrl}/raw`;
  let response = await fetch(`${rawBaseUrl}/${item}-${postfix}`)

  if (response.status != 200)
    response = await fetch(`${rawBaseUrl}/default-${item}`)

  if (response.status != 200)
    return null

  return await response.text()
}

async function getBase64String(url: string) {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer).toString('base64')
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const segments = new URL(req.headers["referer"] as string).pathname.split('/')
  const gistItem = segments.pop() || segments.pop()

  const notes = await getGistContent('vcard-notes', gistItem)
  const imageUrl = await getGistContent('vcard-image', gistItem)
  const base64Image = await getBase64String(imageUrl)

  const myVCard = new VCard()
    .addName('Koch', 'Matthias')
    .addAddress('', '', '', 'Leipzig', '', '', 'Germany')
    .addCompany('JetBrains')
    .addJobtitle('Developer Advocate')
    .addURL('https://ShinyCodes.NET')
    .addEmail('matthias.koch@jetbrains.com')
    .addSocial('https://www.linkedin.com/in/matthias-koch-jb', 'LinkedIn', 'matthias-koch-jb')
    .addSocial('https://github.com/matkoch', 'GitHub', 'matkoch')
    .addSocial('https://twitter.com/matkoch87', 'Twitter', 'matkoch87')
    .addSocial('https://discordapp.com/users/376491402768416798', 'Discord', 'matkoch#1337')
    .addSocial('https://dotnet.social/@matkoch', 'Mastodon', '@matkoch@dotnet.social')
    .addPhoto(base64Image)
    .addNote(notes.trim())

  res.setHeader('Content-Type', 'text/vcard');
  res.setHeader('Content-Disposition', 'attachment; filename="matthias-koch.vcf"');
  res.status(200).send(myVCard.toString())
}
