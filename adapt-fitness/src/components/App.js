'use client';
import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#07080A", surface: "#0E0F12", surfaceHigh: "#16171C", surfaceMid: "#1C1D24",
  border: "#1E2028", borderMid: "#2A2B36", accent: "#C8F542", accentDim: "rgba(200,245,66,0.09)",
  accentBorder: "rgba(200,245,66,0.2)", text: "#F0F0F2", textMuted: "#4A4B5A",
  textSub: "#7A7B8E", orange: "#FF8C42", orangeDim: "rgba(255,140,66,0.09)",
  purple: "#8B7CF6", purpleDim: "rgba(139,124,246,0.09)", teal: "#3ECFB2",
  red: "#FF4455", redDim: "rgba(255,68,85,0.09)",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;700;900&family=Instrument+Sans:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{background:${C.bg};color:${C.text};font-family:'Instrument Sans',sans-serif;-webkit-font-smoothing:antialiased;overscroll-behavior:none}
  ::-webkit-scrollbar{display:none}
  .ep{font-family:'Epilogue',sans-serif}
  input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
  input[type=number]{-moz-appearance:textfield}

  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:-400% 0}100%{background-position:400% 0}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}

  .fade-up{animation:fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both}
  .fade-in{animation:fadeIn 0.3s ease both}
  .slide-up{animation:slideUp 0.4s cubic-bezier(.22,.68,0,1.2) both}

  .btn{font-family:'Epilogue',sans-serif;font-weight:700;font-size:15px;border:none;border-radius:14px;padding:16px 22px;cursor:pointer;transition:all 0.16s ease;display:inline-flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-0.2px}
  .btn-accent{background:${C.accent};color:#050508}
  .btn-accent:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 6px 20px rgba(200,245,66,0.16)}
  .btn-accent:active{transform:translateY(0)}
  .btn-accent:disabled{opacity:0.25;pointer-events:none;transform:none;box-shadow:none}
  .btn-ghost{background:${C.surface};color:${C.textSub};border:1px solid ${C.border}}
  .btn-ghost:hover{border-color:${C.borderMid};color:${C.text}}
  .btn-dim{background:${C.surfaceHigh};color:${C.textSub};border:1px solid ${C.border}}
  .btn-dim:hover{border-color:${C.borderMid};color:${C.text}}

  .card{background:${C.surface};border:1px solid ${C.border};border-radius:18px;padding:18px}
  .card-high{background:${C.surfaceHigh};border:1px solid ${C.border};border-radius:18px;padding:18px}

  .input{width:100%;background:${C.surfaceHigh};border:1.5px solid ${C.border};border-radius:12px;padding:13px 15px;color:${C.text};font-size:15px;font-family:'Instrument Sans',sans-serif;outline:none;transition:border-color 0.18s;resize:none}
  .input:focus{border-color:${C.accent}}
  .input::placeholder{color:${C.textMuted}}

  .chip{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:100px;border:1.5px solid ${C.border};font-size:13px;cursor:pointer;transition:all 0.16s;background:transparent;color:${C.textSub};font-family:'Instrument Sans',sans-serif;font-weight:500;white-space:nowrap}
  .chip:hover{border-color:${C.borderMid};color:${C.text}}
  .chip.on{border-color:${C.accent};background:${C.accentDim};color:${C.accent}}

  .seg{display:flex;background:${C.surfaceHigh};border-radius:10px;padding:3px;gap:2px}
  .seg-btn{flex:1;padding:7px 10px;border-radius:8px;border:none;cursor:pointer;font-family:'Epilogue',sans-serif;font-weight:700;font-size:11px;transition:all 0.16s;background:transparent;color:${C.textMuted};white-space:nowrap}
  .seg-btn.on{background:${C.accent};color:#050508}

  .nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 4px;border:none;background:transparent;cursor:pointer;color:${C.textMuted};font-size:10px;font-family:'Instrument Sans',sans-serif;font-weight:500;border-radius:10px;transition:color 0.16s}
  .nav-item.on{color:${C.accent}}

  .progress{height:3px;background:${C.border};border-radius:100px;overflow:hidden}
  .progress-fill{height:100%;background:${C.accent};border-radius:100px;transition:width 0.6s ease}

  .tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:0.3px}

  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.18s ease}
  .modal{background:${C.surface};border:1px solid ${C.border};border-radius:24px 24px 0 0;width:100%;max-width:430px;max-height:90vh;overflow-y:auto;padding:22px 20px 52px;animation:slideUp 0.32s cubic-bezier(.22,.68,0,1.2)}

  .set-dot{width:9px;height:9px;border-radius:50%;border:1.5px solid ${C.borderMid};transition:all 0.2s;cursor:pointer;flex-shrink:0}
  .set-dot.done{background:${C.accent};border-color:${C.accent};box-shadow:0 0 6px rgba(200,245,66,0.4)}

  .ai-cursor{display:inline-block;width:2px;height:14px;background:${C.accent};margin-left:1px;animation:blink 0.9s infinite;vertical-align:text-bottom}

  .coach-bubble{background:${C.surfaceHigh};border:1px solid ${C.border};border-radius:16px 16px 16px 4px;padding:14px 16px;font-size:14px;line-height:1.65;color:${C.text};max-width:88%;position:relative}
  .user-bubble{background:${C.accentDim};border:1px solid ${C.accentBorder};border-radius:16px 16px 4px 16px;padding:14px 16px;font-size:14px;line-height:1.65;color:${C.text};max-width:88%;align-self:flex-end}

  .shimmer-line{background:linear-gradient(90deg,${C.border} 25%,${C.borderMid} 50%,${C.border} 75%);background-size:400% 100%;animation:shimmer 1.4s infinite;border-radius:6px;height:12px}

  .ex-row{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid ${C.border}}
  .ex-row:last-child{border-bottom:none}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const kgFromInput = (val, unit, st, lbs_part) => {
  if (unit === "kg") return Number(val) || 0;
  if (unit === "lbs") return Math.round((Number(val) || 0) * 0.4536 * 10) / 10;
  const stones = Number(st) || 0, extra = Number(lbs_part) || 0;
  return Math.round((stones * 14 + extra) * 0.4536 * 10) / 10;
};
const cmFromInput = (val, unit, ft, inch) => {
  if (unit === "cm") return Number(val) || 0;
  return Math.round(((Number(ft) || 0) * 12 + (Number(inch) || 0)) * 2.54);
};
const displayKg = (kg, unit) => {
  if (unit === "lbs") return `${Math.round(kg * 2.205)}lbs`;
  if (unit === "st") { const tl = kg * 2.205, s = Math.floor(tl / 14), l = Math.round(tl % 14); return `${s}st ${l}lbs`; }
  return `${kg}kg`;
};
const today = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const dayName = () => new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

// ─── PERSISTENT STORAGE ───────────────────────────────────────────────────────
const STORE_KEY = "adapt_v2";
const loadStore = () => { if (typeof window === "undefined") return null; try { const d = localStorage.getItem(STORE_KEY); return d ? JSON.parse(d) : null; } catch { return null; } };
const saveStore = (data) => { if (typeof window === "undefined") return; try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {} };
// ─── ANTHROPIC API ────────────────────────────────────────────────────────────
// Streaming call -> /api/ai (for AI Coach)
async function callClaude(messages, systemPrompt, onChunk) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system: systemPrompt, stream: true }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = dec.decode(value).split("\n").filter(l => l.startsWith("data: "));
    for (const line of lines) {
      const raw = line.slice(6).trim();
      if (raw === "[DONE]") continue;
      try {
        const json = JSON.parse(raw);
        if (json.text) { full += json.text; onChunk && onChunk(full); }
      } catch {}
    }
  }
  return full;
}

// JSON call -> /api/ai (for workout gen, food log, check-in)
async function callClaudeJSON(prompt, systemPrompt) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      system: systemPrompt,
      json: true,
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.data || null;
}

