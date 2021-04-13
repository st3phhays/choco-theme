(function() {
    const cookieNoticeAlert = jQuery('#cookieNoticeAlert'),
          cookieNoticeName = 'chocolatey_hide_cookies_notice',
          cookieNotice = getCookie(cookieNoticeName);

    // Bottom cookie notice
    if (cookieNotice) {
        cookieNoticeAlert.remove();
    } else {
        cookieNoticeAlert.removeClass('d-none');
    }

    cookieNoticeAlert.find('button').click(function() {
        if (~location.hostname.indexOf('chocolatey.org')) {
            document.cookie = cookieNoticeName + '=true; ' + setCookieExpirationNever() + 'path=/; domain=chocolatey.org;';
        } else {
            document.cookie = cookieNoticeName + '=true;' + setCookieExpirationNever() + 'path=/;';
        }
    });

    $.ajax({
        type: 'GET',
        url: 'https://localhost:44362/api/maintenancemessage',
        success: getMessageSuccess
    });

    function getMessageSuccess(data) {
        if (data.id) {
            var cookieMaintenanceMessage = 'chocolatey_maintenence_message_' + data.id;

            // Only display the message if the user has not already dismissed it
            if (!getCookie(cookieMaintenanceMessage)) {
                createMaintenanceMessage(data, false);
            
                // Set cookie on close based on last updated datetime
                document.querySelector('#topNoticeAlert .btn-close').addEventListener('click', function () {
                    if (~location.hostname.indexOf('chocolatey.org')) {
                        document.cookie = cookieMaintenanceMessage + '=true; ' + setCookieExpirationNever() + 'path=/; domain=chocolatey.org;';
                    } else {
                        document.cookie = cookieMaintenanceMessage + '=true;' + setCookieExpirationNever() + 'path=/;';
                    }
                }, false);
            }
        }
    }
})();