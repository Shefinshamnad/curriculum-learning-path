const API_BASE_URL = "http://127.0.0.1:8000/api";

let modules = [];
let selectedIds = [];

const modulesContainer = document.getElementById(
    "modules-container"
);

const selectedPath = document.getElementById(
    "selected-path"
);

const alertContainer = document.getElementById(
    "alert-container"
);

const savePathButton = document.getElementById(
    "save-path-btn"
);


// Load modules when page loads
document.addEventListener(
    "DOMContentLoaded",
    loadModules
);


// ==========================================
// GET MODULES
// ==========================================

async function loadModules() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/modules/`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load modules."
            );
        }

        modules = await response.json();

        renderModules();
        renderSelectedPath();

    } catch (error) {
        console.error(error);

        modulesContainer.innerHTML = `
            <div class="alert alert-danger">
                Unable to load modules.
                Please make sure the Django server is running.
            </div>
        `;
    }
}


// ==========================================
// RENDER AVAILABLE MODULES
// ==========================================

function renderModules() {

    if (modules.length === 0) {
        modulesContainer.innerHTML = `
            <p class="text-muted">
                No modules are available.
            </p>
        `;

        return;
    }

    modulesContainer.innerHTML = modules
        .map(module => {

            const isSelected =
                selectedIds.includes(module.id);

            const prerequisite = module.prerequisite
                ? getModuleById(module.prerequisite)
                : null;

            return `
                <div class="card module-card mb-3">

                    <div class="card-body">

                        <div class="
                            d-flex
                            justify-content-between
                            align-items-start
                            gap-2
                            mb-2
                        ">

                            <h3 class="h5 module-title mb-0">
                                ${escapeHtml(module.title)}
                            </h3>

                            <span
                                class="badge ${getTierClass(module.tier)}
                                tier-badge"
                            >
                                ${escapeHtml(module.tier)}
                            </span>

                        </div>


                        <p class="
                            card-text
                            text-muted
                            module-description
                        ">
                            ${escapeHtml(module.description)}
                        </p>


                        ${
                            prerequisite
                                ? `
                                    <p class="
                                        text-muted
                                        prerequisite-text
                                        mb-3
                                    ">
                                        <strong>
                                            Prerequisite:
                                        </strong>
                                        ${escapeHtml(
                                            prerequisite.title
                                        )}
                                    </p>
                                `
                                : ""
                        }


                        <button
                            type="button"
                            class="
                                btn
                                ${
                                    isSelected
                                        ? "btn-outline-danger"
                                        : "btn-primary"
                                }
                                w-100
                            "
                            onclick="toggleModule(${module.id})"
                        >
                            ${
                                isSelected
                                    ? "Remove"
                                    : "Add to Plan"
                            }
                        </button>

                    </div>

                </div>
            `;
        })
        .join("");
}


// ==========================================
// ADD / REMOVE MODULE
// ==========================================

function toggleModule(moduleId) {

    const module = getModuleById(moduleId);

    if (!module) {
        return;
    }


    // -----------------------------
    // REMOVE MODULE
    // -----------------------------

    if (selectedIds.includes(moduleId)) {

        const dependentModule = modules.find(
            item =>
                item.prerequisite === moduleId &&
                selectedIds.includes(item.id)
        );

        if (dependentModule) {

            showAlert(
                `"${module.title}" cannot be removed while ` +
                `"${dependentModule.title}" is selected.`,
                "danger"
            );

            return;
        }

        selectedIds = selectedIds.filter(
            id => id !== moduleId
        );

    }

    // -----------------------------
    // ADD MODULE
    // -----------------------------

    else {

        if (
            module.prerequisite &&
            !selectedIds.includes(
                module.prerequisite
            )
        ) {

            const prerequisite =
                getModuleById(
                    module.prerequisite
                );

            const prerequisiteName =
                prerequisite
                    ? prerequisite.title
                    : "its prerequisite";

            showAlert(
                `"${module.title}" requires ` +
                `"${prerequisiteName}" to be selected first.`,
                "danger"
            );

            return;
        }

        selectedIds.push(moduleId);

        showAlert(
            `"${module.title}" added to your learning path.`,
            "success"
        );
    }


    renderModules();
    renderSelectedPath();
}


// ==========================================
// RENDER SELECTED PATH
// ==========================================

function renderSelectedPath() {

    if (selectedIds.length === 0) {

        selectedPath.innerHTML = `
            <div class="empty-path">

                <p class="text-muted mb-0">
                    Your learning path is empty.
                    Add modules from the left.
                </p>

            </div>
        `;

        return;
    }


    const selectedModules = selectedIds
        .map(id => getModuleById(id))
        .filter(Boolean);


    selectedPath.innerHTML =
        selectedModules
            .map((module, index) => {

                return `
                    <div class="
                        card
                        selected-module
                    ">

                        <div class="card-body">

                            <div class="
                                d-flex
                                align-items-center
                                gap-3
                            ">

                                <span
                                    class="badge bg-primary"
                                >
                                    ${index + 1}
                                </span>

                                <div>

                                    <h3 class="
                                        h6
                                        mb-1
                                    ">
                                        ${escapeHtml(
                                            module.title
                                        )}
                                    </h3>

                                    <small class="text-muted">
                                        ${escapeHtml(
                                            module.tier
                                        )}
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>
                `;
            })
            .join("");
}


// ==========================================
// SAVE PATH
// ==========================================

async function savePath() {

    savePathButton.disabled = true;

    savePathButton.innerHTML = `
        <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
        ></span>
        Saving...
    `;


    try {

        const response = await fetch(
            `${API_BASE_URL}/save-path/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    selected_ids: selectedIds
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            const errorMessage =
                getApiErrorMessage(data);

            throw new Error(errorMessage);
        }


        showAlert(
            "Learning path saved successfully!",
            "success"
        );


    } catch (error) {

        console.error(error);

        showAlert(
            error.message ||
            "Unable to save learning path.",
            "danger"
        );

    } finally {

        savePathButton.disabled = false;

        savePathButton.innerHTML =
            "Save Learning Path";
    }
}


savePathButton.addEventListener(
    "click",
    savePath
);


// ==========================================
// ALERT
// ==========================================

function showAlert(message, type) {

    alertContainer.innerHTML = `
        <div
            class="alert alert-${type}
                   alert-dismissible
                   fade
                   show"
            role="alert"
        >

            ${escapeHtml(message)}

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
            ></button>

        </div>
    `;


    setTimeout(() => {

        const alert =
            alertContainer.querySelector(
                ".alert"
            );

        if (alert) {
            alert.remove();
        }

    }, 4000);
}


// ==========================================
// HELPERS
// ==========================================

function getModuleById(moduleId) {

    return modules.find(
        module => module.id === moduleId
    );
}


function getTierClass(tier) {

    switch (tier.toLowerCase()) {

        case "beginner":
            return "bg-success";

        case "intermediate":
            return "bg-warning text-dark";

        case "advanced":
            return "bg-danger";

        default:
            return "bg-secondary";
    }
}


function getApiErrorMessage(data) {

    if (
        data.errors &&
        data.errors.selected_ids
    ) {

        return data.errors.selected_ids.join(" ");
    }

    return "Unable to save the learning path.";
}


function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}

