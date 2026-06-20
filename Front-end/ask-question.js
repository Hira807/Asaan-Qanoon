/* ==========================================================================
   ASAAN QANOON - ASK A QUESTION INTERACTIVE ENGINE
   Connected to: https://asaan-qanoon-back-end-1.onrender.com
   ========================================================================== */

const API_URL = "https://asaan-qanoon-back-end-1.onrender.com/ask";

document.addEventListener("DOMContentLoaded", () => {
    initCategoryPills();
    checkForIncomingQueries();
    initAIQuerySubmission();
    initRecentQuestionClicks();
});

let activeCategory = "All Categories";

/**
 * Manages category pills active styling and updates input text suggestions
 */
function initCategoryPills() {
    const filterPills = document.querySelectorAll(".filter-pill");
    const queryTextarea = document.querySelector(".query-textarea");
    if (!filterPills.length || !queryTextarea) return;

    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            activeCategory = pill.textContent.trim();

            if (activeCategory === "Family Law") {
                queryTextarea.placeholder = "e.g. Can a wife claim her mehr after a divorce under Pakistani law?";
            } else if (activeCategory === "Property Law") {
                queryTextarea.placeholder = "e.g. What is the procedure for registering a property transfer in Lahore?";
            } else if (activeCategory === "Criminal Law") {
                queryTextarea.placeholder = "e.g. What are my legal rights if detained without a warrant by police?";
            } else {
                queryTextarea.placeholder = "e.g. How do I file for divorce in Pakistan?";
            }
        });
    });
}

/**
 * Pulls query forwarded from homepage search bar via URL params
 */
function checkForIncomingQueries() {
    const queryTextarea = document.querySelector(".query-textarea");
    if (!queryTextarea) return;

    const urlParams = new URLSearchParams(window.location.search);
    const sharedQuery = urlParams.get('q');
    if (sharedQuery) {
        queryTextarea.value = decodeURIComponent(sharedQuery);
        // Auto-submit if question came from homepage
        setTimeout(() => {
            const submitBtn = document.querySelector(".btn-submit-query");
            if (submitBtn) submitBtn.click();
        }, 500);
    }
}

/**
 * Makes recent question cards clickable — fills textarea and submits
 */
function initRecentQuestionClicks() {
    const questionCards = document.querySelectorAll(".question-row-card");
    const queryTextarea = document.querySelector(".query-textarea");
    if (!questionCards.length || !queryTextarea) return;

    questionCards.forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const questionText = card.querySelector(".question-string").textContent.trim();
            queryTextarea.value = questionText;
            queryTextarea.scrollIntoView({ behavior: "smooth" });
            const submitBtn = document.querySelector(".btn-submit-query");
            if (submitBtn) submitBtn.click();
        });
    });
}

/**
 * Handles question submission — calls Render API and displays the answer
 */
function initAIQuerySubmission() {
    const submitBtn = document.querySelector(".btn-submit-query");
    const queryTextarea = document.querySelector(".query-textarea");
    if (!submitBtn || !queryTextarea) return;

    submitBtn.addEventListener("click", async () => {
        const userPrompt = queryTextarea.value.trim();

        if (!userPrompt) {
            alert("Please enter your question first!");
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin submit-plane-icon"></i> Processing...`;

        // Remove any previous response
        const oldResponse = document.getElementById("dynamic-ai-response-block");
        if (oldResponse) oldResponse.remove();

        // Build response card
        const responseCard = document.createElement("div");
        responseCard.id = "dynamic-ai-response-block";
        responseCard.style.cssText = `
            border: 1px solid #111111;
            border-radius: 8px;
            padding: 24px;
            margin-top: 24px;
            background-color: #FAFAFA;
            animation: fadeIn 0.4s ease;
        `;

        responseCard.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                <i class="fa-solid fa-scale-balanced" style="font-size:14px; color:#111111;"></i>
                <h4 style="font-size:14px; font-weight:700; color:#000000; margin:0;">Asaan Qanoon AI Response</h4>
            </div>
            <p id="streaming-text-target" style="font-size:13.5px; line-height:1.6; color:#222222; margin:0; min-height:40px; white-space: pre-wrap;">
                <i class="fa-solid fa-spinner fa-spin" style="color:#888;"></i> Thinking... (if this is the first request, server may take up to 60 seconds to wake up)
            </p>
            <div style="margin-top:16px; padding-top:12px; border-top:1px solid #E5E5E5; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11px; color:#8A8A8A;"><i class="fa-solid fa-circle-info"></i> AI-generated • For information only, not legal advice</span>
                <button id="clear-response-btn" style="background:transparent; border:none; font-family:inherit; font-size:11px; color:#666666; cursor:pointer; font-weight:500;">Clear</button>
            </div>
        `;

        const disclaimerSubtext = document.querySelector(".input-disclaimer-subtext");
        disclaimerSubtext.parentNode.insertBefore(responseCard, disclaimerSubtext.nextSibling);

        const targetParagraph = document.getElementById("streaming-text-target");

        try {
            // 60 second timeout to handle Render free tier cold start
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: userPrompt }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            const answerText = data.answer || "No answer returned. Please try again.";

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane submit-plane-icon"></i> Ask Question`;

            // Clear thinking text
            targetParagraph.textContent = "";

            // Typewriter effect for the answer
            let charIndex = 0;
            const typingInterval = setInterval(() => {
                if (charIndex < answerText.length) {
                    targetParagraph.textContent += answerText.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 10);

        } catch (error) {
            let errorMsg = "⚠️ Server is waking up (free hosting takes ~50 seconds on first request). Please wait and try again.";

            if (error.name === "AbortError") {
                errorMsg = "⚠️ Request timed out. The server is still starting up. Please wait 30 seconds and try again.";
            } else if (error.message.includes("500")) {
                errorMsg = "⚠️ Server error. Please try again in a few moments.";
            } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
                errorMsg = "⚠️ Could not reach the server. Please check your internet connection and try again.";
            }

            targetParagraph.textContent = errorMsg;
            targetParagraph.style.color = "#CC3333";

            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane submit-plane-icon"></i> Ask Question`;
        }

        // Clear button functionality
        document.getElementById("clear-response-btn").addEventListener("click", () => {
            responseCard.remove();
            queryTextarea.value = "";
        });

        responseCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}