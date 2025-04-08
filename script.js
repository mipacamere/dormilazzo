document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery');
  const modal = document.getElementById("imageModal") || document.querySelector('.modal');
  const modalImage = document.getElementById("modalImage") || document.querySelector('.modal-image');
  const closeBtn = document.querySelector('.close');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  let currentIndex = 0;
  const images = document.querySelectorAll('.thumbnail');
  
  // Add image overlay elements to each container
  document.querySelectorAll('.image-container').forEach((container, index) => {
    const thumbnail = container.querySelector('.thumbnail');
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    
    const title = document.createElement('h3');
    title.className = 'image-title';
    title.textContent = thumbnail.alt || `Image ${index + 1}`;
    
    overlay.appendChild(title);
    container.appendChild(overlay);
    
    // Apply lazy loading
    thumbnail.loading = 'lazy';
    
    // Add skeleton loading effect
    container.classList.add('skeleton');
    thumbnail.onload = () => {
      container.classList.remove('skeleton');
    };
  });
  
  // Open modal when clicking on an image
  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      openModal(img, index);
    });
  });
  
  // Close modal
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex' && !modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
  
  // Previous image
  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigate(-1));
  }
  
  // Next image
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigate(1));
  }
  
  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      navigate(1); // Swipe left, next image
    }
    if (touchEndX > touchStartX + 50) {
      navigate(-1); // Swipe right, previous image
    }
  }
  
  // Function to open modal (compatible with original code)
  function openModal(imageElement, index = null) {
    if (index !== null) {
      currentIndex = index;
    } else {
      // Find the index if not provided
      currentIndex = Array.from(images).findIndex(img => img === imageElement);
      if (currentIndex === -1) currentIndex = 0;
    }
    
    // Update the modal image
    const highResUrl = imageElement.dataset.highres || imageElement.src;
    modalImage.src = highResUrl;
    modalImage.alt = imageElement.alt || '';
    
    // Show the modal
    modal.style.display = "flex";
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    // Preload next and previous images
    preloadImage(currentIndex - 1);
    preloadImage(currentIndex + 1);
  }
  
  // Function to close modal (compatible with original code)
  function closeModal() {
    modal.style.display = "none";
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  function updateModal(index) {
    const img = images[index];
    
    // Preload the image at high resolution
    const highResUrl = img.dataset.highres || img.src;
    modalImage.src = highResUrl;
    modalImage.alt = img.alt;
    
    // Preload next and previous images
    preloadImage(index - 1);
    preloadImage(index + 1);
  }
  
  function preloadImage(index) {
    if (index >= 0 && index < images.length) {
      const img = new Image();
      img.src = images[index].dataset.highres || images[index].src;
    }
  }
  
  function navigate(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    updateModal(currentIndex);
  }
  
  // Intersection Observer for lazy loading
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('.thumbnail');
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.dataset.src = '';
        }
        imageObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });
  
  document.querySelectorAll('.image-container').forEach(container => {
    imageObserver.observe(container);
  });
  
  // Make the openModal and closeModal functions globally available
  window.openModal = openModal;
  window.closeModal = closeModal;
});
