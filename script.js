/**
 * Cache global para dados dos monstros
 * @type {Array|null}
 */
let monstersCache = null;

/**
 * Configuração das categorias de monstros
 * @type {Object}
 */
const MONSTER_CATEGORIES = {
    small: {
        type: 'small',
        title: 'Small Monsters',
        filter: monster => {
            const isSmall = 
                (monster.type && monster.type.toLowerCase().includes('small')) ||
                (monster.size && monster.size.toLowerCase().includes('small'));
            return isSmall;
        },
        description: 'Explore the smaller creatures that inhabit the New World'
    },
    large: {
        type: 'large',
        title: 'Large Monsters',
        filter: monster => 
            monster.type && 
            monster.type.toLowerCase() === 'large' && 
            (!monster.species || !monster.species.toLowerCase().includes('elder dragon')),
        description: 'Face the powerful predators that dominate their territories'
    },
    elder: {
        type: 'elder',
        title: 'Elder Dragons',
        filter: monster => monster.species && monster.species.toLowerCase().includes('elder dragon'),
        description: 'Meet the legendary creatures that shape the world of Monster Hunter'
    }
};

/**
 * Busca e armazena em cache os dados da API
 * @returns {Promise<Array>} Array com dados dos monstros
 */
async function fetchMonstersData() {
    if (monstersCache) return monstersCache;
    
    try {
        const cachedData = localStorage.getItem('monstersData');
        if (cachedData) {
            monstersCache = JSON.parse(cachedData);
            return monstersCache;
        }

        const response = await fetch("https://mhw-db.com/monsters");
        monstersCache = await response.json();
        
        localStorage.setItem('monstersData', JSON.stringify(monstersCache));
        return monstersCache;
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        return [];
    }
}

/**
 * Inicializa os eventos dos quadrados de categoria
 */
function initializeCategoryBoxes() {
    const categoryBoxes = {
        'small-monsters': 'small-monsters.html',
        'large-monsters': 'large-monsters.html',
        'special-monsters': 'elder-dragons.html',
        'ancient-forest': 'location.html?location=Ancient Forest',
        'wildspire-waste': 'location.html?location=Wildspire Waste',
        'coral-highlands': 'location.html?location=Coral Highlands',
        'rotten-vale': 'location.html?location=Rotten Vale',
        'elders-recess': 'location.html?location=Elder\'s Recess',
        'hoarfrost-reach': 'location.html?location=Hoarfrost Reach'
    };

    Object.entries(categoryBoxes).forEach(([id, page]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', () => {
                window.location.href = page;
            });
        }
    });
}

/**
 * Adiciona efeito de carregamento suave para imagens
 * @param {HTMLImageElement} img - Elemento de imagem
 */
function handleImageLoad(img) {
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
}

/**
 * Obtém o caminho da imagem do monstro
 * @param {string} monsterName - Nome do monstro
 * @param {string} type - Tipo de imagem (monsters/icons)
 * @param {string} category - Categoria do monstro (small/large/elder)
 * @returns {string} Caminho da imagem
 */
