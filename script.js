const tousLesProjets = {};

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      genererSection("prog-container", data.programmation);
      genererSection("proto-container", data.prototypes);
      genererSection("art-container", data.art3d);
      genererSection("other-container", data.autres);

      initCarousels();
      initModalLogic();
      initLightboxLogic();
    })
    .catch((error) =>
      console.error("Erreur lors du chargement du JSON:", error),
    );
});

function genererSection(containerId, projets) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let htmlContent = "";

  projets.forEach((projet) => {
    tousLesProjets[projet.id] = projet;

    const tagsHtml = projet.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    htmlContent += `
            <div class="card-link" onclick="ouvrirModal('${projet.id}')">
                <article>
                    <h3>${projet.title}</h3>
                    <div class="tags">
                        ${tagsHtml}
                    </div>
                    <p>${projet.description}</p>
                </article>
            </div>
        `;
  });

  container.innerHTML = htmlContent;
}

function ouvrirModal(idProjet) {
  const projet = tousLesProjets[idProjet];
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");

  const tagsHtml = projet.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  let gifHtml = "";
  if (projet.gif && projet.gif.trim() !== "") {
    gifHtml = `
            <div class="modal-media-container">
                <img src="${projet.gif}" alt="Aperçu animé de ${projet.title}" class="modal-main-media" onclick="ouvrirLightbox('${projet.gif}')">
            </div>
        `;
  }

  let gitHtml = "";
  if (projet.git && projet.git.trim() !== "") {
    gitHtml = `
            <div class="modal-git-container">
                <a href="${projet.git}" target="_blank" class="modal-git-link">Consulter le code sur GitHub &rarr;</a>
            </div>
        `;
  }

  let linkHtml = "";
  if (
    projet.externLink &&
    projet.externLink.trim() !== "" &&
    projet.linkTitle &&
    projet.linkTitle.trim() !== ""
  ) {
    linkHtml = `
            <div class="modal-git-container">
                <a href="${projet.externLink}" target="_blank" class="modal-git-link">${projet.linkTitle} &rarr;</a>
            </div>
        `;
  }

  let galleryHtml = "";
  if (projet.gallery && projet.gallery.length > 0) {
    const imagesHtml = projet.gallery
      .map(
        (imgUrl) =>
          `<img src="${imgUrl}" alt="Galerie ${projet.title}" onclick="ouvrirLightbox('${imgUrl}')">`,
      )
      .join("");

    galleryHtml = `
            <div class="modal-gallery">
                <h3>Galerie du projet</h3>
                <div class="gallery-grid">
                    ${imagesHtml}
                </div>
            </div>
        `;
  }

  let link = "";
  if (gitHtml.trim() !== "") {
    link = gitHtml;
  } else if (linkHtml.trim() !== "") {
    link = linkHtml;
  }
  modalBody.innerHTML = `
        <div class="modal-body-content">
            <h2>${projet.title}</h2>
            <div class="tags">${tagsHtml}</div>
            ${gifHtml}
            <p>${projet.fullDescription}</p>
            ${link}
            ${galleryHtml}
        </div>
    `;

  modal.classList.add("active");
  document.body.classList.add("no-scroll");
}

function initModalLogic() {
  const modal = document.getElementById("project-modal");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");

  const fermerModal = () => {
    modal.classList.remove("active");
    document.body.classList.remove("no-scroll");
  };

  closeBtn.addEventListener("click", fermerModal);
  overlay.addEventListener("click", fermerModal);

  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (
      e.key === "Escape" &&
      modal.classList.contains("active") &&
      !lightbox.classList.contains("active")
    ) {
      fermerModal();
    }
  });
}

function ouvrirLightbox(imgUrl) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = imgUrl;
  lightbox.classList.add("active");
}

function initLightboxLogic() {
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightbox-close");

  const fermerLightbox = () => {
    lightbox.classList.remove("active");
    setTimeout(() => {
      document.getElementById("lightbox-img").src = "";
    }, 300);
  };

  closeBtn.addEventListener("click", fermerLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      fermerLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      fermerLightbox();
    }
  });
}

function initCarousels() {
  const carousels = document.querySelectorAll(".carousel-wrapper");

  carousels.forEach((wrapper) => {
    const container = wrapper.querySelector(".card-container");
    const leftBtn = wrapper.querySelector(".left-btn");
    const rightBtn = wrapper.querySelector(".right-btn");

    const updateButtons = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft <= 1) {
        leftBtn.classList.add("hidden");
      } else {
        leftBtn.classList.remove("hidden");
      }
      if (Math.ceil(container.scrollLeft) >= maxScrollLeft - 1) {
        rightBtn.classList.add("hidden");
      } else {
        rightBtn.classList.remove("hidden");
      }
    };

    leftBtn.addEventListener("click", () => {
      container.scrollBy({ left: -432, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      container.scrollBy({ left: 432, behavior: "smooth" });
    });

    container.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);
    updateButtons();
  });
}
