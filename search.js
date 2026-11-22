<<<<<<< Updated upstream
document.addEventListener("DOMContentLoaded", async () => {
=======
document.addEventListener("DOMContentLoaded", () => {
>>>>>>> Stashed changes
    const params = new URLSearchParams(window.location.search);

    const getParam = (key, fallback = "") =>
        params.get(key)?.trim() || fallback;

    const origin = getParam("origin", "Your origin");
    const destination = getParam("destination", "Your destination");
    const departure = getParam("departure", "");
    const returnDate = getParam("returnDate", "");
    const transport = getParam("transport", "all").toLowerCase();
    let activeTravelClass = getParam("travelClass", "all").toLowerCase();

    const adults = Number(getParam("adults", "1")) || 0;
    const children = Number(getParam("children", "0")) || 0;
    const infants = Number(getParam("infants", "0")) || 0;

    const travellerCount =
        Number(getParam("travellers", String(adults + children + infants))) ||
        adults + children + infants;

    const SUPPORTED_MODES = ["flight", "train", "bus"];

    // -----------------------------------------
    // GENERAL HELPERS
    // -----------------------------------------

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

    function formatPrice(price) {
        return Number(price).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        });
    }

    function normalizeClass(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    // -----------------------------------------
    // SEARCH SUMMARY
    // -----------------------------------------

    setText("result-origin", origin);
    setText("result-destination", destination);

    setText(
        "result-date",
        returnDate
            ? `${formatDate(departure)} → ${formatDate(returnDate)}`
            : formatDate(departure)
    );

    setText(
        "result-travellers",
        `${travellerCount} traveller${travellerCount === 1 ? "" : "s"}`
    );

    document.querySelectorAll("[data-route-origin]").forEach(element => {
        element.textContent = origin;
    });

    document.querySelectorAll("[data-route-destination]").forEach(element => {
        element.textContent = destination;
    });

<<<<<<< Updated upstream

    // 2. TRANSPORT FILTERS AND CLASS FARES
   

    // Load real routes from the backend (demo cards stay if it is down)
    const esc = value => String(value).replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));

    function renderRoutes(routes) {
        document.querySelectorAll(".JOURNEY-CARD[data-mode]")
            .forEach(card => card.remove());

        const inr = value => `₹${value.toLocaleString("en-IN")}`;

        const html = routes.map(r => {
            const classes = Object.fromEntries(
                r.classes.map(c => [c.code, { label: c.label, price: c.price }])
            );

            const [h, m] = r.depart_time.split(":").map(Number);
            const dayShift = Math.floor((h * 60 + m + r.duration_min) / 1440);

            const trainClasses = r.transport === "train" ? `
                <div class="TRAIN-CLASS-SECTION"><div class="TRAIN-CLASS-GRID">
                    ${r.classes.map(c => `
                    <button type="button"
                            class="TRAIN-CLASS-OPTION${travelClass === "train:" + c.code ? " is-selected" : ""}"
                            data-class="${esc(c.code.toUpperCase())}"
                            data-fare="${c.price}" data-seats="${c.seats}"
                            aria-pressed="${travelClass === "train:" + c.code}">
                        <strong>${esc(c.code.toUpperCase())}</strong>
                        <span>${inr(c.price)}</span>
                        <small>${c.seats} seats</small>
                    </button>`).join("")}
                </div></div>` : "";

            return `
            <article class="JOURNEY-CARD" data-mode="${esc(r.transport)}"
                     data-route-id="${r.id}" data-live="1"
                     data-classes="${esc(JSON.stringify(classes))}">
                <div class="JOURNEY-CARD-TOP">
                    <span class="MODE-BADGE">${esc(r.transport.toUpperCase())} · ${esc(r.operator)}</span>
                    <button type="button" class="FAVOURITE-BTN"
                            aria-label="Mark as favourite" aria-pressed="false"
                            title="Mark as favourite">
                        <i class="fa-regular fa-heart" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="JOURNEY-ROUTE">
                    <div>
                        <strong>${esc(r.depart_time)}</strong>
                        <span class="ROUTE-CITY">${esc(r.origin)}</span>
                    </div>
                    <div class="ROUTE-DURATION">
                        <small>${Math.floor(r.duration_min / 60)}h ${r.duration_min % 60}m</small>
                        <span>───────────────────────────────────</span>
                    </div>
                    <div>
                        <strong>${esc(r.arrive_time)}${dayShift ? ` (+${dayShift})` : ""}</strong>
                        <span class="ROUTE-CITY">${esc(r.destination)}</span>
                    </div>
                </div>
                ${trainClasses}
                <div class="CARD-FARE" aria-live="polite">
                    <div class="CARD-FARE-INFO">
                        <span class="CARD-FARE-LABEL">Selected class fare</span>
                        <strong class="CARD-FARE-PRICE">—</strong>
                        <small class="CARD-FARE-CLASS">Choose a travel class</small>
                    </div>
                </div>
                <div class="JOURNEY-CARD-BOTTOM">
                    <button type="button" class="BOOK-BTN"
                            data-book-mode="${esc(r.transport)}">
                        Continue to book
                    </button>
                </div>
            </article>`;
        }).join("");

        document.querySelector(".RESULTS-HEADING")
            .insertAdjacentHTML("afterend", html);
    }

    if (params.get("origin") && params.get("destination")) {
        try {
            renderRoutes(await api(
                `/search?origin=${encodeURIComponent(origin)}` +
                `&destination=${encodeURIComponent(destination)}`
            ));
        } catch (err) {
            console.error("Search failed, showing demo cards:", err.message);
        }
    }
=======
    // -----------------------------------------
    // 1. MOBILE MENU
    // -----------------------------------------
>>>>>>> Stashed changes

    const mobileMenuButton = document.querySelector("#mobile-menu-toggle");
    const navbar = document.querySelector(".NAVBAR");
    const navMenu = document.querySelector("#nav-menu");

    function closeMobileMenu() {
        if (!mobileMenuButton || !navbar) return;

        navbar.classList.remove("MOBILE-MENU-OPEN");
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenuButton.setAttribute("aria-label", "Open navigation menu");

        const icon = mobileMenuButton.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
    }

    mobileMenuButton?.addEventListener("click", () => {
        if (!navbar) return;

        const isOpen = navbar.classList.toggle("MOBILE-MENU-OPEN");

        mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
        mobileMenuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = mobileMenuButton.querySelector("i");

        if (icon) {
            icon.className = isOpen
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }
    });

    navMenu?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMobileMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 608) closeMobileMenu();
    });

    // -----------------------------------------
    // 2. RESULTS, DEMO FARES AND SORTING
    // -----------------------------------------

    const resultsContainer = document.querySelector(".RESULTS-CONTENT");
    const sortSelect = document.getElementById("sort-results");

    const resultCards = [
        ...document.querySelectorAll(".JOURNEY-CARD[data-mode]")
    ];

    // Demo fares only. Replace these with backend data later.
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
            "non-ac-seater": { label: "Non-AC Seater", price: 450 },
            "ac-seater": { label: "AC Seater", price: 650 },
            "non-ac-sleeper": { label: "Non-AC Sleeper", price: 600 },
            "ac-sleeper": { label: "AC Sleeper", price: 900 },
            "volvo-ac": { label: "Volvo AC", price: 1100 },
            "volvo-ac-sleeper": { label: "Volvo AC Sleeper", price: 1400 }
        },

        flight: {
            "economy": { label: "Economy", price: 4500 },
            "premium-economy": { label: "Premium Economy", price: 6500 },
            "business": { label: "Business", price: 15000 },
            "first-class": { label: "First Class", price: 25000 }
        }
    };

