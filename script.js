<<<<<<< Updated upstream
const savedTheme = localStorage.getItem("travelleon-theme");
const initialTheme = savedTheme || "light";
const themeButton = document.querySelector("#theme-toggle");
const themeIcon = themeButton.querySelector("i");

document.documentElement.dataset.theme = initialTheme;

if (themeIcon) {
    themeIcon.className = initialTheme === "dark"
        ? "fa-regular fa-sun"
        : "fa-regular fa-moon";
}

themeButton?.setAttribute(
    "aria-label",
    initialTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme"
);




themeButton.addEventListener("click", function () {
    const currentTheme = document.documentElement.dataset.theme;

    if (currentTheme === "dark") {
        // Switch to light theme: Sun → Moon
        document.documentElement.dataset.theme = "light";
        themeIcon.className = "fa-regular fa-moon";
        themeIcon.style.transform = "rotate(360deg)";

        themeButton.setAttribute(
            "aria-label",
            "Switch to dark theme"
        );
    } else {
        // Switch to dark theme: Moon → Sun
        document.documentElement.dataset.theme = "dark";
        themeIcon.className = "fa-regular fa-sun";
        themeIcon.style.transform = "rotate(180deg)";

        themeButton.setAttribute(
            "aria-label",
            "Switch to light theme"
        );
    }
    localStorage.setItem(
    "travelleon-theme",
    document.documentElement.dataset.theme
);
});


/*NAVBAR HIDE IN MOBILE*/
const mobileMenuButton = document.querySelector("#mobile-menu-toggle");
const navbar = document.querySelector(".NAVBAR");
const navMenu = document.querySelector("#nav-menu");

function closeMobileMenu() {
    if (!mobileMenuButton || !navbar) return;

    navbar.classList.remove("MOBILE-MENU-OPEN");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", "Open navigation menu");

    const icon = mobileMenuButton.querySelector("i");

    if (icon) {
        icon.className = "fa-solid fa-bars";
    }
}

mobileMenuButton?.addEventListener("click", () => {
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
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 608) {
        closeMobileMenu();
    }
});


/* =====================================
   TRAVELLER POPUP 
===================================== */

const travellerTrigger = document.querySelector("#traveller-trigger");
const travellerPopup = document.querySelector("#traveller-popup");
const travellerSummary = document.querySelector("#traveller-summary");
const travelClassSelect = document.querySelector("#travel-class");
const applyTravellerButton = document.querySelector("#apply-travellers");
const passengerTotal = document.querySelector("#passenger-total");

// Hidden form inputs
const totalTravellersInput = document.querySelector("#travellers");
const adultsInput = document.querySelector("#adults");
const childrenInput = document.querySelector("#children");
const infantsInput = document.querySelector("#infants");

// Current selections inside the popup
const passengerCounts = {
    adults: 1,
    children: 0,
    infants: 0
};

// Last selections confirmed by Apply
let appliedCounts = { ...passengerCounts };
let appliedClass = travelClassSelect?.value || "Economy";


/* OPEN AND CLOSE POPUP */

function openTravellerPopup() {
    if (!travellerPopup || !travellerTrigger) return;

    travellerPopup.hidden = false;
    travellerTrigger.setAttribute("aria-expanded", "true");
}

function closeTravellerPopup() {
    if (!travellerPopup || !travellerTrigger) return;

    travellerPopup.hidden = true;
    travellerTrigger.setAttribute("aria-expanded", "false");
}

travellerTrigger?.addEventListener("click", () => {
    if (travellerPopup.hidden) {
        openTravellerPopup();
    } else {
        closeTravellerPopup();
    }
});



/* =========================================
   TRANSPORT-SPECIFIC TRAVEL CLASSES
========================================= */

const transportRadios = [
    ...document.querySelectorAll('input[name="transport"]')
];

const classSelect = document.querySelector("#travel-class");
const classHelp = document.querySelector("#class-help");

const classesByTransport = {
    flight: [
        { value: "flight:economy", label: "Economy" },
        { value: "flight:premium-economy", label: "Premium Economy" },
        { value: "flight:business", label: "Business" },
        { value: "flight:first-class", label: "First Class" }
    ],

    train: [
        { value: "train:1A", label: "1A — AC First Class" },
        { value: "train:2A", label: "2A — AC 2 Tier" },
        { value: "train:3A", label: "3A — AC 3 Tier" },
        { value: "train:3E", label: "3E — AC 3 Tier Economy" },
        { value: "train:CC", label: "CC — AC Chair Car" },
        { value: "train:EC", label: "EC — Executive Chair Car" },
        { value: "train:SL", label: "SL — Sleeper" },
        { value: "train:2S", label: "2S — Second Sitting" }
    ],

    bus: [
        { value: "bus:seater", label: "Non-AC Seater" },
        { value: "bus:ac-seater", label: "AC Seater" },
        { value: "bus:sleeper", label: "Non-AC Sleeper" },
        { value: "bus:ac-sleeper", label: "AC Sleeper" },
        { value: "bus:volvo-ac", label: "Volvo AC" },
        { value: "bus:volvo-ac-sleeper", label: "Volvo AC Sleeper" }
    ]
};

function getSelectedTransport() {
    return document.querySelector(
        'input[name="transport"]:checked'
    )?.value || "all";
}

function updateTravelClassOptions(preferredValue = "all") {
    if (!classSelect) return;

    const mode = getSelectedTransport();

    let availableClasses;

    if (mode === "all") {
        availableClasses = Object.values(classesByTransport).flat();
    } else {
        availableClasses = classesByTransport[mode] || [];
    }

    classSelect.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All classes";
    classSelect.appendChild(allOption);

    availableClasses.forEach(item => {
        const option = document.createElement("option");
        option.value = item.value;
        option.textContent = mode === "all"
            ? `${item.label} (${item.value.split(":")[0]})`
            : item.label;

        classSelect.appendChild(option);
    });

    const valueExists = [...classSelect.options].some(
        option => option.value === preferredValue
    );

    classSelect.value = valueExists ? preferredValue : "all";

    if (classHelp) {
        classHelp.textContent = mode === "all"
            ? "Choose All Classes or a specific mode and class."
            : `Choose a ${mode} class or compare all its classes.`;
    }
}

transportRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.checked) {
            updateTravelClassOptions("all");
        }
    });
});

// Initialise the class dropdown.
updateTravelClassOptions();
/* RESTORE SEARCH DETAILS WHEN EDIT SEARCH IS CLICKED */

const incomingParams = new URLSearchParams(window.location.search);

if (incomingParams.has("transport")) {
    const incomingTransport = incomingParams.get("transport");

    const matchingRadio = transportRadios.find(
        radio => radio.value === incomingTransport
    );

    if (matchingRadio) {
        matchingRadio.checked = true;
    }
}

updateTravelClassOptions(
    incomingParams.get("travelClass") || "all"
);

const restoredOrigin = document.querySelector("#origin");
const restoredDestination = document.querySelector("#destination");
const restoredDeparture = document.querySelector("#departure");
const restoredReturn = document.querySelector("#return-date");

if (restoredOrigin && incomingParams.has("origin")) {
    restoredOrigin.value = incomingParams.get("origin");
}

if (restoredDestination && incomingParams.has("destination")) {
    restoredDestination.value = incomingParams.get("destination");
}

if (restoredDeparture && incomingParams.has("departure")) {
    restoredDeparture.value = incomingParams.get("departure");
}

if (restoredReturn && incomingParams.has("returnDate")) {
    restoredReturn.value = incomingParams.get("returnDate");
}

/* UPDATE PASSENGER TOTAL */

function updatePassengerTotal() {
    const total =
        passengerCounts.adults +
        passengerCounts.children +
        passengerCounts.infants;

    if (passengerTotal) {
        passengerTotal.textContent =
            `${total} passenger${total === 1 ? "" : "s"}`;
    }
}


/* UPDATE SELECTED COUNT BUTTONS */

function updatePassengerButtons() {
    document.querySelectorAll(".COUNT-OPTIONS").forEach(group => {
        const type = group.dataset.passenger;
        const selectedCount = passengerCounts[type];

        group.querySelectorAll("button[data-count]").forEach(button => {
            const isMoreOption = button.dataset.count === "more";

            const isSelected = isMoreOption
                ? selectedCount >= (type === "adults" ? 10 : 7)
                : Number(button.dataset.count) === selectedCount;

            button.classList.toggle("is-selected", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });
    });
}


/* PASSENGER COUNT BUTTONS */

document.querySelectorAll(".COUNT-OPTIONS").forEach(group => {
    group.addEventListener("click", event => {
        const button = event.target.closest("button[data-count]");

        if (!button) return;

        const type = group.dataset.passenger;

        if (!Object.prototype.hasOwnProperty.call(passengerCounts, type)) {
            return;
        }

        let count;

        // Handle 9+ adults or 6+ children/infants
        if (button.dataset.count === "more") {
            const minimum = type === "adults" ? 10 : 7;

            const answer = prompt(
                `Enter the number of ${type} (${minimum}–99):`
            );

            if (answer === null) return;

            if (!/^\d+$/.test(answer.trim())) {
                alert("Please enter a whole number.");
                return;
            }

            count = Number(answer);

            if (count < minimum || count > 99) {
                alert(`Please enter a number from ${minimum} to 99.`);
                return;
            }
        } else {
            count = Number(button.dataset.count);
        }

        // Infants cannot outnumber adults
        if (type === "infants" && count > passengerCounts.adults) {
            alert("The number of infants cannot exceed the number of adults.");
            return;
        }

        // Don't reduce adults below the current infant count
        if (type === "adults" && count < passengerCounts.infants) {
            alert("Please reduce the infant count before reducing adults.");
            return;
        }

        passengerCounts[type] = count;

        updatePassengerButtons();
        updatePassengerTotal();
    });
});


/* APPLY PASSENGER AND CLASS SELECTIONS */

applyTravellerButton?.addEventListener("click", () => {
    appliedCounts = { ...passengerCounts };
    appliedClass = travelClassSelect?.value || "Economy";

    const total =
        appliedCounts.adults +
        appliedCounts.children +
        appliedCounts.infants;

    const parts = [];

    if (appliedCounts.adults > 0) {
        parts.push(
            `${appliedCounts.adults} Adult${appliedCounts.adults === 1 ? "" : "s"}`
        );
    }

    if (appliedCounts.children > 0) {
        parts.push(
            `${appliedCounts.children} Child${appliedCounts.children === 1 ? "" : "ren"}`
        );
    }

    if (appliedCounts.infants > 0) {
        parts.push(
            `${appliedCounts.infants} Infant${appliedCounts.infants === 1 ? "" : "s"}`
        );
    }

    if (travellerSummary) {
        travellerSummary.textContent =
            `${parts.join(", ")} · ${appliedClass}`;
    }

    // Update hidden inputs for form submission
    if (totalTravellersInput) totalTravellersInput.value = total;
    if (adultsInput) adultsInput.value = appliedCounts.adults;
    if (childrenInput) childrenInput.value = appliedCounts.children;
    if (infantsInput) infantsInput.value = appliedCounts.infants;

    closeTravellerPopup();
});


const travellerCloseButton = document.querySelector("#traveller-close");

travellerCloseButton?.addEventListener("click", () => {
    closeTravellerPopup();
    travellerTrigger?.focus();
});


/* CLOSE WHEN CLICKING OUTSIDE */

document.addEventListener("click", event => {
    if (!travellerPopup || travellerPopup.hidden) return;

    const clickedTrigger = travellerTrigger?.contains(event.target);
    const clickedPopup = travellerPopup.contains(event.target);

    if (!clickedTrigger && !clickedPopup) {
        closeTravellerPopup();
    }
});


/* CLOSE WITH ESCAPE */

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && travellerPopup && !travellerPopup.hidden) {
        closeTravellerPopup();
        travellerTrigger?.focus();
    }
});


