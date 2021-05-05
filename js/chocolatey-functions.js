(function() {
    // Functions based on viewport
    getElementHeight();
    window.onresize = getElementHeight;

    function getElementHeight() {
        // Get window height
        let vh = window.innerHeight * 0.01;
        jQuery('html').css('--vh', vh + 'px');

        // Get main height
        let mh = window.innerHeight - jQuery('header').outerHeight(true) - jQuery('footer').outerHeight(true);
        jQuery('main').css('--mh', mh + 'px');
    }

    // Set a cookie value that never expires based on current date
    window.setCookieExpirationNever=function() {
        var d = new Date();
        // 100 years in milliseconds: 100 years * 365 days * 24 hours * 60 minutes * 60 seconds * 1000ms
        d.setTime(d.getTime() + (100 * 365 * 24 * 60 * 60 * 1000));
        return 'expires=' + d.toUTCString() + ';';
    }

    // Get cookies
    window.getCookie=function(name) {
        var pattern = RegExp(name + "=.[^;]*"),
            matched = document.cookie.match(pattern);

        if (matched) {
            var cookie = matched[0].split('=');
            return cookie[1];
        }
        return false;
    }

    // Get parents of an element and push to array
    window.getParents=function(el) {
        var parents = [],
            node = el;

        while (node != document) {
            parents.push(node.parentNode);
            node = node.parentNode;
        }
        return parents;
    }

    // Escape special chars from Id elements
    window.escapeId=function(el) {
        return el.replace(/[.]/g, "\\$&");
    }

    // Trims off spaces from the beginning and end of a string and replaces it
    window.trimString=function(item) {
        return item.innerHTML = item.innerHTML.trim();
    }

    // Convert event time to local/utc
    var convertEventTimeToLocal = document.querySelectorAll('.convert-utc-to-local');
    convertEventTimeToLocal.forEach(function (el) {
        var timeIncludeBreak = el.getAttribute('data-event-include-break'),
            timeOccurrence = el.getAttribute('data-event-occurrence'),
            utcTime = el.getAttribute('data-event-utc').split(' '),
            datePart = utcTime[0].split('/'),
            timePart = utcTime[1].split(':'),
            utcDateTime = luxon.DateTime.utc(parseInt(datePart[2]), parseInt(datePart[0]), parseInt(datePart[1]), parseInt(timePart[0]), parseInt(timePart[1]), parseInt(timePart[2])),
            timeIncludeBreakText,
            timeOccurrenceText;

        if (timeIncludeBreak == 'true') {
            timeIncludeBreakText = '<br />'
        } else {
            timeIncludeBreakText = 'at ';
        }

        switch (timeOccurrence) {
            case "0":
                timeOccurrenceText = 'Every ' + utcDateTime.toLocal().toFormat('cccc') + ' ' + timeIncludeBreakText;
                break;
            case "1":
                timeOccurrenceText = 'First ' + utcDateTime.toLocal().toFormat('cccc') +  ' of Every Month ' + timeIncludeBreakText;
                break;
            default:
                timeOccurrenceText = '';
        }

        if (timeOccurrence) {
            el.innerHTML = timeOccurrenceText + utcDateTime.toLocal().toFormat("h:mm a ZZZZ") + ' / ' + utcDateTime.toFormat("h:mm a 'GMT'");
            return;
        }

        el.innerText = utcDateTime.toLocal().toFormat("cccc, dd LLL yyyy 'at' h:mm a ZZZZ");
    });
    
    // Top Alert
    window.createMaintenanceMessage=function(data, isPreview) {
        var maintenanceMessage = 
            '<span>' + marked(data.message) + '</span>' +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">' +
            '<i class="fas fa-times" aria-hidden="true"></i>' +
            '</button>';

        var maintenanceMessageObject = document.createElement('div');
        maintenanceMessageObject.setAttribute('id', 'topNoticeAlert');
        maintenanceMessageObject.setAttribute('role', 'alert');
        maintenanceMessageObject.setAttribute('class', 'alert bg-' + data.color + ' alert-dismissible alert-dismissible-center fade show');
        if (isPreview) {
            maintenanceMessageObject.setAttribute('data-preview', 'true');
        }
        maintenanceMessageObject.innerHTML = maintenanceMessage;

        // Append message to header
        document.getElementsByTagName('HEADER')[0].prepend(maintenanceMessageObject);
    }

    // Announcements
    window.createAnnouncementMessages=function(data, isPreview) {
        var announcementContent = document.querySelector('.announcement-content[data-preview="false"]'),
            announcementContentPreview = document.querySelector('.announcement-content[data-preview="true"]'),
            announcementListShuffle = '<div class="shuffle">',
            announcementListPinned = '<div class="pinned">';

        // Shuffle data
        data = data.sort(() => Math.random() - 0.5);

        for (var i of data) {
            var image = i.image ? '<img class="mb-3" src="' + i.image + '" alt="' + i.titleOne + '">' : '',
                image = i.image && i.imageLink ? '<a href="' + i.imageLink + '" target="_blank">' + image + '</a>' : image,
                titleOne = i.titleOne && i.titleOneIsShown ? '<h5 class="text-primary"><strong>' + i.titleOne + '</strong></h5>' : '',
                titleOne = i.titleOne && i.titleOneIsShown && i.titleOneLink ? '<a href="' + i.titleOneLink + '" target="_blank">' + titleOne + '</a>' : titleOne, 
                titleTwo = i.titleTwo ? '<p class="mb-0"><strong>' + i.titleTwo + '</strong></p>' : '',
                titleThree = i.titleThree ? '<p><strong>' + i.titleThree + '</strong></p>' : '',
                buttonOne = i.buttonOneText && i.buttonOneLink && i.buttonOneColor ? '<a class="btn btn-width mt-2 btn-' + i.buttonOneColor + '" href="' + i.buttonOneLink + '">' + i.buttonOneText + '</a>' : '',
                buttonTwo = i.buttonTwoText && i.buttonTwoLink && i.buttonTwoColor ? '<a class="btn btn-width mt-2 me-1 btn-' + i.buttonTwoColor + '" href="' + i.buttonTwoLink + '">' + i.buttonTwoText + '</a>' : '',
                details = i.details ? '<span class="text-start">' + marked(i.details) + '</span>' : '';

            if (i.isPinned) {
                announcementListPinned += createLists();
            } else {
                announcementListShuffle += createLists();
            }

            function createLists() {
                return '<div class="text-center">' +
                    image +
                    titleOne +
                    titleTwo +
                    titleThree +
                    details +
                    buttonTwo +
                    buttonOne +
                    '<hr />' +
                    '</div>';
            }
        }

        announcementListShuffle += '</div>';
        announcementListPinned += '</div>';

        // Apply list
        if (isPreview) {
            announcementContentPreview.innerHTML = announcementListPinned + announcementListShuffle;
        } else {
            announcementContent.innerHTML = announcementListPinned + announcementListShuffle;
        }
    }
})();