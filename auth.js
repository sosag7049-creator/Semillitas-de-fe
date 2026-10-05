import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { createTeacherStore, request } from "./teacher-store.js";
import { mountTeacherPanel } from "./teacher-panel.js";

// Capture the callback before Supabase consumes the URL. Never log tokens.
const callbackParams = new URLSearchParams(location.hash.slice(1));
const queryParams = new URLSearchParams(location.search);
const callbackError = callbackParams.get("error_description") || queryParams.get("error_description") || callbackParams.get("error") || queryParams.get("error");
const returnedFromAuth = callbackParams.has("access_token") || queryParams.has("code") || Boolean(callbackError);
const supabase = createClient("https://wadfxtlbznxmbutkihkr.supabase.co", "sb_publishable_5WPEB0l9NkOyynXkuSEsEQ_dVN9JO2R", {
  auth: { detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
});
let session = null;
let favoritesChannel = null;
let sessionRevision = 0;

document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="/auth.css"><link rel="stylesheet" href="/auth-fixes.css?v=2"><link rel="stylesheet" href="/sion-ui.css?v=3"><link rel="stylesheet" href="/account-ui.css?v=3">');
const bibleIcon = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M10 15.5C10 12.5 12.5 10 15.5 10H30c3 0 5 2 5 5v37H16c-3.3 0-6-2.7-6-6V15.5Z" fill="currentColor" opacity=".92"/><path d="M54 15.5C54 12.5 51.5 10 48.5 10H34c-3 0-5 2-5 5v37h19c3.3 0 6-2.7 6-6V15.5Z" fill="#fff8df" opacity=".95"/><path d="M16 18h12M16 24h12M39 18h10M39 24h10" stroke="#f0bd55" stroke-width="3" stroke-linecap="round"/><path d="M32 24v14M25 31h14" stroke="#e67b55" stroke-width="3.5" stroke-linecap="round"/></svg>';
const accountIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.2" fill="currentColor"/><path d="M5.5 20c.6-3.2 2.7-5 6.5-5s5.9 1.8 6.5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
const profileAvatars = [
  ['semilla','Semillita'], ['biblia','Biblia'], ['maestra','Maestra'],
  ['maestro','Maestro'], ['leon','León'], ['noe','Noé'], ['david','David'], ['paloma','Paloma']
];
let selectedAvatar = 'semilla';
const avatarById = id => profileAvatars.find(item => item[0] === id) || profileAvatars[0];
const avatarMarkup = id => `<span class="avatar-art avatar-art-${avatarById(id)[0]}" aria-hidden="true"></span>`;
document.body.insertAdjacentHTML("beforeend", `
<button class="account-launch" id="accountLaunch" aria-label="Abrir mi cuenta"><span class="account-icon">${accountIcon}</span><span>Mi cuenta</span></button>
<dialog class="account-dialog" id="accountDialog" aria-labelledby="accountTitle">
  <div class="account-head"><div><span class="account-cover-icon" aria-hidden="true">${accountIcon}</span><small>SEMILLITAS DE FE</small><h2 id="accountTitle">Mi cuenta</h2><p>Tu espacio para preparar y compartir la fe.</p></div><button class="account-close" id="accountClose" type="button" aria-label="Cerrar mi cuenta">×</button></div>
  <div id="accountStatus" class="account-status" role="status" aria-live="polite"></div>
  <section id="guestView">
    <div class="google-area">
      <button class="google-button" id="googleSignIn" type="button"><span class="google-g" aria-hidden="true">G</span> Continuar con Google</button>
      <div class="account-divider"><span>o usa tu correo</span></div>
    </div>
    <div class="account-tabs"><button class="active" data-tab="login">Iniciar sesión</button><button data-tab="signup">Crear cuenta</button></div>
    <form id="loginForm" class="account-form">
      <label>Correo electrónico<input name="email" type="email" autocomplete="email" required></label>
      <label>Contraseña<span class="password-field"><input name="password" type="password" autocomplete="current-password" minlength="8" required><button class="password-toggle" type="button" aria-label="Mostrar contraseña" title="Mostrar contraseña">👁️</button></span></label>
      <button class="account-primary" type="submit">Entrar</button>
      <button class="account-link" type="button" id="resetPassword">Olvidé mi contraseña</button>
    </form>
    <form id="signupForm" class="account-form" hidden>
      <label>Nombre del maestro o maestra<input name="display_name" autocomplete="name" maxlength="80" required></label>
      <label>Correo electrónico<input name="email" type="email" autocomplete="email" required></label>
      <label>Contraseña (mínimo 8 caracteres)<span class="password-field"><input name="password" type="password" autocomplete="new-password" minlength="8" required><button class="password-toggle" type="button" aria-label="Mostrar contraseña" title="Mostrar contraseña">👁️</button></span></label>
      <label class="adult-check"><input name="adult" type="checkbox" required> Confirmo que soy maestro/a o adulto responsable.</label>
      <p class="account-note">Las cuentas son solamente para adultos. En la agenda utiliza solo el nombre de pila y día/mes de los cumpleaños; evita información sensible.</p>
      <button class="account-primary" type="submit">Crear cuenta gratuita</button>
    </form>
  </section>
  <section id="memberView" hidden>
    <div class="account-welcome"><span class="account-avatar" id="profileAvatar">${avatarMarkup('semilla')}</span><div><strong id="profileName">Maestro/a</strong><small id="profileEmail"></small></div></div>
    <button class="account-panel-link" id="openTeacherPanel" type="button"><span class="mini-bible">${bibleIcon}</span> Abrir mi panel de maestro</button>
    <button class="account-panel-link" id="openTeacherAgenda" type="button">📅 Agenda del maestro</button>
    <form id="profileForm" class="account-form">
      <label>Nombre para mostrar<input name="display_name" maxlength="80"></label>
      <label>Iglesia (opcional)<input name="church_name" maxlength="120"></label>
      <fieldset class="avatar-picker"><legend>Elige tu avatar</legend><div class="avatar-options">${profileAvatars.map(([id,label]) => `<button type="button" class="avatar-choice" data-avatar="${id}" aria-label="Avatar ${label}" aria-pressed="false"><span class="avatar-art avatar-art-${id}" aria-hidden="true"></span><small>${label}</small></button>`).join('')}</div><input type="hidden" name="avatar_id" value="semilla"></fieldset>
      <button class="account-primary" type="submit">Guardar perfil</button>
    </form>
    <div class="account-summary"><strong id="favoriteCount">0</strong><span>lecciones favoritas</span></div>
    <button class="account-secondary" id="signOut" type="button">Cerrar sesión</button>
  </section>
</dialog>`);
const sionLaunch = document.getElementById("jerubiLaunch");
if (sionLaunch) sionLaunch.innerHTML = '<span class="sion-launch-icon"><img class="sion-bible-img" src="/icons/sion-bible.webp?v=3" alt=""></span>';
const sionAvatar = document.querySelector(".jerubi-avatar");
if (sionAvatar) sionAvatar.innerHTML = '<img class="sion-bible-img" src="/icons/sion-bible.webp?v=3" alt="">';
const sionPanel = document.getElementById("jerubiPanel");
const sionClose = document.getElementById("jerubiClose");
const closeSion = () => {
  sionPanel?.classList.remove("is-open");
  sionPanel?.setAttribute("aria-hidden", "true");
  document.getElementById("jerubiLaunch")?.setAttribute("aria-expanded", "false");
};
sionClose?.addEventListener("pointerdown", event => { event.preventDefault(); closeSion(); });
sionClose?.addEventListener("click", closeSion);
void import("./sion-ai.js?v=2").catch(() => {});

const dialog = document.getElementById("accountDialog");
const statusBox = document.getElementById("accountStatus");
const guestView = document.getElementById("guestView");
const memberView = document.getElementById("memberView");
const showStatus = (message, error = false) => {
  statusBox.textContent = message || "";
  statusBox.classList.toggle("error", error);
};
const humanError = error => {
  const message = error?.message || "No fue posible completar la acción.";
  if (/Invalid login credentials/i.test(message)) return "El correo o la contraseña no son correctos.";
  if (/already registered|already been registered/i.test(message)) return "Este correo ya tiene una cuenta.";
  if (/rate limit/i.test(message)) return "Espera un momento antes de intentarlo otra vez.";
  if (/expired|otp_expired/i.test(message)) return "El enlace ya venció o fue utilizado. Intenta iniciar sesión; si no funciona, crea la cuenta nuevamente.";
  if (/email.*not confirmed/i.test(message)) return "Primero confirma tu correo usando el enlace que te enviamos.";
  if (/abort|fetch|network|timeout|failed to load/i.test(message)) return "No se pudo confirmar la conexión. Revisa tu internet y vuelve a intentarlo.";
  return message;
};
const openAccount = (message = "") => {
  showStatus(message);
  if (!dialog.open) dialog.showModal();
};
const lessons = window.Semillitas.lessons;
const teacherStore = createTeacherStore(supabase, lessons.map(lesson => lesson.id));
const teacherPanel = mountTeacherPanel({ store: teacherStore, lessons, openAccount, errorMessage: humanError, client: supabase });
teacherStore.subscribe(state => {
  document.getElementById("favoriteCount").textContent = state.loaded.favorites ? String(state.favorites.size) : "—";
});
document.getElementById("openTeacherPanel").addEventListener("click", () => teacherPanel.open());
document.getElementById("openTeacherAgenda").addEventListener("click", () => teacherPanel.open("agenda"));
document.addEventListener("click", event => { if(event.target.closest("[data-open-agenda]")) { event.preventDefault(); teacherPanel.open("agenda"); } });
const panelLink = document.createElement("a");
panelLink.href = "#mi-panel"; panelLink.textContent = "Mi panel"; panelLink.className = "teacher-nav-link";
panelLink.addEventListener("click", event => { event.preventDefault(); teacherPanel.open(); });
document.querySelector(".links")?.append(panelLink);
if (!document.querySelector('.links a[href="/juegos/"]')) {
  const gamesLink = document.createElement('a');
  gamesLink.href = '/juegos/'; gamesLink.textContent = 'Juegos'; gamesLink.className = 'teacher-nav-link';
  document.querySelector('.links')?.insertBefore(gamesLink, panelLink);
}

document.querySelectorAll(".password-toggle").forEach(button => button.addEventListener("click", () => {
  const input = button.parentElement.querySelector("input");
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  button.textContent = showing ? "👁️" : "🙈";
  button.setAttribute("aria-label", showing ? "Mostrar contraseña" : "Ocultar contraseña");
  button.title = showing ? "Mostrar contraseña" : "Ocultar contraseña";
}));

document.getElementById("accountLaunch").addEventListener("click", () => session ? teacherPanel.open() : openAccount());
document.getElementById("accountClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

document.getElementById("googleSignIn").addEventListener("click", async event => {
  const button = event.currentTarget;
  button.disabled = true;
  showStatus("Abriendo Google…");
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://semillitasbiblicas.space" }
    });
    if (error) throw error;
  } catch (error) {
    showStatus("No pudimos abrir Google: " + humanError(error), true);
  } finally { button.disabled = false; }
});

