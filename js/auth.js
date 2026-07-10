import { auth, db } from "../firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");
const errorBox = document.getElementById("error");

const roleRedirects = {
  uczen: "uczen/panel.html",
  nauczyciel: "nauczyciel/panel.html"
};

function showError(message = "") {
  errorBox.textContent = message;
}

function getFriendlyError(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "Podaj poprawny adres email.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Nieprawidłowy email lub hasło.";
    case "auth/too-many-requests":
      return "Za dużo prób logowania. Spróbuj ponownie za chwilę.";
    case "auth/unauthorized-domain":
      return "Ta domena nie jest dodana w Firebase Authentication. Dodaj localhost albo 127.0.0.1 w Authorized domains.";
    case "auth/network-request-failed":
      return "Brak połączenia z Firebase. Sprawdź internet albo uruchom stronę przez lokalny serwer.";
    case "app/profile-not-found":
      return "Konto nie ma jeszcze profilu w dzienniku.";
    case "app/role-not-found":
      return "Konto nie ma przypisanej roli.";
    default:
      if (error?.code) {
        return `Nie udało się zalogować. Kod błędu: ${error.code}.`;
      }

      return "Nie udało się zalogować. Spróbuj ponownie.";
  }
}

if (window.location.protocol === "file:") {
  showError("Uruchom stronę przez lokalny serwer, np. http://localhost, a nie przez dwuklik pliku.");
}

async function getUserRole(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    const error = new Error("Profile not found");
    error.code = "app/profile-not-found";
    throw error;
  }

  return snapshot.data().role;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showError();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showError("Wpisz email i hasło.");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Logowanie...";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const role = await getUserRole(userCredential.user.uid);
    const redirectPath = roleRedirects[role];

    if (!redirectPath) {
      const error = new Error("Role not found");
      error.code = "app/role-not-found";
      throw error;
    }

    window.location.assign(redirectPath);
  } catch (error) {
    console.error(error);
    showError(getFriendlyError(error));
    loginButton.disabled = false;
    loginButton.textContent = "Zaloguj";
  }
});
