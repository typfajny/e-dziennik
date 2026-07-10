import { auth, db } from "../firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const rolePanels = {
  uczen: "../uczen/panel.html",
  nauczyciel: "../nauczyciel/panel.html"
};

export function requireRole(expectedRole, onReady) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.replace("../index.html");
      return;
    }

    try {
      const profile = await getDoc(doc(db, "users", user.uid));

      if (!profile.exists()) {
        window.location.replace("../index.html");
        return;
      }

      const role = profile.data().role;

      if (role !== expectedRole) {
        window.location.replace(rolePanels[role] || "../index.html");
        return;
      }

      if (typeof onReady === "function") {
        await onReady(user, profile.data());
      }
    } catch (error) {
      console.error(error);
      window.location.replace("../index.html");
    }
  });
}

export function setupLogout(buttonId = "logout") {
  const button = document.getElementById(buttonId);

  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    button.disabled = true;
    await signOut(auth);
    window.location.replace("../index.html");
  });
}