document.querySelectorAll(".account-tabs button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".account-tabs button").forEach(item => item.classList.toggle("active", item === button));
  document.getElementById("loginForm").hidden = button.dataset.tab !== "login";
  document.getElementById("signupForm").hidden = button.dataset.tab !== "signup";
  showStatus("");
}));

document.getElementById("signupForm").addEventListener("submit", async event => {
  event.preventDefault();
  const element = event.currentTarget;
  const submit = element.querySelector('button[type="submit"]');
  submit.disabled = true;
  const form = new FormData(element);
  showStatus("Creando tu cuenta…");
  try {
    const { data, error } = await supabase.auth.signUp({
    email: String(form.get("email")).trim(),
    password: String(form.get("password")),
    options: {
      data: { display_name: String(form.get("display_name")).trim(), role: "teacher" },
      emailRedirectTo: "https://semillitasbiblicas.space"
    }
    });
    if (error) throw error;
    element.reset();
    if (data.session) showStatus("✅ ¡Cuenta creada correctamente! Ya puedes abrir tu panel.");
    else showStatus("✅ Revisa tu correo (también Spam) para confirmar el registro. Si ya tenías una cuenta, puedes iniciar sesión o recuperar tu contraseña.");
  } catch (error) { showStatus("No pudimos crear la cuenta: " + humanError(error), true); }
  finally { submit.disabled = false; }
});

