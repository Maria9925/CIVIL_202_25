
/* CIVIL202 — question practice and learning events
   Load AFTER progress.js.
   Learning scores are NOT displayed.
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
  // =====================================================

  const QUESTIONS = [
    {
      heading: 'Question 1',
      id: 'module1_basic_properties_q1',
      videoUrl: null,
      fields: [
        {
          label: 'Specific weight (N/m³)',
          answer: 9.81 / 0.70,
          tolerance: 0.05
        }
      ]
    },
    {
      heading: 'Question 2',
      id: 'module1_basic_properties_q2',
      videoUrl: null,
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
    },
    {
      heading: 'Question 3',
      id: 'module1_basic_properties_q3',
      videoUrl: null,
      fields: [
        {
          label: 'Weight (N)',
          answer: 3.83,
          tolerance: 0.05
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

    try {
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
      });
    } catch (e) {
      console.error('Supabase failed to load', e);
      return;
    }
  }

  const db = window.supabase.createClient(URL, KEY);

  const {
    data: { user },
    error: authError
  } = await db.auth.getUser();

  const headings = [
    ...document.querySelectorAll('main h4, article h4')
  ];

  // =====================================================
  // 4. BUTTON STYLE
  // =====================================================

  const buttonStyle = `
    margin: 6px 10px 4px 0;
    padding: 9px 16px;
    border: 1px solid #247c67;
    border-radius: 6px;
    background: white;
    color: #195b4d;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  `;

  function makeButton(label, callback) {
    const button = document.createElement('button');

    button.type = 'button';
    button.textContent = label;
    button.style.cssText = buttonStyle;

    button.addEventListener('mouseenter', () => {
      if (!button.disabled) {
        button.style.background = '#dcefe9';
      }
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'white';
    });

    button.addEventListener('click', callback);

    return button;
  }

   
const cardStyles = document.createElement('style');

cardStyles.textContent = `
  .civil-question-card {
    background: #fcfcfc !important;
    border: 1px solid #dfe2e5 !important;
    border-radius: 18px !important;
    padding: 20px !important;
    margin: 20px 0 !important;
    color: #293241 !important;
  }

  .civil-status {
  background: #f0f1f2;
  border-radius: 30px;
  padding: 5px 12px;
  font-size: 12px;
  color: #58616b;
  white-space: nowrap;
}

  .civil-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .civil-card-heading h4 {
    margin: 4px 0 0 !important;
    font-size: 21px;
    color: #293241;
  }

  .civil-card-subtitle {
    font-size: 12px;
    color: #737980;
  }

  .civil-status {
    background: #f0f1f2;
    border-radius: 30px;
    padding: 5px 12px;
    font-size: 12px;
    color: #58616b;
    white-space: nowrap;
  }

  .civil-question-card > p {
    margin: 8px 0 16px;
    line-height: 1.6;
  }

  .civil-help-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 14px 0;
  }

  .civil-help-actions button {
    border: 1px solid #d5d9dc !important;
    border-radius: 30px !important;
    background: #fff !important;
    color: #505a63 !important;
    padding: 7px 14px !important;
    margin: 0 !important;
  }

  .civil-help-actions button:hover {
    background: #edf1f2 !important;
    border-color: #aeb9bf !important;
  }

  .civil-answer-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin: 12px 0;
  }

  .civil-fields {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    gap: 12px;
    min-width: 0;
  }

  .civil-fields label {
    flex: 1 1 170px;
    margin: 0 !important;
    color: #505a63;
    font-size: 14px;
    font-weight: 600;
  }

  .civil-fields input {
    width: 100% !important;
    border: 1px solid #d5d9dc !important;
    border-radius: 30px !important;
    background: white;
    padding: 12px 16px !important;
    font-size: 15px;
  }
  .civil-feedback:not(:empty) {
  padding: 12px 16px;
  border-radius: 9px;
  margin: 14px 0;
  font-weight: 600;
  line-height: 1.5;
  border: 1px solid #d7e0e9;
  background: #f0f4f8;
  color: #485a72;
}

.civil-feedback.is-correct {
  background: #edf7f2;
  border-color: #cde5d6;
  color: #285f45;
}

.civil-feedback.is-incorrect {
  background: #fff8ea;
  border-color: #eaddbd;
  color: #775522;
}

  .civil-check-button {
    border-radius: 30px !important;
    border: 1px solid #607783 !important;
    background: #607783 !important;
    color: white !important;
    padding: 12px 18px !important;
    margin: 0 !important;
    white-space: nowrap;
  }

  .civil-check-button:hover:not(:disabled) {
    background: #405762 !important;
  }

  .civil-check-button:disabled {
    background: #edf0f1 !important;
    border-color: #edf0f1 !important;
    color: #92999e !important;
    cursor: not-allowed;
  }

  /* Correct answer - soft green */
  .civil-status.status-correct {
    background: #dff3e8;
    color: #276749;
  }

  /* Incorrect answer - soft yellow */
  .civil-status.status-retry {
    background: #fff2d9;
    color: #986719;
  }

  /* Additional practice - soft blue */
  .civil-status.status-practising {
    background: #e8eff8;
    color: #4b6485;
  }

  /* Mobile layout */
  @media (max-width: 600px) {

    .civil-question-card {
      padding: 15px !important;
    }

    .civil-answer-row {
      flex-direction: column;
      align-items: stretch;
    }

    .civil-check-button {
      width: 100%;
    }

  }
