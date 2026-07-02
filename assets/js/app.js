// 0b. Footer Component
const footerHTML = /* html */`
<footer class="footer-one">
  <div class="container">
    <div class="row">

      <!-- Horários -->
      <div class="col" style="min-width: 200px;">
        <h5 class="mb-4 text-primary">Horário de funcionamento</h5>
        <ul class="timing-list">
          <li>Segunda-feira <span>Fechado</span></li>
          <li>Terça-feira   <span>12:00 – 00:00</span></li>
          <li>Quarta-feira  <span>12:00 – 00:00</span></li>
          <li>Quinta-feira  <span>12:00 – 00:00</span></li>
          <li>Sexta-feira   <span>12:00 – 00:00</span></li>
          <li>Sábado        <span>12:00 – 00:00</span></li>
          <li>Domingo       <span>12:00 – 00:00</span></li>
        </ul>
      </div>

      <hr class="mt-5 mb-4 border-secondary">

      <!-- Páginas -->
      <div class="col-lg-2" style="min-width: 120px;">
        <h5 class="mb-4 text-primary">Páginas</h5>
        <ul class="footer-links">
          <li><a href="index.html" class="btn-link">Home</a></li>
          <li><a href="about.html" class="btn-link">Sobre nós</a></li>
          <li><a href="menu-classic.html" class="btn-link">Menu</a></li>
          <li><a href="gallery.html" class="btn-link">Galeria</a></li>
          <li><a href="contact.html" class="btn-link">Contato</a></li>
        </ul>
      </div>

      <!-- Informações -->
      <div class="col" style="min-width: 120px;">
        <h5 class="mb-4 text-primary">Informações</h5>
        <p class="text-white-50">
          Email: contato@tamojuntobotequim.com.br<br>
          Tel: (71) 9 8719-1420
        </p>
        <div class="social-links mt-3">
          <a style="margin-left: -15px; background: none !important;" class="navbar-brand"
            href="https://comidadibuteco.com.br/buteco/tamo-junto-botequim/"
            aria-label="Selo Comida di Buteco">
            <img style="max-height: 60px;" src="./assets/images/selo.png" alt="Selo Comida di Buteco" />
          </a>
        </div>
      </div>

      <!-- Unidades -->
      <div class="col-lg-6">
        <h5 class="mb-4 text-primary">Nossas Unidades</h5>
        <ul style="list-style: none; padding: 0;">

          <li class="mb-3">
            <a href="https://www.instagram.com/tamojuntobotequimofc3" class="btn btn-outline-light me-2"
              target="_blank" rel="noopener" aria-label="Instagram – Unidade Resgate">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="https://maps.app.goo.gl/jZmrTWPa5NFziREx5" class="btn btn-outline-light btn-shine"
              target="_blank" rel="noopener">
              <span>📍</span>
              <span>Rua Andaraí, 723 – Resgate | SSA</span>
              <span>↗</span>
            </a>
          </li>

          <li class="mb-3">
            <a href="https://www.instagram.com/tamojuntobotequimofc" class="btn btn-outline-light me-2"
              target="_blank" rel="noopener" aria-label="Instagram – Unidade Saúde">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="https://maps.google.com/?q=Largo+da+Saude+02+Salvador+BA" class="btn btn-outline-light btn-shine"
              target="_blank" rel="noopener">
              <span>📍</span>
              <span>Largo da Saúde, 02 – Saúde, Salvador – BA</span>
              <span>↗</span>
            </a>
          </li>

          <li class="mb-3">
            <a href="https://www.instagram.com/tamojuntobotequimofc2" class="btn btn-outline-light me-2"
              target="_blank" rel="noopener" aria-label="Instagram – Unidade Vale dos Lagos">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="https://maps.app.goo.gl/pYms8MLuKBDDiAWn6" class="btn btn-outline-light btn-shine"
              target="_blank" rel="noopener">
              <span>📍</span>
              <span>Cond. Mata Atlântica, 01 – Vale dos Lagos</span>
              <span>↗</span>
            </a>
          </li>

        </ul>
      </div>

    </div>

    <hr class="mt-5 mb-4 border-secondary">

    <div class="row copyright">
      <div class="col-md-6 text-md-start">
        <p class="mb-0">© 2026 TamoJunto Botequim — Desenvolvido por Vision</p>
      </div>
    </div>
    <br>
  </div>
</footer>`;

const footerPlaceholder = document.getElementById('footer-placeholder');
if (footerPlaceholder) {
  footerPlaceholder.innerHTML = footerHTML;
}

// 0. Navbar Component
const navbarHTML = /* html */`
<nav class="navbar navbar-expand-lg fixed-top custom-navbar navbar-theme-dark navbar-dark">
  <div class="container-fluid">

    <a class="navbar-brand" href="index.html">
      <img class="nav-logo" src="./assets/images/logo.png" alt="TamoJunto Botequim" />
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
      aria-expanded="false" aria-label="Abrir menu">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="about.html">Sobre nós</a></li>
        <li class="nav-item"><a class="nav-link" href="menu-classic.html">Menu</a></li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">Páginas</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="gallery.html">Galeria</a></li>
            <li><a class="dropdown-item" href="testimonials.html">Depoimentos</a></li>
            <li><a class="dropdown-item" href="faq.html">FAQ</a></li>
          </ul>
        </li>
        <li class="nav-item"><a class="nav-link" href="contact.html">Contato</a></li>
      </ul>
    </div>

  </div>
</nav>`;

const navbarPlaceholder = document.getElementById('navbar-placeholder');
if (navbarPlaceholder) {
  navbarPlaceholder.innerHTML = navbarHTML;

  // Marca o item ativo automaticamente
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// 1. Navbar Logic
// ... resto do seu código

// 1. Navbar Logic

const navbar = document.querySelector('.custom-navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
  });
}


// 2. Carousel Logic 
const galleryItems = document.querySelectorAll('.gallery-item img');
const carouselInner = document.getElementById('carouselInner');
const galleryModal = document.getElementById('galleryModal');

if (carouselInner && galleryItems.length > 0) {
    galleryItems.forEach((img, index) => {
        const isActive = index === 0 ? 'active' : '';
        const carouselItem = `
            <div class="carousel-item ${isActive}">
                <img src="${img.src}" class="d-block w-100 rounded shadow-lg" alt="${img.alt}">
            </div>
        `;
        carouselInner.insertAdjacentHTML('beforeend', carouselItem);
    });
}

if (galleryModal) {
    galleryModal.addEventListener('show.bs.modal', function (event) {
        const triggerElement = event.relatedTarget;
        const allItems = Array.from(document.querySelectorAll('.gallery-item'));
        const index = allItems.indexOf(triggerElement);
        
        // Ensure Bootstrap is loaded
        if (typeof bootstrap !== 'undefined') {
            const carousel = bootstrap.Carousel.getOrCreateInstance('#galleryCarousel');
            carousel.to(index);
        }
    });
}

// 3. Loader Logic 
const spinnerWrapperEl = document.querySelector('.loader-wrapper');
if (spinnerWrapperEl) {
    window.addEventListener('load', () => {
        spinnerWrapperEl.style.opacity = '0';
        setTimeout(() => {
            spinnerWrapperEl.style.display = 'none';
        }, 400); 
    });
}

// Initialize AOS Animation
AOS.init({
  // Global settings:
  duration: 800, // values from 0 to 3000, with step 50ms
  easing: 'ease-in-out', // default easing for AOS animations
  once: true, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
});
