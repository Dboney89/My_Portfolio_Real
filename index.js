document.addEventListener('DOMContentLoaded', () => {

    // ===========================================
    // Navbar & Mobile Menu
    // ===========================================
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // ===========================================
    // About Me Modal (including expanded profile picture)
    // ===========================================
    const profilePic = document.getElementById('profile-pic');
    const aboutMeModal = document.getElementById('about-me-modal');
    const aboutMeProfilePic = document.getElementById('about-me-profile-pic');
    const aboutMeCloseBtn = document.getElementById('about-me-close');
    // Renamed for clarity, assuming this is the same modal as aboutMeModal
    const expandedProfilePicModal = aboutMeModal; // Or get a different ID if it's truly separate
    // No dedicated image element needed here as aboutMeProfilePic is used

    if (profilePic && aboutMeModal && aboutMeCloseBtn && aboutMeProfilePic) {
        profilePic.addEventListener('click', () => {
            aboutMeModal.classList.remove('hidden'); // This makes the modal visible
            document.body.classList.add('overflow-hidden'); // Prevents background scrolling
            aboutMeProfilePic.src = profilePic.src; // Sets the modal's internal profile pic
            aboutMeProfilePic.alt = profilePic.alt; // Set alt text for accessibility
        });
        aboutMeCloseBtn.addEventListener('click', () => {
            aboutMeModal.classList.add('hidden'); // This hides the modal
            document.body.classList.remove('overflow-hidden');
        });
        aboutMeModal.addEventListener('click', (event) => {
            if (event.target === aboutMeModal) { // Close when clicking outside the content
                aboutMeModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    }


    // ===========================================
    // Gallery Modal & Lightbox
    // ===========================================
    const openGalleryBtns = document.querySelectorAll('.open-gallery-btn');
    const galleryModal = document.getElementById('gallery-modal');
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    const galleryLightboxModal = document.getElementById('gallery-lightbox-modal');
    const galleryLightboxImg = document.getElementById('gallery-lightbox-img');
    const closeGalleryLightboxBtn = document.getElementById('close-gallery-lightbox-btn');
    const prevGalleryArrow = document.querySelector('#gallery-lightbox-modal .prev-arrow');
    const nextGalleryArrow = document.querySelector('#gallery-lightbox-modal .next-arrow');

    let allGalleryImages = [];
    let currentGalleryImageIndex = -1;
    let isGalleryImageZoomed = false; // Retaining zoom for main gallery

    function resetGalleryImageZoom() {
        if (isGalleryImageZoomed) {
            galleryLightboxImg.style.transform = 'scale(1)';
            galleryLightboxImg.classList.remove('zoomed');
            galleryLightboxImg.classList.add('zoomable');
            isGalleryImageZoomed = false;
        }
    }

    // Consistent close function for gallery lightbox
    function closeGalleryLightbox() {
        if (galleryLightboxModal) {
            galleryLightboxModal.classList.add('hidden');
            if (galleryLightboxImg) galleryLightboxImg.src = '';
            document.body.classList.remove('overflow-hidden'); // Ensure body overflow is reset
            resetGalleryImageZoom();
        }
    }


    openGalleryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (galleryModal) {
                galleryModal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
                // Capture all gallery images when the main gallery modal opens
                allGalleryImages = Array.from(document.querySelectorAll('#gallery-modal .gallery-img'))
                    .map(img => img.src);
            }
            if (mobileMenu) mobileMenu.classList.add('hidden'); // Close mobile menu if open
        });
    });

    if (closeGalleryBtn) {
        closeGalleryBtn.addEventListener('click', () => {
            if (galleryModal) galleryModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            currentGalleryImageIndex = -1; // Reset index when main gallery closes
            // Ensure lightbox is also closed if open when main gallery closes
            closeGalleryLightbox();
        });
    }
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                currentGalleryImageIndex = -1;
                closeGalleryLightbox(); // Ensure lightbox is closed if clicking outside main gallery
            }
        });
    }

    function attachGalleryImageExpand() {
        // Use event delegation or re-attach if images are dynamic
        document.querySelectorAll('#gallery-modal .gallery-img').forEach((img, index) => {
            img.onclick = function() {
                if (galleryLightboxImg && galleryLightboxModal) {
                    galleryLightboxImg.src = this.src;
                    galleryLightboxImg.alt = this.alt; // Set alt text for accessibility
                    galleryLightboxModal.classList.remove('hidden');
                    document.body.classList.add('overflow-hidden'); // Prevent background scrolling
                    currentGalleryImageIndex = index;
                    resetGalleryImageZoom();
                }
            };
        });
    }
    attachGalleryImageExpand(); // Attach on initial load

    if (closeGalleryLightboxBtn) {
        closeGalleryLightboxBtn.addEventListener('click', closeGalleryLightbox);
    }
    if (galleryLightboxModal) {
        galleryLightboxModal.addEventListener('click', (e) => {
            if (e.target === galleryLightboxModal) {
                closeGalleryLightbox();
            }
        });
    }

    function navigateGalleryLightboxImage(direction) {
        if (allGalleryImages.length === 0 || currentGalleryImageIndex === -1) return;

        let newIndex = currentGalleryImageIndex;
        if (direction === 'left') {
            newIndex = (currentGalleryImageIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
        } else if (direction === 'right') {
            newIndex = (currentGalleryImageIndex + 1) % allGalleryImages.length;
        }

        if (newIndex !== currentGalleryImageIndex) {
            currentGalleryImageIndex = newIndex;
            if (galleryLightboxImg) {
                galleryLightboxImg.src = allGalleryImages[currentGalleryImageIndex];
                resetGalleryImageZoom();
            }
        }
    }

    if (prevGalleryArrow) {
        prevGalleryArrow.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent modal from closing if clicking arrow area
            navigateGalleryLightboxImage('left');
        });
    }
    if (nextGalleryArrow) {
        nextGalleryArrow.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent modal from closing if clicking arrow area
            navigateGalleryLightboxImage('right');
        });
    }

    // Gallery Image Zoom functionality
    if (galleryLightboxImg) {
        galleryLightboxImg.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent lightbox from closing when clicking the image itself
            if (this.classList.contains('zoomable')) { // Check if it's currently zoomable
                this.style.transform = 'scale(1.5)';
                this.classList.remove('zoomable');
                this.classList.add('zoomed');
                isGalleryImageZoomed = true;
            } else if (this.classList.contains('zoomed')) { // Check if it's currently zoomed
                this.style.transform = 'scale(1)';
                this.classList.remove('zoomed');
                this.classList.add('zoomable');
                isGalleryImageZoomed = false;
            }
        });
    }

    // ===========================================
    // Swiper Initialization
    // ===========================================
    const mySwiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
            1280: {
                slidesPerView: 3,
                spaceBetween: 40
            }
        }
    });


    // ===========================================
    // Project Details Modal & Lightbox
    // ===========================================

    const projectDetailsModal = document.getElementById('project-modal');
    const projectModalCloseBtn = document.getElementById('modal-close');
    const modalContentDiv = document.getElementById('modal-content');
    const projectLightbox = document.getElementById('lightbox');
    const projectLightboxImg = document.getElementById('lightbox-img');
    const projectLightboxCloseBtn = document.getElementById('lightbox-close');
    const prevProjectArrow = document.querySelector('#lightbox .prev-arrow');
    const nextProjectArrow = document.querySelector('#lightbox .next-arrow');
    const downloadProjectImageBtn = document.getElementById('download-project-image-btn');

    let currentProjectImages = [];
    let currentProjectImageIndex = -1;

    // Function to generate a tech icon based on tech name
    const getTechIcon = (techName) => {
        switch (techName.toLowerCase()) {
            case 'html5':
                return '<i class="fab fa-html5 text-orange-600"></i>';
            case 'css3':
                return '<i class="fab fa-css3-alt text-blue-600"></i>';
            case 'javascript':
                return '<i class="fab fa-js-square text-yellow-500"></i>';
            case 'php':
                return '<i class="fab fa-php text-purple-600"></i>';
            case 'mysql':
                return '<i class="fas fa-database text-gray-700"></i>';
            case 'bootstrap css':
                return '<i class="fab fa-bootstrap text-indigo-700"></i>';
            case 'tailwind css':
                return '<i class="fas fa-wind text-cyan-500"></i>';
            case 'uml':
                return '<i class="fas fa-project-diagram text-green-700"></i>';
            case 'ai tools':
                return '<i class="fas fa-robot text-red-500"></i>';
            case 'chart js':
                return '<i class="fas fa-chart-bar text-green-500"></i>';
            case 'jquery':
                return '<i class="fab fa-js text-blue-500"></i>';
            case 'alpine js':
                return '<i class="fas fa-mountain text-blue-400"></i>';
            case 'responsive design':
                return '<i class="fas fa-mobile-alt text-gray-600"></i>';
            case 'authentication':
                return '<i class="fas fa-user-lock text-gray-600"></i>';
            case 'restful api':
                return '<i class="fas fa-server text-green-500"></i>';
            case 'arduino':
                return '<i class="fas fa-microchip text-blue-500"></i>';
            case 'esp32':
                return '<i class="fas fa-wifi text-blue-700"></i>';
            case 'iot':
                return '<i class="fas fa-cloud-upload-alt text-gray-500"></i>';
            case 'c++':
                return '<i class="fas fa-code text-blue-800"></i>';
            case 'solar power':
                return '<i class="fas fa-sun text-yellow-400"></i>';
            case 'cloud computing':
                return '<i class="fas fa-cloud text-blue-400"></i>';
            case 'swiper.js':
                return '<i class="fas fa-sliders-h text-purple-500"></i>';
            case 'laravel':
                return '<i class="fab fa-laravel text-red-700"></i>';
            case 'stripe api (mock)':
                return '<i class="fab fa-stripe text-indigo-600"></i>';
            case 'dom manipulation':
                return '<i class="fas fa-mouse-pointer text-purple-500"></i>';
            case 'blynk':
                return '<i class="fas fa-sliders-h text-purple-500"></i>';
            default:
                return '<i class="fas fa-code text-gray-500"></i>';
        }
    };

    function closeProjectModal() {
        if (projectDetailsModal) {
            projectDetailsModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden'); // Use classList for consistency
            if (modalContentDiv) modalContentDiv.innerHTML = '';
            closeProjectLightbox(); // Ensure lightbox is closed if main modal closes
        }
    }

    // Function to show project-specific image lightbox
    window.showProjectLightbox = function(src, alt = '') { // Added alt parameter for accessibility
        if (projectLightbox && projectLightboxImg) {
            projectLightboxImg.src = src;
            projectLightboxImg.alt = alt; // Set alt text
            projectLightbox.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');

            currentProjectImageIndex = currentProjectImages.indexOf(src);
            // Update the download button's href
            if (downloadProjectImageBtn) {
                downloadProjectImageBtn.href = src;
                const fileName = src.split('/').pop(); // Get filename from URL
                downloadProjectImageBtn.download = fileName; // Set download attribute
            }
        }
    }

    function closeProjectLightbox() {
        if (projectLightbox) projectLightbox.classList.add('hidden');
        if (projectLightboxImg) projectLightboxImg.src = '';
        currentProjectImageIndex = -1;
        // Only remove overflow-hidden if NO other modals are open
        if (projectDetailsModal && projectDetailsModal.classList.contains('hidden') &&
            galleryLightboxModal && galleryLightboxModal.classList.contains('hidden') &&
            galleryModal && galleryModal.classList.contains('hidden') &&
            expandedProfilePicModal && expandedProfilePicModal.classList.contains('hidden')
        ) {
            document.body.classList.remove('overflow-hidden');
        }
    }

    if (projectLightboxCloseBtn) {
        projectLightboxCloseBtn.addEventListener('click', closeProjectLightbox);
    }
    if (projectLightbox) {
        projectLightbox.addEventListener('click', function(e) {
            // Only close if the click is directly on the lightbox background, not the image or arrows
            if (e.target === this || e.target === projectLightboxImg || e.target.closest('.lightbox-navigation')) {
                // Modified to not close if clicking image or navigation arrows
                if (e.target === this) {
                    closeProjectLightbox();
                }
            }
        });
    }

    function navigateProjectLightboxImage(direction) {
        if (currentProjectImages.length === 0 || currentProjectImageIndex === -1) return;

        let newIndex = currentProjectImageIndex;
        if (direction === 'left') {
            newIndex = (currentProjectImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
        } else if (direction === 'right') {
            newIndex = (currentProjectImageIndex + 1) % currentProjectImages.length;
        }

        if (newIndex !== currentProjectImageIndex) {
            currentProjectImageIndex = newIndex;
            if (projectLightboxImg) {
                projectLightboxImg.src = currentProjectImages[currentProjectImageIndex];
                // Alt text is usually embedded in data attributes on the original image,
                // you might need to pass it or derive it if necessary.
                // For simplicity, using a generic alt if not available
                projectLightboxImg.alt = `Project Image ${currentProjectImageIndex + 1}`;

                // Update the download button's href for the new image
                if (downloadProjectImageBtn) {
                    downloadProjectImageBtn.href = currentProjectImages[currentProjectImageIndex];
                    const fileName = currentProjectImages[currentProjectImageIndex].split('/').pop();
                    downloadProjectImageBtn.download = fileName;
                }
            }
        }
    }

    if (prevProjectArrow) {
        prevProjectArrow.addEventListener('click', (event) => {
            event.stopPropagation();
            navigateProjectLightboxImage('left');
        });
    }
    if (nextProjectArrow) {
        nextProjectArrow.addEventListener('click', (event) => {
            event.stopPropagation();
            navigateProjectLightboxImage('right');
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (projectLightbox && !projectLightbox.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') {
                navigateProjectLightboxImage('left');
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                navigateProjectLightboxImage('right');
                e.preventDefault();
            } else if (e.key === 'Escape') {
                closeProjectLightbox();
            }
        } else if (galleryLightboxModal && !galleryLightboxModal.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') {
                navigateGalleryLightboxImage('left');
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                navigateGalleryLightboxImage('right');
                e.preventDefault();
            } else if (e.key === 'Escape') {
                closeGalleryLightbox(); // Using the consistent function
                e.preventDefault();
            }
        } else if (projectDetailsModal && !projectDetailsModal.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeProjectModal();
            }
        } else if (galleryModal && !galleryModal.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                galleryModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                // Ensure no lightbox is open when main gallery closes
                closeGalleryLightbox();
            }
        } else if (expandedProfilePicModal && !expandedProfilePicModal.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                expandedProfilePicModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        } else if (e.target.closest('#projects')) { // Only navigate Swiper if focus is within #projects
            if (e.key === 'ArrowLeft') {
                mySwiper.slidePrev();
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                mySwiper.slideNext();
                e.preventDefault();
            }
        }
    });

    // Attach event listener for the "View Details" buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.dataset.title;
            const videoUrl = this.dataset.video;
            const description = this.dataset.desc;
            const imageUrls = this.dataset.imgs ? this.dataset.imgs.split(',').map(url => url.trim()) : [];
            const technologies = this.dataset.tech ? this.dataset.tech.split(',').map(tech => tech.trim()) : [];
            const pdfLink = this.dataset.pdfLink; // Retrieve the PDF link

            currentProjectImages = imageUrls;
            currentProjectImageIndex = -1;

            let descriptionSectionHtml = '';
            if (description) {
                descriptionSectionHtml = `
                    <div class="mb-4 pt-4 border-t border-gray-200">
                        <h3 class="text-lg font-semibold mb-2 text-gray-800">Project Description:</h3>
                        <p class="text-gray-700">${description}</p>
                    </div>
                `;
            }

            let technologiesHtml = '';
            if (technologies.length > 0) {
                technologiesHtml = `
                    <div class="pt-4 border-t border-gray-200">
                        <h3 class="text-lg font-semibold mb-2 text-gray-800">Technologies Used:</h3>
                        <div id="modalTechnologiesContainer" class="flex flex-wrap gap-2 mb-4">
                `;
                technologies.forEach(tech => {
                    const icon = getTechIcon(tech.trim());
                    technologiesHtml += `
                        <span class="flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            ${icon} <span>${tech}</span>
                        </span>
                    `;
                });
                technologiesHtml += `
                        </div>
                        <button id="toggleModalTechBtn" class="mx-auto block bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded text-sm mt-2 transition-colors">
                            Hide Technologies
                        </button>
                    </div>
                `;
            }

            let thumbsSectionHtml = '';
            if (imageUrls.length > 0 && imageUrls[0] !== '') {
                thumbsSectionHtml = `
                    <div class="mb-4 pt-4 border-t border-gray-200">
                        <h3 class="text-lg font-semibold mb-2 text-gray-800">Project Screenshots:</h3>
                        <div class="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                `;
                imageUrls.forEach((src, i) => {
                    // Pass alt text to showProjectLightbox
                    const altText = `${title} image ${i+1}`;
                    thumbsSectionHtml += `
                        <img src="${src}" alt="${altText}"
                            class="flex-shrink-0 w-28 h-20 md:w-32 md:h-24 rounded-md shadow-sm cursor-pointer hover:scale-105 transition-transform object-cover"
                            onclick="showProjectLightbox('${src}', '${altText}')" />
                    `;
                });
                thumbsSectionHtml += `
                        </div>
                    </div>
                `;
            }

            let pdfDownloadHtml = '';
            if (pdfLink) {
                const fileName = pdfLink.split('/').pop();
                pdfDownloadHtml = `
                    <div class="mb-4 pt-4 border-t border-gray-200 text-center">
                        <a href="${pdfLink}" download="${fileName}"
                           class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            <i class="fas fa-file-pdf mr-2"></i>
                            Download Project Document
                        </a>
                    </div>
                `;
            }


            let modalHtml = `
                <h2 class="text-2xl font-bold mb-4 text-blue-700 text-center">${title}</h2>
            `;
            if (videoUrl && videoUrl.includes('youtube.com/')) { // Simplified YouTube check
                const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                if (videoIdMatch && videoIdMatch[1]) {
                    modalHtml += `
                        <div class="aspect-video w-full mb-4 rounded-md overflow-hidden shadow-md">
                            <iframe src="https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full"></iframe>
                        </div>
                    `;
                }
            } else if (videoUrl) {
                modalHtml += `
                    <div class="aspect-video w-full mb-4 rounded-md overflow-hidden shadow-md">
                        <video controls class="w-full h-full">
                            <source src="${videoUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            }

            modalHtml += `
                ${descriptionSectionHtml}
                ${thumbsSectionHtml}
                ${technologiesHtml}
                ${pdfDownloadHtml}
            `;
            
            if (modalContentDiv) {
                modalContentDiv.innerHTML = modalHtml;

                const newlyCreatedToggleBtn = document.getElementById('toggleModalTechBtn');
                const newlyCreatedTechContainer = document.getElementById('modalTechnologiesContainer');

                if (newlyCreatedToggleBtn && newlyCreatedTechContainer) {
                    newlyCreatedToggleBtn.addEventListener('click', () => {
                        newlyCreatedTechContainer.classList.toggle('hidden');
                        if (newlyCreatedTechContainer.classList.contains('hidden')) {
                            newlyCreatedToggleBtn.textContent = 'Show Technologies';
                        } else {
                            newlyCreatedToggleBtn.textContent = 'Hide Technologies';
                        }
                    });
                }
            }

            if (projectDetailsModal) {
                projectDetailsModal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden'); // Use classList for consistency
            }
        });
    });

    if (projectModalCloseBtn) {
        projectModalCloseBtn.addEventListener('click', closeProjectModal);
    }
    if (projectDetailsModal) {
        projectDetailsModal.addEventListener('click', function(e) {
            // Only close if the click is directly on the modal background
            if (e.target === this) closeProjectModal();
        });
    }

});