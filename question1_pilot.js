/* CIVIL202 pilot: first Question 1 of Module 1 only.
   Inject this script after progress.js, or remove progress.js temporarily.
   Supabase publishable key only. Never a secret/service_role key. */
(async () => {
  'use strict';
  const SUPABASE_URL = 'https://kaflloebqtgwstcpnywa.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_fx7AOQeXAmJavxqUZt4FOQ_i_SobgIP';
  const QUESTION_ID = 'module1_basic_properties_q1';
  const EXPECTED = 9.81 / 0.70;
  const TOLERANCE = 0.05; // N/m^3, includes 14.01 and 14.014...
  if (!location.pathname.endsWith('/Module1FluidProperties_SolV2.html')) return;

  const headings = [...document.querySelectorAll('main h4, article h4')];
  const heading = headings.find(h => /^Question\s+1\b/i.test(h.textContent.trim()));
  if (!heading) { console.warn('CIVIL202: Question 1 heading not found'); return; }
  const section = heading.closest('section');
  if (!section) { console.warn('CIVIL202: question section not found'); return; }

  // Jupyter Book/Sphinx renders MyST dropdowns as <details> with <summary>.
  const dropdowns = [...section.querySelectorAll('details')];
  const byLabel = label => dropdowns.find(d => d.querySelector('summary')?.textContent.trim().toLowerCase().includes(label));
  const hintNode = byLabel('hint');
  const answerNode = byLabel('answer');
  if (!hintNode || !answerNode) {
    console.warn('CIVIL202: Hint/Answer dropdowns not found in question section. No changes made.');
    return;
  }
  // Look for the notebook's separate rendered worked solution (not a heading of the next question).
  const elements = [...section.children];
  const solLabel = elements.find(el => /^solution$/i.test(el.textContent.trim()) && !el.querySelector('details'));
  const solutionNodes = solLabel ? elements.slice(elements.indexOf(solLabel)) : [];

  // Visually gate existing Hint, Answer and rendered Python solution.
  hintNode.open = false;
  answerNode.open = false;

  hintNode.style.display = 'none';
  answerNode.style.display = 'none';
  solutionNodes.forEach(el => { el.hidden = true; });

  const box = document.createElement('div');
  box.style.cssText = 'border:1px solid #b7c8c7;border-radius:8px;padding:15px;margin:14px 0;background:#f6fbfa;color:#173d38;max-width:740px';
  box.innerHTML = `<strong>Try this question</strong><p style="margin:8px 0">Calculate the specific weight (N/m³).</p>`;
  const input = document.createElement('input');
  input.type = 'number'; input.step='any'; input.placeholder='Your answer in N/m³';
  input.style.cssText='padding:7px;border:1px solid #889;border-radius:5px;max-width:210px';
  input.setAttribute('aria-label', 'Specific weight in N per cubic metre');
  const check = document.createElement('button');
  check.textContent='Check answer';
  check.style.cssText='margin:8px;padding:8px 12px;border:1px solid #247c67;border-radius:5px;background:white;cursor:pointer';
  const feedback = document.createElement('p');feedback.setAttribute('role','status');
  const tools = document.createElement('div');
  box.append(input,check,feedback,tools);
  // Place the interactive answer box just after the problem statement when possible.
  const statement = [...section.children].find(el => el.tagName === 'P' && /specific volume of a gas/i.test(el.textContent));
  (statement || heading).insertAdjacentElement('afterend',box);

  if (SUPABASE_URL.includes('YOUR-PROJECT') || SUPABASE_PUBLISHABLE_KEY.includes('YOUR-PUBLISHABLE')) {
    feedback.textContent = 'Teacher setup: configure Supabase URL and publishable key.'; check.disabled = true; return;
  }
  if (!window.supabase) {
    const script = document.createElement('script');
    script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    await new Promise((res,rej)=>{script.onload=res;script.onerror=rej;document.head.append(script);}).catch(()=>{});
  }
  if (!window.supabase) { feedback.textContent='Could not load Supabase.'; check.disabled=true; return; }
  // Reuse the same default Supabase authentication storage as progress.js.
  const sharedDb = window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  const {data:{user}}=await sharedDb.auth.getUser();
  if (!user) { feedback.textContent='Please sign in using the CIVIL202 progress box at the top, then reload.';check.disabled=true;return; }
  let {data:events,error:loadError}=await sharedDb.from('question_events').select('event_type,attempt_number,is_correct,answer_value').eq('question_id',QUESTION_ID).eq('user_id',user.id).order('created_at',{ascending:true});
  if (loadError) { feedback.textContent=`Could not load attempts: ${loadError.message}`;check.disabled=true;return; }
  events=events||[];
  const count=()=>events.filter(e=>e.event_type==='attempt').length;
  const solved=()=>events.some(e=>e.event_type==='attempt'&&e.is_correct);
  const save=async event=>{
    const row={...event,question_id:QUESTION_ID,user_id:user.id};
    const {error}=await sharedDb.from('question_events').insert(row);
    if(error){feedback.textContent='Could not save: '+error.message;return false;}
    events.push(row);return true;
  };
  function addButton(label, fn) {
    const b=document.createElement('button');b.textContent=label;
    b.style.cssText='margin:4px 10px 4px 0;padding:7px 10px;border:1px solid #247c67;border-radius:5px;background:white;cursor:pointer';
    b.onclick=fn;tools.append(b);return b;
  }
  function reveal(node){node.hidden=false;if(node.matches('details'))node.open=true;}
  const showSolution=async()=>{
    if (!events.some(e=>e.event_type==='solution_viewed')) {
      if(!await save({event_type:'solution_viewed'}))return;
    }
    reveal(answerNode);solutionNodes.forEach(el=>{el.hidden=false;});
  };
  function render(){
    tools.replaceChildren();
    if (solved()){
      feedback.textContent='Correct! You can review the worked solution.';
      check.disabled=true;input.disabled=true;
      addButton('Show worked solution',showSolution);
    }else if(count()>=2){
      feedback.textContent='Two attempts used. You can now review the worked solution.';
      check.disabled=true;input.disabled=true;
      addButton('Show worked solution',showSolution);
    }else if(count()===1){
      feedback.textContent='First attempt incorrect. Review the hint and try once more.';
      addButton('Show hint',async()=>{
        if(!events.some(e=>e.event_type==='hint_viewed')){
          if(!await save({event_type:'hint_viewed'}))return;
        }
        reveal(hintNode);
      });
    }else feedback.textContent='Enter your answer before opening the hint.';
    if(events.some(e=>e.event_type==='hint_viewed'))reveal(hintNode);
    if(events.some(e=>e.event_type==='solution_viewed')){reveal(answerNode);solutionNodes.forEach(el=>el.hidden=false);}
  }
  check.addEventListener('click',async()=>{
    const v=Number(input.value);
    if(!input.value.trim()||!Number.isFinite(v)){feedback.textContent='Please enter a valid number.';return;}
    check.disabled=true;
    const ok=Math.abs(v-EXPECTED)<=TOLERANCE;
    const saved=await save({event_type:'attempt',attempt_number:count()+1,answer_value:String(v),is_correct:ok});
    if(!saved){check.disabled=false;return;}
    input.value='';check.disabled=false;render();
  });
  render();
})();