/* INITIALISE */

updatePassengerButtons();
updatePassengerTotal();





//swap button working

const swapButton = document.querySelector("#swap-locations");
const originInput = document.querySelector("#origin");
const destinationInput = document.querySelector("#destination");

swapButton?.addEventListener("click", () => {
    if (!originInput || !destinationInput) return;

    const previousOrigin = originInput.value;

    originInput.value = destinationInput.value;
    destinationInput.value = previousOrigin;

    // Notify any other listeners that the values changed
    originInput.dispatchEvent(new Event("input", { bubbles: true }));
    destinationInput.dispatchEvent(new Event("input", { bubbles: true }));
    originInput.dispatchEvent(new Event("change", { bubbles: true }));
    destinationInput.dispatchEvent(new Event("change", { bubbles: true }));
});


//destination and start cant be same

const journeyForm = document.querySelector("#journey-search");



journeyForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();
    const departureInput = document.querySelector("#departure");
    const departureDate = departureInput.value;
    const returnDate = document.querySelector("#return-date");
    const travellers = document.querySelector("#travellers");
    const travelClass = document.querySelector("#travel-class");

    if (!origin) {
        alert("Please enter your starting city.");
        originInput.focus();
        return;
    }

    if (!destination) {
        alert("Please enter your destination.");
        destinationInput.focus();
        return;
    }

    if (
        origin.localeCompare(destination, undefined, {
            sensitivity: "base"
        }) === 0
    ) {
        alert("Your destination must be different from your starting city.");
        destinationInput.focus();
        return;
    }

    if (!departureDate) {
        alert("Please select your departure date.");
        departureInput.focus();
        return;
    }

    const selectedTransport =
    document.querySelector('input[name="transport"]:checked')?.value || "all";
    // Build the URL with the user's search details.
const params = new URLSearchParams({
    origin: origin,
    destination: destination,
    departure: departureDate,
    returnDate: returnDate?.value || "",
    travellers: travellers?.value || "1",
    adults: document.querySelector("#adults")?.value || "1",
    children: document.querySelector("#children")?.value || "0",
    infants: document.querySelector("#infants")?.value || "0",
    transport: getSelectedTransport(),
    travelClass: travelClass?.value || "all"
});

window.location.href = `search.html?${params.toString()}`;
});



/* =========================================
   DEPARTURE & RETURN DATE VALIDATION
========================================= */

const dateDepartureInput = document.querySelector("#departure");
const dateReturnInput = document.querySelector("#return-date");

// Get today's date in local time (YYYY-MM-DD).
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Set the earliest allowed departure and return dates.
function updateDateLimits() {
    const today = getTodayDate();

    if (dateDepartureInput) {
        dateDepartureInput.min = today;
    }

    if (dateReturnInput) {
        // Return cannot be before departure, or before today.
        dateReturnInput.min =
            dateDepartureInput?.value || today;

        // Clear an invalid return date if departure changes.
        if (
            dateReturnInput.value &&
            dateReturnInput.value < dateReturnInput.min
        ) {
            dateReturnInput.value = "";
        }
    }
}

// Apply the limits when the page loads.
updateDateLimits();

// Update the return calendar when departure changes.
dateDepartureInput?.addEventListener("change", updateDateLimits);

//LOGIN


const authView = document.getElementById("auth-view");
const backHome = document.getElementById("back-home");
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authHeading = document.getElementById("auth-heading");
const authSubtitle = document.getElementById("auth-subtitle");
const authMessage = document.getElementById("auth-message");

const signupButton = document.querySelector(".SIGNUP-BTN");
const loginButton = document.querySelector(".LOGIN-BTN");

const signupPassword = document.getElementById("signup-password");
const signupDob = document.getElementById("signup-dob");

// Target the existing homepage elements once.
const homeHeader = document.querySelector("header");
const homeMain = document.querySelector("main");

function setAuthMode(mode) {
    const isLogin = mode === "login";

    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;

    loginTab.classList.toggle("ACTIVE", isLogin);
    signupTab.classList.toggle("ACTIVE", !isLogin);

    authHeading.textContent = isLogin
        ? "Welcome back!"
        : "Join Us Today!";

    authSubtitle.textContent = isLogin
        ? "Sign in to continue your journey."
        : "Create your account and plan your next adventure.";

    authMessage.textContent = "";
}

loginTab.addEventListener("click", () => setAuthMode("login"));
signupTab.addEventListener("click", () => setAuthMode("signup"));
//jekhan theke ase sekhane jate fire jai
backHome.addEventListener("click", (event) => {
    event.preventDefault();

    const cameFromSearch =
        document.referrer.includes("search.html");

    if (cameFromSearch) {
        window.location.href = "search.html";
    } else {
        hideAuthPage();
    }
});
loginButton?.addEventListener("click", (event) => {
    event.preventDefault();
    showAuthPage("login");
});

signupButton?.addEventListener("click", (event) => {
    event.preventDefault();
    showAuthPage("signup");
});

// Eye emoji password visibility toggle.
document.querySelectorAll(".AUTH-TOGGLE").forEach((button) => {
    button.addEventListener("click", () => {
        const field = document.getElementById(button.dataset.password);
        if (!field) return;

        const showing = field.type === "text";

        field.type = showing ? "password" : "text";

        button.innerHTML = showing
            ? '<i class="fa-regular fa-eye" aria-hidden="true"></i>'
            : '<i class="fa-regular fa-eye-slash" aria-hidden="true"></i>';

        button.setAttribute("aria-pressed", String(!showing));
        button.setAttribute(
            "aria-label",
            showing ? "Show password" : "Hide password"
        );
    });
});

