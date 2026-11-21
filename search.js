
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

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
        Number(getParam(
            "travellers",
            String(adults + children + infants)
        )) || adults + children + infants;

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function formatDate(value) {
        if (!value) return "Date not selected";

        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    setText("result-origin", origin);
    setText("result-destination", destination);
    setText("result-date", formatDate(departure));
    setText(
        "result-travellers",
        `${travellerCount} traveller${travellerCount === 1 ? "" : "s"}`
    );

    // Show the searched cities on each result card.
    document.querySelectorAll("[data-route-origin]")
        .forEach(element => element.textContent = origin);

    document.querySelectorAll("[data-route-destination]")
        .forEach(element => element.textContent = destination);

    // --------------------------------------------------
    // TRANSPORT FILTERS
    // --------------------------------------------------

    const cards = [...document.querySelectorAll(".JOURNEY-CARD[data-mode]")];

    const filterInputs = [
        ...document.querySelectorAll(
            "input[name='transport-filter'][data-filter-mode]"
        )
    ];

    const allFilter = filterInputs.find(
        input => input.dataset.filterMode === "all"
    );

    function applyFilters() {
        const allSelected = allFilter?.checked;

        const selectedModes = new Set(
            filterInputs
                .filter(input =>
                    input !== allFilter && input.checked
                )
                .map(input => input.dataset.filterMode)
        );

        cards.forEach(card => {
            card.hidden = !allSelected &&
                !selectedModes.has(card.dataset.mode.toLowerCase());
        });

        const visibleCount = cards.filter(card => !card.hidden).length;

        setText(
            "results-subtitle",
            visibleCount
                ? `${visibleCount} demo option${visibleCount === 1 ? "" : "s"} shown.`
                : "No options match the selected transport filters."
        );
    }

    function selectTransport(mode) {
        filterInputs.forEach(input => {
            input.checked = mode === "all"
                ? true
                : input.dataset.filterMode === mode;
        });

        applyFilters();
    }

    filterInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input === allFilter) {
                // Multi-Mode is an all-modes shortcut.
                filterInputs.forEach(other => {
                    other.checked = input.checked;
                });
            } else if (input.checked) {
                // Selecting a specific mode clears Multi-Mode.
                if (allFilter) allFilter.checked = false;
            } else if (allFilter) {
                allFilter.checked = false;
            }

            applyFilters();
        });
    });

    selectTransport(
        ["all", "flight", "train", "bus"].includes(transport)
            ? transport
            : "all"
    );

    // --------------------------------------------------
    // FAVOURITE ROUTES — SAVED IN THIS BROWSER
    // --------------------------------------------------

    const FAVOURITES_KEY = "yatripath-favourite-routes";

    function readFavourites() {
        try {
            const stored = JSON.parse(
                localStorage.getItem(FAVOURITES_KEY) || "[]"
            );

            return Array.isArray(stored) ? stored : [];
        } catch {
            return [];
        }
    }

    let favourites = readFavourites();

    function routeKey(card) {
        return [
            origin.toLowerCase(),
            destination.toLowerCase(),
            departure,
            card.dataset.mode.toLowerCase()
        ].join("|");
    }

    function updateFavouriteButton(button, saved) {
        const icon = button.querySelector("i");

        button.setAttribute("aria-pressed", String(saved));
        button.setAttribute(
            "aria-label",
            saved ? "Remove from favourites" : "Mark as favourite"
        );
        button.title = saved
            ? "Remove from favourites"
            : "Mark as favourite";

        if (icon) {
            icon.classList.toggle("fa-solid", saved);
            icon.classList.toggle("fa-regular", !saved);
            icon.classList.toggle("fa-heart", true);
        }
    }

    document.querySelectorAll(".FAVOURITE-BTN").forEach(button => {
        const card = button.closest(".JOURNEY-CARD[data-mode]");
        if (!card) return;

        updateFavouriteButton(
            button,
            favourites.includes(routeKey(card))
        );

        button.addEventListener("click", () => {
            const key = routeKey(card);
            const alreadySaved = favourites.includes(key);

            favourites = alreadySaved
                ? favourites.filter(item => item !== key)
                : [...favourites, key];

            try {
                localStorage.setItem(
                    FAVOURITES_KEY,
                    JSON.stringify(favourites)
                );
            } catch {
                alert("Your browser could not save this favourite.");
                return;
            }

            updateFavouriteButton(button, !alreadySaved);
        });
    });

    // --------------------------------------------------
    // TRAIN CLASS SELECTION
    // --------------------------------------------------

    document.querySelectorAll(".JOURNEY-CARD[data-mode='train']")
        .forEach(card => {
            const options = [
                ...card.querySelectorAll(".TRAIN-CLASS-OPTION")
            ];

            const details = card.querySelector(".TRAIN-SELECTED-DETAILS");

            function selectTrainClass(button) {
                options.forEach(option => {
                    const selected = option === button;

                    option.classList.toggle("is-selected", selected);
                    option.setAttribute("aria-pressed", String(selected));
                });

                card.dataset.option = button.dataset.class;
                card.dataset.fare = button.dataset.fare;
                card.dataset.seats = button.dataset.seats;

                if (details) {
                    details.textContent =
                        `Selected: ${button.dataset.class} · ` +
                        `₹${Number(button.dataset.fare).toLocaleString("en-IN")} · ` +
                        `${button.dataset.seats} demo seats`;
                }
            }

            options.forEach(button => {
                button.addEventListener("click", () => {
                    selectTrainClass(button);
                });
            });

            const initiallySelected =
                options.find(option => option.classList.contains("is-selected")) ||
                options[0];

            if (initiallySelected) {
                selectTrainClass(initiallySelected);
            }
        });

    // --------------------------------------------------
    // LIGHT / DARK THEME
    // --------------------------------------------------

    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("travelleon-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.dataset.theme = savedTheme;
    }

    function updateThemeButton() {
        if (!themeToggle) return;

        const dark =
            document.documentElement.dataset.theme === "dark";

        themeToggle.setAttribute(
            "aria-label",
            dark ? "Switch to light theme" : "Switch to dark theme"
        );

        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-moon", !dark);
            icon.classList.toggle("fa-sun", dark);
        }
    }

    updateThemeButton();

    themeToggle?.addEventListener("click", () => {
        const current =
            document.documentElement.dataset.theme || "light";

        const next = current === "dark" ? "light" : "dark";

        document.documentElement.dataset.theme = next;
        localStorage.setItem("travelleon-theme", next);

        updateThemeButton();
    });

    // --------------------------------------------------
    // EDIT SEARCH
    // --------------------------------------------------

    document.getElementById("edit-search")?.addEventListener("click", () => {
        window.location.href =
            `index.html?${params.toString()}`;
    });

    // --------------------------------------------------
    // BOOKING HANDOFF — DEMO UNTIL BACKEND INTEGRATION
    // --------------------------------------------------

    document.querySelectorAll(".BOOK-BTN").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".JOURNEY-CARD[data-mode]");
            if (!card) return;

            const pendingBooking = {
                origin,
                destination,
                departure,
                returnDate,
                transport: card.dataset.mode,
                travellers: travellerCount,
                selectedDemoOption: card.dataset.option || null,
                demoFare: card.dataset.fare
                    ? Number(card.dataset.fare)
                    : null,
                demoSeats: card.dataset.seats
                    ? Number(card.dataset.seats)
                    : null,
                returnTo: window.location.pathname + window.location.search
            };

            sessionStorage.setItem(
                "yatripath-pending-booking",
                JSON.stringify(pendingBooking)
            );

            window.location.href = "index.html#login";
        });
    });
});
