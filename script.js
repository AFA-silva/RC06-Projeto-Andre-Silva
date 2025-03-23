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
            // Include monsters that are either explicitly marked as small
            // or have a size property indicating they're small
            const isSmall = 
                (monster.type && monster.type.toLowerCase().includes('small')) ||
                (monster.size && monster.size.toLowerCase().includes('small'));
            
            // Debug log to see what's being filtered
            if (isSmall) {
                console.log('Including small monster:', monster.name);
            }
            
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
        // Verifica primeiro se há dados no localStorage
        const cachedData = localStorage.getItem('monstersData');
        if (cachedData) {
            monstersCache = JSON.parse(cachedData);
            return monstersCache;
        }

        const response = await fetch("https://mhw-db.com/monsters");
        monstersCache = await response.json();
        
        // Armazena no localStorage para uso futuro
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
        // Monster Categories
        'small-monsters': 'small-monsters.html',
        'large-monsters': 'large-monsters.html',
        'special-monsters': 'elder-dragons.html',
        
        // Biome Categories
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
    // First, handle spaces and special characters
    const formattedName = monsterName.toLowerCase()
        .replace(/\s+/g, '-')  // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove special characters
        .replace(/-+/g, '-');  // Replace multiple hyphens with single hyphen
    
    // Special cases mapping for monsters with spaces and special names
    const specialCases = {
        // Small Monsters
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

        // Large Monsters
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

        // Elder Dragons with spaces and special names
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

        // Elder Dragons with special characters
        'safi-jiiva': 'safijiiva',
        'safijiiva': 'safijiiva',
    };

    // Use special case name if it exists, otherwise use formatted name
    const finalName = specialCases[formattedName] || formattedName;
    
    // Define o caminho base dependendo da categoria
    let basePath = '';
    if (category === 'small') {
        basePath = type === 'monsters' ? 'monsters/small' : 'icons/small';
    } else if (category === 'elder') {
        basePath = type === 'monsters' ? 'monsters/elder' : 'icons/elder';  // Updated path for elder
    } else {
        basePath = type === 'monsters' ? 'monsters/large' : 'icons/large';  // Updated path for large
    }

    // Log the final path for debugging
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
                <button class="view-details-btn" onclick="window.location.href='monster.html?monster=${encodeURIComponent(monster.name)}'">
                    View Details
                </button>
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
    // Debug log to see all monsters and their types
    console.log('All monsters:', monsters.map(m => ({
        name: m.name,
        type: m.type,
        size: m.size
    })));
    
    const containerElement = document.querySelector('.monsters-list');
    if (!containerElement) return;

    const categoryConfig = MONSTER_CATEGORIES[category];
    const filteredMonsters = monsters.filter(categoryConfig.filter);

    // Update title and description
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.category-description p');
    
    if (titleElement) titleElement.textContent = categoryConfig.title;
    if (descriptionElement) descriptionElement.textContent = categoryConfig.description;

    // Show loading
    containerElement.innerHTML = '<div class="loading">Loading monsters...</div>';

    try {
        // Render all cards
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

// Função para criar elemento de sugestão
function createSuggestionItem(monster, searchInput, suggestionsContainer) {
    const suggestionItem = document.createElement("li");
    suggestionItem.textContent = monster.name;
    suggestionItem.classList.add("suggestion-item");
    
    suggestionItem.addEventListener("click", () => {
        searchInput.value = monster.name;
        suggestionsContainer.innerHTML = "";
        suggestionsContainer.style.display = "none";
        // Opcional: Redirecionar automaticamente ao clicar na sugestão
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
    
    // Primeiro, procura por correspondência exata
    const exactMatch = monsters.find(monster => 
        monster.name.toLowerCase() === searchName
    );
    if (exactMatch) return exactMatch;

    // Se não encontrar correspondência exata, procura por correspondência parcial
    const partialMatches = monsters.filter(monster => 
        monster.name.toLowerCase().includes(searchName)
    );

    if (partialMatches.length === 0) return null;

    // Se houver múltiplas correspondências parciais, prioriza o nome mais curto
    // Isso ajuda a encontrar o monstro "base" em vez de suas variantes
    return partialMatches.sort((a, b) => a.name.length - b.name.length)[0];
}

// Função para atualizar sugestões
async function updateSuggestions(query, searchInput, suggestionsContainer) {
    if (!query) {
        suggestionsContainer.style.display = "none";
        return;
    }

    const monsters = await fetchMonstersData();
    const searchLower = query.toLowerCase();
    
    // Separa as sugestões em exatas e parciais
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

    // Ordena parciais por comprimento do nome
    partialMatches.sort((a, b) => a.name.length - b.name.length);

    // Combina os resultados
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

// Inicialização do documento
document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchBtn");
    const suggestionsContainer = document.getElementById("suggestions");

    // Pré-carregar dados dos monstros
    await fetchMonstersData();

    // Configurar evento do botão de pesquisa
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

    // Configurar evento de input para sugestões
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                updateSuggestions(searchInput.value.trim(), searchInput, suggestionsContainer);
            }, 300);
        });

        // Adicionar evento para tecla Enter
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

    // Se estivermos na página monster.html, carregar os dados do monstro
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

    // Inicializa os quadrados de categoria
    initializeCategoryBoxes();

    // Identifica a página atual e carrega os monstros apropriados
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

