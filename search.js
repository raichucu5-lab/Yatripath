
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const getParam = (key, fallback = "") =>
        params.get(key)?.trim() || fallback;

    const origin = getParam("origin", "Your origin");
    const destination = getParam("destination", "Your destination");
    const departure = getParam("departure", "");
    const returnDate = getParam("returnDate", "");
    const transport = getParam("transport", "all").toLowerCase();
    const travelClass = getParam("travelClass", "all").toLowerCase();

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

    // -----------------------------------------
    // 2. TRANSPORT FILTERS AND CLASS FARES
    // -----------------------------------------

    const resultCards = [
        ...document.querySelectorAll(".JOURNEY-CARD[data-mode]")
    ];

    const filterControls = [
        ...document.querySelectorAll(
            "input[name='transport-filter'][data-filter-mode]"
        )
    ];

    const allFilter = filterControls.find(
        input => input.dataset.filterMode === "all"
    );

    // Illustrative prices per traveller. Replace with API data later.
    const fareData = {
        train: {
            "1a": { label: "1A — AC First Class", price: 2400 },
            "2a": { label: "2A — AC 2 Tier", price: 1500 },
            "3a": { label: "3A — AC 3 Tier", price: 1000 },
            "3e": { label: "3E — AC 3 Tier Economy", price: 850 },
            "cc": { label: "CC — AC Chair Car", price: 650 },
            "ec": { label: "EC — Executive Chair Car", price: 950 },
            "sl": { label: "SL — Sleeper", price: 450 },
            "2s": { label: "2S — Second Sitting", price: 180 }
        },

        bus: {
            "seater": { label: "Non-AC Seater", price: 450 },
            "ac-seater": { label: "AC Seater", price: 650 },
            "sleeper": { label: "Non-AC Sleeper", price: 600 },
            "ac-sleeper": { label: "AC Sleeper", price: 900 },
            "volvo-ac": { label: "Volvo AC", price: 1100 },
            "volvo-ac-sleeper": {
                label: "Volvo AC Sleeper",
                price: 1400
            }
        },

        flight: {
            "economy": { label: "Economy", price: 4500 },
            "premium-economy": {
                label: "Premium Economy",
                price: 6500
            },
            "business": { label: "Business", price: 15000 },
            "first-class": { label: "First Class", price: 25000 }
        }
    };

    function getFareForCard(mode) {
        const available = fareData[mode];
        if (!available) return null;

        if (travelClass === "all") {
            const cheapest = Object.values(available)
                .reduce((best, item) =>
                    item.price < best.price ? item : best
                );

            return {
                ...cheapest,
                isStartingFare: true
            };
        }

        const [classMode, className] = travelClass.split(":");

        // A selected class only applies to its own transport mode.
        if (classMode !== mode || !available[className]) {
            return null;
        }

        return {
            ...available[className],
            isStartingFare: false
        };
    }

    function renderCardFare(card) {
        const mode = card.dataset.mode.toLowerCase();
        const fareBox = card.querySelector(".CARD-FARE");

        if (!fareBox) return true;

        const fare = getFareForCard(mode);

        // A mode-specific class cannot be priced on another mode.
        if (!fare) {
            fareBox.hidden = true;
            return false;
        }

        fareBox.hidden = false;

        const priceElement = fareBox.querySelector(".CARD-FARE-PRICE");
        const classElement = fareBox.querySelector(".CARD-FARE-CLASS");
        const labelElement = fareBox.querySelector(".CARD-FARE-LABEL");

        if (priceElement) {
            priceElement.textContent =
                `₹${fare.price.toLocaleString("en-IN")}`;
        }

        if (classElement) {
            classElement.textContent = fare.label;
        }

        if (labelElement) {
            labelElement.textContent = fare.isStartingFare
                ? "Starting fare · per traveller"
                : "Selected class · per traveller";
        }

        card.dataset.fare = String(fare.price);
        card.dataset.option = travelClass === "all"
            ? Object.entries(fareData[mode])
                .find(([, item]) => item.label === fare.label)?.[0] || ""
            : travelClass.split(":")[1];

        return true;
    }

    function setTransportSelection(mode) {
        filterControls.forEach(input => {
            const controlMode = input.dataset.filterMode;

            input.checked = mode === "all"
                ? true
                : controlMode === mode;
        });
    }

    function applyTransportFilters() {
        const allSelected = Boolean(allFilter?.checked);

        const selectedModes = new Set(
            filterControls
                .filter(input =>
                    input !== allFilter && input.checked
                )
                .map(input => input.dataset.filterMode)
        );

        let visibleCount = 0;

        resultCards.forEach(card => {
            const mode = card.dataset.mode.toLowerCase();
            const matchesTransport = allSelected || selectedModes.has(mode);
            const matchesClass = renderCardFare(card);

            card.hidden = !(matchesTransport && matchesClass);

            if (!card.hidden) visibleCount++;
        });

        setText(
            "results-subtitle",
            visibleCount
                ? `${visibleCount} demo option${visibleCount === 1 ? "" : "s"} shown. Fares are illustrative, not live prices.`
                : "No options match the selected transport and class."
        );
    }

    filterControls.forEach(input => {
        input.addEventListener("change", () => {
            const mode = input.dataset.filterMode;

            if (mode === "all") {
                setTransportSelection(input.checked ? "all" : "none");
            } else {
                // Keep the transport filter single-choice.
                filterControls.forEach(other => {
                    other.checked = other === input && input.checked;
                });

                if (!input.checked && allFilter) {
                    allFilter.checked = false;
                }
            }

            applyTransportFilters();
        });
    });

    if (["flight", "train", "bus"].includes(transport)) {
        setTransportSelection(transport);
    } else {
        setTransportSelection("all");
    }

    applyTransportFilters();


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

                selectedClass: travelClass,
                selectedDemoOption: card.dataset.option || null,
                demoFare: card.dataset.fare
                ? Number(card.dataset.fare)
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
