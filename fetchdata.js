// fetchdata.js - With corrected image paths

// Global variable to store businesses data
let businesses = [];

// Function to fetch data from businesses.json
async function fetchBusinesses() {
    try {
        const response = await fetch("businesses.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        businesses = await response.json();

        // Correct image paths
        businesses = businesses.map((business) => {
            // Extract just the filename from the path
            const imagePath = business.image.split("/").pop();
            // Build correct path based on your actual file structure
            return {
                ...business,
                image: `assets/images/${imagePath}`,
            };
        });

        renderListings(); // Initial render after data is loaded
    } catch (error) {
        console.error("Error fetching businesses data:", error);
        document.getElementById("listings").innerHTML =
            '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#666;font-size:1.2rem;">Failed to load businesses. Please try again later.</div>';
    }
}

// Function to render listings with optional filtering
function renderListings(filter = "", sector = "", status = "") {
    const listings = document.getElementById("listings");

    // Apply grid layout to listings container
    listings.style.display = "grid";
    listings.style.gridTemplateColumns =
        "repeat(auto-fill, minmax(300px, 1fr))";
    listings.style.gap = "20px";
    listings.style.padding = "20px";

    listings.innerHTML = "";

    // Show loading state if data isn't loaded yet
    if (businesses.length === 0) {
        listings.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:#666;font-size:1.2rem;">
                Loading businesses...
            </div>
        `;
        return;
    }

    // Filter and render businesses
    const filteredBusinesses = businesses.filter(
        (b) =>
            b.name.toLowerCase().includes(filter.toLowerCase()) &&
            (!sector || b.sector === sector) &&
            (!status ||
                (status === "Home Furniture" && b.status === "company") ||
                (status === "Office Furniture" &&
                    b.status === "individual person"))
    );

    if (filteredBusinesses.length === 0) {
        listings.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:#666;font-size:1.2rem;">
                No businesses match your search criteria.
            </div>
        `;
        return;
    }

    filteredBusinesses.forEach((b) => {
        const card = document.createElement("div");
        // Card container styling
        card.style.border = "1px solid #e0e0e0";
        card.style.borderRadius = "8px";
        card.style.overflow = "hidden";
        card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
        card.style.backgroundColor = "#fff";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.height = "100%";

        // Add hover effect
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-5px)";
            card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.boxShadow = "";
        });

        // Create image element if image exists
        let imageHtml = "";
        if (b.image) {
            imageHtml = `
                <div style="width:100%;height:200px;overflow:hidden;">
                    <img src="${b.image}" alt="${b.name}" 
                         style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s ease;"
                         onload="this.style.opacity=1" 
                         onerror="this.style.display='none'">
                </div>
            `;
        }

        // Status indicator
        const statusIndicator =
            b.status === "individual person"
                ? `<span style="position:absolute;top:10px;right:10px;background:#4CAF50;color:white;padding:3px 8px;border-radius:12px;font-size:0.7rem;">Individual</span>`
                : `<span style="position:absolute;top:10px;right:10px;background:#2196F3;color:white;padding:3px 8px;border-radius:12px;font-size:0.7rem;">Company</span>`;

        card.innerHTML = `
            <div style="position:relative;">
                ${imageHtml}
                ${statusIndicator}
            </div>
            <div style="padding:15px;flex-grow:1;display:flex;flex-direction:column;">
                <h2 style="margin:0 0 10px 0;color:#333;font-size:1.2rem;">${
                    b.name
                }</h2>
                <p style="margin:0 0 8px 0;color:#666;font-size:0.9rem;">
                    <strong>Sector:</strong> ${b.sector}
                </p>
                <p style="margin:0 0 15px 0;color:#444;font-size:0.95rem;flex-grow:1;">${
                    b.desc
                }</p>
                
                <div style="display:flex;flex-direction:column;gap:8px;margin-top:auto;">
                    ${
                        b.social
                            ? `
                        <a href="${b.social}" target="_blank" 
                           style="color:#0066cc;text-decoration:none;font-size:0.9rem;display:flex;align-items:center;gap:5px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#0066cc">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                            </svg>
                            Social Profile
                        </a>
                    `
                            : ""
                    }
                    
                    ${
                        b.email
                            ? `
                        <a href="mailto:${b.email}" 
                           style="color:#0066cc;text-decoration:none;font-size:0.9rem;display:flex;align-items:center;gap:5px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#0066cc">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <path d="M22 6l-10 7L2 6" stroke="#0066cc" stroke-width="2" fill="none"/>
                            </svg>
                            ${b.email}
                        </a>
                    `
                            : ""
                    }
                    
                    ${
                        b.mobile
                            ? `
                        <a href="tel:${b.mobile.replace(/\D/g, "")}" 
                           style="color:#0066cc;text-decoration:none;font-size:0.9rem;display:flex;align-items:center;gap:5px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#0066cc">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            ${b.mobile}
                        </a>
                    `
                            : ""
                    }
                </div>
            </div>
        `;
        listings.appendChild(card);
    });
}

// Event listeners for search and filter
document
    .getElementById("search")
    .addEventListener("input", (e) =>
        renderListings(
            e.target.value,
            document.getElementById("sectorFilter").value,
            document.getElementById("statusFilter").value
        )
    );

document
    .getElementById("sectorFilter")
    .addEventListener("change", (e) =>
        renderListings(
            document.getElementById("search").value,
            e.target.value,
            document.getElementById("statusFilter").value
        )
    );

// Add new event listener for status filter
document
    .getElementById("statusFilter")
    .addEventListener("change", (e) =>
        renderListings(
            document.getElementById("search").value,
            document.getElementById("sectorFilter").value,
            e.target.value
        )
    );
// Initialize the page by fetching data
document.addEventListener("DOMContentLoaded", fetchBusinesses);