// Password requirements.
const passwordRules = [
    {
        id: "rule-length",
        test: (value) => value.length >= 8,
        label: "At least 8 characters"
    },
    {
        id: "rule-upper",
        test: (value) => /[A-Z]/.test(value),
        label: "One uppercase letter (A–Z)"
    },
    {
        id: "rule-lower",
        test: (value) => /[a-z]/.test(value),
        label: "One lowercase letter (a–z)"
    },
    {
        id: "rule-number",
        test: (value) => /[0-9]/.test(value),
        label: "One number (0–9)"
    },
    {
        id: "rule-special",
        test: (value) => /[^A-Za-z0-9]/.test(value),
        label: "One special character (!@#$...)"
    }
];

function checkPassword(value) {
    let allValid = true;

    passwordRules.forEach((rule) => {
        const element = document.getElementById(rule.id);
        const passed = rule.test(value);

        element.classList.toggle("PASS", passed);
        element.textContent = `${passed ? "✓" : "○"} ${rule.label}`;

        if (!passed) allValid = false;
    });

    return allValid;
}

const passwordRulesBox = document.getElementById("password-rules");

signupPassword.addEventListener("input", () => {
    const hasTyped = signupPassword.value.length > 0;

    passwordRulesBox.hidden = !hasTyped;

    if (hasTyped) {
        checkPassword(signupPassword.value);
    } else {
        // Reset the rules when the field becomes empty.
        passwordRules.forEach((rule) => {
            const element = document.getElementById(rule.id);
            element.classList.remove("PASS");
            element.textContent = `○ ${rule.label}`;
        });
    }
});

// Prevent future birth dates.
const today = new Date();
const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

signupDob.max = todayString;

// OTP interface: delivery is not connected yet.
document.querySelectorAll("[data-otp]").forEach((button) => {
    button.addEventListener("click", () => {
        const type = button.dataset.otp;

        if (type === "email") {
            const email = document.getElementById("signup-email");

            if (!email.checkValidity()) {
                email.reportValidity();
                return;
            }
        }

        if (type === "phone") {
            const phone = document.getElementById("signup-phone");

            if (!phone.value.trim() || !phone.checkValidity()) {
                phone.reportValidity();
                return;
            }
        }

        authMessage.textContent =
            `The ${type} OTP service is not connected yet. ` +
            "We'll enable code delivery after integrating the authentication backend.";
    });
});

// Login UI submission.
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    authMessage.textContent =
        "Your login form is ready. Real account authentication still needs to be connected.";
});

// Signup UI submission.
signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!checkPassword(signupPassword.value)) {
        authMessage.textContent =
            "Please meet all five password requirements.";
        signupPassword.focus();
        return;
    }

    if (signupDob.value > todayString) {
        authMessage.textContent =
            "Date of birth cannot be in the future.";
        signupDob.focus();
        return;
    }

    authMessage.textContent =
        "Your form passed the basic checks. Account creation and email/phone OTP verification still need to be connected.";
});


function showAuthPage(mode = "login") {
    if (!authView) return;

    setAuthMode(mode);

    const targetHash = mode === "signup" ? "#signup" : "#login";

    if (window.location.hash !== targetHash) {
        history.replaceState(null, "", targetHash);
    }

    // If already on the authentication page, just switch tabs.
    if (!authView.hidden) return;

    homeHeader?.classList.add("PAGE-EXIT");
    homeMain?.classList.add("PAGE-EXIT");

    setTimeout(() => {
        homeHeader?.setAttribute("hidden", "");
        homeMain?.setAttribute("hidden", "");

        homeHeader?.classList.remove("PAGE-EXIT");
        homeMain?.classList.remove("PAGE-EXIT");

        authView.hidden = false;
        authView.classList.add("PAGE-ENTER");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                authView.classList.remove("PAGE-ENTER");
            });
        });

        window.scrollTo({ top: 0, behavior: "auto" });
    }, 220);
}

function hideAuthPage() {
    if (!authView || authView.hidden) return;

    history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
    );

    authView.classList.add("PAGE-EXIT");

    setTimeout(() => {
        authView.hidden = true;
        authView.classList.remove("PAGE-EXIT");

        homeHeader?.removeAttribute("hidden");
        homeMain?.removeAttribute("hidden");

        homeHeader?.classList.add("PAGE-ENTER");
        homeMain?.classList.add("PAGE-ENTER");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                homeHeader?.classList.remove("PAGE-ENTER");
                homeMain?.classList.remove("PAGE-ENTER");
            });
        });

        if (authMessage) authMessage.textContent = "";

        window.scrollTo({ top: 0, behavior: "auto" });
    }, 220);
}

window.addEventListener("DOMContentLoaded", restorePageFromURL);

//email address check
function isValidEmail(email) {
    const value = email.trim();

    // Basic email format check
    const emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    return emailPattern.test(value);
}

function restorePageFromURL() {
    const hash = window.location.hash.toLowerCase();

    if (hash === "#login") {
        showAuthPage("login");
    } else if (hash === "#signup") {
        showAuthPage("signup");
    } else {
        hideAuthPage();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restorePageFromURL);
} else {
    restorePageFromURL();
}

function updateNavbar() {
    const name = localStorage.getItem("userName");
    const loggedIn = localStorage.getItem("token") && name;
    signupButton.textContent = loggedIn ? "Hi, " + name : "Sign Up";
    loginButton.textContent = loggedIn ? "Log out" : "Log In";
}
updateNavbar();

//show the city from database
async function loadCities() {
    try {
        const stations = await api("/stations");
        const cities = [...new Set(stations.map(s => s.city))];
        document.getElementById("city-suggestions").innerHTML =
            cities.map(c => `<option value="${c}">`).join("");
    } catch (err) {
        console.error("Could not load cities:", err.message);
    }
}
loadCities();
=======
const savedTheme = localStorage.getItem("travelleon-theme");
const initialTheme = savedTheme || "light";
const themeButton = document.querySelector("#theme-toggle");
const themeIcon = themeButton?.querySelector("i");