// Atualização da página de detalhes do monstro
async function updateMonsterDetails(monster) {
    // Determine the correct category and add appropriate class to body
    let category = 'small';
    if (monster.species && monster.species.toLowerCase().includes('elder dragon')) {
        category = 'elder';
    } else if (monster.type && monster.type.toLowerCase() === 'large') {
        category = 'large';
    }

    // Remove any existing category classes
    document.body.classList.remove('monster-small', 'monster-large', 'monster-elder');
    // Add the appropriate category class
    document.body.classList.add(`monster-${category}`);

    // Get image paths
    const monsterImagePath = getMonsterImagePath(monster.name, 'monsters', category);
    const monsterIconPath = getMonsterImagePath(monster.name, 'icons', category);

    // Update basic information
    document.getElementById("monsterName").textContent = monster.name;
    document.getElementById("monsterDescription").textContent = monster.description || "Information unavailable.";
    document.getElementById("monsterType").textContent = monster.type || "Unknown";
    document.getElementById("monsterRace").textContent = monster.species || "Unknown";
    document.getElementById("monsterTypeBadge").textContent = monster.type || "Unknown";

    // Update images with error handling
    const monsterImage = document.getElementById("monsterImage");
    const monsterIcon = document.getElementById("monsterIcon");

    // Function to handle image loading
    const loadImage = (img, src, fallbackSrc) => {
        img.onload = function() {
            this.classList.add('loaded');
        };
        img.onerror = function() {
            console.log('Error loading image:', src);
            this.src = fallbackSrc;
        };
        img.src = src;
    };

    // Load images
    loadImage(monsterImage, monsterImagePath, 'Images/monster-placeholder.png');
    loadImage(monsterIcon, monsterIconPath, 'Images/icon-placeholder.png');
    
    // Update lists
    updateMonsterList("monsterAilments", monster.ailments);
    updateMonsterList("monsterResistances", monster.resistances);
    updateMonsterList("monsterWeaknesses", monster.weaknesses);
    updateMonsterList("monsterHabitats", monster.locations);
}

/**
 * Atualiza uma lista específica de características do monstro
 * @param {string} elementId - ID do elemento HTML
 * @param {Array} items - Array de itens a serem exibidos
 */
function updateMonsterList(elementId, items) {
    const element = document.getElementById(elementId);
    if (!element) return;

    switch(elementId) {
        case "monsterAilments":
            if (!items || items.length === 0) {
                element.innerHTML = '<li>No ailments available</li>';
                return;
            }
            const sortedAilments = items.sort((a, b) => {
                const starsA = a.stars || 0;
                const starsB = b.stars || 0;
                return starsB - starsA;
            });
            const topAilments = sortedAilments.slice(0, 5);
            element.innerHTML = topAilments.map(a => 
                `<li>${a.name}${a.stars ? ` ★${a.stars}` : ''}: ${a.description || 'No description available'}</li>`
            ).join('');
            break;

        case "monsterResistances":
            if (!items || items.length === 0) {
                element.innerHTML = '<li>None available</li>';
                return;
            }
            // Show all resistances, even those without stars
            const resistancesList = items.map(r => {
                if (r.stars && r.stars > 0) {
                    return `<li>${r.element} ${r.stars ? '★'.repeat(r.stars) : ''}</li>`;
                } else {
                    // For resistances without stars, just show the element
                    return `<li>${r.element} (Resistant)</li>`;
                }
            });
            element.innerHTML = resistancesList.join('');
            break;

        case "monsterWeaknesses":
            if (!items || items.length === 0) {
                element.innerHTML = '<li>No weaknesses available</li>';
                return;
            }
            const validWeaknesses = items.filter(w => w.stars >= 2);
            if (validWeaknesses.length === 0) {
                element.innerHTML = '<li>No significant weaknesses available</li>';
                return;
            }
            const sortedWeaknesses = validWeaknesses
                .sort((a, b) => b.stars - a.stars)
                .slice(0, 5);
            element.innerHTML = sortedWeaknesses.map(w => 
                `<li>${w.element} ★${w.stars}</li>`
            ).join('');
            break;

        case "monsterHabitats":
            if (!items || items.length === 0) {
                element.innerHTML = '<li>No habitats available</li>';
                return;
            }
            // Take only the first 4 habitats
            const limitedHabitats = items.slice(0, 4);
            element.innerHTML = limitedHabitats.map(l => 
                `<li>${l.name}</li>`
            ).join('');
            break;
    }
}

