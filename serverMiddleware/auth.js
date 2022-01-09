const msal = require('@azure/msal-node');
const msalConfig = {
    auth: {
        clientId: "89322658-208d-4a7d-98c6-6ba83864e9f5",
        authority: "https://login.microsoftonline.com/namenjesu.com",
        clientSecret: process.env.MICROSOFT_PROVIDER_AUTHENTICATION_SECRET
    },
};
const cca = new msal.ConfidentialClientApplication(msalConfig);


// const axios = require('axios').default;


export default function(req, res, _next) {

    const baseUrl = (process.env.NODE_ENV === 'production' ? "https://" : "http://") + req.headers.host;
    const url = new URL(req.url, baseUrl);
    if (req.url.match(/^\/login\/aad\?/i)) {
        const params = new URLSearchParams(req._parsedUrl.search);
        const authCodeUrlParameters = {
            scopes: ["user.read"],
            redirectUri: `${baseUrl}/auth/login/aad/callback`,
            domainHint: 'namenjesu.com',
            state: params.get('ref')
        };


        // get url to sign user in and consent to scopes needed for application
        cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
            res.writeHead(303, { Location: response });
            res.end();
        });
    } else if (req.url.match(/^\/login\/aad\/callback/i)) {
        const params = new URLSearchParams(req._parsedUrl.search);
        const tokenRequest = {
            code: url.searchParams.get('code'),
            scopes: ["user.read"],
            redirectUri: `${baseUrl}/auth/login/aad/callback`,
            state: params.get('state')
        };


        cca.acquireTokenByCode(tokenRequest).then((response) => {
            res.writeHead(303, { Location: `${baseUrl}/login/aad/${response.accessToken}?ref=${params.get('state')}` });
            res.end();

            _next()
        }).catch(() => {
            res.writeHead(500, 'Internal Server Error')
            res.end();
        });

    }

    // res is the Node.js http response object

    // next is a function to call to invoke the next middleware
    // Don't forget to call next at the end if your middleware is not an endpoint!
    // next()
}