document.documentElement.dataset.theme = initialTheme;

if (themeIcon) {
    themeIcon.className = initialTheme === "dark"
        ? "fa-regular fa-sun"
        : "fa-regular fa-moon";
}

themeButton?.setAttribute(
    "aria-label",
    initialTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme"
);

themeButton?.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;

    if (themeIcon) {
        themeIcon.className = nextTheme === "dark"
            ? "fa-regular fa-sun"
            : "fa-regular fa-moon";
        themeIcon.style.transform = nextTheme === "dark"
            ? "rotate(180deg)"
            : "rotate(360deg)";
    }

    themeButton.setAttribute(
        "aria-label",
        nextTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );

    localStorage.setItem("travelleon-theme", nextTheme);
});


/* =====================================
   NAVBAR HIDE IN MOBILE
===================================== */

const mobileMenuButton = document.querySelector("#mobile-menu-toggle");
const navbar = document.querySelector(".NAVBAR");
const navMenu = document.querySelector("#nav-menu");

function closeMobileMenu() {
    if (!mobileMenuButton || !navbar) return;

    navbar.classList.remove("MOBILE-MENU-OPEN");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", "Open navigation menu");

    const icon = mobileMenuButton.querySelector("i");
    if (icon) {
        icon.className = "fa-solid fa-bars";
    }
}

mobileMenuButton?.addEventListener("click", () => {
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
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 608) {
        closeMobileMenu();
    }
});


/* =====================================
   TRAVELLER POPUP
===================================== */

const travellerField = document.querySelector(".TRAVELLER-FIELD");
const travellerTrigger = document.querySelector("#traveller-trigger");
const travellerPopup = document.querySelector("#traveller-popup");
const travellerSummary = document.querySelector("#traveller-summary");
const travelClassSelect = document.querySelector("#travel-class");
const applyTravellerButton = document.querySelector("#apply-travellers");
const passengerTotal = document.querySelector("#passenger-total");

const totalTravellersInput = document.querySelector("#travellers");
const adultsInput = document.querySelector("#adults");
const childrenInput = document.querySelector("#children");
const infantsInput = document.querySelector("#infants");

const passengerCounts = {
    adults: 1,
    children: 0,
    infants: 0
};

let appliedCounts = { ...passengerCounts };
let appliedClass = "all";

function getSelectedClassLabel() {
    return travelClassSelect?.selectedOptions?.[0]?.textContent?.trim() || "All classes";
}

function renderTravellerSummary() {
    const total =
        appliedCounts.adults +
        appliedCounts.children +
        appliedCounts.infants;

    const parts = [];
    if (appliedCounts.adults > 0) {
        parts.push(`${appliedCounts.adults} Adult${appliedCounts.adults === 1 ? "" : "s"}`);
    }
    if (appliedCounts.children > 0) {
        parts.push(`${appliedCounts.children} Child${appliedCounts.children === 1 ? "" : "ren"}`);
    }
    if (appliedCounts.infants > 0) {
        parts.push(`${appliedCounts.infants} Infant${appliedCounts.infants === 1 ? "" : "s"}`);
    }

    if (travellerSummary) {
        travellerSummary.textContent = `${parts.join(", ")} · ${getSelectedClassLabel()}`;
    }

    if (totalTravellersInput) totalTravellersInput.value = total;
    if (adultsInput) adultsInput.value = appliedCounts.adults;
    if (childrenInput) childrenInput.value = appliedCounts.children;
    if (infantsInput) infantsInput.value = appliedCounts.infants;
}

function openTravellerPopup() {
    if (!travellerPopup || !travellerTrigger) return;

    Object.assign(passengerCounts, appliedCounts);
    if (travelClassSelect) travelClassSelect.value = appliedClass;
    updatePassengerButtons();
    updatePassengerTotal();

    travellerPopup.hidden = false;
    travellerField?.classList.add("is-open");
    travellerTrigger.setAttribute("aria-expanded", "true");
}

function closeTravellerPopup({ discardChanges = true } = {}) {
    if (!travellerPopup || !travellerTrigger) return;

    if (discardChanges) {
        Object.assign(passengerCounts, appliedCounts);
        if (travelClassSelect) travelClassSelect.value = appliedClass;
        updatePassengerButtons();
        updatePassengerTotal();
    }

    travellerPopup.hidden = true;
    travellerField?.classList.remove("is-open");
    travellerTrigger.setAttribute("aria-expanded", "false");
}

travellerTrigger?.addEventListener("click", () => {
    if (travellerPopup.hidden) {
        openTravellerPopup();
    } else {
        closeTravellerPopup();
    }
});


/* =========================================
   TRANSPORT-SPECIFIC TRAVEL CLASSES
========================================= */

const transportRadios = [
    ...document.querySelectorAll('input[name="transport"]')
];

const classSelect = document.querySelector("#travel-class");
const classHelp = document.querySelector("#class-help");

const classesByTransport = {
    flight: [
        { value: "flight:economy", label: "Economy" },
        { value: "flight:premium-economy", label: "Premium Economy" },
        { value: "flight:business", label: "Business" },
        { value: "flight:first-class", label: "First Class" }
    ],

    train: [
        { value: "train:1A", label: "1A — AC First Class" },
        { value: "train:2A", label: "2A — AC 2 Tier" },
        { value: "train:3A", label: "3A — AC 3 Tier" },
        { value: "train:3E", label: "3E — AC 3 Tier Economy" },
        { value: "train:CC", label: "CC — AC Chair Car" },
        { value: "train:EC", label: "EC — Executive Chair Car" },
        { value: "train:SL", label: "SL — Sleeper" },
        { value: "train:2S", label: "2S — Second Sitting" }
    ],

    bus: [
        { value: "bus:seater", label: "Non-AC Seater" },
        { value: "bus:ac-seater", label: "AC Seater" },
        { value: "bus:sleeper", label: "Non-AC Sleeper" },
        { value: "bus:ac-sleeper", label: "AC Sleeper" },
        { value: "bus:volvo-ac", label: "Volvo AC" },
        { value: "bus:volvo-ac-sleeper", label: "Volvo AC Sleeper" }
    ]
};

