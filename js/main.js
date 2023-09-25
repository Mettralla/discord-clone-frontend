// Esto se ejecuta al cargar la pagina
window.addEventListener("load", function () {
  getProfileName();
  load_user_servers();
});

document.getElementById("cancel-btn").addEventListener("click", function () {
  window.location.href = "../index.html";
});

function newServerForm() {
  window.location.href = "../pages/create_server.html";
}

function goToProfile() {
  window.location.href = "../pages/profile.html";
}

function gotToLogin() {
  window.location.href = "../pages/login.html";
}

document
  .getElementById("authForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    createServer();
  });

function createServer() {
  const data = {
    server_name: document.getElementById("server_name").value,
    server_description: document.getElementById("server_description").value,
  };
  fetch("http://127.0.0.1:5000/server", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json().then((data) => {
          document.getElementById("message").innerHTML = data.message;
          window.location.href = "../index.html";
        });
      } else {
        return response.json().then((data) => {
          if (errorData.error) {
            document.getElementById("message").innerHTML =
              data.error.description;
          }
        });
      }
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = "Ocurrio un error";
    });
}

function getProfileName() {
  const url = "http://127.0.0.1:5000/auth/profile";

  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          document.getElementById("profile-card").innerText = data.username;
        });
      } else {
        // Redirige al usuario a la página de inicio de sesión en caso de error
        window.location.href = "../pages/login.html";
      }
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = "Ocurrió un error.";
    });
}

function load_user_servers() {
  if (window.location.pathname === "/index.html") {
    fetch("http://127.0.0.1:5000/users/servers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((data) => {
            const serverList = document.getElementById("server-list");

            data.servers.forEach((server) => {
              const serverDiv = document.createElement("div");
              serverDiv.classList.add("svr");

              const uServerDiv = document.createElement("div");
              uServerDiv.classList.add("u-server");

              const IconImg = document.createElement("img");
              IconImg.src = "../img/server.png";
              IconImg.id = "search-icon";

              const serverNameP = document.createElement("p");
              serverNameP.classList.add("svr-name");
              serverNameP.textContent = server.server_name;

              // Agrega un evento de clic al div
              serverDiv.addEventListener("click", function () {
                const server_id = server.server_id;
                cleanScreen();
                // Llama a otra función y pasa el server_id
                get_channels(server_id);
              });

              uServerDiv.appendChild(IconImg);
              serverDiv.appendChild(uServerDiv);
              serverDiv.appendChild(serverNameP);

              serverList.appendChild(serverDiv);
            });
          });
        } else {
          return response.json().then((data) => {
            if (errorData.error) {
              document.getElementById("message").innerHTML =
                data.error.description;
            }
          });
        }
      })
      .catch((error) => {
        document.getElementById("message").innerHTML = "Ocurrio un error";
      });
  }
}

function get_channels(server_id) {
  const channelListDiv = document.createElement("div");
  channelListDiv.id = "channel-list";

  const addChannelDiv = document.createElement("div");
  addChannelDiv.id = "add-channel";

  const addButton = document.createElement("button");
  addButton.id = "btn-new-channel";
  addButton.textContent = "Agregar Canal";

  addButton.addEventListener("click", function () {
    newChannelForm(server_id);
  });

  addChannelDiv.appendChild(addButton);

  document.body.appendChild(channelListDiv);
  document.body.appendChild(addChannelDiv);

  get_channels_in_server(server_id);
}

function get_channels_in_server(server_id) {
  const url = `http://127.0.0.1:5000/tchannels?server_id=${server_id}`;

  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          const channelListDiv = document.getElementById("channel-list");
          channelListDiv.innerHTML = "";

          data.channels.forEach((channel) => {
            const channelDiv = document.createElement("div");
            channelDiv.classList.add("channel");

            const channelNameP = document.createElement("p");
            channelNameP.classList.add("channel_name");
            channelNameP.textContent = `# ${channel.channel_name}`;

            channelDiv.addEventListener("click", function () {
              cleanChatbox();
              // alert(channel.channel_id)
              open_channel_chatbox(channel.channel_id);
              // alert(`Canal seleccionado: ${channel.channel_id}`);
            });

            channelDiv.appendChild(channelNameP);
            channelListDiv.appendChild(channelDiv);
          });
        });
      } else {
        return response.json().then((data) => {
          alert("Ocurrio un error");
        });
      }
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = "Ocurrió un error.";
    });
}