<<<<<<< Updated upstream
    function getFareForCard(card) {
        const mode = card.dataset.mode.toLowerCase();
        const available = card.dataset.classes
            ? JSON.parse(card.dataset.classes)
            : fareData[mode];
        if (!available) return null;
=======
    function getClassOptions(section) {
        return [
            ...section.querySelectorAll(
                ".TRAVEL-CLASS-OPTION, .TRAIN-CLASS-OPTION"
            )
        ];
    }
>>>>>>> Stashed changes

    function getSectionMode(section) {
        const leg = section.closest("[data-leg-mode]");

        if (section.dataset.legMode) {
            return section.dataset.legMode.toLowerCase();
        }

        if (leg?.dataset.legMode) {
            return leg.dataset.legMode.toLowerCase();
        }

        const card = section.closest(".JOURNEY-CARD[data-mode]");

        return (card?.dataset.mode || "").toLowerCase();
    }

    function getSelectedOption(section) {
        const options = getClassOptions(section);

        return options.find(option =>
            option.classList.contains("is-selected")
        ) || options[0] || null;
    }

    function getOptionFare(mode, option) {
        const classKey = normalizeClass(option?.dataset.class);
        const metadata = fareData[mode]?.[classKey];

        const suppliedFare = Number(option?.dataset.fare);

        return {
            classKey,
            label: metadata?.label || option?.dataset.class || "Travel class",
            price: Number.isFinite(suppliedFare) && suppliedFare > 0
                ? suppliedFare
                : (metadata?.price || 0)
        };
    }

    function getSectionSelection(section) {
        const option = getSelectedOption(section);
        if (!option) return null;

        const mode = getSectionMode(section);
        const fare = getOptionFare(mode, option);

        return {
            mode,
            travelClass: option.dataset.class || "",
            optionKey: fare.classKey,
            fare: fare.price,
            seats: Number(option.dataset.seats) || null,
            label: fare.label
        };
    }

    function updateCardFareDisplay(
        card,
        { price, label, isStartingFare, optionKey }
    ) {
        const fareBox = card.querySelector(".CARD-FARE");
<<<<<<< Updated upstream

        if (!fareBox) return true;

        const fare = getFareForCard(card);

        // A mode-specific class cannot be priced on another mode.
        if (!fare) {
            fareBox.hidden = true;
            return false;
        }
=======
        if (!fareBox) return;
>>>>>>> Stashed changes

        fareBox.hidden = false;

        const priceElement = fareBox.querySelector(".CARD-FARE-PRICE");
        const classElement = fareBox.querySelector(".CARD-FARE-CLASS");
        const labelElement = fareBox.querySelector(".CARD-FARE-LABEL");

        if (priceElement) {
            priceElement.textContent = formatPrice(price);
        }

        if (classElement) {
            classElement.textContent = label;
        }

        if (labelElement) {
            labelElement.textContent = isStartingFare
                ? "Starting fare · per traveller"
                : "Selected class · per traveller";
        }

<<<<<<< Updated upstream
        card.dataset.fare = String(fare.price);
        card.dataset.option = travelClass === "all"
            ? Object.entries(JSON.parse(card.dataset.classes || "null") || fareData[mode])
                .find(([, item]) => item.label === fare.label)?.[0] || ""
            : travelClass.split(":")[1];
=======
        card.dataset.fare = String(price);

        if (optionKey) {
            card.dataset.option = optionKey;
        }
    }

    function updateItineraryTotal(card) {
        const sections = [
            ...card.querySelectorAll("[data-class-section]")
        ];

        if (!sections.length) return;

        const selections = sections
            .map(getSectionSelection)
            .filter(Boolean);

        const total = selections.reduce(
            (sum, selection) => sum + selection.fare,
            0
        );

        card.dataset.fare = String(total);

        const totalElement = card.querySelector("[data-itinerary-total]");

        if (totalElement) {
            totalElement.textContent = formatPrice(total);
        }

        const fareBox = card.querySelector(".CARD-FARE");

        if (fareBox) {
            updateCardFareDisplay(card, {
                price: total,
                label: selections.map(selection =>
                    `${selection.mode}: ${selection.label}`
                ).join(" + "),
                isStartingFare: false,
                optionKey: "multimodal"
            });
        }
    }

    function getRequestedClassForMode(mode) {
        if (activeTravelClass === "all") return null;

        const separator = activeTravelClass.indexOf(":");

        if (separator !== -1) {
            const requestedMode = activeTravelClass.slice(0, separator);
            const requestedClass = activeTravelClass.slice(separator + 1);

            return requestedMode === mode ? requestedClass : null;
        }

        return fareData[mode]?.[activeTravelClass]
            ? activeTravelClass
            : null;
    }

    function selectClass(section, button, { shouldSort = true } = {}) {
        const options = getClassOptions(section);

        options.forEach(option => {
            const selected = option === button;

            option.classList.toggle("is-selected", selected);
            option.setAttribute("aria-pressed", String(selected));
        });

        const card = section.closest(".JOURNEY-CARD[data-mode]");
        if (!card) return;

        const mode = getSectionMode(section);
        const selection = getSectionSelection(section);

        if (!selection) return;

        if (button.dataset.seats) {
            card.dataset.seats = button.dataset.seats;
        }

        // Each leg keeps its own class and fare.
        if (card.dataset.mode.toLowerCase() === "multimodal") {
            updateItineraryTotal(card);
        } else {
            updateCardFareDisplay(card, {
                price: selection.fare,
                label: selection.seats
                    ? `${selection.label} · ${selection.seats} seats`
                    : selection.label,
                isStartingFare: false,
                optionKey: selection.optionKey
            });
        }

        if (shouldSort) sortResultCards();
    }

    // Attach universal class selection to single-mode cards and
    // to every leg inside multi-mode cards.
    document.querySelectorAll("[data-class-section]").forEach(section => {
        getClassOptions(section).forEach(button => {
            button.addEventListener("click", () => {
                selectClass(section, button);
            });
        });
    });

    // Also support existing class sections without data-class-section.
    document.querySelectorAll(".TRAVEL-CLASS-SECTION").forEach(section => {
        if (section.hasAttribute("data-class-section")) return;

        getClassOptions(section).forEach(button => {
            button.addEventListener("click", () => {
                selectClass(section, button);
            });
        });
    });

    function renderCardFare(card) {
        const mode = (card.dataset.mode || "").toLowerCase();

        if (mode === "multimodal") {
            updateItineraryTotal(card);
            return true;
        }

        const fareBox = card.querySelector(".CARD-FARE");
        const sections = [...card.querySelectorAll("[data-class-section]")];

        // If the card doesn't use a class selector, preserve its existing fare.
        if (!fareBox && !sections.length) return true;

        const section = sections[0];

        if (section) {
            const requestedClass = getRequestedClassForMode(mode);

            if (requestedClass) {
                const match = getClassOptions(section).find(option =>
                    normalizeClass(option.dataset.class) === requestedClass
                );

                if (!match) {
                    if (fareBox) fareBox.hidden = true;
                    return false;
                }

                selectClass(section, match, { shouldSort: false });
                return true;
            }

            // "All classes": use the cheapest available demo class.
            const options = getClassOptions(section);

            if (options.length) {
                const cheapest = options.reduce((best, option) => {
                    const currentFare = getOptionFare(mode, option).price;
                    const bestFare = getOptionFare(mode, best).price;

                    return currentFare < bestFare ? option : best;
                });

                selectClass(section, cheapest, { shouldSort: false });

                const selection = getSectionSelection(section);

                if (selection) {
                    updateCardFareDisplay(card, {
                        price: selection.fare,
                        label: selection.label,
                        isStartingFare: true,
                        optionKey: selection.optionKey
                    });
                }

                return true;
            }
        }

        // Fallback for cards that only use the demo fare table.
        const available = fareData[mode];

        if (!available) return true;

        const requestedClass = getRequestedClassForMode(mode);

        if (requestedClass) {
            const fare = available[requestedClass];

            if (!fare) {
                if (fareBox) fareBox.hidden = true;
                return false;
            }

            updateCardFareDisplay(card, {
                ...fare,
                label: fare.label,
                isStartingFare: false,
                optionKey: requestedClass
            });

            return true;
        }

        const [optionKey, cheapest] = Object.entries(available)
            .reduce((best, entry) =>
                entry[1].price < best[1].price ? entry : best
            );

        updateCardFareDisplay(card, {
            ...cheapest,
            isStartingFare: true,
            optionKey
        });
>>>>>>> Stashed changes

        return true;
    }

    function sortResultCards() {
        if (!resultsContainer) return;

        const sortBy = sortSelect?.value || "recommended";

        const sorted = [...resultCards].sort((a, b) => {
            if (sortBy === "price") {
                return (Number(a.dataset.fare) || Infinity) -
                    (Number(b.dataset.fare) || Infinity);
            }

            if (sortBy === "duration") {
                return (Number(a.dataset.duration) || Infinity) -
                    (Number(b.dataset.duration) || Infinity);
            }

            return (Number(a.dataset.departure) || 0) -
                (Number(b.dataset.departure) || 0);
        });

        sorted.forEach(card => resultsContainer.appendChild(card));
    }

    // -----------------------------------------
    // 3. FIVE TRANSPORT FILTERS
    //
    // Flights | Trains | Buses | All | Multi-Mode
    // -----------------------------------------

    const filterControls = [
        ...document.querySelectorAll(
            "input[name='transport-filter'][data-filter-mode]"
        )
    ];

    const allFilter = filterControls.find(
        input => input.dataset.filterMode.toLowerCase() === "all"
    );

    const multiModeFilter = filterControls.find(
        input => ["multimodal", "multi-mode", "multi"]
            .includes(input.dataset.filterMode.toLowerCase())
    );

    const singleModeFilters = filterControls.filter(input =>
        SUPPORTED_MODES.includes(input.dataset.filterMode.toLowerCase())
    );

    function setTransportSelection(mode) {
        const normalized = (mode || "all").toLowerCase();

        filterControls.forEach(input => {
            const filterMode = input.dataset.filterMode.toLowerCase();

            if (filterMode === "all") {
                input.checked = normalized === "all";
            } else if (
                ["multimodal", "multi-mode", "multi"].includes(filterMode)
            ) {
                input.checked = [
                    "multimodal",
                    "multi-mode",
                    "multi"
                ].includes(normalized);
            } else {
                input.checked = filterMode === normalized;
            }
        });

        // Unknown transport values default to All.
        const recognized = [
            "all", "multimodal", "multi-mode", "multi",
            ...SUPPORTED_MODES
        ].includes(normalized);

        if (!recognized && allFilter) {
            filterControls.forEach(input => {
                input.checked = input === allFilter;
            });
        }
    }

    function getCardModes(card) {
        const mode = (card.dataset.mode || "").toLowerCase();

        if (mode !== "multimodal") {
            return SUPPORTED_MODES.includes(mode) ? [mode] : [];
        }

        return (card.dataset.modes || "")
            .split(",")
            .map(item => item.trim().toLowerCase())
            .filter(item => SUPPORTED_MODES.includes(item));
    }

    function applyTransportFilters() {
        const showAll = Boolean(allFilter?.checked);
        const showMultiMode = Boolean(multiModeFilter?.checked);

        const selectedSingleModes = new Set(
            singleModeFilters
                .filter(input => input.checked)
                .map(input => input.dataset.filterMode.toLowerCase())
        );

        let visibleCount = 0;

        resultCards.forEach(card => {
            const mode = (card.dataset.mode || "").toLowerCase();
            const isMultiMode = mode === "multimodal";

            let matchesTransport;

            if (showAll) {
                // All = all single-mode journeys AND all combinations.
                matchesTransport = true;
            } else if (isMultiMode) {
                // Multi-Mode explicitly includes combined itineraries only.
                matchesTransport = showMultiMode;
            } else {
                matchesTransport = selectedSingleModes.has(mode);
            }

            const matchesClass = renderCardFare(card);

            card.hidden = !(matchesTransport && matchesClass);

            if (!card.hidden) visibleCount++;
        });

        sortResultCards();

        setText(
            "results-subtitle",
            visibleCount
                ? `${visibleCount} option${visibleCount === 1 ? "" : "s"} shown.` +
                  (resultCards.some(card => card.dataset.live) ? "" : " Demo data: fares are illustrative.")
                : "No options match the selected transport and class."
        );
    }

    filterControls.forEach(input => {
        input.addEventListener("change", () => {
            const mode = input.dataset.filterMode.toLowerCase();

            if (mode === "all" && input.checked) {
                // All is exclusive.
                filterControls.forEach(other => {
                    if (other !== allFilter) other.checked = false;
                });
            } else if (input.checked && allFilter) {
                allFilter.checked = false;
            }

            // If the user clears every checkbox, restore All.
            if (!filterControls.some(control => control.checked)) {
                if (allFilter) {
                    allFilter.checked = true;
                } else {
                    setTransportSelection("all");
                }
            }

            applyTransportFilters();
        });
    });

    sortSelect?.addEventListener("change", sortResultCards);

    // Apply the mode sent from the homepage.
    setTransportSelection(transport);

    // Apply the homepage's selected class to matching sections.
    if (activeTravelClass !== "all") {
        document.querySelectorAll("[data-class-section]").forEach(section => {
            const mode = getSectionMode(section);
            const requestedClass = getRequestedClassForMode(mode);

            if (!requestedClass) return;

            const match = getClassOptions(section).find(option =>
                normalizeClass(option.dataset.class) === requestedClass
            );

            if (match) {
                selectClass(section, match, { shouldSort: false });
            }
        });
    }

    // Initialize every class section and calculate combo fares.
    document.querySelectorAll("[data-class-section]").forEach(section => {
        const selected = getSelectedOption(section);

        if (selected) {
            const card = section.closest(".JOURNEY-CARD[data-mode]");

            if (card?.dataset.mode.toLowerCase() === "multimodal") {
                updateItineraryTotal(card);
            } else if (activeTravelClass === "all") {
                selectClass(section, selected, { shouldSort: false });
            }
        }
    });

    applyTransportFilters();

<<<<<<< Updated upstream

    // FAVOURITE ROUTES —SAVED IN THIS BROWSER
    
=======
    // -----------------------------------------
    // 4. FAVOURITE ROUTES
    // -----------------------------------------
>>>>>>> Stashed changes

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
            card.dataset.mode.toLowerCase(),
            card.dataset.itinerary || ""
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
            icon.classList.add("fa-heart");
        }
    }

    document.querySelectorAll(".FAVOURITE-BTN").forEach(button => {
        const card = button.closest(".JOURNEY-CARD[data-mode]");
        if (!card) return;

        updateFavouriteButton(button, favourites.includes(routeKey(card)));

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

<<<<<<< Updated upstream

    // TRAIN CLASS SELECTION
   

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

    
    // LIGHT / DARK THEME
 
=======
    // -----------------------------------------
    // 5. LIGHT / DARK THEME
    // -----------------------------------------
>>>>>>> Stashed changes

    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("travelleon-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.dataset.theme = savedTheme;
    }

    function updateThemeButton() {
        if (!themeToggle) return;

        const dark = document.documentElement.dataset.theme === "dark";

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
        const current = document.documentElement.dataset.theme || "light";
        const next = current === "dark" ? "light" : "dark";

        document.documentElement.dataset.theme = next;
        localStorage.setItem("travelleon-theme", next);

        updateThemeButton();
    });

<<<<<<< Updated upstream

    // EDIT SEARCH
=======
    // -----------------------------------------
    // 6. EDIT SEARCH
    // -----------------------------------------
>>>>>>> Stashed changes

    document.getElementById("edit-search")?.addEventListener("click", () => {
        window.location.href = `index.html?${params.toString()}`;
    });

<<<<<<< Updated upstream
   
    // BOOKING HANDOFF — DEMO UNTIL BACKEND INTEGRATION
  
=======
    // -----------------------------------------
    // 7. BOOKING HANDOFF
    // -----------------------------------------

>>>>>>> Stashed changes
    document.querySelectorAll(".BOOK-BTN").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".JOURNEY-CARD[data-mode]");
            if (!card) return;

            const mode = (card.dataset.mode || "").toLowerCase();

            const sections = [
                ...card.querySelectorAll("[data-class-section]")
            ];

            const legs = sections
                .map(section => {
                    const selection = getSectionSelection(section);
                    if (!selection) return null;

                    const leg = section.closest("[data-leg-mode]");
                    const legMode = selection.mode;

                    return {
                        mode: legMode,
                        travelClass: selection.travelClass,
                        selectedDemoOption: selection.optionKey,
                        demoFare: selection.fare,
                        seats: selection.seats,
                        origin: leg?.dataset.origin || null,
                        destination: leg?.dataset.destination || null
                    };
                })
                .filter(Boolean);

            const totalFare = legs.length
                ? legs.reduce((sum, leg) => sum + leg.demoFare, 0)
                : (Number(card.dataset.fare) || null);

            const singleSelection = legs.length === 1 ? legs[0] : null;

            const pendingBooking = {
                origin,
                destination,
                departure,
                returnDate,
                transport: mode,
                travellers: travellerCount,
                adults,
                children,
                infants,

                selectedClass: singleSelection
                    ? `${singleSelection.mode}:${singleSelection.selectedDemoOption}`
                    : (legs.length ? null : activeTravelClass),

                selectedDemoOption: singleSelection
                    ? singleSelection.selectedDemoOption
                    : (card.dataset.option || null),

                legs,
                demoFare: totalFare,
                isDemoFare: true,

                itineraryId: card.dataset.itinerary || null,

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