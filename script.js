// Espera que o DOM seja carregado antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchBtn");
    const suggestionsContainer = document.getElementById("suggestions");

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const monsterName = searchInput.value.trim().toLowerCase();

            if (!monsterName) {
                alert("Por favor, digite o nome de um monstro.");
                return;
            }

            // Busca os monstros na API
            fetch("https://mhw-db.com/monsters")
                .then(response => response.json())
                .then(data => {
                    const foundMonster = data.find(monster => 
                        monster.name.toLowerCase().includes(monsterName)
                    );

                    if (foundMonster) {
                        window.location.href = `monster.html?monster=${encodeURIComponent(foundMonster.name)}`;
                    } else {
                        alert("Nenhum monstro encontrado com esse nome.");
                    }
                })
                .catch(error => console.error("Erro ao buscar os dados da API:", error));
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            suggestionsContainer.innerHTML = ""; // Limpar sugestões anteriores
            if (query.length > 0) {
                fetch("https://mhw-db.com/monsters")
                    .then(response => response.json())
                    .then(data => {
                        const suggestions = data.filter(monster => monster.name.toLowerCase().includes(query));
                        if (suggestions.length > 0) {
                            const suggestionsList = document.createElement("ul");
                            suggestions.forEach(monster => {
                                const suggestionItem = document.createElement("li");
                                suggestionItem.textContent = monster.name;
                                suggestionItem.addEventListener("click", () => {
                                    searchInput.value = monster.name;
                                    suggestionsContainer.innerHTML = "";
                                    suggestionsContainer.style.display = "none";
                                });
                                suggestionsList.appendChild(suggestionItem);
                            });
                            suggestionsContainer.appendChild(suggestionsList);
                            suggestionsContainer.style.display = "block";
                        } else {
                            suggestionsContainer.style.display = "none";
                        }
                    })
                    .catch(error => console.error("Erro ao buscar os dados da API:", error));
            } else {
                suggestionsContainer.style.display = "none";
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
                        document.getElementById("monsterName").textContent = foundMonster.name;
                        document.getElementById("monsterDescription").textContent = foundMonster.description || "N/A";
                        document.getElementById("monsterImage").src = foundMonster.img || "placeholder.jpg";
                        document.getElementById("monsterType").textContent = foundMonster.type || "N/A";
                        document.getElementById("monsterRace").textContent = foundMonster.species || "N/A";
                        
                        const ailmentsList = document.getElementById("monsterAilments");
                        ailmentsList.innerHTML = (foundMonster.ailments && foundMonster.ailments.length > 0) 
                            ? foundMonster.ailments.map(a => `<li>${a.name}: ${a.description || 'N/A'}</li>`).join('') 
                            : "<li>N/A</li>";

                        const resistancesList = document.getElementById("monsterResistances");
                        resistancesList.innerHTML = (foundMonster.resistances && foundMonster.resistances.length > 0) 
                            ? foundMonster.resistances.map(r => `<li>${r.element} (${r.stars ? '★'.repeat(r.stars) : 'N/A'})</li>`).join('') 
                            : "<li>N/A</li>";

                        const weaknessesList = document.getElementById("monsterWeaknesses");
                        weaknessesList.innerHTML = (foundMonster.weaknesses && foundMonster.weaknesses.length > 0) 
                            ? foundMonster.weaknesses.filter(w => w.stars >= 2).map(w => `<li>${w.element} (★${w.stars})</li>`).join('') 
                            : "<li>N/A</li>";
                    } else {
                        document.getElementById("monsterName").textContent = "Monstro não encontrado";
                        document.getElementById("monsterDescription").textContent = "Não foi possível carregar as informações.";
                    }
                })
                .catch(error => console.error("Erro ao carregar os dados do monstro:", error));
        }
    }
});