// Location descriptions
const LOCATION_DESCRIPTIONS = {
    'Ancient Forest': 'A dense forest teeming with life, featuring multiple layers of terrain from forest floor to canopy. Home to various monsters that have adapted to life among the ancient trees.',
    'Wildspire Waste': 'A vast desert area interspersed with wetlands, creating a unique ecosystem where both arid-climate and marsh-dwelling monsters thrive.',
    'Coral Highlands': 'A unique area resembling a coral reef in the sky, with floating coral formations and unique wind-riding creatures.',
    'Rotten Vale': 'A deep valley where deceased creatures decompose, creating a toxic environment home to scavenging monsters.',
    'Elder\'s Recess': 'A volcanic region rich in bioenergy, serving as a nest for powerful Elder Dragons and other formidable creatures.',
    'Hoarfrost Reach': 'A frigid region covered in deep snow, where monsters have evolved special adaptations to survive the extreme cold.'
};

// Handle location page loading
if (window.location.pathname.includes('location.html')) {
    const params = new URLSearchParams(window.location.search);
    const locationName = params.get('location');

    if (locationName) {
        // Update page title and description
        document.getElementById('locationTitle').textContent = locationName;
        document.getElementById('locationDesc').textContent = LOCATION_DESCRIPTIONS[locationName] || 'Description not available.';

        // Add location-specific theme class
        const themeClass = locationName.toLowerCase().replace(/\s+/g, '-') + '-theme';
        document.body.classList.add(themeClass);

        // Set location image
        const locationImage = document.getElementById('locationImage');
        if (locationImage) {
            locationImage.src = `Images/locations/${locationName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            locationImage.alt = locationName;
        }

        // Load monsters for this location
        loadLocationMonsters(locationName);
    }
}

async function loadLocationMonsters(locationName) {
    const monstersGrid = document.querySelector('.monsters-grid');
    if (!monstersGrid) return;

    try {
        const monsters = await fetchMonstersData();
        const locationMonsters = monsters.filter(monster => 
            monster.locations && 
            monster.locations.some(loc => 
                loc.name.toLowerCase() === locationName.toLowerCase()
            )
        );

        if (locationMonsters.length === 0) {
            monstersGrid.innerHTML = '<div class="no-monsters">No monsters found in this location.</div>';
            return;
        }

        const monsterCards = await Promise.all(
            locationMonsters.map(monster => renderMonsterCard(monster, getMonsterCategory(monster)))
        );

        monstersGrid.innerHTML = monsterCards.join('');
    } catch (error) {
        console.error('Error loading location monsters:', error);
        monstersGrid.innerHTML = '<div class="error">Error loading monsters.</div>';
    }
}

function getMonsterCategory(monster) {
    if (monster.species && monster.species.toLowerCase().includes('elder dragon')) {
        return 'elder';
    } else if (monster.type && monster.type.toLowerCase() === 'large') {
        return 'large';
    }
    return 'small';
}

function renderLocationMonsters(monsters) {
    const monstersByType = {
        small: monsters.filter(m => m.type?.toLowerCase() === 'small'),
        large: monsters.filter(m => m.type?.toLowerCase() === 'large' && !m.species?.toLowerCase().includes('elder dragon')),
        elder: monsters.filter(m => m.species?.toLowerCase().includes('elder dragon'))
    };

    const container = document.querySelector('.monsters-section');
    container.innerHTML = '';

    // Create sections for each type
    const types = [
        { key: 'small', title: 'Small Monsters', class: 'small-monster' },
        { key: 'large', title: 'Large Monsters', class: 'large-monster' },
        { key: 'elder', title: 'Elder Dragons', class: 'elder-dragon' }
    ];

    types.forEach(type => {
        if (monstersByType[type.key].length > 0) {
            const section = document.createElement('div');
            section.className = `monster-section ${type.key}-monsters-section`;
            
            section.innerHTML = `
                <h2 class="monster-section-title">${type.title}</h2>
                <div class="monsters-grid">
                    ${monstersByType[type.key].map(monster => `
                        <div class="monster-card ${type.class}">
                            <div class="monster-image-container">
                                <img src="${getMonsterImagePath(monster.name, 'monsters', type.key)}" 
                                     alt="${monster.name}" 
                                     class="monster-image"
                                     loading="lazy">
                            </div>
                            <div class="monster-header">
                                <img src="${getMonsterImagePath(monster.name, 'icons', type.key)}" 
                                     alt="${monster.name} icon" 
                                     class="monster-icon">
                                <h3>${monster.name}</h3>
                            </div>
                            <p class="monster-description">${monster.description || 'No description available.'}</p>
                            <button class="view-details-btn" onclick="window.location.href='monster.html?monster=${encodeURIComponent(monster.name)}'">
                                View Details
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(section);
        }
    });
}