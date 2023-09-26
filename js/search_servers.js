// Esto se ejecuta al cargar la pagina
window.addEventListener("load", function () {
    load_servers();
});


function load_servers() {
    fetch(`http://127.0.0.1:5000/server`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: "include",
    })
        .then((response) => {
        if (response.status === 200) {
            return response.json().then((data) => {
                const servers = data.servers;
                const serverShowcase = document.getElementById("main");
                servers.forEach((server) => {
                    // console.log(server);
                    const serverCard = document.createElement("div");
                    serverCard.classList.add("server-card");
                    const serverHeader = document.createElement("div");
                    serverHeader.classList.add("server-header");

                    const serverName = document.createElement("h2");
                    serverName.textContent = server.server_name;

                    const serverInfo = document.createElement("div");
                    serverInfo.classList.add("server-info");

                    const serverDescription = document.createElement("p");
                    serverDescription.textContent = server.server_description;

                    const serverCreator = document.createElement("p");
                    serverCreator.textContent = `Creador: ${server.owner_id}`;

                    // const serverMembers = document.createElement("p");
                    // serverMembers.textContent = `Cantidad de Miembros: ${server_members}`;

                    serverHeader.appendChild(serverName);
                    serverInfo.appendChild(serverDescription);
                    // serverInfo.appendChild(serverMembers);
                    serverCard.appendChild(serverHeader);
                    serverCard.appendChild(serverInfo);
                    serverInfo.appendChild(serverCreator);

                    serverShowcase.appendChild(serverCard);
                    
                });
            });
        } else {
            return response.json().then((data) => {
            if (errorData.error) {
                alert(data.error.description);
            }
            });
        }
        })
        .catch((error) => {
        alert("Ocurrió un error");
        });
}
// , server_description, server_members, server_creator
function addServer(server_name) {
    const serverShowcase = document.getElementById("main");

    // Crear elementos para la tarjeta de servidor
    const serverCard = document.createElement("div");
    serverCard.classList.add("server-card");

    const serverHeader = document.createElement("div");
    serverHeader.classList.add("server-header");

    const serverName = document.createElement("h2");
    serverName.textContent = server_name;

    const serverInfo = document.createElement("div");
    serverInfo.classList.add("server-info");

    const serverDescription = document.createElement("p");
    serverDescription.textContent = server_description;

    const serverMembers = document.createElement("p");
    serverMembers.textContent = `Cantidad de Miembros: ${server_members}`;

    const serverCreator = document.createElement("p");
    serverCreator.textContent = `Creador: ${server_creator}`;

    // Agregar elementos a la tarjeta de servidor
    serverHeader.appendChild(serverName);
    serverInfo.appendChild(serverDescription);
    serverInfo.appendChild(serverMembers);
    serverInfo.appendChild(serverCreator);
    serverCard.appendChild(serverHeader);
    serverCard.appendChild(serverInfo);

    // Agregar la tarjeta de servidor al contenedor principal
    serverShowcase.appendChild(serverCard);
}