function newChannelForm(server_id) {
  // Crear el div principal con clase "create-channel-screen"
  const createChannelScreenDiv = document.createElement("div");
  createChannelScreenDiv.classList.add("create-channel-screen");

  // Crear el div con clase "container"
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("container");

  // Crear el título h1 con id "title"
  const titleH1 = document.createElement("h1");
  titleH1.id = "title";
  titleH1.textContent = "Nuevo Canal";

  // Crear el formulario con id "authForm"
  const form = document.createElement("form");
  form.id = "authForm";

  // Crear el div con clase "form-field"
  const formFieldDiv = document.createElement("div");
  formFieldDiv.classList.add("form-field");

  // Crear la etiqueta "label"
  const label = document.createElement("label");
  label.setAttribute("for", "channel_name");
  label.textContent = "Nombre:";

  // Crear el input con clase "input-box" y los atributos necesarios
  const input = document.createElement("input");
  input.classList.add("input-box");
  input.setAttribute("type", "text");
  input.setAttribute("name", "channel_name");
  input.setAttribute("id", "channel_name");
  input.setAttribute("required", true);

  // Crear el botón "Crear" con tipo "submit" y id "auth-btn"
  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.id = "auth-btn";
  submitButton.textContent = "Crear";

  // Crear el botón "Cancelar" con id "cancel-btn"
  const cancelButton = document.createElement("button");
  cancelButton.id = "cancel-btn";
  cancelButton.textContent = "Cancelar";

  // Agregar eventos de clic a los botones
  submitButton.addEventListener("click", onCrearButtonClick);
  cancelButton.addEventListener("click", onCancelarButtonClick);

  // Función que se ejecuta cuando se hace clic en el botón "Crear"
  function onCrearButtonClick(event) {
    event.preventDefault(); // Evita que el formulario se envíe si está dentro de un formulario
    // Agrega aquí el código que deseas ejecutar cuando se hace clic en "Crear"
    createChannel(server_id);
  }

  // Función que se ejecuta cuando se hace clic en el botón "Cancelar"
  function onCancelarButtonClick() {
    // Agrega aquí el código que deseas ejecutar cuando se hace clic en "Cancelar"
    window.location.href = "../index.html";
  }

  // Crear el div con id "message"
  const messageDiv = document.createElement("div");
  messageDiv.id = "message";

  // Agregar los elementos al formulario y al div principal
  formFieldDiv.appendChild(label);
  formFieldDiv.appendChild(input);
  form.appendChild(formFieldDiv);
  form.appendChild(submitButton);
  form.appendChild(cancelButton);
  containerDiv.appendChild(titleH1);
  containerDiv.appendChild(form);
  containerDiv.appendChild(messageDiv);
  createChannelScreenDiv.appendChild(containerDiv);

  // Insertar el div principal en el body
  document.body.appendChild(createChannelScreenDiv);
}

function createChannel(server_id) {
  const data = {
    channel_name: document.getElementById("channel_name").value,
    server_id: server_id,
  };
  fetch("http://127.0.0.1:5000/tchannels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json().then((data) => {
          alert(data.message);
          window.location.href = "../index.html";
        });
      } else {
        return response.json().then((data) => {
          alert(data.error.description);
        });
      }
    })
    .catch((error) => {
      alert("Ocurrio un error");
    });
}