document.getElementById("loginForm").addEventListener("submit", async event => {
  event.preventDefault();
  const element = event.currentTarget;
  const submit = element.querySelector('button[type="submit"]');
  submit.disabled = true;
  const form = new FormData(element);
  showStatus("Ingresando…");
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password"))
    });
    if (error) throw error;
    element.reset();
    applySession(data.session);
    teacherPanel.open();
  } catch (error) { showStatus("No pudimos iniciar sesión: " + humanError(error), true); }
  finally { submit.disabled = false; }
});

document.getElementById("resetPassword").addEventListener("click", async event => {
  const email = document.querySelector('#loginForm input[name="email"]').value.trim();
  if (!email) return showStatus("Escribe primero tu correo electrónico.", true);
  const button = event.currentTarget;
  button.disabled = true;
  showStatus("Enviando instrucciones…");
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://semillitasbiblicas.space" });
    if (error) throw error;
    showStatus("Revisa tu correo para cambiar la contraseña.");
  } catch (error) { showStatus(humanError(error), true); }
  finally { button.disabled = false; }
});

document.getElementById("signOut").addEventListener("click", async event => {
  if (!teacherPanel.mayDiscard()) return;
  const button = event.currentTarget; button.disabled = true;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    applySession(null); dialog.close();
  } catch (error) { showStatus("No se pudo cerrar la sesión: " + humanError(error), true); }
  finally { button.disabled = false; }
});

