/* ==========================================================================
   ASAAN QANOON - FIXED BROWSE LAWS GRID FILTER ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initCategoryLiveFilter();
    updateBrowseFooterYear();
});

/**
 * Real-time matching filter to narrow down category visibility based on keywords
 */
function initCategoryLiveFilter() {
    const searchInput = document.querySelector(".main-search-input");
    const searchButton = document.querySelector(".btn-search-action");
    const cards = document.querySelectorAll(".category-directory-card");
    const countBadge = document.querySelector(".category-aggregate-badge");

    // Safety fallback step: prevent script errors if items are missing
    if (!searchInput || cards.length === 0) return;

    function executeFilter(e) {
        // Prevent default form reloads if triggered by keyboard submissions
        if (e) e.preventDefault();

        const filterKeyword = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector(".card-category-title").textContent.toLowerCase();
            const summary = card.querySelector(".card-category-summary").textContent.toLowerCase();

            // Check if input tokens exist anywhere inside titles or description summaries
            if (title.includes(filterKeyword) || summary.includes(filterKeyword)) {
                // Return to original CSS layout style definition
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Update structural header indicator live with exact singular/plural counts
        if (countBadge) {
            if (filterKeyword === "") {
                // Restore default hardcoded template text view when search input is clear
                countBadge.textContent = "100+ laws across 3 categories";
            } else {
                countBadge.textContent = `${visibleCount} categor${visibleCount === 1 ? 'y' : 'ies'} showing`;
            }
        }
    }

    // Connect real-time filtering updates while user is typing
    searchInput.addEventListener("keyup", executeFilter);
    
    // Connect click actions directly to search action buttons
    if (searchButton) {
        searchButton.addEventListener("click", executeFilter);
    }

    // Capture explicit "Enter" keypress events inside input field to block standard window refreshes
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
            executeFilter(e);
        }
    });
}

/**
 * Automatically rolls forward copyright year targets in real-time
 */
function updateBrowseFooterYear() {
    const footerCopyright = document.querySelector(".footer-copyright-text");
    if (footerCopyright && footerCopyright.textContent.includes("2026")) {
        const activeYear = new Date().getFullYear();
        footerCopyright.textContent = `© ${activeYear} Asaan Qanoon _ Academic Project. Not Legal advice | All rights reserved.`;
    }
}