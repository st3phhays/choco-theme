import { confettiBurst } from './util/confetti-burst';
import { setCookieExpirationNever } from './util/set-cookie-expiration-never';
import { getCookie } from './util/get-cookie';

(() => {
    const searchParams = new URLSearchParams(window.location.search.toLowerCase());

    if ((searchParams.get('q') === 'choco') || (searchParams.get('q') === 'chocolatey') || (window.location.pathname.toLowerCase().indexOf('/packages/chocolatey') > -1)) {
        confettiBurst();
        return;
    }

    const birthdayCookie = 'chocolatey_11_birthday';

    if (getCookie(birthdayCookie)) {
        return;
    }

    if (~location.hostname.indexOf('chocolatey.org')) {
        document.cookie = `${birthdayCookie}=true; ${setCookieExpirationNever()}path=/; domain=chocolatey.org;`;
    } else {
        document.cookie = `${birthdayCookie}=true; ${setCookieExpirationNever()}path=/;`;
    }

    confettiBurst();
})();
