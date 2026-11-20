
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    // -----------------------------------------
    // 1. DISPLAY THE SEARCHED JOURNEY
    // -----------------------------------------

    const getParam = (key, fallback = "") =>
        params.get(key)?.trim() || fallback;

    const origin = getParam("origin", "Your origin");
    const destination = getParam("destination", "Your destination");
    const departure = getParam("departure", "");
    const returnDate = getParam("returnDate", "");
    const transport = getParam("transport", "all").toLowerCase();

    const adults = Number(getParam("adults", "1")) || 0;
    const children = Number(getParam("children", "0")) || 0;
    const infants = Number(getParam("infants", "0")) || 0;

    const travellerCount =
        Number(getParam("travellers", String(adults + children + infants))) ||
        adults + children + infants;

    function formatDate(dateString) {
        if (!dateString) return "Date not selected";

        const date = new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    setText("result-origin", origin);
    setText("result-destination", destination);
    setText("result-date", formatDate(departure));
    setText(
        "result-travellers",
        `${travellerCount} traveller${travellerCount === 1 ? "" : "s"}`
    );

    // -----------------------------------------
    // 2. FILTER DEMO RESULTS BY TRANSPORT TYPE
    // -----------------------------------------

    const resultCards = document.querySelectorAll("article[data-mode]");

    function applyTransportFilter(mode) {
        resultCards.forEach(card => {
            const cardMode = card.dataset.mode.toLowerCase();
            card.hidden = mode !== "all" && cardMode !== mode;
        });
    }

    // Supports buttons with data-filter-mode="train",
    // or inputs with name="transport-filter".
    const filterControls = document.querySelectorAll(
        "[data-filter-mode], [name='transport-filter']"
    );

    filterControls.forEach(control => {
        const controlMode = (
            control.dataset.filterMode || control.value || "all"
        ).toLowerCase();

        if (control.type === "radio" || control.type === "checkbox") {
            control.addEventListener("change", () => {
                if (control.checked) applyTransportFilter(controlMode);
            });
        } else {
            control.addEventListener("click", () => {
                applyTransportFilter(controlMode);
            });
        }
    });

    applyTransportFilter(
        ["all", "flight", "train", "bus"].includes(transport)
            ? transport
            : "all"
    );

    // -----------------------------------------
    // 3. KEEP THE LIGHT/DARK THEME CONSISTENT
    // -----------------------------------------

    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("travelleon-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.dataset.theme = savedTheme;
    }

    function updateThemeButton() {
        if (!themeToggle) return;

        const isDark =
            document.documentElement.dataset.theme === "dark";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light theme" : "Switch to dark theme"
        );

        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-moon", !isDark);
            icon.classList.toggle("fa-sun", isDark);
        }
    }

    updateThemeButton();

    themeToggle?.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.dataset.theme || "light";

        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("travelleon-theme", nextTheme);

        updateThemeButton();
    });

    // -----------------------------------------
    // 4. RETURN TO EDIT THE SEARCH
    // -----------------------------------------

    const editSearchButton = document.getElementById("edit-search");

    editSearchButton?.addEventListener("click", () => {
        const preservedParams = new URLSearchParams(params);
        window.location.href = `index.html?${preservedParams.toString()}`;
    });

    // -----------------------------------------
    // 5. SAVE A PENDING BOOKING AND ASK THE USER
    //    TO LOG IN BEFORE CONTINUING
    // -----------------------------------------

    document.querySelectorAll(".BOOK-BTN").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest("article[data-mode]");

            if (!card) return;

            const pendingBooking = {
                origin,
                destination,
                departure,
                returnDate,
                transport: card.dataset.mode,
                travellers: travellerCount,
                selectedDemoOption: card.dataset.option || null,
                returnTo: window.location.pathname + window.location.search
            };

            sessionStorage.setItem(
                "yatripath-pending-booking",
                JSON.stringify(pendingBooking)
            );

            // Existing homepage authentication view.
            window.location.href = "index.html#login";
        });
    });

    // -----------------------------------------
    // 6. BACKEND INTEGRATION PLACEHOLDER
    // -----------------------------------------
    //
    // Demo cards remain in the HTML for now.
    // Once your friend confirms the search API,
    // we will fetch real results here and render
    // them into the existing results section.
    //
    // We are deliberately NOT guessing the API URL.

});