function getMonsterImagePath(monsterName, type, category) {
    const formattedName = monsterName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
    
    const specialCases = {
        'gajalaka': 'gajalaka',
        'vespoid': 'vespoid',
        'hornetaur': 'hornetaur',
        'gajau': 'gajau',
        'kestodon': 'kestodon',
        'gastodon': 'gastodon',
        'noios': 'noios',
        'raphinos': 'raphinos',
        'shamos': 'shamos',
        'girros': 'girros',
        'jagras': 'jagras',
        'mernos': 'mernos',
        'apceros': 'apceros',
        'aptonoth': 'aptonoth',
        'kelbi': 'kelbi',
        'anjanath': 'anjanath',
        'azure-rathalos': 'azure-rathalos',
        'barroth': 'barroth',
        'black-diablos': 'black-diablos',
        'diablos': 'diablos',
        'dodogama': 'dodogama',
        'great-girros': 'great-girros',
        'great-jagras': 'great-jagras',
        'jyuratodus': 'jyuratodus',
        'kulu-ya-ku': 'kulu-ya-ku',
        'paolumu': 'paolumu',
        'pukei-pukei': 'pukei-pukei',
        'radobaan': 'radobaan',
        'rathalos': 'rathalos',
        'rathian': 'rathian',
        'pink-rathian': 'pink-rathian',
        'tobi-kadachi': 'tobi-kadachi',
        'tzitzi-ya-ku': 'tzitzi-ya-ku',
        'uragaan': 'uragaan',
        'odogaron': 'odogaron',
        'legiana': 'legiana',
        'deviljho': 'deviljho',
        'bazelgeuse': 'bazelgeuse',
        'lavasioth': 'lavasioth',
        'kushala-daora': 'kushala-daora',
        'kulve-taroth': 'kulve-taroth',
        'vaal-hazak': 'vaal-hazak',
        'xeno-jiiva': 'xenojiiva',
        'zorah-magdaros': 'zorah-magdaros',
        'nergigante': 'nergigante',
        'teostra': 'teostra',
        'lunastra': 'lunastra',
        'kirin': 'kirin',
        'namielle': 'namielle',
        'velkhana': 'velkhana',
        'safi-jiiva': 'safijiiva',
        'safijiiva': 'safijiiva',
    };

    const finalName = specialCases[formattedName] || formattedName;
    
    let basePath = '';
    if (category === 'small') {
        basePath = type === 'monsters' ? 'monsters/small' : 'icons/small';
    } else if (category === 'elder') {
        basePath = type === 'monsters' ? 'monsters/elder' : 'icons/elder';
    } else {
        basePath = type === 'monsters' ? 'monsters/large' : 'icons/large';
    }

    const finalPath = `Images/${basePath}/${finalName}.png`;
    console.log(`Generated path for ${monsterName}:`, finalPath);

    return finalPath;
}

/**
 * Verifica se uma imagem existe
 * @param {string} url - URL da imagem
 * @returns {Promise<boolean>}
 */
async function imageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Renderiza um card de monstro individual
 * @param {Object} monster - Dados do monstro
 * @param {string} category - Categoria do monstro
 * @returns {Promise<string>} HTML do card
 */
async function renderMonsterCard(monster, category) {
    const monsterImagePath = getMonsterImagePath(monster.name, 'monsters', category);
    const monsterIconPath = getMonsterImagePath(monster.name, 'icons', category);

    console.log('Loading:', {
        name: monster.name,
        imagePath: monsterImagePath,
        iconPath: monsterIconPath
    });

    return `
        <div class="monster-card ${category}-card" data-monster="${monster.name}">
            ${getMonsterTypeBadge(monster)}
            <div class="monster-card-content">
                <div class="monster-header">
                    <img src="${monsterIconPath}" 
                         alt="${monster.name} icon" 
                         class="monster-icon"
                         onerror="this.src='Images/icon-placeholder.png'; console.log('Error loading icon:', this.src);"
                         onload="this.classList.add('loaded')">
                    <h3>${monster.name}</h3>
                </div>
                <div class="monster-image-container">
                    <img src="${monsterImagePath}" 
                         alt="${monster.name}" 
                         class="monster-image"
                         loading="lazy"
                         onerror="this.src='Images/monster-placeholder.png'; console.log('Error loading image:', this.src);"
                         onload="this.classList.add('loaded')">
                </div>
                <div class="monster-info">
                    <span class="monster-type">${monster.type || 'Unknown'}</span>
                    ${monster.species ? `<span class="monster-species">${monster.species}</span>` : ''}
                </div>
                <p class="monster-description">${monster.description || 'Information unavailable.'}</p>
            </div>
        </div>
    `;
}

