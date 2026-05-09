const APK_DOWNLOAD_URL = "https://github.com/ineedgold2020-lgtm/awlad-ragab-app-updates/releases/download/v1.0.0/app-release.apk";

const APP_CONFIG = {
    appName: "Ù…Ø­Ù„Ø§Øª Ø£ÙˆÙ„Ø§Ø¯ Ø±Ø¬Ø¨",
    version: "1.0.0",
    apkDownloadUrl: APK_DOWNLOAD_URL
};

const state = {
    toastTimer: null
};

const selectors = {
    downloadButtons: [...document.querySelectorAll(".download-trigger")],
    revealItems: [...document.querySelectorAll(".reveal")],
    topbar: document.querySelector(".topbar"),
    modal: document.getElementById("installModal"),
    toast: document.getElementById("toast"),
    stepsAnchorButton: document.querySelector('.button-secondary[href="#steps"]')
};

function showToast(message, type = "success") {
    const { toast } = selectors;
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

function setButtonLoading(button, isLoading) {
    if (!button) return;
    button.classList.toggle("loading", isLoading);
    button.setAttribute("aria-busy", String(isLoading));
}

async function handleDownload(button) {
    const path = button.dataset.apkPath || APP_CONFIG.apkDownloadUrl;
    setButtonLoading(button, true);

    try {
        const link = document.createElement("a");
        link.href = path;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        console.log(`[Download] Starting APK download from GitHub Release: ${path}`);
        link.click();
        link.remove();

        showToast("Ø¨Ø¯Ø£ ØªÙ†Ø²ÙŠÙ„ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ø¨Ù†Ø¬Ø§Ø­. Ø¥Ø°Ø§ Ù„Ù… ÙŠØ¨Ø¯Ø£ Ø§Ù„ØªÙ†Ø²ÙŠÙ„ØŒ ØªØ­Ù‚Ù‚ Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ØªØµÙØ­.", "success");
    } catch (error) {
        showToast("ØªØ¹Ø°Ø± Ø¨Ø¯Ø¡ Ø§Ù„ØªØ­Ù…ÙŠÙ„ Ù…Ù† GitHub Releases Ø­Ø§Ù„ÙŠÙ‹Ø§. Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.", "error");
        console.error(error);
    } finally {
        window.setTimeout(() => setButtonLoading(button, false), 900);
    }
}

function setupRevealAnimations() {
    if (!("IntersectionObserver" in window)) {
        selectors.revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -70px 0px"
        }
    );

    selectors.revealItems.forEach((item) => observer.observe(item));
}

function setupTopbarState() {
    const { topbar } = selectors;
    if (!topbar) return;

    const onScroll = () => {
        topbar.classList.toggle("scrolled", window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}

function openModal() {
    const { modal } = selectors;
    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeModal() {
    const { modal } = selectors;
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function setupModal() {
    const { modal, stepsAnchorButton } = selectors;
    if (!modal || !stepsAnchorButton) return;

    stepsAnchorButton.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("steps")?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(openModal, 450);
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.closest(".modal-close")) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
}

function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetSelector = anchor.getAttribute("href");
            const target = document.querySelector(targetSelector);

            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function setupDownloads() {
    selectors.downloadButtons.forEach((button) => {
        button.addEventListener("click", () => handleDownload(button));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupTopbarState();
    setupRevealAnimations();
    setupModal();
    setupSmoothAnchors();
    setupDownloads();

    console.log(`${APP_CONFIG.appName} v${APP_CONFIG.version}`);
});