document.getElementById("profileForm").addEventListener("submit", async event => {
  event.preventDefault();
  if (!session) return;
  const element = event.currentTarget, form = new FormData(element), userId = session.user.id;
  const submit = element.querySelector('button[type="submit"]'); submit.disabled = true;
  showStatus("Guardando…");
  try {
    const avatarId = avatarById(String(form.get("avatar_id") || selectedAvatar))[0];
    const { data } = await request(supabase.from("profiles").update({
      display_name: String(form.get("display_name")).trim(),
      church_name: String(form.get("church_name")).trim(),
      updated_at: new Date().toISOString()
    }).eq("id", userId).select("display_name,church_name").single());
    const updatedMetadata = { ...(session.user.user_metadata || {}), display_name: String(form.get("display_name")).trim(), avatar_id: avatarId };
    const { error: metadataError } = await supabase.auth.updateUser({ data: updatedMetadata });
    if (metadataError) throw metadataError;
    if (session?.user.id !== userId) return;
    showStatus("Perfil guardado.");
    document.getElementById("profileName").textContent = data.display_name || "Maestro/a";
    setProfileAvatar(avatarId);
    teacherPanel.setName(data.display_name);
  } catch (error) { if (session?.user.id === userId) showStatus(humanError(error), true); }
  finally { submit.disabled = false; }
});

async function loadProfile(user, revision) {
  try {
    const { data } = await request(supabase.from("profiles").select("display_name,church_name").eq("id", user.id).maybeSingle());
    if (revision !== sessionRevision || session?.user.id !== user.id) return;
    const name = data?.display_name || user.user_metadata?.display_name || user.user_metadata?.full_name || "";
    document.getElementById("profileName").textContent = name || "Maestro/a";
    document.querySelector('#profileForm input[name="display_name"]').value = name;
    document.querySelector('#profileForm input[name="church_name"]').value = data?.church_name || "";
    setProfileAvatar(user.user_metadata?.avatar_id || 'semilla');
    teacherPanel.setName(name);
  } catch (error) {
    if (revision === sessionRevision) showStatus("No se pudo cargar tu perfil: " + humanError(error), true);
  }
}

