
document.addEventListener("DOMContentLoaded", function () {
    const revealItems = document.querySelectorAll(".info-card, .stat-card, .project-card, .timeline-item");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealItems.forEach(item => {
            item.classList.add("reveal-ready");
            revealObserver.observe(item);
        });
    }

    const scrollProgress = document.querySelector(".scroll-progress");

    function updateScrollProgress() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        if (scrollProgress) {
            scrollProgress.style.width = progress + "%";
        }
    }

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    const photoImages = document.querySelectorAll(".project-image img");

    if (photoImages.length > 0) {
        const lightbox = document.createElement("div");
        lightbox.className = "image-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Photo preview");
        lightbox.innerHTML = `
            <button class="lightbox-close" type="button" aria-label="Close photo preview">&times;</button>
            <img class="lightbox-image" src="" alt="">
        `;
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector(".lightbox-image");
        const closeButton = lightbox.querySelector(".lightbox-close");

        function openLightbox(image) {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightbox.classList.add("active");
            document.body.classList.add("lightbox-open");
            closeButton.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove("active");
            document.body.classList.remove("lightbox-open");
            lightboxImage.src = "";
        }

        photoImages.forEach(image => {
            image.setAttribute("tabindex", "0");
            image.setAttribute("role", "button");
            image.setAttribute("aria-label", "Zoom " + (image.alt || "project photo"));

            image.addEventListener("click", () => openLightbox(image));
            image.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(image);
                }
            });
        });

        closeButton.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    // Get all navigation links
    const navLinks = document.querySelectorAll(".nav-link");

    // Get all content sections
    const sections = document.querySelectorAll(
        ".content-section > div[id]"
    );

    // Highlight selected navigation
    function setActiveLink(id) {

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
            }

        });

    }

    // Click navigation
    navLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(null, "", targetId);

                setActiveLink(targetId.substring(1));

            }

        });

    });

    // Update navigation while scrolling
    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }

        });

    }, {
        rootMargin: "-25% 0px -65% 0px"
    });

    sections.forEach(section => {
        observer.observe(section);
    });

});

// =================================
// COMPANY IMAGE GALLERY
// =================================

const galleryImages = [
    {
        src: "gallery1.png",
        caption: "Company Activity"
    },
    {
        src: "gallery2.png",
        caption: "CCTV Project"
    },
    {
        src: "gallery3.png",
        caption: "AI Simulation Demonstration"
    },
    {
        src: "gallery4.png",
        caption: "Company Event"
    }
];

let currentImage = 0;

function displayImage(index) {
    const image = document.getElementById("galleryImage");
    const caption = document.getElementById("galleryCaption");
    const dots = document.getElementById("galleryDots");

    if (!image || !caption || !dots) return;

    image.src = galleryImages[index].src;
    caption.textContent = galleryImages[index].caption;

    dots.innerHTML = "";

    galleryImages.forEach((item, i) => {
        const dot = document.createElement("span");

        dot.className = "gallery-dot";

        if (i === index) {
            dot.classList.add("active");
        }

        dot.onclick = function () {
            currentImage = i;
            displayImage(currentImage);
        };

        dots.appendChild(dot);
    });
}

function changeImage(direction) {
    currentImage += direction;

    if (currentImage >= galleryImages.length) {
        currentImage = 0;
    }

    if (currentImage < 0) {
        currentImage = galleryImages.length - 1;
    }

    displayImage(currentImage);
}

displayImage(currentImage);
