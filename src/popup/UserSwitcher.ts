import { ChromeApiPromiseWrapper } from './utils/ChromeApiPromiseWrapper';
import { IUser } from './models/User';
import { TokenProvier, AuthServiceResponse } from './utils/TokenProvider';

const JWT_HOLDING_COOKIE_NAME = 'access-token'; // change to your cookie's name
const SESSION_COOKIE = 'symfony'; // change to your cookie's name

export class UserSwitcher {

    constructor(private user: IUser) { }

    public execute() {
        return this.getCurrentTabCookie(JWT_HOLDING_COOKIE_NAME)
            .then((authCookie: chrome.cookies.Cookie) => this.switchLoginCookie(authCookie, this.user))
            .then(() => this.getCurrentTabCookie(SESSION_COOKIE))
            .then((sessionCookie: chrome.cookies.Cookie) => ChromeApiPromiseWrapper.removeOneCookieByNameAndUrl(sessionCookie));
    }

    private getCurrentTabCookie(cookieName: string) {
        return ChromeApiPromiseWrapper.getCurrentTabHostname()
            .then((hostname: string) => ChromeApiPromiseWrapper.getCookieByHostnameAndName(hostname, cookieName));
    }

    private switchLoginCookie(cookie: chrome.cookies.Cookie, user: IUser) {
        return ChromeApiPromiseWrapper.removeOneCookieByNameAndUrl(cookie)
        .then(() => TokenProvier.getToken(user))
        .then((token: AuthServiceResponse) => {
            cookie.value = token.token;
            return ChromeApiPromiseWrapper.setOneCookie(cookie);
        });
    }
}