// ─── EXERCISE DB ──────────────────────────────────────────────────────────────
const EXERCISE_DB = [
  { id:"bb_squat",name:"Barbell Squat",sets:"4×6",muscle:"Quads / Glutes",equip:["barbell"],avoids:[],fig:"🏋️",col:"#7C6FFF",steps:[{cue:"Bar across upper traps, feet shoulder-width, toes slightly out.",tip:"Bar sits on muscle, not bone — if it hurts your neck, it's too high."},{cue:"Brace hard, big breath, sit back and down keeping chest tall.",tip:"Think 'sit between your legs' not 'sit back onto a chair'."},{cue:"Drive through your whole foot, push the floor away, squeeze glutes at top.",tip:"Knees track over toes the whole way — don't let them cave inward."}]},
  { id:"bb_rdl",name:"Romanian Deadlift",sets:"4×8",muscle:"Hamstrings / Glutes",equip:["barbell"],avoids:["back"],fig:"🏋️",col:"#7C6FFF",steps:[{cue:"Bar at hip height, soft knee bend, shoulders packed back.",tip:"This is a hip hinge, not a squat — knees barely move."},{cue:"Push hips back, lower bar along your legs until strong hamstring stretch.",tip:"Bar should graze your shins/thighs the whole way down."},{cue:"Drive hips forward to stand, squeeze glutes hard at the top.",tip:"Don't hyperextend at the top — stop when you're upright."}]},
  { id:"bb_bench",name:"Barbell Bench Press",sets:"4×8",muscle:"Chest / Triceps",equip:["barbell","bench"],avoids:["shoulder","wrist"],fig:"💪",col:"#FF6B6B",steps:[{cue:"Lie flat, grip just wider than shoulders, bar over lower chest.",tip:"Retract your shoulder blades into the bench — creates a stable base."},{cue:"Lower bar to lower chest, elbows at ~45°.",tip:"Touch and press, don't bounce."},{cue:"Press explosively to near full extension.",tip:"Think about pressing yourself through the bench, not just pushing the bar up."}]},
  { id:"bb_ohp",name:"Overhead Press",sets:"4×6",muscle:"Shoulders / Triceps",equip:["barbell"],avoids:["shoulder","wrist"],fig:"💪",col:"#FF8C42",steps:[{cue:"Bar on front rack, hands just wider than shoulders, core tight.",tip:"Don't flare your elbows out — keep them angled slightly forward."},{cue:"Press bar overhead in a slight arc, clear your face then back.",tip:"Your head moves forward through the window, not back."},{cue:"Lower with control to collarbone level.",tip:"Full range every rep — no partial reps."}]},
  { id:"bb_row",name:"Barbell Bent-Over Row",sets:"4×8",muscle:"Back",equip:["barbell"],avoids:["back"],fig:"🔄",col:"#3ECFB2",steps:[{cue:"Hinge at hips, torso ~45°, bar hanging from straight arms.",tip:"Lower back flat throughout — not rounded."},{cue:"Row bar to lower abdomen, drive elbows back and up.",tip:"Lead with elbows, not hands."},{cue:"Lower slowly to full arm extension, feel the lat stretch.",tip:"Don't let your torso bounce to help the weight."}]},
  { id:"db_press",name:"Dumbbell Shoulder Press",sets:"4×10",muscle:"Shoulders",equip:["dumbbells"],avoids:["shoulder"],fig:"💪",col:"#FF8C42",steps:[{cue:"Seated or standing, dumbbells at shoulder height, palms forward.",tip:"Don't arch your lower back as you press."},{cue:"Press directly overhead until arms nearly locked out.",tip:"Think about pressing the ceiling away."},{cue:"Lower slowly to shoulder height — 3 seconds down.",tip:"The lowering phase is where muscle is built."}]},
  { id:"db_curl",name:"Dumbbell Curl",sets:"3×12",muscle:"Biceps",equip:["dumbbells"],avoids:["wrist"],fig:"💪",col:"#C8F542",steps:[{cue:"Stand tall, dumbbells at sides, palms forward.",tip:"Elbows pinned to your sides — don't let them drift forward."},{cue:"Curl both dumbbells up, rotate palms toward you at top.",tip:"Squeeze your bicep hard at the peak."},{cue:"Lower slowly to full extension.",tip:"Full extension at bottom maximises the stretch."}]},
  { id:"db_row",name:"Dumbbell Row",sets:"4×12",muscle:"Back",equip:["dumbbells"],avoids:["wrist"],fig:"🔄",col:"#3ECFB2",steps:[{cue:"One hand and knee on bench, other arm hanging with dumbbell.",tip:"Back flat and parallel to the floor."},{cue:"Row dumbbell to your hip, elbow driving straight back.",tip:"Arm is a hook — your back does the work."},{cue:"Lower with full control to complete extension.",tip:"Get the full stretch at the bottom every rep."}]},
  { id:"db_goblet",name:"Goblet Squat",sets:"4×15",muscle:"Quads / Glutes",equip:["dumbbells"],avoids:["knee"],fig:"🏋️",col:"#7C6FFF",steps:[{cue:"Hold dumbbell vertically at chest, feet shoulder-width, toes out.",tip:"The front load helps you sit deeper with an upright torso."},{cue:"Squat down, elbows tracking inside knees at bottom.",tip:"Use elbows to push knees out if they want to cave."},{cue:"Drive back up through heels, squeeze glutes at top.",tip:"Tall chest throughout."}]},
  { id:"db_rdl",name:"Dumbbell RDL",sets:"3×12",muscle:"Hamstrings",equip:["dumbbells"],avoids:["back"],fig:"🏋️",col:"#7C6FFF",steps:[{cue:"Dumbbells in front of thighs, soft knee bend, back flat.",tip:"Same hinge pattern as barbell RDL."},{cue:"Push hips back, lower dumbbells along legs to mid-shin.",tip:"Feel the hamstring stretch — that's the money position."},{cue:"Drive hips through, squeeze glutes at top.",tip:"Don't round your lower back as you stand."}]},
  { id:"db_lateral",name:"Lateral Raise",sets:"3×15",muscle:"Shoulders",equip:["dumbbells"],avoids:["shoulder","wrist"],fig:"💪",col:"#FF8C42",steps:[{cue:"Dumbbells at sides, slight bend in elbows, soft knees.",tip:"Don't shrug your shoulders as you raise."},{cue:"Raise arms to shoulder height, leading with elbows.",tip:"Pinky slightly higher than thumb at top — engages side delt more."},{cue:"Lower with full control — 3 seconds down.",tip:"Don't let momentum do the work."}]},
  { id:"cable_pulldown",name:"Lat Pulldown",sets:"4×12",muscle:"Back / Lats",equip:["cables"],avoids:["shoulder"],fig:"🔗",col:"#3ECFB2",steps:[{cue:"Grip just wider than shoulders, palms away, slight lean back.",tip:"Don't grip too wide — limits range and reduces lat engagement."},{cue:"Pull bar to upper chest, drive elbows down and back.",tip:"Lead with elbows, not hands."},{cue:"Control bar back to full arm extension.",tip:"4-second return — that eccentric is where growth happens."}]},
  { id:"cable_row",name:"Seated Cable Row",sets:"4×12",muscle:"Back",equip:["cables"],avoids:[],fig:"🔗",col:"#3ECFB2",steps:[{cue:"Sit upright, feet on platform, slight forward lean, grip handle.",tip:"Lower back neutral — don't round it."},{cue:"Row to lower sternum, elbows tight to sides.",tip:"Imagine cracking a walnut between your shoulder blades."},{cue:"Slowly extend arms back, full lat stretch.",tip:"Don't let shoulders shrug up or hunch forward."}]},
  { id:"cable_tricep",name:"Tricep Pushdown",sets:"3×15",muscle:"Triceps",equip:["cables"],avoids:["wrist"],fig:"🔗",col:"#FF8C42",steps:[{cue:"Grip rope at chest height, elbows pinned to sides.",tip:"Elbows are the hinge — they don't move."},{cue:"Push down to full extension, flare rope slightly at bottom.",tip:"That flare at the bottom squeezes the tricep harder."},{cue:"Control weight back up — no momentum.",tip:"Slow and controlled beats heavy and sloppy."}]},
  { id:"leg_press",name:"Leg Press",sets:"4×15",muscle:"Quads / Glutes",equip:["machines"],avoids:["back","shoulder","wrist"],fig:"⚙️",col:"#7C6FFF",steps:[{cue:"Feet shoulder-width on platform, toes slightly out.",tip:"Higher foot = more glutes. Lower = more quads."},{cue:"Lower platform until knees hit ~90°, lower back flat.",tip:"Don't let your lower back peel off — disc injury risk."},{cue:"Drive through heels to near full extension, don't lock knees.",tip:"Stop just before full extension to keep tension on the muscle."}]},
  { id:"leg_curl",name:"Leg Curl",sets:"3×12",muscle:"Hamstrings",equip:["machines"],avoids:[],fig:"⚙️",col:"#7C6FFF",steps:[{cue:"Lie face down, pad against your lower leg, grip handles.",tip:"Adjust so your knee joint aligns with the machine pivot."},{cue:"Curl legs to full contraction, pause at top.",tip:"Don't let your hips rise — keep them pressed into the pad."},{cue:"Lower slowly with full control.",tip:"4-second descent for maximum hamstring stimulus."}]},
  { id:"chest_fly",name:"Pec Deck / Chest Fly",sets:"3×15",muscle:"Chest",equip:["machines"],avoids:["shoulder"],fig:"⚙️",col:"#FF6B6B",steps:[{cue:"Arms parallel to floor, slight elbow bend, back flat against pad.",tip:"Don't let shoulders roll forward — keep chest proud."},{cue:"Bring handles together, squeeze pecs hard.",tip:"Imagine holding a piece of paper between your pecs."},{cue:"Open slowly back to start, feel the stretch.",tip:"Don't overstretch — stop at mild tension."}]},
  { id:"pushup",name:"Push-Up",sets:"4×20",muscle:"Chest / Triceps",equip:["bodyweight"],avoids:["wrist","shoulder"],fig:"🧍",col:"#FF6B6B",steps:[{cue:"High plank, hands wider than shoulders, body straight line.",tip:"Squeeze glutes and brace core — no sagging hips."},{cue:"Lower chest to just above floor, elbows at 45°.",tip:"Don't flare elbows wide — shoulder joint stress."},{cue:"Push explosively back to start.",tip:"Push the floor away from you."}]},
  { id:"bw_squat",name:"Bodyweight Squat",sets:"4×25",muscle:"Quads / Glutes",equip:["bodyweight"],avoids:["knee"],fig:"🧍",col:"#7C6FFF",steps:[{cue:"Feet shoulder-width, toes out, arms forward for balance.",tip:"Chest tall, don't let knees cave inward."},{cue:"Sit back and down until thighs parallel to floor.",tip:"Wiggle your toes to check weight is in your heels."},{cue:"Drive through heels, squeeze glutes at top.",tip:"Don't round lower back at bottom."}]},
  { id:"pullup",name:"Pull-Up",sets:"4×max",muscle:"Back / Biceps",equip:["pullup"],avoids:["shoulder","wrist"],fig:"⬆️",col:"#3ECFB2",steps:[{cue:"Dead hang, hands shoulder-width, palms away.",tip:"Full dead hang at bottom — no half reps."},{cue:"Pull until chin clears bar, drive elbows down.",tip:"Pull bar to your chest, not yourself to the bar."},{cue:"Lower with full control to dead hang.",tip:"Slower descent = more back."}]},
  { id:"band_row",name:"Resistance Band Row",sets:"4×15",muscle:"Back",equip:["bands"],avoids:[],fig:"🔴",col:"#3ECFB2",steps:[{cue:"Anchor band at chest height, grab both ends.",tip:"More wrap/step = harder resistance."},{cue:"Pull to lower chest, elbows driving back.",tip:"Shoulders down — don't shrug."},{cue:"Slowly extend back, control the tension.",tip:"Don't let the band snap your arms forward."}]},
  { id:"dip",name:"Tricep Dip",sets:"3×15",muscle:"Triceps / Chest",equip:["bodyweight"],avoids:["shoulder","wrist"],fig:"🧍",col:"#FF8C42",steps:[{cue:"Hands on chair or surface, legs extended in front.",tip:"Further out = harder."},{cue:"Lower until upper arms parallel to floor.",tip:"Back close to surface — don't drift forward."},{cue:"Push to full extension.",tip:"Slight bend at top — don't lock aggressively."}]},
];

const LIMITATIONS = [
  {id:"ankle",label:"Ankle",icon:"🦶"},{id:"knee",label:"Knee",icon:"🦵"},
  {id:"back",label:"Lower back",icon:"🔄"},{id:"shoulder",label:"Shoulder",icon:"💪"},
  {id:"hip",label:"Hip",icon:"🩻"},{id:"wrist",label:"Wrist/elbow",icon:"✋"},
  {id:"chronic",label:"Chronic fatigue",icon:"⚡"},{id:"none",label:"No limitations",icon:"✓"},
];
const GOALS = [
  {id:"lose",label:"Lose fat",sub:"Burn fat, drop weight",icon:"🔥"},
  {id:"build",label:"Build muscle",sub:"Strength and size",icon:"💪"},
  {id:"maintain",label:"Stay consistent",sub:"Lock in a habit",icon:"📅"},
  {id:"mobility",label:"Move better",sub:"Flexibility & recovery",icon:"🧘"},
];
const FITNESS_LEVELS = [
  {id:"beginner",label:"Beginner",sub:"New or returning after a long break"},
  {id:"intermediate",label:"Intermediate",sub:"Training regularly for 6+ months"},
  {id:"advanced",label:"Advanced",sub:"Years of consistent training"},
];
const EQUIP_OPTIONS = [
  {id:"barbell",label:"Barbell & rack",icon:"🏋️"},{id:"dumbbells",label:"Dumbbells",icon:"🪆"},
  {id:"cables",label:"Cable machine",icon:"🔗"},{id:"machines",label:"Gym machines",icon:"⚙️"},
  {id:"bands",label:"Resistance bands",icon:"🔴"},{id:"pullup",label:"Pull-up bar",icon:"⬆️"},
  {id:"bench",label:"Bench",icon:"🛋️"},{id:"bodyweight",label:"Bodyweight only",icon:"🧍"},
];
const ONBOARD_STEPS = ["welcome","name","limitations","goals","body","fitness","location","ready"];

