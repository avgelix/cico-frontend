var keycloak = new Keycloak();

var serviceUrl = 'http://127.0.0.1:3000/service'

window.onload = function () {
    const init = keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then(function () {
        if (keycloak.authenticated) {
            console.log("authenticated");
            authenticated();
            window.location.href = 'home.html';
        } else {
            console.log("nope");
            notAuthenticated();
        }

        document.body.style.display = 'block';
    });
}

function notAuthenticated() {
    document.getElementById('not-authenticated').style.display = 'block';
    document.getElementById('authenticated').style.display = 'none';
}

function authenticated() {
    document.getElementById('not-authenticated').style.display = 'none';
    document.getElementById('authenticated').style.display = 'block';
    document.getElementById('message').innerHTML = 'User: ' + keycloak.tokenParsed['preferred_username'];
    postrequest('public');
}

function logoutAndRedirect() {
    keycloak.logout({ redirectUri: 'http://localhost:8080/dummy-frontend' });
}

function getrequest(endpoint) {
    var req = function () {
        var req = new XMLHttpRequest();
        var output = document.getElementById('message');
        req.open('GET', serviceUrl + '/' + endpoint, true);

        if (keycloak.authenticated) {
            req.setRequestHeader('Authorization', 'Bearer ' + keycloak.token);
        }

        req.onreadystatechange = function () {
            console.log(req.readyState);
            console.log(req.status);
            if (req.readyState == 4) {
                if (req.status == 200) {
                    try {
                        console.log(req);
                        output.innerHTML = 'Success: ' + JSON.parse(req.responseText).message;
                    } catch (error) {
                        // Handle the parsing error (e.g., show an error message, fallback to default value, etc.)
                        console.error("There is an error parsing JSON response:", error);
                    }
                } else if (req.status == 0) {
                    output.innerHTML = '<span class="error">Request failed</span>';
                } else {
                    console.log(req);
                    console.log(req.status + ' ' + req.statusText);
                    output.innerHTML = '<span class="error">You do not have the necessary permissions to access Cico this way. Sorry :( </span>';
                }
            }
        };

        req.send();
    };

    if (keycloak.authenticated) {
        keycloak.updateToken(30).then(req);
    } else {
        req();
    }
};

function postrequest(endpoint) {
    var req = function () {
        var req = new XMLHttpRequest();
        req.open('POST', serviceUrl + '/' + endpoint, true);

        if (keycloak.authenticated) {
            req.setRequestHeader('Authorization', 'Bearer ' + keycloak.token);

            req.onreadystatechange = function () {
                console.log(req.readyState);
                console.log(req.status);
            }

            req.send();
        };
    }

    if (keycloak.authenticated) {
        keycloak.updateToken(30).then(req);
    } else {
        req();
    }
};

keycloak.onAuthLogout = notAuthenticated;
