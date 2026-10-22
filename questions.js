
/* CIVIL202 - Reusable Question Tracking System
   Supports multiple questions in the same HTML.
   Load AFTER progress.js.
*/

(async () => {
  'use strict';

  // =====================================================
  // 1. SUPABASE CONFIGURATION
  // =====================================================

  const URL =
    'https://kaflloebqtgwstcpnywa.supabase.co';

  const KEY =
    'sb_publishable_fx7AOQeXAmJavxqUZt4FOQ_i_SobgIP';

  if (!location.pathname.endsWith(
    '/Module1FluidProperties_SolV2.html'
  )) return;


  // =====================================================
  // 2. QUESTION CONFIGURATION
  // Add new questions here
  // =====================================================

  const QUESTIONS = [

    // QUESTION 1
    {
      heading: 'Question 1',
      id: 'module1_basic_properties_q1',

      fields: [
        {
          label: 'Specific weight (N/m³)',
          answer: 9.81 / 0.70,
          tolerance: 0.05
        }
      ]
    },

    // QUESTION 2
    {
      heading: 'Question 2',
      id: 'module1_basic_properties_q2',

      fields: [
        {
          label: 'Weight (kN)',
          answer: 11.77,
          tolerance: 0.05
        },
        {
          label: 'Mass density (kg/m³)',
          answer: 1261,
          tolerance: 2
        },
        {
          label: 'Specific weight (kN/m³)',
          answer: 12.36,
          tolerance: 0.05
        },
        {
          label: 'Specific gravity',
          answer: 1.26,
          tolerance: 0.02
        }
      ]
    }

  ];


  // =====================================================
  // 3. LOAD SUPABASE
  // =====================================================

  if (!window.supabase) {
    const script = document.createElement('script');

    script.src =
      'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    }).catch(() => {});
  }

  if (!window.supabase) {
    console.error('CIVIL202: Supabase not loaded');
    return;
  }

  const db = window.supabase.createClient(URL, KEY);

  const {
    data: { user },
    error: authError
  } = await db.auth.getUser();


  // =====================================================
  // 4. FIND QUESTIONS IN HTML
  // =====================================================

  const headings = [
    ...document.querySelectorAll('main h4, article h4')
  ];

  for (const config of QUESTIONS) {

    const heading = headings.find(h =>
      h.textContent.trim().startsWith(
        config.heading + ' ('
      ) ||
      h.textContent.trim() === config.heading
    );

    if (!heading) {
      console.warn('Missing heading:', config.heading);
      continue;
    }

    const section = heading.closest('section');

    if (!section) {
      console.warn('Missing section:', config.heading);
      continue;
    }


    // =====================================================
    // 5. FIND HINT, ANSWER AND SOLUTION
    // =====================================================

    const dropdowns = [
      ...section.querySelectorAll('details')
    ];

    const findDropdown = text =>
      dropdowns.find(d =>
        d.querySelector('summary')
          ?.textContent.trim()
          .toLowerCase()
          .startsWith(text)
      );

    const hint = findDropdown('hint');
    const answer = findDropdown('answer');

    if (!hint || !answer) {
      console.warn(
        'Missing hint/answer:',
        config.heading
      );
      continue;
    }

    const children = [...section.children];

    // Find the Solution heading
   const solutionTitle = [...section.children].find(el =>
     el.tagName === 'P' &&
     el.textContent.trim().toLowerCase() === 'solution'
   );
   
   // Find the Python output after Solution
   const possibleSolutionCell = solutionTitle?.nextElementSibling;

   const solutionCell =
     possibleSolutionCell?.classList.contains('cell')
       ? possibleSolutionCell
       : null;
   
   // Elements to hide until the solution is unlocked
   const solutionParts = [
     solutionTitle,
     solutionCell
   ].filter(Boolean);


    // =====================================================
    // 6. HIDE HINT AND SOLUTION INITIALLY
    // =====================================================

    [hint, answer, ...solutionParts].forEach(el => {

      if (el.matches('details')) {
        el.open = false;
      }

      el.style.display = 'none';
    });

    function show(el) {
      el.style.removeProperty('display');
      el.hidden = false;

      if (el.matches('details')) {
        el.open = true;
      }
    }


    // =====================================================
    // 7. CREATE ANSWER INPUTS
    // =====================================================

    const box = document.createElement('div');

    box.style.cssText = `
      border: 1px solid #b7c8c7;
      border-radius: 9px;
      padding: 14px;
      margin: 16px 0;
      background: #f6fbfa;
      color: #173d38;
    `;

    const inputs = config.fields.map(field => {

      const wrap = document.createElement('label');

      wrap.style.cssText = `
        display: inline-flex;
        flex-direction: column;
        gap: 5px;
        margin: 4px 12px 8px 0;
      `;

      const label = document.createElement('span');
      label.textContent = field.label;

      const input = document.createElement('input');

      input.type = 'number';
      input.step = 'any';
      input.placeholder = 'Your answer';

      input.style.cssText = `
        padding: 8px;
        border: 1px solid #889;
        border-radius: 5px;
        width: 175px;
      `;

      wrap.append(label, input);
      box.append(wrap);

      return input;
    });


    // =====================================================
    // 8. CREATE BUTTONS AND FEEDBACK
    // =====================================================

    const actions = document.createElement('div');

    const check = document.createElement('button');
    check.textContent = 'Check answer';

    const feedback = document.createElement('p');
    feedback.setAttribute('role', 'status');

    const extras = document.createElement('div');

    actions.append(check);
    box.append(actions, feedback, extras);

    const buttonStyle = `
      margin: 6px 10px 4px 0;
      padding: 8px 12px;
      border: 1px solid #247c67;
      border-radius: 6px;
      background: white;
      color: #195b4d;
      cursor: pointer;
    `;

    check.style.cssText = buttonStyle;

    heading.insertAdjacentElement('afterend', box);

    // Move the box below the problem statement
    const statement = [...section.children].find(el =>
      el.tagName === 'P' &&
      el !== solutionTitle
    );

    if (statement) {
      statement.insertAdjacentElement('afterend', box);
    }


    // =====================================================
    // 9. CHECK STUDENT LOGIN
    // =====================================================

    if (authError || !user) {

      feedback.textContent =
        'Sign in from the main CIVIL202 page, ' +
        'then reload this module.';

      check.disabled = true;

      inputs.forEach(i => i.disabled = true);

      continue;
    }


    // =====================================================
    // 10. LOAD PREVIOUS ATTEMPTS
    // =====================================================

    const {
      data,
      error
    } = await db
      .from('question_events')
      .select(
        'event_type,attempt_number,is_correct,answer_value'
      )
      .eq('user_id', user.id)
      .eq('question_id', config.id)
      .order('created_at', { ascending: true });

    if (error) {

      feedback.textContent = error.message;
      check.disabled = true;

      continue;
    }

    const events = data || [];

    const attempts = () =>
      events.filter(e => e.event_type === 'attempt');

    const isCorrect = () =>
      attempts().some(e => e.is_correct);

    const hasEvent = type =>
      events.some(e => e.event_type === type);


    // =====================================================
    // 11. SAVE EVENTS IN SUPABASE
    // =====================================================

    async function save(evt) {

      const row = {
        ...evt,
        user_id: user.id,
        question_id: config.id
      };

      const { error } = await db
        .from('question_events')
        .insert(row);

      if (error) {
        feedback.textContent =
          'Could not save: ' + error.message;

        return false;
      }

      events.push(row);

      return true;
    }


    // =====================================================
    // 12. SHOW HINT
    // =====================================================

    async function displayHint() {

      if (!hasEvent('hint_viewed')) {

        const saved = await save({
          event_type: 'hint_viewed'
        });

        if (!saved) return;
      }

      show(hint);

      hint.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }


    // =====================================================
    // 13. SHOW WORKED SOLUTION
    // =====================================================

    async function displaySolution() {

      if (!hasEvent('solution_viewed')) {

        const saved = await save({
          event_type: 'solution_viewed'
        });

        if (!saved) return;
      }

      show(answer);

      solutionParts.forEach(show);
    }


    // =====================================================
    // 14. CREATE ADDITIONAL BUTTONS
    // =====================================================

    function addButton(text, callback) {

      const b = document.createElement('button');

      b.textContent = text;
      b.style.cssText = buttonStyle;

      b.addEventListener('click', callback);

      extras.append(b);
    }


    // =====================================================
    // 15. UPDATE QUESTION INTERFACE
    // =====================================================

    function render() {

      extras.replaceChildren();

      const count = attempts().length;

      const done = isCorrect() || count >= 2;

      check.disabled = done;

      inputs.forEach(i => i.disabled = done);

      if (isCorrect()) {

        feedback.textContent =
          'Correct! You can review the worked solution.';

        addButton(
          'Show solution',
          displaySolution
        );

      } else if (count >= 2) {

        feedback.textContent =
          'Two attempts used. You can review the worked solution.';

        addButton(
          'Show solution',
          displaySolution
        );

      } else if (count === 1) {

        feedback.textContent =
          'Not quite. You can view the hint and try once more.';

        addButton(
          'Show hint',
          displayHint
        );

      } else {

        feedback.textContent = '';
      }

      if (hasEvent('hint_viewed')) {
        show(hint);
      }

      if (hasEvent('solution_viewed')) {
        show(answer);
        solutionParts.forEach(show);
      }
    }


    // =====================================================
    // 16. CHECK STUDENT ANSWERS
    // =====================================================

    check.addEventListener('click', async () => {

      const values = inputs.map(i =>
        i.value.trim()
      );

      if (
        values.some(v =>
          v === '' ||
          !Number.isFinite(Number(v))
        )
      ) {

        feedback.textContent =
          'Please enter all numeric answers.';

        return;
      }

      check.disabled = true;

      const correct = values.every((v, idx) =>
        Math.abs(
          Number(v) - config.fields[idx].answer
        ) <= config.fields[idx].tolerance
      );

      const saved = await save({

        event_type: 'attempt',

        attempt_number: attempts().length + 1,

        answer_value: JSON.stringify(values),

        is_correct: correct
      });


      if (saved) {

        inputs.forEach(i => i.value = '');

        render();

        // Update the progress bar automatically
        window.dispatchEvent(
          new Event('civil202-progress-updated')
        );

      } else {

        check.disabled = false;

      }

    });

    render();

  }

})();