/**
 * Renderiza a lista de monstros
 * @param {string} category - Tipo de categoria
 * @param {Array} monsters - Array de monstros
 */
async function renderMonstersList(category, monsters) {
    const containerElement = document.querySelector('.monsters-list');
    if (!containerElement) return;

    const categoryConfig = MONSTER_CATEGORIES[category];
    const filteredMonsters = monsters.filter(categoryConfig.filter);

    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.category-description p');
    
    if (titleElement) titleElement.textContent = categoryConfig.title;
    if (descriptionElement) descriptionElement.textContent = categoryConfig.description;

    containerElement.innerHTML = '<div class="loading">Loading monsters...</div>';

    try {
        const monsterCards = await Promise.all(
            filteredMonsters.map(monster => renderMonsterCard(monster, category))
        );

        containerElement.innerHTML = monsterCards.join('') || 
            '<div class="no-monsters">No monsters found in this category.</div>';
    } catch (error) {
        console.error('Error rendering monsters:', error);
        containerElement.innerHTML = '<div class="error">Error loading monsters.</div>';
    }
}

/**
 * Gera o badge do tipo do monstro
 * @param {Object} monster - Dados do monstro
 * @returns {string} HTML do badge
 */
function getMonsterTypeBadge(monster) {
    if (monster.species && monster.species.toLowerCase().includes('elder dragon')) {
        return '<span class="monster-type-badge elder-dragon-badge">Elder Dragon</span>';
    }
    if (monster.type) {
        return `<span class="monster-type-badge">${monster.type}</span>`;
    }
    return '';
}

function createSuggestionItem(monster, searchInput, suggestionsContainer) {
    const suggestionItem = document.createElement("li");
    suggestionItem.textContent = monster.name;
    suggestionItem.classList.add("suggestion-item");
    
    suggestionItem.addEventListener("click", () => {
        searchInput.value = monster.name;
        suggestionsContainer.innerHTML = "";
        suggestionsContainer.style.display = "none";
        window.location.href = `monster.html?monster=${encodeURIComponent(monster.name)}`;
    });
    
    return suggestionItem;
}

/**
 * Encontra o monstro mais adequado baseado no nome pesquisado
 * @param {string} searchName - Nome pesquisado
 * @param {Array} monsters - Lista de monstros
 * @returns {Object|null} Monstro encontrado ou null
 */
function findBestMonsterMatch(searchName, monsters) {
    searchName = searchName.toLowerCase();
    
    const exactMatch = monsters.find(monster => 
        monster.name.toLowerCase() === searchName
    );
    if (exactMatch) return exactMatch;

    const partialMatches = monsters.filter(monster => 
        monster.name.toLowerCase().includes(searchName)
    );

    if (partialMatches.length === 0) return null;

    return partialMatches.sort((a, b) => a.name.length - b.name.length)[0];
}