const INITIAL_WEIGHT_LOG = [{date:"May 1",kg:113.8},{date:"May 8",kg:112.4},{date:"May 15",kg:111.2},{date:"May 22",kg:110.0},{date:"May 29",kg:109.1}];
const INITIAL_MEALS = [
  {id:1,name:"Greek Yogurt & Berries",time:"08:00",cal:280,protein:22,carbs:28,fat:6},
  {id:2,name:"Chicken Rice Bowl",time:"13:00",cal:520,protein:48,carbs:55,fat:12},
  {id:3,name:"Protein Shake",time:"16:30",cal:160,protein:30,carbs:8,fat:3},
  {id:4,name:"Salmon & Vegetables",time:"19:00",cal:480,protein:42,carbs:22,fat:18},
];

// ─── SVG CHARTS ───────────────────────────────────────────────────────────────
function RingChart({value,max,size=80,stroke=7,color=C.accent,label,sublabel}){
  const r=(size-stroke*2)/2, circ=2*Math.PI*r, pct=Math.min(value/max,1), dash=pct*circ;
  return(
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.7s ease"}}/>
      </svg>
      <div style={{position:"absolute",textAlign:"center"}}>
        <div className="ep" style={{fontSize:13,fontWeight:900,color:C.text,lineHeight:1}}>{label}</div>
        {sublabel&&<div style={{fontSize:9,color:C.textMuted,marginTop:1}}>{sublabel}</div>}
      </div>
    </div>
  );
}

function LineChart({data,color=C.accent,height=80}){
  if(!data||data.length<2) return null;
  const vals=data.map(d=>d.kg), min=Math.min(...vals)-1, max=Math.max(...vals)+1, w=100, h=height;
  const pts=vals.map((v,i)=>[i/(vals.length-1)*w, h-((v-min)/(max-min))*h]);
  const path="M "+pts.map(p=>p.join(",")).join(" L ");
  const area=`M 0,${h} L ${pts.map(p=>p.join(",")).join(" L ")} L ${w},${h} Z`;
  return(
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} preserveAspectRatio="none" style={{overflow:"visible"}}>
      <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.15"/><stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={area} fill="url(#lg)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.5" fill={color}/>)}
    </svg>
  );
}

// ─── WEIGHT / HEIGHT INPUTS ───────────────────────────────────────────────────
function WeightInput({unit,onUnitChange,vals,onVals}){
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
        <label style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.2,flex:1}}>Weight</label>
        <div className="seg">{["kg","lbs","st"].map(u=><button key={u} className={`seg-btn ${unit===u?"on":""}`} onClick={()=>onUnitChange(u)}>{u}</button>)}</div>
      </div>
      {unit==="st"?(
        <div style={{display:"flex",gap:8}}>
          <div style={{flex:1}}><input className="input" type="number" placeholder="Stone" value={vals.st} onChange={e=>onVals({...vals,st:e.target.value})}/><div style={{fontSize:10,color:C.textMuted,marginTop:4,textAlign:"center"}}>st</div></div>
          <div style={{flex:1}}><input className="input" type="number" placeholder="Lbs" min="0" max="13" value={vals.lbs_part} onChange={e=>onVals({...vals,lbs_part:e.target.value})}/><div style={{fontSize:10,color:C.textMuted,marginTop:4,textAlign:"center"}}>lbs</div></div>
        </div>
      ):(
        <input className="input" type="number" placeholder={unit==="kg"?"e.g. 85":"e.g. 187"} value={vals.main} onChange={e=>onVals({...vals,main:e.target.value})}/>
      )}
    </div>
  );
}
function HeightInput({unit,onUnitChange,vals,onVals}){
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
        <label style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.2,flex:1}}>Height</label>
        <div className="seg">{["cm","ft"].map(u=><button key={u} className={`seg-btn ${unit===u?"on":""}`} onClick={()=>onUnitChange(u)}>{u}</button>)}</div>
      </div>
      {unit==="ft"?(
        <div style={{display:"flex",gap:8}}>
          <div style={{flex:1}}><input className="input" type="number" placeholder="Feet" value={vals.ft} onChange={e=>onVals({...vals,ft:e.target.value})}/><div style={{fontSize:10,color:C.textMuted,marginTop:4,textAlign:"center"}}>ft</div></div>
          <div style={{flex:1}}><input className="input" type="number" placeholder="Inches" min="0" max="11" value={vals.inch} onChange={e=>onVals({...vals,inch:e.target.value})}/><div style={{fontSize:10,color:C.textMuted,marginTop:4,textAlign:"center"}}>in</div></div>
        </div>
      ):(
        <input className="input" type="number" placeholder="e.g. 178" value={vals.main} onChange={e=>onVals({...vals,main:e.target.value})}/>
      )}
    </div>
  );
}

// ─── EXERCISE MODAL ───────────────────────────────────────────────────────────
function ExModal({ex,onClose}){
  const [si,setSi]=useState(0);
  const s=ex.steps[si];
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.4,marginBottom:4}}>{ex.muscle}</div><h3 className="ep" style={{fontSize:20,fontWeight:900}}>{ex.name}</h3></div>
          <button onClick={onClose} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:10,width:34,height:34,cursor:"pointer",color:C.textMuted,fontSize:14,flexShrink:0}}>✕</button>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:14}}>
          {ex.steps.map((_,i)=><button key={i} onClick={()=>setSi(i)} style={{flex:1,height:3,border:"none",borderRadius:100,cursor:"pointer",background:i===si?C.accent:i<si?"rgba(200,245,66,0.25)":C.border,transition:"all 0.2s"}}/>)}
        </div>
        <div style={{background:C.surfaceHigh,borderRadius:14,padding:"18px",marginBottom:14,border:`1px solid ${C.border}`,minHeight:120,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:56,marginBottom:8,filter:`drop-shadow(0 4px 12px ${ex.col}40)`}}>{ex.fig}</div><div style={{fontSize:11,color:C.textMuted,fontWeight:600}}>Step {si+1} of {ex.steps.length}</div></div>
        </div>
        <div className="card" style={{marginBottom:12}}>
          <div style={{fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:1.4,marginBottom:8,fontWeight:700}}>Cue</div>
          <p style={{fontSize:14,lineHeight:1.7,marginBottom:12}}>{s.cue}</p>
          <div style={{background:C.surfaceHigh,borderRadius:10,padding:"11px 13px",display:"flex",gap:8}}>
            <span style={{fontSize:14}}>💡</span>
            <p style={{fontSize:12,color:C.textSub,lineHeight:1.5}}>{s.tip}</p>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost" style={{flex:1}} disabled={si===0} onClick={()=>setSi(i=>i-1)}>← Back</button>
          {si<ex.steps.length-1?<button className="btn btn-accent" style={{flex:2}} onClick={()=>setSi(i=>i+1)}>Next →</button>:<button className="btn btn-accent" style={{flex:2}} onClick={onClose}>Got it ✓</button>}
        </div>
      </div>
    </div>
  );
}