`;

document.head.append(cardStyles);


  // =====================================================
  // 5. PROCESS EACH QUESTION
  // =====================================================

  for (const config of QUESTIONS) {

    const heading = headings.find(h =>
      h.textContent.trim().startsWith(
        config.heading + ' ('
      ) ||
      h.textContent.trim() === config.heading
    );

    if (!heading) {
      console.warn('Missing heading', config.heading);
      continue;
    }

    const section = heading.closest('section');

    if (!section) continue;

    // =====================================================
    // 6. FIND HINT, ANSWER AND SOLUTION
    // =====================================================

    const dropdowns = [
      ...section.querySelectorAll('details')
    ];

    const findDropdown = word =>
      dropdowns.find(d =>
        d.querySelector('summary')
          ?.textContent.trim()
          .toLowerCase()
          .startsWith(word)
      );

    const hint = findDropdown('hint');
    const answer = findDropdown('answer');

    if (!hint || !answer) {
      console.warn(
        'Missing hint/answer',
        config.heading
      );
      continue;
    }

    const solutionTitle = [
      ...section.children
    ].find(el =>
      el.tagName === 'P' &&
      el.textContent.trim().toLowerCase() === 'solution'
    );

    const candidate =
      solutionTitle?.nextElementSibling;

    const solutionCell =
      candidate?.classList.contains('cell')
        ? candidate
        : null;

    const solutionParts = [
      solutionTitle,
      solutionCell
    ].filter(Boolean);

    for (const element of [
      hint,
      answer,
      ...solutionParts
    ]) {
      if (element.matches('details')) {
        element.open = false;
      }

      element.style.display = 'none';
    }

    function reveal(element) {
      element.style.removeProperty('display');
      element.hidden = false;

      if (element.matches('details')) {
        element.open = true;
      }
    }

    // =====================================================
    // 7. FIND OPTIONAL VIDEO
    // =====================================================

    const existingVideo = section.querySelector(
      'a[href*="panopto"], ' +
      'a[href*="youtube"], ' +
      'a[href*="youtu.be"], ' +
      'a[href*="vimeo"]'
    );

    const videoUrl =
      config.videoUrl ||
      existingVideo?.href ||
      null;

    // =====================================================
    // 8. CREATE QUESTION BOX
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

     const answerRow = document.createElement('div');
      answerRow.className = 'civil-answer-row';
      
      const fieldsGroup = document.createElement('div');
      fieldsGroup.className = 'civil-fields';
      
      answerRow.append(fieldsGroup);
      box.append(answerRow);

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
      fieldsGroup.append(wrap);

      return input;
    });

    // =====================================================
    // 9. CREATE CONTROLS
    // =====================================================

    const helpActions =
      document.createElement('div');

    const check =
      makeButton('Check answer', checkAnswer);

    const feedback =
      document.createElement('p');

    feedback.setAttribute('role', 'status');
     feedback.className = 'civil-feedback';

    const choices =
      document.createElement('div');

    const reviewActions =
      document.createElement('div');

    box.insertBefore(helpActions, answerRow);
   helpActions.className = 'civil-help-actions';
   
   check.classList.add('civil-check-button');
   answerRow.append(check);
   
   box.append(
     feedback,
     choices,
     reviewActions
   );

    box.classList.add('civil-question-card');

const statement = [
  ...section.children
].find(el =>
  el.tagName === 'P' &&
  el !== solutionTitle
);

heading.insertAdjacentElement('afterend', box);

const header = document.createElement('div');
header.className = 'civil-card-header';

const headerLeft = document.createElement('div');
headerLeft.className = 'civil-card-heading';


const status = document.createElement('span');
status.className = 'civil-status';
status.textContent = 'Not started';

headerLeft.append(heading);
header.append(headerLeft, status);

box.prepend(header);

if (statement) {
  header.insertAdjacentElement('afterend', statement);
}

    // =====================================================
    // 10. CHECK USER AUTHENTICATION
    // =====================================================

    if (authError || !user) {

      feedback.textContent =
        'Sign in from the main CIVIL202 page, ' +
        'then reload this module.';

      check.disabled = true;

      inputs.forEach(input => {
        input.disabled = true;
      });

      continue;
    }

    // =====================================================
    // 11. LOAD PREVIOUS EVENTS
    // =====================================================

    const { data, error } = await db
      .from('question_events')
      .select(
        'event_type,attempt_number,answer_value,' +
        'is_correct,decision_after_error,' +
        'difficulty_reason,created_at'
      )
      .eq('user_id', user.id)
      .eq('question_id', config.id)
      .order('created_at', {
        ascending: true
      });

    if (error) {
      feedback.textContent =
        'Could not load progress: ' +
        error.message;

      check.disabled = true;
      continue;
    }

    const events = data || [];
    let busy = false;

    const attempts = () =>
      events.filter(
        e => e.event_type === 'attempt'
      );

    const lastAttemptIndex = () =>
      events.map(
        e => e.event_type
      ).lastIndexOf('attempt');

    const sinceLastAttempt = () =>
      events.slice(lastAttemptIndex() + 1);

    const lastAttempt = () =>
      attempts().at(-1);

    const decisionAfterLast = () =>
      sinceLastAttempt().find(
        e => e.event_type === 'error_decision'
      );

    const reasonAfterLast = () =>
      sinceLastAttempt().find(
        e => e.event_type === 'difficulty_reported'
      );

    const ever = name =>
      events.some(
        e => e.event_type === name
      );

    // =====================================================
    // 12. SAVE EVENTS
    // =====================================================

    async function save(row) {

      if (busy) return false;

      busy = true;

      try {

        const record = {
          ...row,
          user_id: user.id,
          question_id: config.id
        };

        const {
          data: inserted,
          error: writeError
        } = await db
          .from('question_events')
          .insert(record)
          .select(
            'event_type,attempt_number,answer_value,' +
            'is_correct,decision_after_error,' +
            'difficulty_reason,created_at'
          )
          .single();

        if (writeError) {
          throw writeError;
        }

        events.push(inserted);

        return true;

      } catch (e) {

        feedback.textContent =
          'Could not save: ' + e.message;

        return false;

      } finally {
        busy = false;
      }
    }

    // =====================================================
    // 13. SHOW HINT
    // =====================================================

    async function showHint() {

      if (!ever('hint_viewed')) {
        const saved = await save({
          event_type: 'hint_viewed'
        });

        if (!saved) return;
      }

      reveal(hint);
      render();
    }

    // =====================================================
    // 14. SHOW VIDEO
    // =====================================================

    async function showVideo() {

      if (!videoUrl) return;

      const tab = window.open(
        'about:blank',
        '_blank'
      );

      if (tab) tab.opener = null;

      const saved = await save({
        event_type: 'video_opened'
      });

      if (!saved) {
        if (tab) tab.close();
        return;
      }

      if (tab) {
        tab.location.replace(videoUrl);
      } else {
        feedback.textContent =
          'Video click saved. ' +
          'Please allow pop-ups to open the video.';
      }

      render();
    }

    // =====================================================
    // 15. SHOW CORRECT ANSWER
    // =====================================================

    async function showAnswer() {

      if (!ever('answer_viewed')) {
        const saved = await save({
          event_type: 'answer_viewed'
        });

        if (!saved) return;
      }

      reveal(answer);
      render();
    }

    // =====================================================
    // 16. SHOW WORKED SOLUTION
    // =====================================================

    async function showSolution() {

       const pendingFeedback =
        decisionAfterLast()?.decision_after_error === 'show_solution' &&
        !reasonAfterLast();
      
      if (pendingFeedback) {
        feedback.textContent =
          'Please submit your feedback to view the worked solution.';
        return;
      }

      if (!ever('solution_viewed')) {
        const saved = await save({
          event_type: 'solution_viewed'
        });

        if (!saved) return;
      }

      solutionParts.forEach(reveal);

      window.dispatchEvent(
        new Event('civil202-progress-updated')
      );

      render();
    }

    // =====================================================
    // 17. CHOOSE ACTION AFTER ERROR
    // =====================================================

    async function chooseDecision(value) {

      const saved = await save({
        event_type: 'error_decision',
        decision_after_error: value
      });

      if (!saved) return;

      if (value === 'show_answer') {
        await showAnswer();
      }
      
      // If 'show_solution' was selected, wait for
      // difficulty feedback before revealing it.
      
      render();
    }

    // =====================================================
    // 18. REPORT DIFFICULTY
    // =====================================================

    async function reportDifficulty(value) {

      if (!value) return;

      const saved = await save({
        event_type: 'difficulty_reported',
        difficulty_reason: value
      });

      if (saved) render();
    }

    // =====================================================
    // 19. ADD BUTTONS
    // =====================================================

    function addChoices(target, labels) {

      for (const [label, action] of labels) {
        target.append(
          makeButton(label, action)
        );
      }
    }

     
   function createOptionBox(title) {
     const panel = document.createElement('div');
   
     panel.style.cssText = `
       background: #edf7f3;
       border: 1px solid #c4ddd2;
       border-radius: 9px;
       padding: 16px;
       margin: 12px 0;
     `;
   
     const heading = document.createElement('p');
     heading.textContent = title;
   
     heading.style.cssText = `
       margin: 0 0 14px;
       font-weight: 600;
       color: #195b4d;
     `;
   
     panel.append(heading);
     return panel;
   }
   
   function createRadioFeedback() {
     const panel = createOptionBox(
       'What was your main difficulty?'
     );
   
     const options = [
       ['no_idea', 'I had no idea how to start'],
       ['wrong_approach', 'I followed the wrong approach'],
       ['calculation_error', 'I made a calculation error']
     ];
   
     const group = document.createElement('div');
     const groupName = 'difficulty_' + config.id;
   
     let selected = '';
   
     options.forEach(([value, label]) => {
       const row = document.createElement('label');
   
       row.style.cssText = `
         display: flex;
         align-items: center;
         gap: 10px;
         padding: 7px 0;
         cursor: pointer;
         color: #284c43;
       `;
   
       const radio = document.createElement('input');
       radio.type = 'radio';
       radio.name = groupName;
       radio.value = value;
   
       radio.style.cssText = `
         width: auto;
         margin: 0;
         accent-color: #247c67;
         cursor: pointer;
       `;
   
       radio.addEventListener('change', () => {
         selected = value;
         submit.disabled = false;
       });
   
       const text = document.createElement('span');
       text.textContent = label;
   
       row.append(radio, text);
       group.append(row);
     });
   
     const submit = makeButton(
       'Submit feedback',
       async () => {
         if (!selected) return;
   
         submit.disabled = true;
   
         const saved = await save({
           event_type: 'difficulty_reported',
           difficulty_reason: selected
         });
   
         if (saved) {
         
           // Feedback was successfully recorded.
           // Now reveal the worked solution.
           await showSolution();
         
           render();
         
         } else {
         
           submit.disabled = false;
         
         }
       }
     );
   
     submit.disabled = true;
   
     panel.append(group, submit);
     return panel;
   }


    // =====================================================
    // 20. UPDATE QUESTION INTERFACE
    // =====================================================

    function render() {

       feedback.classList.remove(
        'is-correct',
        'is-incorrect'
      );

      choices.replaceChildren();
      reviewActions.replaceChildren();
      helpActions.replaceChildren();

      helpActions.append(
        makeButton('Show hint', showHint)
      );

      if (videoUrl) {
        helpActions.append(
          makeButton('Show video', showVideo)
        );
      }

      if (ever('hint_viewed')) {
        reveal(hint);
      }

      if (ever('answer_viewed')) {
        reveal(answer);
      }

      if (ever('solution_viewed')) {
        solutionParts.forEach(reveal);
      }


      const count = attempts().length;
      const last = lastAttempt();
      
      // Apply status colours directly
      status.style.fontWeight = '600';
      
      if (count === 0) {
      
        status.textContent = 'Not started';
        status.style.backgroundColor = '#f0f1f2';
        status.style.color = '#58616b';
      
      } else if (last?.is_correct) {
      
        status.textContent = '✓ Correct';
        status.style.backgroundColor = '#dff3e8';
        status.style.color = '#276749';
      
      } else if (count >= 2) {
      
        status.textContent = 'Practising';
        status.style.backgroundColor = '#e8eff8';
        status.style.color = '#4b6485';
      
      } else {
      
        status.textContent = 'Try again';
        status.style.backgroundColor = '#fff2d9';
        status.style.color = '#986719';
      
      }


      const needsDecision =
        count > 0 &&
        count < 2 &&
        !last.is_correct &&
        !decisionAfterLast();

      const decision =
        decisionAfterLast()?.decision_after_error;

      const needsReason =
        decision === 'show_solution' &&
        !reasonAfterLast();

      const allowInput =
        !needsDecision &&
        !needsReason;

      check.disabled =
        !allowInput || busy;

      inputs.forEach(i => {
        i.disabled = !allowInput;
      });

      check.textContent =
        count >= 2
          ? 'Check answer (free practice)'
          : 'Check answer';

      if (needsDecision) {

        feedback.textContent = '';
      
        const panel = createOptionBox(
          'Not quite! What would you like to do next?'
        );
      
        const optionButtons = document.createElement('div');
      
        optionButtons.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        `;
      
        const options = [
          [
            'I have no idea — show me the solution',
            () => chooseDecision('show_solution')
          ],
          [
            'Let me try again',
            () => chooseDecision('try_again')
          ],
          [
            'Show correct answer',
            () => chooseDecision('show_answer')
          ]
        ];
      
        options.forEach(([label, callback]) => {
      
          const button = makeButton(label, callback);
      
          button.style.cssText += `
            display: block;
            width: 100%;
            margin: 0;
            text-align: left;
            background: white;
            padding: 11px 14px;
          `;
      
          optionButtons.append(button);
        });
      
        panel.append(optionButtons);
        choices.append(panel);
      
      
      } else if (needsReason) {
      
        feedback.textContent =
          'Please submit your feedback to view the worked solution.';
      
        choices.append(createRadioFeedback());
      
      }
      
      } else if (last?.is_correct) {

        feedback.textContent =
          'Correct! You can review the ' +
          'answer or worked solution.';

      } else if (count >= 2) {

        feedback.textContent =
          'You can keep practising ' +
          'as many times as you like.';

      } else {

        feedback.textContent = '';
      }

      if (
        (last?.is_correct || count >= 2) &&
        !needsDecision &&
        !needsReason
      ) {

        addChoices(reviewActions, [
          [
            'Show correct answer',
            showAnswer
          ],
          [
            'Show solution',
            showSolution
          ]
        ]);
      }
    }

    // =====================================================
    // 21. CHECK STUDENT ANSWERS
    // =====================================================

    async function checkAnswer() {

      if (busy || check.disabled) return;

      const values = inputs.map(
        input => input.value.trim()
      );

      if (
        values.some(
          v =>
            v === '' ||
            !Number.isFinite(Number(v))
        )
      ) {

        feedback.textContent =
          'Please enter all numeric answers.';

        return;
      }

      const correct = values.every(
        (value, index) =>
          Math.abs(
            Number(value) -
            config.fields[index].answer
          ) <= config.fields[index].tolerance
      );

      // Only the first two attempts are recorded.

      if (attempts().length < 2) {

        const saved = await save({

          event_type: 'attempt',

          attempt_number:
            attempts().length + 1,

          answer_value:
            JSON.stringify(values),

          is_correct: correct,

          is_scored_attempt: true,

          help_before_attempt:
            ever('hint_viewed') ||
            ever('video_opened')
        });

        if (!saved) {
          render();
          return;
        }

        window.dispatchEvent(
          new Event('civil202-progress-updated')
        );

        inputs.forEach(i => {
          i.value = '';
        });

        render();

      } else {

        // Attempts 3+ are free practice.
        // They are not saved to Supabase.

          feedback.textContent = correct
          ? 'Correct! Well done.'
          : 'Not quite! Give it another try.';
      
        feedback.classList.toggle('is-correct', correct);
        feedback.classList.toggle('is-incorrect', !correct);
      
        if (correct) {

          reviewActions.replaceChildren();

          addChoices(reviewActions, [
            [
              'Show correct answer',
              showAnswer
            ],
            [
              'Show solution',
              showSolution
            ]
          ]);
        }
      }
    }

    render();
  }

})();
