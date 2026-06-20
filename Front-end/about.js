document.addEventListener("DOMContentLoaded", () => {
    initAboutEditorialAccordions();
    syncAboutFooterTimeline();
});

function initAboutEditorialAccordions() {
    const faqRows = document.querySelectorAll(".faq-row-item");

    if (faqRows.length === 0) return;

    faqRows.forEach(row => {
        const rowHeader = row.querySelector(".faq-row-header");
        if (!rowHeader) return;

        rowHeader.addEventListener("click", () => {
            // Verify if target block is already toggled open
            const isTargetOpen = row.classList.contains("open");

            // Loop and clear out the active open state on adjacent grid rows
            faqRows.forEach(item => {
                item.classList.remove("open");
            });

            // If the element wasn't open, add the display rules configuration
            if (!isTargetOpen) {
                row.classList.add("open");
            }
        });
    });
}


function syncAboutFooterTimeline() {
    const aboutCopyrightElement = document.querySelector(".footer-copyright-text");
    
    if (aboutCopyrightElement && aboutCopyrightElement.textContent.includes("2026")) {
        const systemTimelineYear = new Date().getFullYear();
        aboutCopyrightElement.textContent = `© ${systemTimelineYear} Asaan Qanoon — Academic Project. Not Legal advice | All rights reserved.`;
    }
}