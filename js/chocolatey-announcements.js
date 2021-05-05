(function() {
    $.ajax({
        type: 'GET',
        url: 'https://localhost:44362/CommunityAdmin/Announcements?handler=FindAllActiveAnnouncements',
        success: getAnnouncementsSuccess
    });

    function getAnnouncementsSuccess(data) {
        if (data) {
            var announcementCookie = 'chocolatey_announcement_' + data[0].id,
                announcementCount = Object.keys(data).length,
                announcementBtns = document.querySelectorAll('.btn-announcement-notifications'),
                announcementBadges = document.querySelectorAll('.notification-badge');

            if (!getCookie(announcementCookie)) {
                for (var i of announcementBadges) {
                    i.classList.remove('d-none');
                    i.innerText = announcementCount;
                }
            }

            announcementBtns.forEach(function (el) {
                el.addEventListener('click', function (e) {
                    e.stopImmediatePropagation();

                    if (!getCookie(announcementCookie)) {
                        if (~location.hostname.indexOf('chocolatey.org')) {
                            document.cookie = announcementCookie + '=true; ' + setCookieExpirationNever() + 'path=/; domain=chocolatey.org;';
                        } else {
                            document.cookie = announcementCookie + '=true;' + setCookieExpirationNever() + 'path=/;';
                        }

                        for (var i of announcementBadges) {
                            i.classList.add('d-none');
                        }
                    }
                }, false);
            });

            createAnnouncementMessages(data, false);
        }
    }
})();