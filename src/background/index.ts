import { CORS_HOST_FILTER } from '../environment';

const CORS_PERMISSION_SCOPE = ['blocking', 'responseHeaders', 'extraHeaders'];

function init() {
    chrome.webRequest.onHeadersReceived.addListener(
        addCORSheaders,
        { urls: [CORS_HOST_FILTER] },
        CORS_PERMISSION_SCOPE);
}

function addCORSheaders(details: chrome.webRequest.WebResponseHeadersDetails): chrome.webRequest.BlockingResponse {
    const newHeaders = {
        responseHeaders: [
            ...details.responseHeaders,
            {
                name: 'Access-Control-Allow-Origin',
                value: '*',
            },
        ],
    };
    return newHeaders;
}

init();