function open_channel_chatbox(channel_id) {
  // Crear el contenedor principal con clase "chat-container"
  const chatContainerDiv = document.createElement("div");
  chatContainerDiv.classList.add("chat-container");

  // Crear el cuadro de chat con clase "chat-box" y id "chatBox"
  const chatBoxDiv = document.createElement("div");
  chatBoxDiv.classList.add("chat-box");
  chatBoxDiv.id = "chatBox";

  // Crear el campo de entrada de texto con tipo "text" y id "messageInput" con un atributo de marcador de posición (placeholder)
  const messageInput = document.createElement("input");
  messageInput.setAttribute("type", "text");
  messageInput.id = "messageInput";
  messageInput.setAttribute("placeholder", "Escribe un mensaje...");

  // Crear el botón con id "sendBtn" y texto "Enviar" y agregar un evento de clic
  const sendButton = document.createElement("button");
  sendButton.id = "sendBtn";
  sendButton.textContent = "Enviar";
  sendButton.addEventListener("click", sendMessage);

  function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    // Get the user's username from the profile
    const username = document.getElementById("profile-card").innerText;

    const data = {
      message_body: message,
      channel_id: channel_id,
    };

    fetch("http://127.0.0.1:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json().then((data) => {
            // Aquí pasamos el message_id al llamar a addMessage
            addMessage(
              username,
              message,
              new Date().toISOString(),
              data.message_id // Agrega el ID del mensaje
            );
            messageInput.value = ""; // Clear the input field
          });
        } else {
          return response.json().then((data) => {
            alert(data.error.name);
          });
        }
      })
      .catch((error) => {
        alert("Ocurrió un error");
      });
  }

  // Agregar todos los elementos al contenedor principal
  chatContainerDiv.appendChild(chatBoxDiv);
  chatContainerDiv.appendChild(messageInput);
  chatContainerDiv.appendChild(sendButton);

  // Insertar el contenedor principal en el cuerpo (body) del documento
  document.body.appendChild(chatContainerDiv);

  // Cargar los mensajes del canal correspondiente
  load_channel_messages(channel_id);
}

function addMessage(username, message, date) {
  const fDate = new Date(date);
  const chatBox = document.getElementById("chatBox");
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");

  const messageContent = document.createElement("p");
  messageContent.textContent = `>> ${username} (${fDate.getDate()}/${fDate.getMonth()} ${fDate.getHours()}:${fDate.getMinutes()}): ${message}`;

  const editButton = document.createElement("button");
  editButton.textContent = "Editar";
  editButton.addEventListener("click", function () {
    editMessage(newMessage, message);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", function () {
    deleteMessage(newMessage);
  });

  newMessage.appendChild(messageContent);
  newMessage.appendChild(editButton);
  newMessage.appendChild(deleteButton);

  chatBox.appendChild(newMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// function editMessage(messageElement, originalMessage) {
//   const newMessage = prompt("Editar mensaje:", originalMessage);
//   if (newMessage !== null) {
//     const messageContent = messageElement.querySelector("p");
//     messageContent.textContent = newMessage;
//   }
// }

// function deleteMessage(messageElement) {
//   const confirmDelete = confirm("¿Seguro que deseas eliminar este mensaje?");
//   if (confirmDelete) {
//     messageElement.remove();
//   }
// }

function cleanScreen() {
  // Eliminar el div con ID "channel-list" si existe
  const channelListDiv = document.getElementById("channel-list");
  if (channelListDiv) {
    channelListDiv.parentNode.removeChild(channelListDiv);
  }

  // Eliminar el div con ID "add-channel" si existe
  const addChannelDiv = document.getElementById("add-channel");
  if (addChannelDiv) {
    addChannelDiv.parentNode.removeChild(addChannelDiv);
  }

  // Eliminar todos los elementos con la clase "chat-container" y sus hijos
  const chatContainers = document.querySelectorAll(".chat-container");
  chatContainers.forEach(function (container) {
    container.parentNode.removeChild(container);
  });
}

function cleanChatbox() {
  // Eliminar todos los elementos con la clase "chat-container" y sus hijos
  const chatContainers = document.querySelectorAll(".chat-container");
  chatContainers.forEach(function (container) {
    container.parentNode.removeChild(container);
  });
}

function load_channel_messages(channel_id) {
  fetch(`http://127.0.0.1:5000/messages?channel_id=${channel_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          const messages = data.messages; // Supongamos que los mensajes están en data.messages
          const chatBox = document.getElementById("chatBox");

          // Limpia el chatbox antes de agregar los mensajes
          chatBox.innerHTML = "";

          // Agrega cada mensaje al chatbox usando la función addMessage
          messages.forEach((message) => {
            addMessage(
              message.username,
              message.message_body,
              message.creation_date
            );
          });
        });
      } else {
        return response.json().then((data) => {
          if (errorData.error) {
            document.getElementById("message").innerHTML =
              data.error.description;
          }
        });
      }
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = "Ocurrió un error";
    });
}