async function updateSuggestions(query, searchInput, suggestionsContainer) {
    if (!query) {
        suggestionsContainer.style.display = "none";
        return;
    }

    const monsters = await fetchMonstersData();
    const searchLower = query.toLowerCase();
    
    const exactMatches = [];
    const partialMatches = [];
    
    monsters.forEach(monster => {
        const monsterName = monster.name.toLowerCase();
        if (monsterName === searchLower) {
            exactMatches.push(monster);
        } else if (monsterName.includes(searchLower)) {
            partialMatches.push(monster);
        }
    });

    partialMatches.sort((a, b) => a.name.length - b.name.length);

    const suggestions = [...exactMatches, ...partialMatches];

    suggestionsContainer.innerHTML = "";
    
    if (suggestions.length > 0) {
        const suggestionsList = document.createElement("ul");
        suggestionsList.classList.add("suggestions-list");
        
        suggestions.forEach(monster => {
            const suggestionItem = createSuggestionItem(monster, searchInput, suggestionsContainer);
            if (monster.name.toLowerCase() === searchLower) {
                suggestionItem.classList.add('exact-match');
            }
            suggestionsList.appendChild(suggestionItem);
        });
        
        suggestionsContainer.appendChild(suggestionsList);
        suggestionsContainer.style.display = "block";
    } else {
        suggestionsContainer.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchBtn");
    const suggestionsContainer = document.getElementById("suggestions");

    await fetchMonstersData();

    if (searchButton) {
        searchButton.addEventListener("click", async () => {
            const monsterName = searchInput.value.trim();

            if (!monsterName) {
                alert("Por favor, digite o nome de um monstro.");
                return;
            }

            const monsters = await fetchMonstersData();
            const foundMonster = findBestMonsterMatch(monsterName, monsters);

            if (foundMonster) {
                window.location.href = `monster.html?monster=${encodeURIComponent(foundMonster.name)}`;
            } else {
                alert("Nenhum monstro encontrado com esse nome.");
            }
        });
    }

    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                updateSuggestions(searchInput.value.trim(), searchInput, suggestionsContainer);
            }, 300);
        });

        searchInput.addEventListener("keypress", async (e) => {
            if (e.key === "Enter") {
                const monsterName = searchInput.value.trim();
                if (!monsterName) {
                    alert("Por favor, digite o nome de um monstro.");
                    return;
                }

                const monsters = await fetchMonstersData();
                const foundMonster = findBestMonsterMatch(monsterName, monsters);

                if (foundMonster) {
                    window.location.href = `monster.html?monster=${encodeURIComponent(foundMonster.name)}`;
                } else {
                    alert("Nenhum monstro encontrado com esse nome.");
                }
            }
        });
    }

    if (window.location.pathname.includes("monster.html")) {
        const params = new URLSearchParams(window.location.search);
        const monsterName = params.get("monster");

        if (monsterName) {
            fetch("https://mhw-db.com/monsters")
                .then(response => response.json())
                .then(data => {
                    const foundMonster = data.find(monster => monster.name === monsterName);

                    if (foundMonster) {
                        updateMonsterDetails(foundMonster);
                    } else {
                        document.getElementById("monsterName").textContent = "Monster not found";
                        document.getElementById("monsterDescription").textContent = "Could not load monster information.";
                    }
                })
                .catch(error => {
                    console.error("Error loading monster data:", error);
                    document.getElementById("monsterName").textContent = "Error";
                    document.getElementById("monsterDescription").textContent = "Failed to load monster information.";
                });
        }
    }

    initializeCategoryBoxes();

    const currentPage = window.location.pathname;
    if (currentPage.includes('small-monsters.html')) {
        const monsters = await fetchMonstersData();
        renderMonstersList('small', monsters);
    } else if (currentPage.includes('large-monsters.html')) {
        const monsters = await fetchMonstersData();
        renderMonstersList('large', monsters);
    } else if (currentPage.includes('elder-dragons.html')) {
        const monsters = await fetchMonstersData();
        renderMonstersList('elder', monsters);
    }
});

async function updateMonsterDetails(monster) {
    let category = 'small';
    if (monster.species && monster.species.toLowerCase().includes('elder dragon')) {
        category = 'elder';
    } else if (monster.type && monster.type.toLowerCase() === 'large') {
        category = 'large';
    }

    document.body.classList.remove('monster-small', 'monster-large', 'monster-elder');
    document.body.classList.add(`monster-${category}`);

    const monsterImagePath = getMonsterImagePath(monster.name, 'monsters', category);
    const monsterIconPath = getMonsterImagePath(monster.name, 'icons', category);

    document.getElementById("monsterName").textContent = monster.name;
    document.getElementById("monsterDescription").textContent = monster.description || "Information unavailable.";
    document.getElementById("monsterType").textContent = monster.type || "Unknown";
    document.getElementById("monsterRace").textContent = monster.species || "Unknown";
    document.getElementById("monsterTypeBadge").textContent = monster.type || "Unknown";
