/**
 * Coran Explorer - Version 2026
 * Format de fichier simplifié : {ID}.pdf (ex: 1.pdf, 108.pdf)
 * Auteur : Rachid Bounoua
 */

// 1. Gestion du Menu "À propos"
function toggleMenu() {
    const menu = document.getElementById("aboutMenu");
    if (menu) {
        menu.classList.toggle("show");
    }
}

// Fermer le menu si clic à l'extérieur
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
}

// 2. Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#surahTable tbody');
    const searchInput = document.getElementById('searchInput');

    // --- LOGIQUE INDEX ---
    if (tbody && typeof surahData !== 'undefined') {
        renderTable(surahData);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = surahData.filter(s => 
                    s.nomFr.toLowerCase().includes(term) || 
                    s.nomAr.toLowerCase().includes(term) || 
                    s.no.toString().includes(term)
                );
                renderTable(filtered);
            });
        }
    }

    // --- LOGIQUE TAFSIR ---
    const urlParams = new URLSearchParams(window.location.search);
    const surahId = urlParams.get('id');
    if (surahId && window.location.pathname.includes('tafsir.html')) {
        chargerLeTafsir(surahId);
    }
});

// 3. Rendu du Tableau
function renderTable(data) {
    const tbody = document.querySelector('#surahTable tbody');
    if (!tbody) return;

    tbody.innerHTML = ""; 

    data.forEach(s => {
        const row = document.createElement('tr');
        const lieuClass = s.lieu.toLowerCase().includes('mecque') ? 'mecque' : 'medine';

        row.innerHTML = `
            <td><span class="num-badge">${s.no}</span></td>
            <td>
                <div class="ar-name">${s.nomAr}</div>
                <div class="fr-name">${s.nomFr}</div>
            </td>
            <td>${s.versets}</td>
            <td><span class="tag-lieu ${lieuClass}">${s.lieu}</span></td>
            <td style="font-size: 0.85rem; color: #444;">${s.theme}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="window.open('https://quran.com/fr/${s.no}', '_blank')" class="btn-action btn-read">
                        Lire & Écouter
                    </button>
                    <button onclick="window.location.href='tafsir.html?id=${s.no}'" class="btn-action btn-tafsir">
                        Tafsir
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 4. Chargement du PDF (Format: ID.pdf)
function chargerLeTafsir(id) {
    const viewer = document.getElementById('pdf-viewer');
    const titleEl = document.getElementById('currentTomeTitle');
    
    if (viewer && typeof surahData !== 'undefined') {
        const sourate = surahData.find(s => s.no == id);
        
        // LE COEUR DE LA SIMPLIFICATION :
        const fileName = `${id}.pdf`;
        
        viewer.src = fileName + "#toolbar=1";
        
        if (titleEl && sourate) {
            titleEl.innerText = `Tafsir : ${sourate.nomFr}`;
        }
    }
}