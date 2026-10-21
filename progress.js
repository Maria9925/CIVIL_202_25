/* CIVIL202 - place this file in book/_static/progress.js (Jupyter Book v1).
   Set the Supabase values below and adjust EXERCISES paths.
   Browser publishable key is public; NEVER insert a service_role/secret key. */
(async function () {
  'use strict';
  const SUPABASE_URL = 'https://kaflloebqtgwstcpnywa.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_fx7AOQeXAmJavxqUZt4FOQ_i_SobgIP';
  // Edit paths to match the published HTML URL paths after /Course_Problems/.
  const EXERCISES = {
    'Module1FluidProperties_SolV2.html': 'Module 1 - Fluid Properties'
  };
  const root = document.createElement('section');
  root.setAttribute('aria-label', 'CIVIL202 exercise tracking');
  root.style.cssText = 'border:1px solid #b7c8c7;border-radius:10px;padding:14px;margin:16px 0;background:#f6fbfa;color:#173d38;max-width:720px;font:15px system-ui,sans-serif';
  const header = document.createElement('strong');
  header.textContent = 'CIVIL202 · Exercise progress';
  const status = document.createElement('div');
  status.style.marginTop = '8px';
  const controls = document.createElement('div');
  controls.style.marginTop = '10px';
  root.append(header, status, controls);
  const host = document.querySelector('main article') || document.querySelector('main') || document.body;
  host.prepend(root);
  const renderText = (message) => { status.textContent = message; };
  function button(text, callback) {
    const el = document.createElement('button');
    el.type = 'button'; el.textContent = text;
    el.style.cssText = 'margin:5px 9px 5px 0;padding:8px 12px;border:1px solid #247c67;border-radius:6px;background:white;color:#195b4d;cursor:pointer';
    el.addEventListener('click', callback);
    controls.appendChild(el);
    return el;
  }
  function getExercise() {
    const path = decodeURIComponent(location.pathname).replace(/^\/+|\/+$/g, '');
    return Object.entries(EXERCISES).find(([suffix]) => path.endsWith('/' + suffix) || path === suffix);
  }
  if (SUPABASE_URL.includes('YOUR-PROJECT') || SUPABASE_PUBLISHABLE_KEY.includes('YOUR-PUBLISHABLE')) {
    renderText('Teacher setup needed: add Supabase URL and publishable key in progress.js.'); return;
  }
  const sdk = document.createElement('script');
  sdk.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  try {
    await new Promise((resolve, reject) => { sdk.onload=resolve; sdk.onerror=reject; document.head.append(sdk); });
  } catch { renderText('Could not load sign-in service. Please reload later.'); return; }
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  async function draw() {
    controls.replaceChildren();
    const { data: { user }, error } = await db.auth.getUser();
    
   if (error || !user) {
     renderText('Sign in to track your CIVIL202 progress.');
   
     // Email
     const email = document.createElement('input');
     email.type = 'email';
     email.placeholder = 'University email';
     email.autocomplete = 'email';
     email.required = true;
     email.style.cssText =
       'padding:8px;margin:5px;border:1px solid #aaa;border-radius:6px';
   
     // Password
     const password = document.createElement('input');
     password.type = 'password';
     password.placeholder = 'Password';
     password.autocomplete = 'current-password';
     password.required = true;
     password.style.cssText =
       'padding:8px;margin:5px;border:1px solid #aaa;border-radius:6px';
   
     controls.append(email, password);
   
     // Sign in
     button('Sign in', async () => {
       if (!email.reportValidity() || !password.reportValidity()) {
         return;
       }
   
       const { error: signInError } =
         await db.auth.signInWithPassword({
           email: email.value.trim(),
           password: password.value
         });
   
       if (signInError) {
         renderText('Sign-in error: ' + signInError.message);
       } else {
         await draw();
       }
     });
   
     return;
   }

    const {data:rows,error:fetchError} = await db.from('exercise_completions').select('exercise_id').eq('user_id',user.id);
    if (fetchError) { renderText('Could not load progress: '+fetchError.message); return; }
    const completed = new Set(rows.map(row=>row.exercise_id));
    const exercise = getExercise();
    renderText(`Signed in as ${user.email}. Completed ${Object.keys(EXERCISES).filter(k=>completed.has(k)).length}/${Object.keys(EXERCISES).length} exercises. Self-reported progress.`);
    if (exercise) {
      const [id,title] = exercise;
      button(completed.has(id) ? `✓ ${title} — Completed (undo)` : `Mark ${title} as completed`, async () => {
        const result = completed.has(id)
          ? await db.from('exercise_completions').delete().eq('exercise_id',id).eq('user_id',user.id)
          : await db.from('exercise_completions').insert({exercise_id:id,user_id:user.id});
        if (result.error) renderText('Could not save: '+result.error.message);
        else await draw();
      });
    }
    button('Sign out', async () => { await db.auth.signOut(); await draw(); });
  }
  await draw();
  db.auth.onAuthStateChange(() => { setTimeout(draw, 0); });
})();
