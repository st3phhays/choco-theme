const iconSmallImage = document.querySelectorAll('img.package-icon-sm');
const iconLargeImage = document.querySelectorAll('img.package-icon-lg');
const iconSmallUrl = 'https://img.chocolatey.org/icons/packageDefaultIcon-50x50.png';
const iconLargeUrl = 'https://img.chocolatey.org/icons/packageDefaultIcon.png';

iconSmallImage.forEach(icon => {
    icon.onerror = () => {
        console.error('Image failed to load:', icon.src);

        if (icon.src === iconSmallUrl) {
            return;
        }

        console.log('Reverting to default small icon:', iconSmallUrl);
        icon.src = iconSmallUrl;
    };
});

iconLargeImage.forEach(icon => {
    icon.onerror = () => {
        console.error('Image failed to load:', icon.src);

        if (icon.src === iconLargeUrl) {
            return;
        }

        console.log('Reverting to default large icon:', iconLargeUrl);
        icon.src = iconLargeUrl;
    };
});
