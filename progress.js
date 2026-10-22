
/* CIVIL202 - Student Progress and Authentication */

(async function () {
  'use strict';

  // SUPABASE CONFIGURATION
  const SUPABASE_URL =
    'https://kaflloebqtgwstcpnywa.supabase.co';

  const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_fx7AOQeXAmJavxqUZt4FOQ_i_SobgIP';

  const EXERCISES = {
    'Module1FluidProperties_SolV2.html':
      'Module 1 - Fluid Properties'
  };

  // CREATE INTERFACE
  const root = document.createElement('section');
  if (document.getElementById('civil202-progress-root')) {
  return;
}
  root.id = 'civil202-progress-root';
  root.setAttribute('aria-label', 'CIVIL202 exercise tracking');

  root.style.cssText = `
    border: 1px solid #b7c8c7;
    border-radius: 10px;
    padding: 14px;
    margin: 16px 0;
    background: #f6fbfa;
    color: #173d38;
    max-width: 720px;
    font: 15px system-ui, sans-serif;
  `;

  const header = document.createElement('strong');
  header.textContent = 'CIVIL202 · Exercise progress';

  const status = document.createElement('div');
  status.style.marginTop = '8px';

  const controls = document.createElement('div');
  controls.style.marginTop = '10px';

  root.append(header, status, controls);

  const host =
    document.querySelector('main article') ||
    document.querySelector('main') ||
    document.body;

  host.prepend(root);

  function renderText(message) {
    status.textContent = message;
  }

  function button(text, callback) {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = text;

    el.style.cssText = `
      margin: 5px 9px 5px 0;
      padding: 8px 12px;
      border: 1px solid #247c67;
      border-radius: 6px;
      background: white;
      color: #195b4d;
      cursor: pointer;
    `;

    el.addEventListener('click', callback);
    controls.appendChild(el);

    return el;
  }

  function getExercise() {
    const path = decodeURIComponent(location.pathname)
      .replace(/^\/+|\/+$/g, '');

    return Object.entries(EXERCISES).find(
      ([suffix]) =>
        path.endsWith('/' + suffix) ||
        path === suffix
    );
  }

  // LOAD SUPABASE
  try {
    if (!window.supabase) {
      const sdk = document.createElement('script');

      sdk.src =
        'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

      await new Promise((resolve, reject) => {
        sdk.onload = resolve;
        sdk.onerror = reject;
        document.head.append(sdk);
      });
    }
  } catch (error) {
    renderText('Could not load Supabase.');
    return;
  }

  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  // MAIN INTERFACE
  let drawing = false;
  async function draw() {
    controls.replaceChildren();

    const {
      data: { user },
      error
    } = await db.auth.getUser();

    // LOGIN FORM
    if (error || !user) {
      renderText(
        'Sign in with your CIVIL202 email and password.'
      );

      const email = document.createElement('input');
      email.type = 'email';
      email.placeholder = 'University email';
      email.required = true;
      email.autocomplete = 'email';

      const password = document.createElement('input');
      password.type = 'password';
      password.placeholder = 'Password';
      password.required = true;
      password.autocomplete = 'current-password';

      email.style.cssText = `
        padding: 8px;
        margin: 5px;
        border: 1px solid #aaa;
        border-radius: 6px;
      `;

      password.style.cssText = email.style.cssText;

      controls.append(email, password);

      button('Sign in', async () => {
        if (
          !email.reportValidity() ||
          !password.reportValidity()
        ) {
          return;
        }

        renderText('Signing in...');

        const { error: signInError } =
          await db.auth.signInWithPassword({
            email: email.value.trim(),
            password: password.value
          });

        if (signInError) {
        renderText('Sign-in error: ' + signInError.message);
      } else {
        window.location.reload();
      }
      });

      return;
    }

 
    // LOAD QUESTION PROGRESS
    const QUESTION_IDS = [
  'module1_basic_properties_q1',
  'module1_basic_properties_q2'
    ];

    const { data: events, error: fetchError } = await db
      .from('question_events')
      .select('question_id, event_type, attempt_number, is_correct')
      .eq('user_id', user.id)
      .in('question_id', QUESTION_IDS);

    if (fetchError) {
      renderText('Could not load progress: ' + fetchError.message);
      return;
    }

    const records = events || [];

    let completed = 0;
    let firstCorrect = 0;
    let secondCorrect = 0;
    let hintsUsed = 0;
    let solutionsViewed = 0;

    for (const id of QUESTION_IDS) {
      const q = records.filter(e => e.question_id === id);
      const attempts = q.filter(e => e.event_type === 'attempt');

      // A question is completed if answered correctly
      // or if the two attempts have been used.
      if (
        attempts.some(e => e.is_correct) ||
        attempts.length >= 2
      ) {
        completed++;
      }

      if (attempts.some(e =>
        e.attempt_number === 1 && e.is_correct
      )) firstCorrect++;

      if (attempts.some(e =>
        e.attempt_number === 2 && e.is_correct
      )) secondCorrect++;

      if (q.some(e => e.event_type === 'hint_viewed')) {
        hintsUsed++;
      }

      if (q.some(e => e.event_type === 'solution_viewed')) {
        solutionsViewed++;
      }
    }

    const total = QUESTION_IDS.length;
    const percentage = Math.round(100 * completed / total);

    // MODULE PROGRESS
    
    // SIMPLE MODULE PROGRESS

    const total = QUESTION_IDS.length;
    const percentage = total > 0
      ? Math.round((completed / total) * 100)
      : 0;

    renderText('');

    const summary = document.createElement('div');

    summary.style.cssText = `
      padding: 6px 0;
      font-family: system-ui, sans-serif;
    `;

    const heading = document.createElement('div');
    heading.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    `;

    const label = document.createElement('strong');
    label.textContent =
      `${completed} of ${total} questions completed`;

    const percent = document.createElement('strong');
    percent.textContent = `${percentage}%`;

    heading.append(label, percent);

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      width: 100%;
      height: 10px;
      background: #dce8e5;
      border-radius: 8px;
      overflow: hidden;
    `;

    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
      width: ${percentage}%;
      height: 100%;
      background: #258b70;
      border-radius: 8px;
      transition: width 0.3s ease;
    `;

    progressBar.append(progressFill);
    summary.append(heading, progressBar);
    controls.append(summary);



    // SIGN OUT
    button('Sign out', async () => {
      await db.auth.signOut();
      window.location.reload();
    });
  }

  await draw();

})();
