const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url_user_id = urlParams.get('user_id');

window.addEventListener('load', function () {
    getProfile()
});

document.getElementById("authForm").addEventListener("submit", function (event) {
    event.preventDefault();
    edit_user()
});

function edit_user() {
    const data = {
        username: document.getElementById("username").value,
        user_id: parseInt(url_user_id)
    }
    const url = `http://127.0.0.1:5000/users/${parseInt(url_user_id)}`;

        fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                window.location.href = "profile.html";
        })
        } else {
            return response.json().then(data => {
                alert(data.error.description);
            });
        }
    })
    .catch(error => {
        alert("Ocurrió un error.");
    });
    };

function getProfile() {
    const url = "http://127.0.0.1:5000/auth/profile";
    
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                document.getElementById("username").value = data.username; // Actualiza el campo de nombre de usuario
                if (data.image != null) {
                    document.getElementById("avatar").src = data.image;
                }
        })
        } else {
            return response.json().then(data => {
                alert(data.error.description);
            });
        }
    })
    .catch(error => {
        alert("Ocurrió un error.");
    });
}