function getSelectedTransport() {
    return document.querySelector(
        'input[name="transport"]:checked'
    )?.value || "all";
}

function updateTravelClassOptions(preferredValue = "all") {
    if (!classSelect) return;

    const mode = getSelectedTransport();
    const availableClasses = mode === "all"
        ? Object.values(classesByTransport).flat()
        : (classesByTransport[mode] || []);

    classSelect.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All classes";
    classSelect.appendChild(allOption);

    availableClasses.forEach(item => {
        const option = document.createElement("option");
        option.value = item.value;
        option.textContent = mode === "all"
            ? `${item.label} (${item.value.split(":")[0]})`
            : item.label;

        classSelect.appendChild(option);
    });

    const valueExists = [...classSelect.options].some(
        option => option.value === preferredValue
    );

    classSelect.value = valueExists ? preferredValue : "all";

    if (classHelp) {
        classHelp.textContent = mode === "all"
            ? "Choose All Classes or a specific mode and class."
            : `Choose a ${mode} class or compare all its classes.`;
    }
}

transportRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.checked) {
            updateTravelClassOptions("all");
            appliedClass = classSelect?.value || "all";
            renderTravellerSummary();
        }
    });
});


/* =========================================
   RESTORE SEARCH DETAILS WHEN EDIT SEARCH IS CLICKED
========================================= */

const incomingParams = new URLSearchParams(window.location.search);

if (incomingParams.has("transport")) {
    const incomingTransport = incomingParams.get("transport");
    const matchingRadio = transportRadios.find(radio => radio.value === incomingTransport);
    if (matchingRadio) matchingRadio.checked = true;
}

updateTravelClassOptions(incomingParams.get("travelClass") || "all");
appliedClass = classSelect?.value || "all";

const restoredOrigin = document.querySelector("#origin");
const restoredDestination = document.querySelector("#destination");
const restoredDeparture = document.querySelector("#departure");
const restoredReturn = document.querySelector("#return-date");

if (restoredOrigin && incomingParams.has("origin")) {
    restoredOrigin.value = incomingParams.get("origin");
}
if (restoredDestination && incomingParams.has("destination")) {
    restoredDestination.value = incomingParams.get("destination");
}
if (restoredDeparture && incomingParams.has("departure")) {
    restoredDeparture.value = incomingParams.get("departure");
}
if (restoredReturn && incomingParams.has("returnDate")) {
    restoredReturn.value = incomingParams.get("returnDate");
}

const restoredAdults = Number(incomingParams.get("adults"));
const restoredChildren = Number(incomingParams.get("children"));
const restoredInfants = Number(incomingParams.get("infants"));

if (restoredAdults >= 1) passengerCounts.adults = restoredAdults;
if (restoredChildren >= 0 && incomingParams.has("children")) passengerCounts.children = restoredChildren;
if (restoredInfants >= 0 && incomingParams.has("infants")) {
    passengerCounts.infants = Math.min(restoredInfants, passengerCounts.adults);
}

appliedCounts = { ...passengerCounts };


/* UPDATE PASSENGER TOTAL */

function updatePassengerTotal() {
    const total =
        passengerCounts.adults +
        passengerCounts.children +
        passengerCounts.infants;

    if (passengerTotal) {
        passengerTotal.textContent =
            `${total} passenger${total === 1 ? "" : "s"}`;
    }
}


/* UPDATE SELECTED COUNT BUTTONS */

function updatePassengerButtons() {
    document.querySelectorAll(".COUNT-OPTIONS").forEach(group => {
        const type = group.dataset.passenger;
        const selectedCount = passengerCounts[type];

        group.querySelectorAll("button[data-count]").forEach(button => {
            const isMoreOption = button.dataset.count === "more";

            const isSelected = isMoreOption
                ? selectedCount >= (type === "adults" ? 10 : 7)
                : Number(button.dataset.count) === selectedCount;

            button.classList.toggle("is-selected", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });
    });
}


/* PASSENGER COUNT BUTTONS */

document.querySelectorAll(".COUNT-OPTIONS").forEach(group => {
    group.addEventListener("click", event => {
        const button = event.target.closest("button[data-count]");
        if (!button) return;

        const type = group.dataset.passenger;
        if (!Object.prototype.hasOwnProperty.call(passengerCounts, type)) {
            return;
        }

        let count;

        if (button.dataset.count === "more") {
            const minimum = type === "adults" ? 10 : 7;
            const answer = prompt(`Enter the number of ${type} (${minimum}–99):`);

            if (answer === null) return;

            if (!/^\d+$/.test(answer.trim())) {
                alert("Please enter a whole number.");
                return;
            }

            count = Number(answer);

            if (count < minimum || count > 99) {
                alert(`Please enter a number from ${minimum} to 99.`);
                return;
            }
        } else {
            count = Number(button.dataset.count);
        }

        if (type === "infants" && count > passengerCounts.adults) {
            alert("The number of infants cannot exceed the number of adults.");
            return;
        }

        if (type === "adults" && count < passengerCounts.infants) {
            alert("Please reduce the infant count before reducing adults.");
            return;
        }

        passengerCounts[type] = count;

        updatePassengerButtons();
        updatePassengerTotal();
    });
});


/* APPLY PASSENGER AND CLASS SELECTIONS */

applyTravellerButton?.addEventListener("click", () => {
    appliedCounts = { ...passengerCounts };
    appliedClass = travelClassSelect?.value || "all";
    renderTravellerSummary();
    closeTravellerPopup({ discardChanges: false });
});

const travellerCloseButton = document.querySelector("#traveller-close");

travellerCloseButton?.addEventListener("click", () => {
    closeTravellerPopup();
    travellerTrigger?.focus();
});


/* CLOSE WHEN CLICKING OUTSIDE */

document.addEventListener("click", event => {
    if (!travellerPopup || travellerPopup.hidden) return;

    const clickedTrigger = travellerTrigger?.contains(event.target);
    const clickedPopup = travellerPopup.contains(event.target);

    if (!clickedTrigger && !clickedPopup) {
        closeTravellerPopup();
    }
});


/* CLOSE WITH ESCAPE */

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && travellerPopup && !travellerPopup.hidden) {
        closeTravellerPopup();
        travellerTrigger?.focus();
    }
});


