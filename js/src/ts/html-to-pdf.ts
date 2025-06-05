import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import '../lib/vfs_fonts';

export const htmlToPdf = (contentId: string, exportName: string) => {
    const exportButton = document.querySelectorAll('.export-to-pdf');

    exportButton.forEach(button => {
        button.addEventListener('click', () => {
            const html = document.getElementById(contentId);

            if (!html) return;

            const converted = htmlToPdfmake(html?.innerHTML || '', {
                defaultStyles: {
                    h1: { fontSize: 30, bold: true, marginBottom: 10 }
                },
                imagesByReference: true
            });

            pdfMake.fonts = {
                PT_Sans: {
                    normal: 'PTSans-Regular.ttf',
                    bold: 'PTSans-Bold.ttf',
                    italics: 'PTSans-Italic.ttf',
                    bolditalics: 'PTSans-BoldItalic.ttf'
                }
            };

            const docDefinition = {
                content: converted,
                defaultStyle: {
                    font: 'PT_Sans'
                }
            };

            // Fix bug where content is wrapped in an additional object caused by adding `imagesByReference: true`
            const output = {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                content: docDefinition.content.content, // Ignore type error here, caused by bug mentioned above
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                images: docDefinition.content.images, // Ignore type error here, caused by bug mentioned above
                defaultStyle: docDefinition.defaultStyle
            };

            pdfMake.createPdf(output).download(`${exportName}.pdf`);
        });
    });
};
