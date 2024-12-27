import {
    auth,
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    provider
} from "./firebase.js"
let email = document.getElementById("email")

// signUp
const signUp = document.getElementById("signUp")

signUp.addEventListener('click', (e) => {
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let name = document.getElementById("name").value
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            Swal.fire("Sign Up successful!");
            setInterval(window.location.href = "login.html", 60000) // Change to your desired URL
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Swal.fire("Unable to SignUp");

            // ..
        })

})
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid)

    } else {
        console.log('User is signed out')
        // ...
    }
});

let google = document.getElementById("google");
google.addEventListener("click", (e) => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("User signed in:", user);
            Swal.fire("Sign In successful!");
            // Redirect or take other actions here
            setInterval(window.location.href = "index.html", 60000) // Change to your desired URL
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error during sign-in:", errorMessage);
            Swal.fire("Error signing in");
        });
});

// .......................................theme...
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', '')
}

if (darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})