/* INITIALISE TRAVELLER STATE */

updatePassengerButtons();
updatePassengerTotal();
renderTravellerSummary();


/* =========================================
   SWAP LOCATIONS & SEARCH SUBMIT
========================================= */

const swapButton = document.querySelector("#swap-locations");
const originInput = document.querySelector("#origin");
const destinationInput = document.querySelector("#destination");

swapButton?.addEventListener("click", () => {
    if (!originInput || !destinationInput) return;

    const previousOrigin = originInput.value;

    originInput.value = destinationInput.value;
    destinationInput.value = previousOrigin;

    originInput.dispatchEvent(new Event("input", { bubbles: true }));
    destinationInput.dispatchEvent(new Event("input", { bubbles: true }));
    originInput.dispatchEvent(new Event("change", { bubbles: true }));
    destinationInput.dispatchEvent(new Event("change", { bubbles: true }));
});

const journeyForm = document.querySelector("#journey-search");

journeyForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();
    const departureInput = document.querySelector("#departure");
    const departureDate = departureInput.value;
    const returnDate = document.querySelector("#return-date");
    const travellers = document.querySelector("#travellers");
    const travelClass = document.querySelector("#travel-class");

    if (!origin) {
        alert("Please enter your starting city.");
        originInput.focus();
        return;
    }

    if (!destination) {
        alert("Please enter your destination.");
        destinationInput.focus();
        return;
    }

    if (origin.localeCompare(destination, undefined, { sensitivity: "base" }) === 0) {
        alert("Your destination must be different from your starting city.");
        destinationInput.focus();
        return;
    }

    if (!departureDate) {
        alert("Please select your departure date.");
        departureInput.focus();
        return;
    }

    if (departureDate < getTodayDate()) {
        alert("Departure date cannot be in the past.");
        departureInput.focus();
        return;
    }

    if (returnDate?.value && returnDate.value < departureDate) {
        alert("Return date cannot be earlier than your departure date.");
        returnDate.focus();
        return;
    }

    const params = new URLSearchParams({
        origin,
        destination,
        departure: departureDate,
        returnDate: returnDate?.value || "",
        travellers: travellers?.value || "1",
        adults: document.querySelector("#adults")?.value || "1",
        children: document.querySelector("#children")?.value || "0",
        infants: document.querySelector("#infants")?.value || "0",
        transport: getSelectedTransport(),
        travelClass: travelClass?.value || "all"
    });

    window.location.href = `search.html?${params.toString()}`;
});


/* =========================================
   DEPARTURE & RETURN DATE VALIDATION
========================================= */

const dateDepartureInput = document.querySelector("#departure");
const dateReturnInput = document.querySelector("#return-date");

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function updateDateLimits() {
    const today = getTodayDate();

    if (dateDepartureInput) {
        dateDepartureInput.min = today;
    }

    if (dateReturnInput) {
        dateReturnInput.min = dateDepartureInput?.value || today;

        if (dateReturnInput.value && dateReturnInput.value < dateReturnInput.min) {
            dateReturnInput.value = "";
        }
    }
}

updateDateLimits();
dateDepartureInput?.addEventListener("change", updateDateLimits);


/* =========================================
   LOGIN / SIGN UP VIEW
========================================= */

const authView = document.getElementById("auth-view");
const backHome = document.getElementById("back-home");
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authHeading = document.getElementById("auth-heading");
const authSubtitle = document.getElementById("auth-subtitle");
const authMessage = document.getElementById("auth-message");

const signupButton = document.querySelector(".SIGNUP-BTN");
const loginButton = document.querySelector(".LOGIN-BTN");

const signupPassword = document.getElementById("signup-password");
const signupDob = document.getElementById("signup-dob");

const homeHeader = document.querySelector("header");
const homeMain = document.querySelector("main");

function setAuthMode(mode) {
    const isLogin = mode === "login";

    if (loginForm) loginForm.hidden = !isLogin;
    if (signupForm) signupForm.hidden = isLogin;

    loginTab?.classList.toggle("ACTIVE", isLogin);
    signupTab?.classList.toggle("ACTIVE", !isLogin);

    if (authHeading) {
        authHeading.textContent = isLogin ? "Welcome back!" : "Join Us Today!";
    }

    if (authSubtitle) {
        authSubtitle.textContent = isLogin
            ? "Sign in to continue your journey."
            : "Create your account and plan your next adventure.";
    }

    if (authMessage) authMessage.textContent = "";
}

loginTab?.addEventListener("click", () => setAuthMode("login"));
signupTab?.addEventListener("click", () => setAuthMode("signup"));

// Return to search page (with query params) if arriving from search, otherwise homepage
backHome?.addEventListener("click", (event) => {
    event.preventDefault();

    try {
        const pending = JSON.parse(
            sessionStorage.getItem("yatripath-pending-booking") || "null"
        );
        if (pending?.returnTo && pending.returnTo.includes("search.html")) {
            window.location.href = pending.returnTo;
            return;
        }
    } catch {
        // Ignore storage parse errors
    }

    if (document.referrer.includes("search.html")) {
        window.location.href = document.referrer;
    } else {
        hideAuthPage();
    }
});

loginButton?.addEventListener("click", (event) => {
    event.preventDefault();
    showAuthPage("login");
});

