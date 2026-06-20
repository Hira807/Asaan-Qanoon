/* ==========================================================================
   ASAAN QANOON - HOME PAGE INTERACTIVITY ENGINE
   Connected to: https://asaan-qanoon-back-end-1.onrender.com
   ========================================================================== */

const API_URL = "https://asaan-qanoon-back-end-1.onrender.com/ask";

document.addEventListener("DOMContentLoaded", () => {
    initHeroChatWidget();
    initFAQAccordions();
    updateFooterYear();
});

/**
 * 1. HERO WIDGET INTERACTIVITY
 * Captures questions and sends them to the real Render API backend.
 */
function initHeroChatWidget() {
    const chatInput = document.querySelector(".chat-input-box");
    const chatSubmitBtn = document.querySelector(".chat-submit-btn");
    const chatMessageArea = document.querySelector(".chat-message-area");

    if (!chatInput || !chatSubmitBtn || !chatMessageArea) return;

    async function handleQuestionSubmission() {
        const userQuery = chatInput.value.trim();

        if (userQuery === "") {
            chatInput.style.borderColor = "#FF3333";
            chatInput.placeholder = "Please enter a question first...";
            setTimeout(() => {
                chatInput.style.borderColor = "";
                chatInput.placeholder = "Ask your legal question...";
            }, 2000);
            return;
        }

        // Disable inputs during processing
        chatInput.disabled = true;
        chatSubmitBtn.disabled = true;
        chatSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

        // Append user bubble
        const userBubble = document.createElement("div");
        userBubble.className = "msg-bubble user-bubble";
        userBubble.textContent = userQuery;
        chatMessageArea.appendChild(userBubble);
        chatMessageArea.scrollTop = chatMessageArea.scrollHeight;
        chatInput.value = "";

        // Append thinking bubble
        const thinkingBubble = document.createElement("div");
        thinkingBubble.className = "msg-bubble assistant-bubble";
        thinkingBubble.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:#888;"></i> Thinking... (if this is the first request, server may take up to 60 seconds to wake up)`;
        chatMessageArea.appendChild(thinkingBubble);
        chatMessageArea.scrollTop = chatMessageArea.scrollHeight;

        try {
            // 60 second timeout to handle Render free tier cold start
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: userQuery }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const data = await response.json();
            const fullAnswer = data.answer || "Sorry, I could not find an answer.";

            // Truncate to ~200 chars for homepage preview
            const previewText = fullAnswer.length > 200
                ? fullAnswer.substring(0, 200) + "..."
                : fullAnswer;

            // Replace thinking bubble with real answer + read more link
            thinkingBubble.innerHTML = `<span></span> <a href="ask-question.html?q=${encodeURIComponent(userQuery)}" class="inline-read-more">read more</a>`;

            const textContainer = thinkingBubble.querySelector("span");
            let charIndex = 0;

            // Typewriter effect
            const typingInterval = setInterval(() => {
                if (charIndex < previewText.length) {
                    textContainer.textContent += previewText.charAt(charIndex);
                    charIndex++;
                    chatMessageArea.scrollTop = chatMessageArea.scrollHeight;
                } else {
                    clearInterval(typingInterval);
                    chatInput.disabled = false;
                    chatSubmitBtn.disabled = false;
                    chatSubmitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Ask`;
                    chatInput.focus();
                }
            }, 10);

        } catch (error) {
            let errorMsg = "⚠️ Server is waking up (free hosting takes ~50 seconds on first request). Please wait and try again.";

            if (error.name === "AbortError") {
                errorMsg = "⚠️ Request timed out. The server is still starting up. Please wait 30 seconds and try again.";
            } else if (error.message.includes("500")) {
                errorMsg = "⚠️ Server error. Please try again in a moment.";
            } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
                errorMsg = "⚠️ Could not reach the server. Please check your internet connection and try again.";
            }

            thinkingBubble.innerHTML = `<span style="color:#CC3333;">${errorMsg}</span>`;

            chatInput.disabled = false;
            chatSubmitBtn.disabled = false;
            chatSubmitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Ask`;
        }
    }

    chatSubmitBtn.addEventListener("click", handleQuestionSubmission);

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleQuestionSubmission();
    });
}

/**
 * 2. FAQ ACCORDION COMPONENT
 */
function initFAQAccordions() {
    const accordionPanels = document.querySelectorAll(".accordion-panel");

    accordionPanels.forEach(panel => {
        const header = panel.querySelector(".accordion-header-row");
        if (!header) return;

        header.addEventListener("click", () => {
            const isCurrentlyOpen = panel.classList.contains("active-open");
            accordionPanels.forEach(p => p.classList.remove("active-open"));
            if (!isCurrentlyOpen) {
                panel.classList.add("active-open");
            }
        });
    });
}

/**
 * 3. FOOTER YEAR UPDATE
 */
function updateFooterYear() {
    const footerMetaRow = document.querySelector(".footer-base-meta-row span");
    if (footerMetaRow && footerMetaRow.textContent.includes("2026")) {
        const currentYear = new Date().getFullYear();
        footerMetaRow.textContent = `© ${currentYear} Asaan Qanoon _ Academic Project. Not Legal advice | All rights reserved.`;
    }
}