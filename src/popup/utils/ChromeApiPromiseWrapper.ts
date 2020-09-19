import { ALL_SUBDOMAIN_COOKIE_URL } from '../../environment';

export class ChromeApiPromiseWrapper {

    public static getCurrentTabHostname(): Promise<string> {
        return new Promise((resolve, reject) => {
            let hostname: string = null;
            chrome.tabs.query({ active: true }, (tabs: chrome.tabs.Tab[]) => {
                if (tabs.length < 1) {
                    reject('could not get tabs hostname');
                    return;
                }
                const url = tabs[0].url;
                try {
                    hostname = new URL(url).hostname;
                    console.log(`hostname is: ${hostname}`);
                    resolve(hostname);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    public static getCookieByHostnameAndName(hostname: string, cookieName: string) {
            console.log('Cookie hostname is: ', hostname);
            const hostnameFixed = ChromeApiPromiseWrapper.fixAllSubdomainCookieHostname(hostname);
            return new Promise((resolve, rejects) => {
                chrome.cookies.getAll({ domain: hostnameFixed }, (cookies: chrome.cookies.Cookie[]) => {
                    console.log(`All cookies for hostname ${hostnameFixed}: `, cookies);
                    const result = cookies.find((cookie: chrome.cookies.Cookie) => {
                        return cookieName === cookie.name;
                    });
                    console.log('Found cookie:', result);
                    if (result === undefined) {
                        rejects('no cookie found');
                    } else {
                        resolve(result);
                    }
                });
            });
    }

    private static fixAllSubdomainCookieHostname(hostname: string) {
        let hostnameFilter = hostname;
        if (hostname.indexOf(ALL_SUBDOMAIN_COOKIE_URL) > 0) {
            hostnameFilter = ALL_SUBDOMAIN_COOKIE_URL.substring(1);
        }
        return hostnameFilter;
    }

    public static removeOneCookieByNameAndUrl(cookie: chrome.cookies.Cookie) {
        return new Promise((resolve) => {
            const detail = {
                name: cookie.name,
                url: ChromeApiPromiseWrapper.urlFromCookie(cookie),
            };
            console.log('Using details for deleting: ', detail);
            chrome.cookies.remove(detail, (details: chrome.cookies.Details) => {
                console.log(`removing: ${cookie.name}`, details);
                resolve(details);
            });
        });
    }

    public static setOneCookie(cookie: chrome.cookies.Cookie) {
        const urlForCookie = ChromeApiPromiseWrapper.urlFromCookie(cookie);
        console.log(`setting ${cookie.name} for ${cookie.domain} and url ${urlForCookie}`);
        return new Promise((resolve) => {
          const detail: chrome.cookies.SetDetails = {
                value: cookie.value,
                domain: cookie.domain,
                name: cookie.name,
                url: urlForCookie,
                storeId: cookie.storeId,
                expirationDate: cookie.expirationDate,
                path: cookie.path,
                httpOnly: cookie.httpOnly,
                secure: cookie.secure,
            };
            chrome.cookies.set(detail, resolve);
        });
    }

    private static urlFromCookie(cookie: chrome.cookies.Cookie) {
        if (cookie.domain.startsWith('.')) {
            return `http${cookie.secure ? 's' : ''}://${cookie.domain.substring(1)}${cookie.path}`;
        }
        return `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
    }
}