signupButton?.addEventListener("click", (event) => {
    event.preventDefault();
    showAuthPage("signup");
});

// Password visibility toggle
document.querySelectorAll(".AUTH-TOGGLE").forEach((button) => {
    button.addEventListener("click", () => {
        const field = document.getElementById(button.dataset.password);
        if (!field) return;

        const showing = field.type === "text";
        field.type = showing ? "password" : "text";

        button.innerHTML = showing
            ? '<i class="fa-regular fa-eye" aria-hidden="true"></i>'
            : '<i class="fa-regular fa-eye-slash" aria-hidden="true"></i>';

        button.setAttribute("aria-pressed", String(!showing));
        button.setAttribute(
            "aria-label",
            showing ? "Show password" : "Hide password"
        );
    });
});

// Password requirements
const passwordRules = [
    { id: "rule-length", test: (value) => value.length >= 8, label: "At least 8 characters" },
    { id: "rule-upper", test: (value) => /[A-Z]/.test(value), label: "One uppercase letter (A–Z)" },
    { id: "rule-lower", test: (value) => /[a-z]/.test(value), label: "One lowercase letter (a–z)" },
    { id: "rule-number", test: (value) => /[0-9]/.test(value), label: "One number (0–9)" },
    { id: "rule-special", test: (value) => /[^A-Za-z0-9]/.test(value), label: "One special character (!@#$...)" }
];

function checkPassword(value) {
    let allValid = true;

    passwordRules.forEach((rule) => {
        const element = document.getElementById(rule.id);
        const passed = rule.test(value);

        if (element) {
            element.classList.toggle("PASS", passed);
            element.textContent = `${passed ? "✓" : "○"} ${rule.label}`;
        }

        if (!passed) allValid = false;
    });

    return allValid;
}

const passwordRulesBox = document.getElementById("password-rules");

signupPassword?.addEventListener("input", () => {
    const hasTyped = signupPassword.value.length > 0;
    if (passwordRulesBox) passwordRulesBox.hidden = !hasTyped;

    if (hasTyped) {
        checkPassword(signupPassword.value);
    } else {
        passwordRules.forEach((rule) => {
            const element = document.getElementById(rule.id);
            if (element) {
                element.classList.remove("PASS");
                element.textContent = `○ ${rule.label}`;
            }
        });
    }
});

// Prevent future birth dates
const todayString = getTodayDate();
if (signupDob) signupDob.max = todayString;

// OTP interface (placeholder until backend integration)
document.querySelectorAll("[data-otp]").forEach((button) => {
    button.addEventListener("click", () => {
        const type = button.dataset.otp;

        if (type === "email") {
            const email = document.getElementById("signup-email");
            if (email && !email.checkValidity()) {
                email.reportValidity();
                return;
            }
        }

        if (type === "phone") {
            const phone = document.getElementById("signup-phone");
            if (phone && (!phone.value.trim() || !phone.checkValidity())) {
                phone.reportValidity();
                return;
            }
        }

        if (authMessage) {
            authMessage.textContent =
                `The ${type} OTP service is not connected yet. ` +
                "We'll enable code delivery after integrating the authentication backend.";
        }
    });
});

// Login UI submission
loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (authMessage) {
        authMessage.textContent =
            "Your login form is ready. Real account authentication still needs to be connected.";
    }
});

// Signup UI submission
signupForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (signupPassword && !checkPassword(signupPassword.value)) {
        if (authMessage) {
            authMessage.textContent = "Please meet all five password requirements.";
        }
        signupPassword.focus();
        return;
    }

    if (signupDob && signupDob.value > todayString) {
        if (authMessage) {
            authMessage.textContent = "Date of birth cannot be in the future.";
        }
        signupDob.focus();
        return;
    }

    if (authMessage) {
        authMessage.textContent =
            "Your form passed the basic checks. Account creation and email/phone OTP verification still need to be connected.";
    }
});

function showAuthPage(mode = "login") {
    if (!authView) return;

    setAuthMode(mode);

    const targetHash = mode === "signup" ? "#signup" : "#login";
    if (window.location.hash !== targetHash) {
        history.replaceState(null, "", targetHash);
    }

    if (!authView.hidden) return;

    homeHeader?.classList.add("PAGE-EXIT");
    homeMain?.classList.add("PAGE-EXIT");

    setTimeout(() => {
        homeHeader?.setAttribute("hidden", "");
        homeMain?.setAttribute("hidden", "");

        homeHeader?.classList.remove("PAGE-EXIT");
        homeMain?.classList.remove("PAGE-EXIT");

        authView.hidden = false;
        authView.classList.add("PAGE-ENTER");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                authView.classList.remove("PAGE-ENTER");
            });
        });

        window.scrollTo({ top: 0, behavior: "auto" });
    }, 220);
}

function hideAuthPage() {
    if (!authView || authView.hidden) return;

    history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
    );

    authView.classList.add("PAGE-EXIT");

    setTimeout(() => {
        authView.hidden = true;
        authView.classList.remove("PAGE-EXIT");

        homeHeader?.removeAttribute("hidden");
        homeMain?.removeAttribute("hidden");

        homeHeader?.classList.add("PAGE-ENTER");
        homeMain?.classList.add("PAGE-ENTER");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                homeHeader?.classList.remove("PAGE-ENTER");
                homeMain?.classList.remove("PAGE-ENTER");
            });
        });

        if (authMessage) authMessage.textContent = "";

        window.scrollTo({ top: 0, behavior: "auto" });
    }, 220);
}

function restorePageFromURL() {
    const hash = window.location.hash.toLowerCase();

    if (hash === "#login") {
        showAuthPage("login");
    } else if (hash === "#signup") {
        showAuthPage("signup");
    } else {
        hideAuthPage();
    }
}

window.addEventListener("hashchange", restorePageFromURL);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restorePageFromURL);
} else {
    restorePageFromURL();
}
>>>>>>> Stashed changes
