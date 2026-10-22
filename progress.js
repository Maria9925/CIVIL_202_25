
/* CIVIL202 - Simple Student Progress */

(async function () {
  'use strict';

  const SUPABASE_URL =
    'https://kaflloebqtgwstcpnywa.supabase.co';

  const SUPABASE_KEY =
    'sb_publishable_fx7AOQeXAmJavxqUZt4FOQ_i_SobgIP';

  // Questions currently implemented
  const QUESTION_IDS = [
    'module1_basic_properties_q1',
    'module1_basic_properties_q2',
    "module1_basic_properties_q3"
  ];

  // Prevent duplicate progress boxes
  if (document.getElementById('civil202-progress-root')) {
    return;
  }

  // Create progress container
  const root = document.createElement('section');
  root.id = 'civil202-progress-root';

  root.style.cssText = `
    border: 1px solid #b7c8c7;
    border-radius: 10px;
    padding: 16px;
    margin: 16px 0;
    background: #f6fbfa;
    color: #173d38;
    font: 15px system-ui, sans-serif;
  `;

  const status = document.createElement('p');
  status.style.margin = '0 0 12px 0';

  const summary = document.createElement('div');

  root.append(status, summary);

  const host =
    document.querySelector('main article') ||
    document.querySelector('main') ||
    document.body;

  host.prepend(root);

  // Load Supabase
  if (!window.supabase) {
    const script = document.createElement('script');

    script.src =
      'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

    try {
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
      });
    } catch {
      status.textContent = 'Could not load Supabase.';
      return;
    }
  }

  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  // Load and display progress
  async function updateProgress() {
    const { data: { user }, error: authError } =
      await db.auth.getUser();

    if (authError || !user) {
      status.textContent =
        'Please sign in from the CIVIL202 main page.';

      summary.replaceChildren();

      const link = document.createElement('a');
      link.href = 'index.html';
      link.textContent = 'Go to sign in';

      summary.append(link);
      return;
    }

    status.textContent = `Signed in as ${user.email}`;

    const { data, error } = await db
      .from('question_events')
      .select(
        'question_id, event_type, attempt_number, is_correct'
      )
      .eq('user_id', user.id)
      .in('question_id', QUESTION_IDS);

    if (error) {
      summary.textContent =
        'Could not load progress: ' + error.message;
      return;
    }

    const events = data || [];

    let completed = 0;

    for (const id of QUESTION_IDS) {
      const attempts = events.filter(event =>
        event.question_id === id &&
        event.event_type === 'attempt'
      );

      const correct = attempts.some(event =>
        event.is_correct === true
      );

      if (correct || attempts.length >= 2) {
        completed++;
      }
    }

    const total = QUESTION_IDS.length;

    const percentage = total > 0
      ? Math.round((completed / total) * 100)
      : 0;

    // Clean progress summary
    summary.replaceChildren();

    const heading = document.createElement('div');

    heading.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    `;

    const label = document.createElement('strong');
    label.textContent =
      `${completed} of ${total} questions completed`;

    const percent = document.createElement('strong');
    percent.textContent = `${percentage}%`;

    heading.append(label, percent);

    // Progress bar
    const bar = document.createElement('div');

    bar.style.cssText = `
      height: 10px;
      width: 100%;
      background: #dce8e5;
      border-radius: 10px;
      overflow: hidden;
    `;

    const fill = document.createElement('div');

    fill.style.cssText = `
      height: 100%;
      width: ${percentage}%;
      background: #258b70;
      border-radius: 10px;
      transition: width 0.3s ease;
    `;

    bar.append(fill);

    summary.append(heading, bar);
  }

  await updateProgress();

  // Refresh progress when a question is answered
  window.addEventListener(
    'civil202-progress-updated',
    updateProgress
  );

})();