// ─── AI COACH MODAL ───────────────────────────────────────────────────────────
function CoachModal({user,weightLog,meals,setsDone,availableEx,onClose}){
  const [msgs,setMsgs]=useState([{role:"assistant",content:`Hey ${user.name.split(" ")[0]} 👋 I'm your AI coach. I know your injuries, your goals, and your data. Ask me anything — adjust your plan, explain why something hurts, what to eat, how you're tracking. What's on your mind?`}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const weightKg=kgFromInput(user.weightVals.main,user.weightUnit,user.weightVals.st,user.weightVals.lbs_part);
  const calTarget=user.primaryGoal==="lose"?Math.round(weightKg*22):user.primaryGoal==="build"?Math.round(weightKg*32):Math.round(weightKg*27);
  const proteinTarget=Math.round(weightKg*1.8);
  const totalCal=meals.reduce((s,m)=>s+m.cal,0);
  const totalProtein=meals.reduce((s,m)=>s+m.protein,0);
  const latestWeight=weightLog[weightLog.length-1]?.kg||weightKg;
  const dropped=(weightLog[0]?.kg||weightKg)-latestWeight;

  const systemPrompt=`You are a personal trainer and nutrition coach inside a fitness app called Adapt. You speak like a real, straight-talking PT — no corporate fluff, no excessive disclaimers, no em dashes. Direct, warm, knowledgeable. Keep responses concise (2-4 sentences max unless detail is genuinely needed).

USER PROFILE:
- Name: ${user.name}
- Age: ${user.age}, Weight: ${latestWeight}kg, Goal: ${user.primaryGoal}
- Injuries/limitations: ${user.limitations.filter(x=>x!=="none").join(", ")||"none"}
- Fitness level: ${user.fitnessLevel}, Location: ${user.location}
- Equipment: ${user.equipment.join(", ")}
- Calorie target: ${calTarget}, Protein target: ${proteinTarget}g

TODAY'S DATA:
- Calories logged: ${totalCal}/${calTarget}
- Protein logged: ${totalProtein}g/${proteinTarget}g
- Weight trend: started ${weightLog[0]?.kg}kg, now ${latestWeight}kg (${dropped>0?"-"+dropped.toFixed(1)+"kg lost":"no change"})
- Completed exercises: ${Object.entries(setsDone).filter(([,v])=>v.some(Boolean)).map(([id])=>availableEx.find(e=>e.id===id)?.name).filter(Boolean).join(", ")||"none yet today"}

Be specific to their data. Never suggest exercises they can't do due to their injuries. If they ask about their ankle, remember it's a permanent injury.`;

  const send=async()=>{
    if(!input.trim()||loading) return;
    const userMsg={role:"user",content:input.trim()};
    const newMsgs=[...msgs,userMsg];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);
    const placeholder={role:"assistant",content:""};
    setMsgs(m=>[...m,placeholder]);
    try{
      await callClaude(
        newMsgs.map(m=>({role:m.role,content:m.content})),
        systemPrompt,
        (chunk)=>setMsgs(m=>[...m.slice(0,-1),{role:"assistant",content:chunk}])
      );
    }catch(e){
      setMsgs(m=>[...m.slice(0,-1),{role:"assistant",content:"Something went wrong — try again in a sec."}]);
    }
    setLoading(false);
  };

  const suggestions=["Am I on track this week?","What should I eat before training?","Why does my ankle hurt after squats?","Should I train today or rest?"];

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{display:"flex",flexDirection:"column",height:"85vh",padding:0}}>
        <div style={{padding:"20px 20px 14px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:C.accentDim,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
              <div><div className="ep" style={{fontWeight:800,fontSize:16}}>AI Coach</div><div style={{fontSize:11,color:C.textMuted}}>Knows your data</div></div>
            </div>
            <button onClick={onClose} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:10,width:34,height:34,cursor:"pointer",color:C.textMuted,fontSize:14}}>✕</button>
          </div>
        </div>

        <div style={{flex:1,overflow:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant"?(
                <div className="coach-bubble">
                  {m.content===("")?(
                    <div style={{display:"flex",gap:5,alignItems:"center",padding:"2px 0"}}>
                      {[0,0.2,0.4].map((d,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.accent,animation:`pulse 1.2s ${d}s infinite`}}/>)}
                    </div>
                  ):(
                    <>{m.content}{loading&&i===msgs.length-1&&<span className="ai-cursor"/>}</>
                  )}
                </div>
              ):(
                <div className="user-bubble">{m.content}</div>
              )}
            </div>
          ))}
          {msgs.length===1&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
              {suggestions.map(s=>(
                <button key={s} onClick={()=>{ setInput(s); }} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:100,padding:"7px 12px",fontSize:12,color:C.textSub,cursor:"pointer",fontFamily:"'Instrument Sans',sans-serif"}}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div style={{padding:"12px 18px 20px",borderTop:`1px solid ${C.border}`,flexShrink:0,display:"flex",gap:8}}>
          <textarea className="input" placeholder="Ask your coach anything..." value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            style={{flex:1,resize:"none",minHeight:42,maxHeight:100,overflowY:"auto",lineHeight:1.5,padding:"11px 14px",fontSize:14}}
            rows={1}/>
          <button className="btn btn-accent" style={{padding:"11px 16px",flexShrink:0}} disabled={!input.trim()||loading} onClick={send}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── AI WORKOUT GENERATOR ─────────────────────────────────────────────────────
function WorkoutGeneratorModal({user,availableEx,onAccept,onClose}){
  const [loading,setLoading]=useState(false);
  const [plan,setPlan]=useState(null);
  const [error,setError]=useState(null);
  const [feel,setFeel]=useState(null);

  const FEELS=[{id:"great",label:"💪 Feeling great",sub:"Full intensity"},{id:"ok",label:"🙂 Decent",sub:"Normal session"},{id:"tired",label:"😴 A bit tired",sub:"Lighter day"},{id:"sore",label:"🤕 Pretty sore",sub:"Recovery focus"}];

  const generate=async()=>{
    setLoading(true); setError(null);
    const weightKg=kgFromInput(user.weightVals.main,user.weightUnit,user.weightVals.st,user.weightVals.lbs_part);
    const sys=`You are a personal trainer. Respond ONLY with valid JSON, no markdown, no explanation.`;
    const prompt=`Generate a workout plan for this person. Return JSON array of 5-7 exercises.

USER:
- Age: ${user.age}, Weight: ${weightKg}kg
- Goal: ${user.primaryGoal}
- Injuries: ${user.limitations.filter(x=>x!=="none").join(", ")||"none"}
- Fitness level: ${user.fitnessLevel}
- How they feel today: ${feel||"ok"}
- Equipment: ${user.equipment.join(", ")}
- Location: ${user.location}

AVAILABLE EXERCISE IDs: ${availableEx.map(e=>e.id).join(", ")}

Return exactly this format:
[
  {"id":"exercise_id","reason":"1 sentence why this was picked for them"},
  ...
]

Rules:
- Only use exercise IDs from the AVAILABLE list
- Never suggest exercises involving: ${user.limitations.filter(x=>x!=="none").join(", ")||"nothing"}
- If they feel tired/sore, choose lighter movements and fewer sets
- Pick exercises that make sense together as a session (don't mix legs and chest randomly)
- Vary the session type based on their goal: ${user.primaryGoal}`;

    try{
      const result=await callClaudeJSON(prompt,sys);
      if(Array.isArray(result)){
        const resolved=result.map(r=>({...availableEx.find(e=>e.id===r.id)||availableEx[0],reason:r.reason})).filter(e=>e.id);
        setPlan(resolved);
      } else { setError("Couldn't parse plan — try again."); }
    } catch(e){ setError("API error — check connection."); }
    setLoading(false);
  };

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div><div style={{fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:1.5,marginBottom:4,fontWeight:700}}>AI-Generated</div><h3 className="ep" style={{fontSize:20,fontWeight:900}}>Build today's session</h3></div>
          <button onClick={onClose} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:10,width:34,height:34,cursor:"pointer",color:C.textMuted,fontSize:14}}>✕</button>
        </div>

        {!plan&&!loading&&(
          <>
            <p style={{fontSize:13,color:C.textSub,marginBottom:18,lineHeight:1.6}}>Tell the AI how you're feeling today and it'll build a session around your injuries, goals, and energy level.</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {FEELS.map(f=>(
                <button key={f.id} onClick={()=>setFeel(f.id)} style={{background:feel===f.id?C.accentDim:C.surfaceHigh,border:`1.5px solid ${feel===f.id?C.accent:C.border}`,borderRadius:14,padding:"13px 16px",cursor:"pointer",textAlign:"left",transition:"all 0.16s",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span className="ep" style={{fontWeight:700,fontSize:14,color:feel===f.id?C.accent:C.text}}>{f.label}</span>
                  <span style={{fontSize:11,color:C.textMuted}}>{f.sub}</span>
                </button>
              ))}
            </div>
            {error&&<div style={{background:C.redDim,border:`1px solid rgba(255,68,85,0.2)`,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.red,marginBottom:14}}>{error}</div>}
            <button className="btn btn-accent" style={{width:"100%",padding:16}} disabled={!feel} onClick={generate}>Generate my session ✨</button>
          </>
        )}

        {loading&&(
          <div style={{textAlign:"center",padding:"48px 0"}}>
            <div style={{fontSize:40,marginBottom:16,animation:"float 2s infinite"}}>🧠</div>
            <div className="ep" style={{fontWeight:800,fontSize:18,marginBottom:6}}>Building your session...</div>
            <div style={{fontSize:13,color:C.textMuted,marginBottom:24}}>Factoring in your injuries, energy, and goals</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {["Checking safe exercises for your injuries...","Matching to your energy level...","Structuring the session..."].map((t,i)=>(
                <div key={i} style={{background:C.surfaceHigh,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.textSub,textAlign:"left",display:"flex",gap:8}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.accent,marginTop:3,flexShrink:0,animation:`pulse 1s ${i*0.3}s infinite`}}/>
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {plan&&(
          <div className="fade-up">
            <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.accent,fontWeight:600}}>
              ✓ {plan.length} exercises built around your profile
            </div>
            <div className="card" style={{marginBottom:14}}>
              {plan.map((ex,i)=>(
                <div key={i} style={{padding:"12px 0",borderBottom:i<plan.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
                    <div style={{width:38,height:38,borderRadius:10,background:`${ex.col}18`,border:`1px solid ${ex.col}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ex.fig}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:14}}>{ex.name}</div>
                      <div style={{fontSize:11,color:C.textMuted}}>{ex.sets} · {ex.muscle}</div>
                    </div>
                  </div>
                  <div style={{marginLeft:48,fontSize:12,color:C.textSub,lineHeight:1.5}}>{ex.reason}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setPlan(null);setFeel(null);}}>Regenerate</button>
              <button className="btn btn-accent" style={{flex:2}} onClick={()=>{onAccept(plan);onClose();}}>Use this plan ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI FOOD LOG ──────────────────────────────────────────────────────────────
function FoodModal({onClose,onLog}){
  const [mode,setMode]=useState("choose");
  const [desc,setDesc]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState(null);

  const analyse=async()=>{
    setLoading(true); setError(null);
    const sys=`You are a nutrition expert. Respond ONLY with valid JSON, no markdown.`;
    const prompt=`Estimate the macros for this meal. Be realistic and specific.

Meal description: "${desc}"

Return exactly:
{"name":"clean meal name","cal":number,"protein":number,"carbs":number,"fat":number,"confidence":"high|medium|low","note":"any important caveat in max 10 words"}`;
    try{
      const r=await callClaudeJSON(prompt,sys);
      if(r&&r.cal) setResult(r);
      else setError("Couldn't parse that — try describing it differently.");
    }catch(e){ setError("API error. Try again."); }
    setLoading(false);
  };

  const QUICK=[
    "Chicken breast 200g with rice and broccoli",
    "Protein shake with oat milk",
    "Scrambled eggs on toast",
    "Beef burger no bun with salad",
  ];

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h3 className="ep" style={{fontSize:20,fontWeight:900}}>Log a meal</h3>
          <button onClick={onClose} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:10,width:34,height:34,cursor:"pointer",color:C.textMuted,fontSize:14}}>✕</button>
        </div>

        {!result&&(
          <>
            <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:12,padding:"11px 14px",marginBottom:16,fontSize:13,color:C.textSub}}>
              🤖 Describe what you ate and AI estimates the macros — no barcode needed.
            </div>
            <textarea className="input" placeholder='e.g. "Chicken and rice, about 200g chicken, large portion of rice, some broccoli"' value={desc} onChange={e=>setDesc(e.target.value)} rows={3} style={{marginBottom:12}}/>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Quick add:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {QUICK.map(q=><button key={q} onClick={()=>setDesc(q)} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:100,padding:"6px 11px",fontSize:11,color:C.textSub,cursor:"pointer"}}>{q}</button>)}
              </div>
            </div>
            {error&&<div style={{background:C.redDim,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.red,marginBottom:12}}>{error}</div>}
            {loading?(
              <div style={{textAlign:"center",padding:"24px 0"}}>
                <div style={{fontSize:36,animation:"float 1.5s infinite",marginBottom:10}}>🧮</div>
                <div style={{fontSize:13,color:C.textMuted}}>Calculating macros...</div>
              </div>
            ):(
              <button className="btn btn-accent" style={{width:"100%",padding:15}} disabled={!desc.trim()} onClick={analyse}>Analyse macros ✨</button>
            )}
          </>
        )}

        {result&&(
          <div className="fade-up">
            <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",gap:8,alignItems:"center"}}>
              <span>✓</span>
              <div style={{fontSize:13,color:C.accent,fontWeight:600}}>Confidence: {result.confidence} {result.confidence==="high"?"— solid estimate":"— best guess from description"}</div>
            </div>
            <div className="card" style={{marginBottom:12}}>
              <div className="ep" style={{fontWeight:800,fontSize:16,marginBottom:14}}>{result.name}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,textAlign:"center"}}>
                {[["Cal",result.cal,""],["Protein",result.protein,"g"],["Carbs",result.carbs,"g"],["Fat",result.fat,"g"]].map(([l,v,u])=>(
                  <div key={l}><div className="ep" style={{fontWeight:900,fontSize:20,color:C.accent}}>{v}{u}</div><div style={{fontSize:10,color:C.textMuted,marginTop:2}}>{l}</div></div>
                ))}
              </div>
              {result.note&&<div style={{marginTop:12,fontSize:12,color:C.textMuted,background:C.surfaceHigh,borderRadius:8,padding:"8px 12px"}}>{result.note}</div>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setResult(null);setDesc("");}}>Try again</button>
              <button className="btn btn-accent" style={{flex:2}} onClick={()=>{onLog(result);onClose();}}>Log this ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WEIGHT LOG MODAL ─────────────────────────────────────────────────────────
function WeightModal({onClose,onLog,current}){
  const [val,setVal]=useState("");
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 className="ep" style={{fontSize:20,fontWeight:900}}>Log weight</h3>
          <button onClick={onClose} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:10,width:34,height:34,cursor:"pointer",color:C.textMuted,fontSize:14}}>✕</button>
        </div>
        <div style={{fontSize:13,color:C.textMuted,marginBottom:14}}>Last: {current}kg</div>
        <input className="input" type="number" placeholder="Today's weight in kg" value={val} onChange={e=>setVal(e.target.value)}
          style={{marginBottom:18,fontSize:22,fontFamily:"'Epilogue',sans-serif",fontWeight:700}} autoFocus/>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" style={{flex:2}} disabled={!val} onClick={()=>{onLog(Number(val));onClose();}}>Save ✓</button>
        </div>
      </div>
    </div>
  );
}

// ─── DAILY CHECK-IN ───────────────────────────────────────────────────────────
function CheckInModal({user,onClose,onDone}){
  const [step,setStep]=useState(0);
  const [energy,setEnergy]=useState(null);
  const [sleep,setSleep]=useState(null);
  const [sore,setSore]=useState([]);
  const [loading,setLoading]=useState(false);
  const [advice,setAdvice]=useState(null);

  const ENERGIES=[{v:5,label:"🔥 Pumped"},{v:4,label:"💪 Good"},{v:3,label:"😐 Alright"},{v:2,label:"😴 Tired"},{v:1,label:"🤕 Rough"}];
  const SLEEPS=[{v:"8+",label:"8+ hrs"},{v:"6-8",label:"6-8 hrs"},{v:"<6",label:"Under 6"}];
  const MUSCLES=["Chest","Back","Shoulders","Arms","Quads","Hamstrings","Glutes","Core"];

  const getAdvice=async()=>{
    setLoading(true); setStep(3);
    const weightKg=kgFromInput(user.weightVals.main,user.weightUnit,user.weightVals.st,user.weightVals.lbs_part);
    const sys=`You are a personal trainer. Be direct, specific, helpful. 2-4 sentences max. No em dashes.`;
    const prompt=`Give a specific training recommendation for today.

User: ${user.name}, ${user.age}yrs, ${weightKg}kg, goal: ${user.primaryGoal}
Injuries: ${user.limitations.filter(x=>x!=="none").join(", ")||"none"}
Today: Energy ${energy}/5, Sleep ${sleep}, Sore muscles: ${sore.join(", ")||"none"}

Tell them specifically what intensity/focus to bring today based on this data. Mention their sore muscles and injuries if relevant. End with one actionable tip.`;
    setLoading(false);
    try{
      const text = await callClaude([{role:"user",content:prompt}],sys);
      setAdvice(text || "Couldn't load advice — but your check-in is saved. Go train.");
    }catch{ setAdvice("Couldn't load advice — but your check-in is saved. Go train."); }
  };

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div><div style={{fontSize:10,color:C.accent,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,marginBottom:4}}>Daily check-in</div><h3 className="ep" style={{fontSize:20,fontWeight:900}}>{["How's the energy?","How did you sleep?","Anything sore?","Your coaching note"][step]||"How's the energy?"}</h3></div>
          <button onClick={onClose} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:10,width:34,height:34,cursor:"pointer",color:C.textMuted,fontSize:14}}>✕</button>
        </div>

        {step===0&&(
          <div className="fade-up">
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {ENERGIES.map(e=>(
                <button key={e.v} onClick={()=>setEnergy(e.v)} style={{background:energy===e.v?C.accentDim:C.surfaceHigh,border:`1.5px solid ${energy===e.v?C.accent:C.border}`,borderRadius:12,padding:"13px 16px",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",transition:"all 0.16s"}}>
                  <span className="ep" style={{fontWeight:700,fontSize:14,color:energy===e.v?C.accent:C.text}}>{e.label}</span>
                  {energy===e.v&&<span style={{fontSize:12,color:C.accent}}>✓</span>}
                </button>
              ))}
            </div>
            <button className="btn btn-accent" style={{width:"100%",padding:15}} disabled={!energy} onClick={()=>setStep(1)}>Next →</button>
          </div>
        )}
        {step===1&&(
          <div className="fade-up">
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              {SLEEPS.map(s=>(
                <button key={s.v} onClick={()=>setSleep(s.v)} style={{flex:1,background:sleep===s.v?C.accentDim:C.surfaceHigh,border:`1.5px solid ${sleep===s.v?C.accent:C.border}`,borderRadius:12,padding:"16px 8px",cursor:"pointer",textAlign:"center",transition:"all 0.16s"}}>
                  <div className="ep" style={{fontWeight:700,fontSize:14,color:sleep===s.v?C.accent:C.text}}>{s.label}</div>
                </button>
              ))}
            </div>
            <button className="btn btn-accent" style={{width:"100%",padding:15}} disabled={!sleep} onClick={()=>setStep(2)}>Next →</button>
          </div>
        )}
        {step===2&&(
          <div className="fade-up">
            <p style={{fontSize:13,color:C.textMuted,marginBottom:14}}>Tap any muscles that are still sore from previous sessions:</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
              {MUSCLES.map(m=>(
                <button key={m} className={`chip ${sore.includes(m)?"on":""}`} onClick={()=>setSore(p=>p.includes(m)?p.filter(x=>x!==m):[...p,m])}>{m}</button>
              ))}
            </div>
            <button className="btn btn-accent" style={{width:"100%",padding:15}} onClick={getAdvice}>Get my coaching note ✨</button>
          </div>
        )}
        {step===3&&(
          <div className="fade-up">
            <div style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px",marginBottom:18,minHeight:80}}>
              <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
                <div style={{width:28,height:28,borderRadius:8,background:C.accentDim,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🤖</div>
                <div className="ep" style={{fontWeight:700,fontSize:13}}>AI Coach</div>
              </div>
              {advice===null?(
                <div style={{display:"flex",gap:5,alignItems:"center"}}>{[0,0.2,0.4].map((d,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.accent,animation:`pulse 1.2s ${d}s infinite`}}/>)}</div>
              ):(
                <p style={{fontSize:14,lineHeight:1.7,color:C.text}}>{advice}</p>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
              {[["Energy",energy+"/5"],["Sleep",sleep],["Sore",sore.length||"None"]].map(([l,v])=>(
                <div key={l} style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div className="ep" style={{fontWeight:800,fontSize:15,color:C.accent,marginBottom:2}}>{v}</div>
                  <div style={{fontSize:10,color:C.textMuted}}>{l}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-accent" style={{width:"100%",padding:15}} disabled={!advice||advice.length<10} onClick={()=>{onDone({energy,sleep,sore});onClose();}}>Start training →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({onDone}){
  const [step,setStep]=useState(0);
  const [d,setD]=useState({
    name:"",limitations:[],primaryGoal:null,secondaryGoal:null,
    weightUnit:"kg",weightVals:{main:"",st:"",lbs_part:""},
    heightUnit:"cm",heightVals:{main:"",ft:"",inch:""},
    age:"",fitnessLevel:null,location:null,equipment:[],
  });
  const u=(k,v)=>setD(p=>({...p,[k]:v}));
  const next=()=>setStep(s=>s+1);
  const back=()=>setStep(s=>s-1);
  const prog=step/(ONBOARD_STEPS.length-1)*100;

  const weightOk=()=>d.weightUnit==="st"?d.weightVals.st!=="":d.weightVals.main!=="";
  const heightOk=()=>d.heightUnit==="ft"?d.heightVals.ft!=="":d.heightVals.main!=="";
  const canNext=()=>{
    const s=ONBOARD_STEPS[step];
    if(s==="name") return d.name.trim().length>1;
    if(s==="limitations") return d.limitations.length>0;
    if(s==="goals") return d.primaryGoal!==null;
    if(s==="body") return weightOk()&&heightOk()&&d.age!=="";
    if(s==="fitness") return d.fitnessLevel!==null;
    if(s==="location") return d.location!==null&&d.equipment.length>0;
    return true;
  };
  const toggleLimitation=id=>{
    if(id==="none"){u("limitations",["none"]);return;}
    u("limitations",d.limitations.includes(id)?d.limitations.filter(x=>x!==id):[...d.limitations.filter(x=>x!=="none"),id]);
  };
  const setGoal=id=>{
    if(d.primaryGoal===id){u("primaryGoal",null);return;}
    if(d.secondaryGoal===id){u("secondaryGoal",null);return;}
    if(!d.primaryGoal){u("primaryGoal",id);return;}
    if(!d.secondaryGoal){u("secondaryGoal",id);return;}
    u("primaryGoal",id);u("secondaryGoal",null);
  };
  const toggleEquip=id=>{
    if(id==="bodyweight"){u("equipment",["bodyweight"]);return;}
    u("equipment",d.equipment.includes(id)?d.equipment.filter(x=>x!==id):[...d.equipment.filter(x=>x!=="bodyweight"),id]);
  };
  const firstName=d.name.split(" ")[0];
  const weightKg=kgFromInput(d.weightVals.main,d.weightUnit,d.weightVals.st,d.weightVals.lbs_part);
  const heightCm=cmFromInput(d.heightVals.main,d.heightUnit,d.heightVals.ft,d.heightVals.inch);
  const bmi=heightCm>0&&weightKg>0?(weightKg/Math.pow(heightCm/100,2)).toFixed(1):null;

  return(
    <div style={{minHeight:"100vh",maxWidth:430,margin:"0 auto",padding:"0 20px 52px",display:"flex",flexDirection:"column"}}>
      <style>{G}</style>
      {ONBOARD_STEPS[step]==="welcome"&&(
        <div className="fade-in" style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:72}}>
          <div style={{width:48,height:48,borderRadius:14,background:C.accentDim,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:26,fontSize:20}}>⚡</div>
          <div style={{fontSize:10,color:C.accent,letterSpacing:3,textTransform:"uppercase",marginBottom:12,fontWeight:700}}>Adapt</div>
          <h1 className="ep" style={{fontSize:44,fontWeight:900,lineHeight:1.05,marginBottom:16}}>Fitness built<br/>for your<br/><span style={{color:C.accent}}>actual body.</span></h1>
          <p style={{fontSize:14,color:C.textSub,lineHeight:1.7,marginBottom:44,maxWidth:280}}>No generic plans. No exercises that wreck your injuries. An AI coach that actually knows you.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button className="btn btn-accent" style={{width:"100%",padding:17}} onClick={next}>Get started — it's free</button>
            <button className="btn btn-ghost" style={{width:"100%"}}>I already have an account</button>
          </div>
          <div style={{display:"flex",gap:18,marginTop:28,justifyContent:"center"}}>
            {["AI coach","Injury-aware","Adapts weekly"].map(t=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textMuted}}>
                <span style={{color:C.accent,fontSize:8}}>●</span>{t}
              </div>
            ))}
          </div>
        </div>
      )}
      {step>0&&step<ONBOARD_STEPS.length-1&&(
        <div style={{paddingTop:48,paddingBottom:22}}>
          <div className="progress"><div className="progress-fill" style={{width:`${prog}%`}}/></div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
            <span style={{fontSize:11,color:C.textMuted}}>Step {step} of {ONBOARD_STEPS.length-2}</span>
            {step>1&&<button onClick={back} style={{background:"none",border:"none",color:C.textMuted,fontSize:12,cursor:"pointer"}}>← Back</button>}
          </div>
        </div>
      )}
      {ONBOARD_STEPS[step]==="name"&&(
        <div className="fade-up" style={{flex:1}}>
          <h2 className="ep" style={{fontSize:28,fontWeight:900,marginBottom:8}}>What's your name?</h2>
          <p style={{color:C.textMuted,marginBottom:24,fontSize:14}}>We personalise everything to you.</p>
          <input className="input" placeholder="First name" value={d.name} autoFocus onChange={e=>u("name",e.target.value)} style={{fontSize:20,fontFamily:"'Epilogue',sans-serif",fontWeight:700,marginBottom:24}}/>
          <button className="btn btn-accent" style={{width:"100%",padding:16}} disabled={!canNext()} onClick={next}>Continue</button>
        </div>
      )}
      {ONBOARD_STEPS[step]==="limitations"&&(
        <div className="fade-up" style={{flex:1}}>
          <h2 className="ep" style={{fontSize:28,fontWeight:900,marginBottom:8}}>Any injuries or limitations?</h2>
          <p style={{color:C.textMuted,marginBottom:20,fontSize:14,lineHeight:1.55}}>Be honest. We'll filter out anything that could make it worse.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>{LIMITATIONS.map(l=><button key={l.id} className={`chip ${d.limitations.includes(l.id)?"on":""}`} onClick={()=>toggleLimitation(l.id)}><span>{l.icon}</span>{l.label}</button>)}</div>
          <button className="btn btn-accent" style={{width:"100%",padding:16}} disabled={!canNext()} onClick={next}>{d.limitations.includes("none")?"No limitations, let's go":`Continue (${d.limitations.length} selected)`}</button>
        </div>
      )}
      {ONBOARD_STEPS[step]==="goals"&&(
        <div className="fade-up" style={{flex:1}}>
          <h2 className="ep" style={{fontSize:28,fontWeight:900,marginBottom:6}}>What are you working toward?</h2>
          <p style={{color:C.textMuted,marginBottom:10,fontSize:14}}>First tap = primary goal.</p>
          {d.primaryGoal&&(
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <span className="tag" style={{background:C.accentDim,color:C.accent,border:`1px solid ${C.accentBorder}`}}>Primary: {GOALS.find(g=>g.id===d.primaryGoal)?.label}</span>
              {d.secondaryGoal&&<span className="tag" style={{background:C.orangeDim,color:C.orange,border:`1px solid rgba(255,140,66,0.2)`}}>Secondary: {GOALS.find(g=>g.id===d.secondaryGoal)?.label}</span>}
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
            {GOALS.map(g=>{
              const ip=d.primaryGoal===g.id,is=d.secondaryGoal===g.id;
              return(
                <button key={g.id} onClick={()=>setGoal(g.id)} style={{background:ip?C.accentDim:is?C.orangeDim:C.surface,border:`1.5px solid ${ip?C.accent:is?C.orange:C.border}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all 0.16s",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:20}}>{g.icon}</span>
                  <div style={{flex:1}}><div className="ep" style={{fontWeight:700,fontSize:14,color:ip?C.accent:is?C.orange:C.text}}>{g.label}</div><div style={{fontSize:12,color:C.textMuted,marginTop:1}}>{g.sub}</div></div>
                  {ip&&<span style={{fontSize:9,color:C.accent,fontWeight:700}}>PRIMARY</span>}
                  {is&&<span style={{fontSize:9,color:C.orange,fontWeight:700}}>SECONDARY</span>}
                </button>
              );
            })}
          </div>
          <button className="btn btn-accent" style={{width:"100%",padding:16}} disabled={!canNext()} onClick={next}>Continue</button>
        </div>
      )}
      {ONBOARD_STEPS[step]==="body"&&(
        <div className="fade-up" style={{flex:1}}>
          <h2 className="ep" style={{fontSize:28,fontWeight:900,marginBottom:8}}>A bit about your body</h2>
          <p style={{color:C.textMuted,marginBottom:20,fontSize:14}}>For calculating your targets — nothing else.</p>
          <div style={{marginBottom:16}}><WeightInput unit={d.weightUnit} onUnitChange={v=>u("weightUnit",v)} vals={d.weightVals} onVals={v=>u("weightVals",v)}/></div>
          <div style={{marginBottom:16}}><HeightInput unit={d.heightUnit} onUnitChange={v=>u("heightUnit",v)} vals={d.heightVals} onVals={v=>u("heightVals",v)}/></div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.2,display:"block",marginBottom:8}}>Age</label>
            <input className="input" type="number" placeholder="Your age" value={d.age} onChange={e=>u("age",e.target.value)}/>
          </div>
          {bmi&&<div style={{background:C.surfaceHigh,borderRadius:10,padding:"11px 14px",marginBottom:16,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.textSub}}>BMI</span><span className="ep" style={{fontWeight:800,fontSize:15,color:C.accent}}>{bmi}</span></div>}
          <button className="btn btn-accent" style={{width:"100%",padding:16}} disabled={!canNext()} onClick={next}>Continue</button>
        </div>
      )}
      {ONBOARD_STEPS[step]==="fitness"&&(
        <div className="fade-up" style={{flex:1}}>
          <h2 className="ep" style={{fontSize:28,fontWeight:900,marginBottom:8}}>Your fitness level?</h2>
          <p style={{color:C.textMuted,marginBottom:20,fontSize:14}}>Honest answers only — it sets intensity and volume.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
            {FITNESS_LEVELS.map(f=>(
              <button key={f.id} onClick={()=>u("fitnessLevel",f.id)} style={{background:d.fitnessLevel===f.id?C.accentDim:C.surface,border:`1.5px solid ${d.fitnessLevel===f.id?C.accent:C.border}`,borderRadius:14,padding:"16px 18px",cursor:"pointer",textAlign:"left",transition:"all 0.16s"}}>
                <div className="ep" style={{fontWeight:700,fontSize:15,color:d.fitnessLevel===f.id?C.accent:C.text,marginBottom:3}}>{f.label}</div>
                <div style={{fontSize:12,color:C.textMuted}}>{f.sub}</div>
              </button>
            ))}
          </div>
          <button className="btn btn-accent" style={{width:"100%",padding:16}} disabled={!canNext()} onClick={next}>Continue</button>
        </div>
      )}
      {ONBOARD_STEPS[step]==="location"&&(
        <div className="fade-up" style={{flex:1}}>
          <h2 className="ep" style={{fontSize:28,fontWeight:900,marginBottom:8}}>Where do you train?</h2>
          <p style={{color:C.textMuted,marginBottom:18,fontSize:14}}>Only shows exercises you can actually do.</p>
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            {[{id:"gym",label:"🏟️ Gym",sub:"Full equipment"},{id:"home",label:"🏠 Home",sub:"Select what you have"}].map(loc=>(
              <button key={loc.id} onClick={()=>{u("location",loc.id);if(loc.id==="gym")u("equipment",["barbell","dumbbells","cables","machines","bench","pullup"]);else u("equipment",[]);}} style={{flex:1,background:d.location===loc.id?C.accentDim:C.surface,border:`1.5px solid ${d.location===loc.id?C.accent:C.border}`,borderRadius:14,padding:"16px 10px",cursor:"pointer",textAlign:"center",transition:"all 0.16s"}}>
                <div className="ep" style={{fontWeight:700,fontSize:14,color:d.location===loc.id?C.accent:C.text}}>{loc.label}</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{loc.sub}</div>
              </button>
            ))}
          </div>
          {d.location&&(
            <div className="fade-in">
              <div style={{fontSize:12,color:C.textSub,marginBottom:10}}>{d.location==="gym"?"Untick anything you don't use:":"What have you got at home?"}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:18}}>{EQUIP_OPTIONS.map(eq=><button key={eq.id} className={`chip ${d.equipment.includes(eq.id)?"on":""}`} onClick={()=>toggleEquip(eq.id)}><span>{eq.icon}</span>{eq.label}</button>)}</div>
              {d.equipment.length>0&&<div style={{fontSize:12,color:C.textMuted,marginBottom:14,padding:"9px 13px",background:C.accentDim,borderRadius:9,border:`1px solid ${C.accentBorder}`}}>✓ {EXERCISE_DB.filter(e=>e.equip.some(eq=>d.equipment.includes(eq))).length} exercises available</div>}
            </div>
          )}
          <button className="btn btn-accent" style={{width:"100%",padding:16}} disabled={!canNext()} onClick={next}>Continue</button>
        </div>
      )}
      {ONBOARD_STEPS[step]==="ready"&&(
        <div className="slide-up" style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:32}}>
          <div style={{width:50,height:50,borderRadius:14,background:C.accentDim,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:20}}>✓</div>
          <h2 className="ep" style={{fontSize:34,fontWeight:900,marginBottom:10}}>You're set,<br/><span style={{color:C.accent}}>{firstName}.</span></h2>
          <p style={{color:C.textSub,fontSize:13,lineHeight:1.7,marginBottom:20}}>Your AI coach is ready. Plan adapts to your injuries, goals, and how you feel each day.</p>
          <div className="card" style={{marginBottom:20}}>
            {[["Injuries",d.limitations.includes("none")?"None":d.limitations.join(", ")],["Primary goal",GOALS.find(g=>g.id===d.primaryGoal)?.label||"—"],["Weight",d.weightUnit==="st"?`${d.weightVals.st}st ${d.weightVals.lbs_part||0}lbs`:`${d.weightVals.main}${d.weightUnit}`],["Fitness level",d.fitnessLevel],["Location",d.location==="gym"?"Gym":"Home"],["Equipment",d.equipment.length+" items"]].map(([label,val])=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:12,color:C.textMuted}}>{label}</span>
                <span style={{fontSize:12,fontWeight:600,color:C.text,textTransform:"capitalize",textAlign:"right",maxWidth:"55%"}}>{val}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-accent" style={{width:"100%",padding:17}} onClick={()=>onDone(d)}>Open my plan →</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp({user}){
  const [tab,setTab]=useState("home");
  const [activeEx,setActiveEx]=useState(null);
  const [showCoach,setShowCoach]=useState(false);
  const [showGen,setShowGen]=useState(false);
  const [showFood,setShowFood]=useState(false);
  const [showWeight,setShowWeight]=useState(false);
  const [showCheckIn,setShowCheckIn]=useState(false);
  const [checkInDone,setCheckInDone]=useState(null);

  // Persistent state
  const [meals,setMeals]=useState(()=>{ const s=loadStore(); return s?.meals||INITIAL_MEALS; });
  const [weightLog,setWeightLog]=useState(()=>{ const s=loadStore(); return s?.weightLog||INITIAL_WEIGHT_LOG; });
  const [setsDone,setSetsDone]=useState({});
  const [customPlan,setCustomPlan]=useState(null);
  const [sessionStarted,setSessionStarted]=useState(false);

  // Persist on change
  useEffect(()=>{ saveStore({meals,weightLog}); },[meals,weightLog]);

  const weightKg=kgFromInput(user.weightVals.main,user.weightUnit,user.weightVals.st,user.weightVals.lbs_part);
  const calTarget=user.primaryGoal==="lose"?Math.round(weightKg*22):user.primaryGoal==="build"?Math.round(weightKg*32):Math.round(weightKg*27);
  const proteinTarget=Math.round(weightKg*1.8);
  const totalCal=meals.reduce((s,m)=>s+m.cal,0);
  const totalProtein=meals.reduce((s,m)=>s+m.protein,0);
  const totalCarbs=meals.reduce((s,m)=>s+m.carbs,0);
  const totalFat=meals.reduce((s,m)=>s+m.fat,0);
  const latestWeight=weightLog[weightLog.length-1]?.kg||weightKg;
  const dropped=parseFloat(((weightLog[0]?.kg||weightKg)-latestWeight).toFixed(1));
  const firstName=user.name.split(" ")[0];
  const hasLimitations=!user.limitations.includes("none");

  const availableEx=EXERCISE_DB.filter(ex=>{
    const hasEquip=ex.equip.some(eq=>user.equipment.includes(eq));
    const isSafe=!hasLimitations||!user.limitations.some(l=>ex.avoids.includes(l));
    return hasEquip&&isSafe;
  });
  const sessionExercises=customPlan||availableEx.slice(0,7);

  const getSets=ex=>{ const m=ex.sets.match(/(\d+)/); return m?parseInt(m[1]):3; };
  const totalSets=sessionExercises.reduce((s,ex)=>s+getSets(ex),0);
  const doneSets=Object.values(setsDone).reduce((s,arr)=>s+arr.filter(Boolean).length,0);
  const sessionPct=totalSets>0?doneSets/totalSets:0;

  const toggleSet=(exId,si)=>{
    if(!sessionStarted) setSessionStarted(true);
    setSetsDone(p=>{ const cur=p[exId]||[]; const up=[...cur]; up[si]=!up[si]; return {...p,[exId]:up}; });
  };

  const TABS=[{id:"home",label:"Home",icon:"⊞"},{id:"workout",label:"Train",icon:"◈"},{id:"meals",label:"Meals",icon:"◉"},{id:"progress",label:"Progress",icon:"◎"}];

  return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",position:"relative",background:C.bg}}>
      <style>{G}</style>

      {/* HEADER */}
      <div style={{padding:"50px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:3}}>{dayName()}</div>
          <h1 className="ep" style={{fontSize:24,fontWeight:900,lineHeight:1.1}}>
            {tab==="home"&&`Hey, ${firstName}.`}
            {tab==="workout"&&"Today's session."}
            {tab==="meals"&&"Your nutrition."}
            {tab==="progress"&&"Your progress."}
          </h1>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setShowCoach(true)} style={{width:38,height:38,borderRadius:11,background:C.accentDim,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16}}>🤖</button>
          <div style={{width:38,height:38,borderRadius:11,background:C.surfaceHigh,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span className="ep" style={{fontWeight:900,color:C.accent,fontSize:14}}>{firstName[0].toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div style={{padding:"16px 20px 100px",display:"flex",flexDirection:"column",gap:12}}>

        {/* ══ HOME ══ */}
        {tab==="home"&&<>
          {/* Check-in CTA */}
          {!checkInDone?(
            <button className="fade-up" onClick={()=>setShowCheckIn(true)} style={{background:`linear-gradient(135deg, ${C.accentDim}, ${C.purpleDim})`,border:`1px solid ${C.accentBorder}`,borderRadius:16,padding:"14px 18px",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
              <div>
                <div style={{fontSize:11,color:C.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:3}}>Daily check-in</div>
                <div className="ep" style={{fontWeight:800,fontSize:15,color:C.text}}>How are you feeling today?</div>
                <div style={{fontSize:12,color:C.textSub,marginTop:2}}>Takes 30 seconds. AI adapts your day.</div>
              </div>
              <div style={{fontSize:22}}>→</div>
            </button>
          ):(
            <div className="fade-up" style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:14,padding:"12px 16px",display:"flex",gap:12,alignItems:"center"}}>
              <span>✓</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.accent,fontWeight:700,marginBottom:1}}>Check-in done</div>
                <div style={{fontSize:12,color:C.textSub}}>Energy {checkInDone.energy}/5 · Sleep {checkInDone.sleep}{checkInDone.sore.length>0?` · Sore: ${checkInDone.sore.join(", ")}`:""}
                </div>
              </div>
            </div>
          )}

          {/* Macros rings */}
          {hasLimitations&&(
            <div className="fade-up" style={{animationDelay:"0.04s",background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:14,padding:"12px 15px",display:"flex",gap:10}}>
              <span style={{fontSize:16}}>⚡</span>
              <div>
                <div style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:2}}>Adapted plan</div>
                <div style={{fontSize:12,color:C.textSub,lineHeight:1.5}}>Exercises risking your {user.limitations.filter(x=>x!=="none").join(", ")} are automatically removed.</div>
              </div>
            </div>
          )}

          <div className="card fade-up" style={{animationDelay:"0.08s"}}>
            <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.3,marginBottom:14}}>Today's nutrition</div>
            <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",marginBottom:14}}>
              <RingChart value={totalCal} max={calTarget} size={84} stroke={7} color={C.accent} label={totalCal} sublabel="kcal"/>
              <RingChart value={totalProtein} max={proteinTarget} size={68} stroke={6} color={C.purple} label={`${totalProtein}g`} sublabel="protein"/>
              <RingChart value={totalCarbs} max={220} size={68} stroke={6} color={C.orange} label={`${totalCarbs}g`} sublabel="carbs"/>
              <RingChart value={totalFat} max={80} size={68} stroke={6} color={C.teal} label={`${totalFat}g`} sublabel="fat"/>
            </div>
            <div className="progress"><div className="progress-fill" style={{width:`${Math.min(totalCal/calTarget*100,100)}%`}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              <span style={{fontSize:10,color:C.textMuted}}>{totalCal} eaten</span>
              <span style={{fontSize:10,color:C.textMuted}}>{Math.max(0,calTarget-totalCal)} left</span>
            </div>
          </div>

          {/* Today's workout */}
          <div className="card fade-up" style={{animationDelay:"0.12s",cursor:"pointer"}} onClick={()=>setTab("workout")}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.3}}>{customPlan?"AI-generated plan":"Today's workout"}</div>
              <span style={{fontSize:12,color:C.accent}}>{sessionPct>0?"Continue →":"Start →"}</span>
            </div>
            <div className="ep" style={{fontWeight:900,fontSize:18,marginBottom:10}}>{user.location==="gym"?"Upper Body — Gym":"Custom Home Session"}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:sessionPct>0?12:0}}>
              <span className="tag" style={{background:C.accentDim,color:C.accent}}>{sessionExercises.length} exercises</span>
              <span className="tag" style={{background:C.surfaceHigh,color:C.textMuted}}>~45 min</span>
              {hasLimitations&&<span className="tag" style={{background:C.orangeDim,color:C.orange}}>Injury-safe</span>}
              {customPlan&&<span className="tag" style={{background:C.purpleDim,color:C.purple}}>AI plan ✨</span>}
            </div>
            {sessionPct>0&&<>
              <div className="progress"><div className="progress-fill" style={{width:`${sessionPct*100}%`}}/></div>
              <div style={{fontSize:10,color:C.textMuted,marginTop:5}}>{doneSets}/{totalSets} sets complete</div>
            </>}
          </div>

          {/* Weight snapshot */}
          <div className="card fade-up" style={{animationDelay:"0.16s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.3}}>Weight this month</div>
              <button onClick={()=>setShowWeight(true)} style={{fontSize:11,color:C.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>+ Log</button>
            </div>
            <div style={{display:"flex",gap:20,marginBottom:12}}>
              <div><div className="ep" style={{fontSize:24,fontWeight:900}}>{displayKg(latestWeight,user.weightUnit)}</div><div style={{fontSize:10,color:C.textMuted}}>Current</div></div>
              {dropped>0&&<div><div className="ep" style={{fontSize:24,fontWeight:900,color:C.accent}}>-{dropped}kg</div><div style={{fontSize:10,color:C.textMuted}}>Lost</div></div>}
            </div>
            <LineChart data={weightLog} height={72}/>
          </div>

          {/* Streak */}
          <div className="card fade-up" style={{animationDelay:"0.2s"}}>
            <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.3,marginBottom:12}}>Weekly streak</div>
            <div style={{display:"flex",gap:5}}>
              {["M","T","W","T","F","S","S"].map((d,i)=>(
                <div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{width:"100%",aspectRatio:"1",borderRadius:7,marginBottom:4,background:i<4?C.accent:C.surfaceHigh,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#000",fontWeight:900}}>{i<4?"✓":""}</div>
                  <div style={{fontSize:9,color:C.textMuted}}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ══ WORKOUT ══ */}
        {tab==="workout"&&<>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:2}}>
            <span className="tag" style={{background:C.accentDim,color:C.accent,textTransform:"capitalize"}}>{user.location}</span>
            <span className="tag" style={{background:C.surfaceHigh,color:C.textMuted,textTransform:"capitalize"}}>{user.fitnessLevel}</span>
            {hasLimitations&&<span className="tag" style={{background:C.orangeDim,color:C.orange}}>Adapted</span>}
            {customPlan&&<span className="tag" style={{background:C.purpleDim,color:C.purple}}>AI plan ✨</span>}
          </div>

          {/* AI Plan generator CTA */}
          <button onClick={()=>setShowGen(true)} style={{background:`linear-gradient(135deg,${C.purpleDim},${C.accentDim})`,border:`1px solid rgba(139,124,246,0.3)`,borderRadius:14,padding:"14px 18px",cursor:"pointer",textAlign:"left",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:10,color:C.purple,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:2}}>AI-powered ✨</div>
              <div className="ep" style={{fontWeight:800,fontSize:14,color:C.text}}>Generate today's session</div>
              <div style={{fontSize:12,color:C.textSub,marginTop:1}}>Built around your injuries, energy, and goal</div>
            </div>
            <div style={{fontSize:22}}>→</div>
          </button>

          {hasLimitations&&(
            <div style={{background:C.surfaceHigh,borderRadius:11,padding:"11px 13px",fontSize:12,color:C.textSub}}>
              🔒 {user.limitations.filter(x=>x!=="none").join(", ")} — unsafe exercises filtered out automatically.
            </div>
          )}

          {/* Session progress bar */}
          {doneSets>0&&(
            <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:12,padding:"11px 15px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <span style={{fontSize:12,color:C.accent,fontWeight:700}}>In progress</span>
                <span style={{fontSize:12,color:C.textMuted}}>{doneSets}/{totalSets} sets</span>
              </div>
              <div className="progress"><div className="progress-fill" style={{width:`${sessionPct*100}%`}}/></div>
            </div>
          )}

          {sessionExercises.length===0?(
            <div className="card" style={{textAlign:"center",padding:"32px 20px"}}>
              <div style={{fontSize:32,marginBottom:10}}>🤔</div>
              <div className="ep" style={{fontWeight:700,fontSize:16,marginBottom:6}}>No exercises match</div>
              <div style={{fontSize:13,color:C.textMuted}}>Add more equipment or remove some limitations.</div>
            </div>
          ):(
            <div className="card">
              {sessionExercises.map((ex,i)=>{
                const numSets=getSets(ex);
                const done=setsDone[ex.id]||[];
                const allDone=done.filter(Boolean).length===numSets;
                return(
                  <div key={ex.id} className="ex-row" style={{borderBottom:i<sessionExercises.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{width:44,height:44,borderRadius:12,background:allDone?"rgba(200,245,66,0.12)":`${ex.col}14`,border:`1px solid ${allDone?C.accent:ex.col+"28"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,transition:"all 0.3s"}}>
                      {allDone?"✓":ex.fig}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,marginBottom:5,color:allDone?C.textMuted:C.text,textDecoration:allDone?"line-through":"none",transition:"all 0.3s"}}>{ex.name}</div>
                      <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                        <div style={{display:"flex",gap:4}}>{Array.from({length:numSets},(_,si)=><div key={si} className={`set-dot ${(done[si])?"done":""}`} onClick={()=>toggleSet(ex.id,si)}/>)}</div>
                        <span style={{fontSize:10,color:C.textMuted}}>{ex.sets}</span>
                      </div>
                      {customPlan&&ex.reason&&<div style={{fontSize:11,color:C.textSub,marginTop:4,lineHeight:1.4}}>{ex.reason}</div>}
                    </div>
                    <button onClick={()=>setActiveEx(ex)} style={{fontSize:10,color:C.textMuted,background:C.surfaceHigh,border:"none",borderRadius:7,padding:"4px 9px",cursor:"pointer",flexShrink:0}}>How →</button>
                  </div>
                );
              })}
            </div>
          )}

          {doneSets===totalSets&&totalSets>0?(
            <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:14,padding:"20px",textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:8}}>🎉</div>
              <div className="ep" style={{fontWeight:900,fontSize:20,color:C.accent,marginBottom:4}}>Session complete!</div>
              <div style={{fontSize:13,color:C.textSub}}>Every single set. Proper job.</div>
            </div>
          ):(
            <button className="btn btn-accent" style={{width:"100%",padding:16}} onClick={()=>setSessionStarted(true)}>{sessionStarted?"Carrying on...":"Start session"}</button>
          )}
        </>}

        {/* ══ MEALS ══ */}
        {tab==="meals"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Calories",totalCal,calTarget,"",C.accent],["Protein",totalProtein,proteinTarget,"g",C.purple]].map(([l,v,t,u,col])=>(
              <div key={l} className="card" style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{l}</div>
                <div className="ep" style={{fontSize:26,fontWeight:900,color:col}}>{v}{u}</div>
                <div style={{fontSize:9,color:C.textMuted,marginBottom:7}}>of {t}{u}</div>
                <div style={{height:3,background:C.border,borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",background:col,borderRadius:100,width:`${Math.min(v/t*100,100)}%`,transition:"width 0.6s ease"}}/></div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Carbs",totalCarbs,220,"g",C.orange],["Fat",totalFat,80,"g",C.teal]].map(([l,v,t,u,col])=>(
              <div key={l} className="card" style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{l}</div>
                <div className="ep" style={{fontSize:26,fontWeight:900,color:col}}>{v}{u}</div>
                <div style={{fontSize:9,color:C.textMuted,marginBottom:7}}>of {t}{u}</div>
                <div style={{height:3,background:C.border,borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",background:col,borderRadius:100,width:`${Math.min(v/t*100,100)}%`,transition:"width 0.6s ease"}}/></div>
              </div>
            ))}
          </div>

          {/* AI Food log CTA */}
          <button onClick={()=>setShowFood(true)} style={{background:`linear-gradient(135deg,${C.accentDim},${C.purpleDim})`,border:`1px solid ${C.accentBorder}`,borderRadius:14,padding:"14px 18px",cursor:"pointer",textAlign:"left",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:10,color:C.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:2}}>AI-powered ✨</div>
              <div className="ep" style={{fontWeight:800,fontSize:14,color:C.text}}>Describe a meal, get instant macros</div>
              <div style={{fontSize:12,color:C.textSub,marginTop:1}}>No barcode. Just tell it what you ate.</div>
            </div>
            <div style={{fontSize:22}}>→</div>
          </button>

          <div className="card">
            <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.3,marginBottom:12}}>Today's meals</div>
            {meals.map((m,i)=>(
              <div key={m.id||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<meals.length-1?`1px solid ${C.border}`:"none"}}>
                <div>
                  <div style={{fontWeight:500,fontSize:13}}>{m.name}</div>
                  <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{m.time} · {m.protein}g protein</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="ep" style={{fontWeight:800,fontSize:15}}>{m.cal}</div>
                  <div style={{fontSize:10,color:C.textMuted}}>kcal</div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ══ PROGRESS ══ */}
        {tab==="progress"&&<>
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.3}}>Weight trend</div>
              <button onClick={()=>setShowWeight(true)} style={{fontSize:11,color:C.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>+ Log weight</button>
            </div>
            <div style={{display:"flex",gap:20,marginBottom:14}}>
              <div><div className="ep" style={{fontSize:28,fontWeight:900}}>{displayKg(latestWeight,user.weightUnit)}</div><div style={{fontSize:10,color:C.textMuted}}>Current</div></div>
              {dropped>0&&<div><div className="ep" style={{fontSize:28,fontWeight:900,color:C.accent}}>-{dropped}kg</div><div style={{fontSize:10,color:C.textMuted}}>Since {weightLog[0]?.date}</div></div>}
            </div>
            <LineChart data={weightLog} height={90}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              {weightLog.map((p,i)=><div key={i} style={{fontSize:9,color:C.textMuted}}>{p.date}</div>)}
            </div>
          </div>

          <div className="card">
            <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.3,marginBottom:12}}>Weight log</div>
            {[...weightLog].reverse().slice(0,6).map((entry,i,arr)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{entry.date}</div></div>
                <div className="ep" style={{fontWeight:800,fontSize:14}}>{entry.kg}kg</div>
                {i<arr.length-1&&<div style={{fontSize:11,color:C.accent,minWidth:44,textAlign:"right"}}>-{(arr[i+1].kg-entry.kg).toFixed(1)}kg</div>}
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:1.3,marginBottom:12}}>This month</div>
            {[["Workouts done","4","/ 12 planned"],["Avg protein",`${totalProtein}g`,`/ ${proteinTarget}g`],["Current streak","4 days","Personal best"],["Total lost",dropped>0?`${dropped}kg`:"0kg","since start"]].map(([l,v,s])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:13,color:C.textSub}}>{l}</span>
                <div><span className="ep" style={{fontWeight:800,fontSize:14,color:C.accent}}>{v} </span><span style={{fontSize:11,color:C.textMuted}}>{s}</span></div>
              </div>
            ))}
          </div>
        </>}

      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.surface,borderTop:`1px solid ${C.border}`,padding:"7px 10px 22px",display:"flex",gap:2}}>
        {TABS.map(t=><button key={t.id} className={`nav-item ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}><span style={{fontSize:18}}>{t.icon}</span><span>{t.label}</span></button>)}
      </div>

      {/* MODALS */}
      {activeEx&&<ExModal ex={activeEx} onClose={()=>setActiveEx(null)}/>}
      {showCoach&&<CoachModal user={user} weightLog={weightLog} meals={meals} setsDone={setsDone} availableEx={availableEx} onClose={()=>setShowCoach(false)}/>}
      {showGen&&<WorkoutGeneratorModal user={user} availableEx={availableEx} onAccept={plan=>{setCustomPlan(plan);setSetsDone({});setSessionStarted(false);}} onClose={()=>setShowGen(false)}/>}
      {showFood&&<FoodModal onClose={()=>setShowFood(false)} onLog={meal=>setMeals(p=>[...p,{...meal,id:Date.now(),time:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}])}/>}
      {showWeight&&<WeightModal onClose={()=>setShowWeight(false)} current={latestWeight} onLog={kg=>setWeightLog(p=>[...p,{date:today(),kg}])}/>}
      {showCheckIn&&<CheckInModal user={user} onClose={()=>setShowCheckIn(false)} onDone={data=>setCheckInDone(data)}/>}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  return user?<MainApp user={user}/>:<Onboarding onDone={setUser}/>;
}