function applySession(nextSession) {
  const changed = session?.user.id !== nextSession?.user.id;
  session = nextSession;
  guestView.hidden = Boolean(session); memberView.hidden = !session;
  const launch = document.getElementById("accountLaunch");
  launch.innerHTML = session ? `<span class="account-icon profile-launch-avatar">${avatarMarkup(session.user.user_metadata?.avatar_id || 'semilla')}</span><span>Mi panel</span>` : `<span class="account-icon">${accountIcon}</span><span>Mi cuenta</span>`;
  launch.setAttribute("aria-label", session ? "Abrir mi panel de maestro" : "Abrir mi cuenta");
  // Clear the previous account synchronously before starting any new requests.
  teacherStore.setUser(session?.user || null);
  if (!changed) return;
  sessionRevision++;
  if (favoritesChannel) { supabase.removeChannel(favoritesChannel); favoritesChannel = null; }
  document.getElementById("profileForm").reset();
  document.getElementById("profileName").textContent = "Maestro/a";
  document.getElementById("profileEmail").textContent = session?.user.email || "";
  setProfileAvatar(session?.user.user_metadata?.avatar_id || 'semilla');
  if (session) {
    loadProfile(session.user, sessionRevision);
    const userId = session.user.id;
    const refresh = () => { if (session?.user.id === userId) teacherStore.refresh(); };
    favoritesChannel = supabase.channel("lesson-favorites-" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "lesson_favorites", filter: "user_id=eq." + userId }, refresh)
      .subscribe(status => { if (status === "SUBSCRIBED") refresh(); });
  }
}

function setProfileAvatar(id) {
  selectedAvatar = avatarById(id)[0];
  const hidden = document.querySelector('#profileForm input[name="avatar_id"]');
  if (hidden) hidden.value = selectedAvatar;
  const avatar = document.getElementById('profileAvatar');
  if (avatar) avatar.innerHTML = avatarMarkup(selectedAvatar);
  document.querySelectorAll('.avatar-choice').forEach(button => {
    const active = button.dataset.avatar === selectedAvatar;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.dispatchEvent(new CustomEvent('semillitas:avatar-changed', { detail: { id: selectedAvatar } }));
}
document.addEventListener('semillitas:avatar-changed', event => {
  const headerAvatar = document.getElementById('teacherHeaderAvatar');
  if (headerAvatar) headerAvatar.className = `avatar-art avatar-art-${avatarById(event.detail?.id)[0]}`;
});
document.querySelectorAll('.avatar-choice').forEach(button => button.addEventListener('click', () => setProfileAvatar(button.dataset.avatar)));

// Subscribe before loading so a concurrent sign-out cannot restore an old session.
let authEventRevision = 0;
supabase.auth.onAuthStateChange((event, nextSession) => {
  const revision = ++authEventRevision;
  setTimeout(() => { if (revision === authEventRevision) applySession(nextSession); }, 0);
});
const initialRevision = authEventRevision;
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (initialRevision === authEventRevision) applySession(data.session);
  if (returnedFromAuth) {
    openAccount();
    if (callbackError) showStatus("No se pudo completar el acceso: " + humanError({ message: callbackError }), true);
    else if (data.session) showStatus("✅ Tu sesión está activa. Ya puedes abrir tu panel.");
    else showStatus("No se pudo confirmar tu sesión. Intenta iniciar sesión de nuevo.", true);
    const clean = new URL(location.href);
    ["code", "error", "error_code", "error_description"].forEach(key => clean.searchParams.delete(key));
    if (callbackParams.has("access_token") || callbackParams.has("error")) clean.hash = "";
    history.replaceState({}, document.title, clean.pathname + clean.search + clean.hash);
  }
} catch (error) { openAccount("No se pudo recuperar tu sesión: " + humanError(error)); }
window.addEventListener("online", () => teacherStore.refresh());
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") teacherStore.refresh(); });
