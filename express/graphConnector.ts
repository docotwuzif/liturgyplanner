const axios = require('axios').default

const graphBaseUrl = 'https://graph.microsoft.com/v1.0'

axios.defaults.baseURL = graphBaseUrl

const msConfig = {
  auth: {
    clientId: '89322658-208d-4a7d-98c6-6ba83864e9f5',
    authority: 'https://login.microsoftonline.com/namenjesu.com',
    clientSecret: process.env.MICROSOFT_PROVIDER_AUTHENTICATION_SECRET,
  },
}

export async function getAuthToken() {
  const res = await axios.post(
    msConfig.auth.authority + '/oauth2/v2.0/token',
    `client_id=${msConfig.auth.clientId}` +
      `&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default` +
      `&client_secret=${msConfig.auth.clientSecret}` +
      `&grant_type=client_credentials`,
    {
      headers: {
        Host: 'login.microsoftonline.com',
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }
  )
  return res.data
}

export async function getCurrentUser(accessToken: string) {
  const userdata = await axios.get('/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return userdata
}

export type MSAuthToken = {
  token_type: string
  access_token: string
}

export async function getAllUsers(authToken: MSAuthToken) {
  const res1 = await axios.get('/users', {
    headers: {
      Host: 'graph.microsoft.com',
      Authorization: `${authToken.token_type} ${authToken.access_token}`,
    },
  })
  return res1.data.value
}

export type getUserOptions = {
  include: {
    pfp?:
      | '48x48'
      | '64x64'
      | '96x96'
      | '120x120'
      | '240x240'
      | '360x360'
      | '432x432'
      | '504x504'
      | '648x648'
  }
}

export async function getUserById(
  authToken: MSAuthToken,
  uid: string,
  options: getUserOptions = { include: { pfp: '120x120' } }
) {
  const res1 = await axios.get(`/users/${uid}`, {
    headers: {
      Host: 'graph.microsoft.com',
      Authorization: `${authToken.token_type} ${authToken.access_token}`,
    },
  })

  const pfp: { picture?: { meta: any; data: any } } = {}
  if (options.include.pfp) {
    const resPfpData = await axios({
      method: 'get',
      url: `/users/${uid}/photos/${options.include.pfp}/$value`,
      responseType: 'stream',

      headers: {
        Host: 'graph.microsoft.com',
        Authorization: `${authToken.token_type} ${authToken.access_token}`,
      },
    })
    const resPfpMetaData = await axios.get(
      `/users/${uid}/photos/${options.include.pfp}`,
      {
        headers: {
          Host: 'graph.microsoft.com',
          Authorization: `${authToken.token_type} ${authToken.access_token}`,
        },
      }
    )
    pfp.picture = { meta: resPfpMetaData.data, data: resPfpData.data }
  }

  return { ...res1.data, ...pfp }
}
