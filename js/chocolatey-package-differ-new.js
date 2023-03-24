import { Diff2HtmlUI } from 'diff2html/lib/ui/js/diff2html-ui-slim.js';
import { getCookie, setCookieExpirationNever } from './util/chocolatey-functions';

(() => {
    const diffSection = document.querySelector('#diffsNew');

    // Only continue if diffs are available
    if (diffSection) {
        const diffContainer = document.querySelector('#diffContentNew');
        const diffSelector = document.querySelector('#diffSelectorNew');

        // WIP Radio Buttons for diff view style
        let preferredOutputFormat = 'line-by-line';
        const diffViewSideBySide = 'side-by-side';
        const diffViewCookie = 'chocolatey_diff_outputFormat';

        if (getCookie(diffViewCookie) && getCookie(diffViewCookie) === diffViewSideBySide) {
            preferredOutputFormat = diffViewSideBySide;
        }

        if (preferredOutputFormat === diffViewSideBySide) {
            diffSection.querySelector('input[data-diff-output-format="side-by-side"]').checked = true;
        }

        const configuration = {
            drawFileList: false,
            matching: 'words',
            outputFormat: preferredOutputFormat,
            rawTemplates: {
                'generic-file-path': '<span class="d2h-file-name-wrapper">{{>fileIcon}}<span class="d2h-file-name">{{fileDiffName}}</span>{{>fileTag}}</span><div class="d2h-file-collapse"><input class="btn-check" type="checkbox" name="viewed" value="viewed"><label class="btn btn-sm btn-secondary text-nowrap">Hide</label></div>',
                'tag-file-added': '<span class="badge rounded-pill text-bg-success ms-2">Added</span>',
                'tag-file-changed': '<span class="badge rounded-pill text-bg-warning ms-2">Changed</span>',
                'tag-file-deleted': '<span class="badge rounded-pill text-bg-danger ms-2">Deleted</span>',
                'tag-file-moved': '<span class="badge rounded-pill text-bg-info ms-2">Moved</span>'
            }
        };

        const callEndpoint = async url => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error(error);
            }
        };

        // Create diff on page
        const createDiff = (diffContent, fileIndex, preferredOutputFormat) => {
            const fileContainer = document.createElement('div');

            fileContainer.id = `diffFileContainer${fileIndex}`;
            diffContainer.appendChild(fileContainer);

            configuration.outputFormat = preferredOutputFormat;

            const diff2htmlUi = new Diff2HtmlUI(diffContainer.querySelector(`#diffFileContainer${fileIndex}`), diffContent, configuration);

            diff2htmlUi.draw();
            diff2htmlUi.highlightCode();

            const diffCollapseBtnContainer = diffContainer.querySelector(`#diffFileContainer${fileIndex} .d2h-file-collapse`);

            diffCollapseBtnContainer.addEventListener('click', () => {
                console.log('click');
                const diffCollapseBtnContainerLabel = diffCollapseBtnContainer.querySelector('label');
                console.log(diffCollapseBtnContainerLabel);
                if (diffCollapseBtnContainerLabel.textContent === 'Hide') {
                    console.log('show');
                    diffCollapseBtnContainerLabel.textContent = 'Show';
                } else {
                    console.log('hide');
                    diffCollapseBtnContainerLabel.textContent = 'Hide';
                }
            });
        };

        // Get File Content
        const getDiffFiles = (diffFolder, preferredOutputFormat) => {
            // Remove any diffs that might already be there
            diffContainer.innerHTML = '';

            return callEndpoint(`${window.location.protocol}//${window.location.host}/json/JsonApi?invoke&action=GetDiffFileUrls&folderName=${diffFolder}`).then(filePaths => {
                filePaths.forEach((filePath, fileIndex) => {
                    callEndpoint(`${window.location.protocol}//${window.location.host}/json/JsonApi?invoke&action=GetDiffContent&key=${filePath}`).then(fileContent => {
                        createDiff(fileContent, fileIndex, preferredOutputFormat);
                    });
                });
            }).then(() => {
                console.log('place');
            }).catch(error => {
                console.error(error.message);
            });
        };

        const diffViewOptions = document.querySelectorAll('input[name="diffView"]');

        diffViewOptions.forEach(diffViewOption => {
            diffViewOption.addEventListener('change', () => {
                if (diffViewOption.getAttribute('data-diff-output-format') === diffViewSideBySide) {
                    console.log('preffered view: side-by-side');
                    if (~location.hostname.indexOf('chocolatey.org')) {
                        document.cookie = `${diffViewCookie}=side-by-side; ${setCookieExpirationNever()}path=/; domain=chocolatey.org;`;
                    } else {
                        document.cookie = `${diffViewCookie}=side-by-side; ${setCookieExpirationNever()}path=/;`;
                    }

                    preferredOutputFormat = diffViewSideBySide;
                } else {
                    // Delete cookie
                    document.cookie = `${diffViewCookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

                    preferredOutputFormat = 'line-by-line';
                }

                getDiffFiles(diffSelector.value, preferredOutputFormat); // this will break
            });
        });

        const initDiffSelector = () => {
            diffSelector.addEventListener('change', e => {
                const diffFolder = e.target.value;

                // Make sure we don't send in the first default option
                if (diffFolder !== 'default') {
                    getDiffFiles(diffFolder, preferredOutputFormat);
                }
            });
        };

        // Initialize
        // Check to see if Diff Section is expanded or hidden
        const isDiffContainerExpanded = diffSection.classList.contains('show') || window.location.hash == `#${diffSection.id}`;
        let isDiffContainerExpandedClick = false;

        if (isDiffContainerExpanded && diffSelector.nodeName == 'INPUT') {
            // Expanded by default with 1 diff
            getDiffFiles(diffSelector.value, preferredOutputFormat);
        } else if (isDiffContainerExpanded && diffSelector.nodeName == 'SELECT') {
            // Expanded by default with multiple diffs
            initDiffSelector();
        } else {
            // Hidden by default
            diffSection.addEventListener('show.bs.collapse', () => {
                if (!isDiffContainerExpandedClick) {
                    if (diffSelector.nodeName === 'INPUT') {
                        getDiffFiles(diffSelector.value, preferredOutputFormat);
                    } else {
                        initDiffSelector();
                    }
                }

                // Only do the above actions on load
                isDiffContainerExpandedClick = true;
            });
        }
    }
})();
