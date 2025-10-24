import axios from 'axios';
import { URL } from 'node:url';
import { getRandom } from 'random-useragent';

const BASE_HEADERS = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'close',
    'DNT': '1',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Ch-Ua-Mobile': '?0',
    'TE': 'trailers',
    'Priority': 'u=0, i',
    'Cache-Control': 'no-cache',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
}

const debug = process.env.debug;

class RequestBuilder {
    constructor(url, method = 'GET') {
        this.url = new URL(url);
        this.method = method.toUpperCase();
        this.headers = { ...BASE_HEADERS };
        this.timeout = 5000;
        this.params = {};
        this.data = null;
    }

    setHeaders(headers) {
        this.headers = { ...this.headers, ...headers };
        return this;
    }

    // Set parameters for GET requests
    setParams(params) {
        this.params = { ...this.params, ...params };
        return this;
    }

    // Set data for POST requests
    setData(data) {
        this.data = data;
        return this;
    }

    // Change the HTTP method dynamically
    setMethod(method) {
        this.method = method.toUpperCase();
        return this;
    }

    async send() {
        const userAgent = getRandom(function (ua) {
            return Number.parseFloat(ua.browserVersion) >= 90;
        });

        this.headers['User-Agent'] = userAgent;

        const config = {
            method: this.method,
            url: this.url,
            headers: this.headers,
            timeout: this.timeout,
            params: this.params
        }

        if (this.method === 'POST' && this.data) {
            config.data = this.data;
        }

        try {
            const response = await axios(config);
            response.success = response.status >= 200 && response.status < 300;
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

RequestBuilder.get = (url) => new RequestBuilder(url, 'GET');
RequestBuilder.post = (url) => new RequestBuilder(url, 'POST');

export default RequestBuilder;