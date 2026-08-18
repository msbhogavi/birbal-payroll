// KaushalStack Grow desktop prototype — campaign state + interactions
const screens = ["strategy","creative","review","performance"];
const campaign = {
  lifecycle: "draft",
  capacity: { total: 5, filled: 2, open: 3, bookedByCampaign: 0 },
  goal: "More bookings",
  offerApproved: false,
  approval: { status: "none", hasUnresolvedComment: false },
  published: false,
  boost: { status: "blocked", goal: "More bookings", daily: 300, days: 3, metaPaymentVerified: false },
  channels: { instagram: { selected: true, connected: true }, facebook: { selected: false, connected: false }, whatsapp: { selected: true, manual: true, optedIn: 142 } },
  schedule: { mode: "recommended", date: "2026-08-06", time: "10:30", label: "Wed 10:30 AM" },
  resultsVisible: false
};

const perfByGoal = {
  "More bookings": {
    heading: "This campaign filled 2 of 3 open Friday slots",
    sub: "2 confirmed bookings matched through refunction.in/aug. 1 slot remains open. WhatsApp matches are reported separately and unconfirmed.",
    heroLabel: "Confirmed bookings", heroVal: "2", heroDelta: "2 of 3 open slots filled · 1 remaining",
    secondaryLabel: "Link clicks", secondaryVal: "186", secondaryDelta: "1.5% of people reached",
    waVal: "22", waDelta: "6 matched booking phrases · unconfirmed",
    spendVal: "₹1,560", spendDelta: "₹780 per paid-attributed booking · max ₹900 recommended",
    chartTitle: "Bookings by day", funnelTitle: "Booking funnel", funnelPill: "Matched to confirmed appointments",
    funnel: [{ l: "Reached", v: 12400 }, { l: "Clicked", v: 186 }, { l: "Started", v: 14 }, { l: "Booked", v: 2 }],
    recPrimaryTitle: "1 Friday slot is still open",
    recPrimaryBody: "This audience produced 2 bookings within 5 km. Spend up to ₹900 over 3 days to try for the last slot — tied to remaining capacity.",
    recSecondaryTitle: "Offer headline outperformed education",
    recSecondaryBody: "Compared variants over 4 days · n=12,400 reach · offer 1.5% CTR vs education 0.6%. Confidence: moderate.",
    measurement: "Success = a completed booking",
    measurementDetail: "Grow adds a campaign ID to refunction.in/aug and records a result only after the appointment is confirmed in your calendar."
  },
  "More messages": {
    heading: "22 WhatsApp conversations started",
    sub: "6 messages matched booking phrases; none count as bookings until an appointment is confirmed.",
    heroLabel: "WhatsApp conversations", heroVal: "22", heroDelta: "6 phrase-matched · 0 confirmed bookings",
    secondaryLabel: "Response rate", secondaryVal: "68%", secondaryDelta: "15 of 22 replied within 24h",
    waVal: "22", waDelta: "Primary metric for this goal",
    spendVal: "₹1,560", spendDelta: "₹71 per conversation started",
    chartTitle: "Messages by day", funnelTitle: "Message funnel", funnelPill: "Matched to WhatsApp Business API events",
    funnel: [{ l: "Reached", v: 12400 }, { l: "Clicked WA", v: 94 }, { l: "Started chat", v: 22 }, { l: "Phrase match", v: 6 }],
    recPrimaryTitle: "Follow up on 6 phrase matches",
    recPrimaryBody: "These showed booking intent but did not complete. Only 4 have marketing opt-in for a reminder.",
    recSecondaryTitle: "Offer CTA drove more chats",
    recSecondaryBody: "Offer post: 1.2% WA click-through vs education 0.4% over 4 days · n=12,400 reach.",
    measurement: "Success = a new WhatsApp conversation",
    measurementDetail: "Counts first message to your WhatsApp Business number within 7 days of a campaign touchpoint."
  },
  "More reach": {
    heading: "12,400 people reached nearby",
    sub: "Reach is reported by Meta. Confirmed bookings (2) appear as secondary business outcomes.",
    heroLabel: "People reached", heroVal: "12,400", heroDelta: "Within 8 km around Kothrud",
    secondaryLabel: "Frequency", secondaryVal: "1.3", secondaryDelta: "Average times each person saw the post",
    waVal: "22", waDelta: "Secondary · unconfirmed booking intent",
    spendVal: "₹1,560", spendDelta: "₹0.13 per person reached",
    chartTitle: "Reach by day", funnelTitle: "Reach funnel", funnelPill: "Meta-reported impressions",
    funnel: [{ l: "Budget", v: 1560 }, { l: "Impressions", v: 18200 }, { l: "Reach", v: 12400 }, { l: "Engaged", v: 420 }],
    recPrimaryTitle: "Frequency is still low",
    recPrimaryBody: "At 1.3× frequency there is room to extend 3 days without oversaturating this audience.",
    recSecondaryTitle: "Bookings are a secondary signal",
    recSecondaryBody: "2 confirmed bookings despite reach-first optimization. Consider switching goal if slots remain open.",
    measurement: "Success = unique people reached",
    measurementDetail: "Uses Meta reach reporting. Does not infer bookings from impressions."
  },
  "More visits": {
    heading: "186 visits to the booking page",
    sub: "Visits are campaign-tagged sessions on refunction.in/aug. 2 completed bookings are counted separately.",
    heroLabel: "Booking-page visits", heroVal: "186", heroDelta: "14 started booking · 2 completed",
    secondaryLabel: "Bounce rate", secondaryVal: "42%", secondaryDelta: "Lower than site average (51%)",
    waVal: "22", waDelta: "Secondary channel · not counted as visits",
    spendVal: "₹1,560", spendDelta: "₹8.39 per visit",
    chartTitle: "Visits by day", funnelTitle: "Visit funnel", funnelPill: "Campaign-tagged sessions only",
    funnel: [{ l: "Reached", v: 12400 }, { l: "Clicked", v: 186 }, { l: "Sessions", v: 164 }, { l: "Started form", v: 14 }],
    recPrimaryTitle: "14 started but did not finish",
    recPrimaryBody: "Form drop-off is high on mobile. Shorten the booking form or add WhatsApp fallback.",
    recSecondaryTitle: "Offer headline drove more visits",
    recSecondaryBody: "Offer variant: 1.5% CTR vs education 0.6% · n=12,400 reach over 4 days.",
    measurement: "Success = a tagged visit to refunction.in/aug",
    measurementDetail: "Session must include UTM campaign parameters. Repeat sessions within 30 min count once."
  }
};

const stateCopy = {
  strategy: ["Recommended audience ready","Accept the recommendation or open advanced settings.","Setting audience","Build the post →"],
  creative: ["Finish the post","Edit headline, caption, and image. Post preview is full size.","Editing post","Review and schedule →"],
  review: ["Ready to schedule","Complete offer approval and resolve any review comments.","Awaiting publish","Schedule post"],
  performance: ["Gathering results","Attribution updates as bookings confirm. Last sync 12 min ago.","Live · gathering","View results"]
};

function refreshIcons(){
  if(window.lucide) lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
}

function setDockPrimary(label, withArrow){
  const dock = document.getElementById("dockPrimary");
  if(withArrow){
    dock.innerHTML = `${label.replace(/ →$/,"")} <i data-lucide="arrow-right" class="icon-sm"></i>`;
  } else {
    dock.textContent = label;
  }
}

function updateCapacityUI(){
  const { total, filled, bookedByCampaign } = campaign.capacity;
  const filledCount = filled + bookedByCampaign;
  const openCount = Math.max(0, total - filledCount);
  campaign.capacity.open = openCount;
  document.getElementById("signalHeadline").textContent = `${openCount} Friday assessment slot${openCount===1?" is":"s are"} still open`;
  document.getElementById("signalBody").textContent = openCount===0
    ? "All Friday slots are filled. Grow will stop recommending further spend on this campaign."
    : "Friday usually fills by Thursday. This campaign is set to bookings and will stop recommending spend once the slots are filled.";
  document.getElementById("slotLabel").textContent = `${filledCount} filled · ${openCount} open`;
  document.getElementById("leftDesc").textContent = `${openCount} Friday slot${openCount===1?" is":"s are"} still open. This campaign was created to help fill them.`;
  document.getElementById("ctxWhyNow").textContent = `${openCount} Friday slot${openCount===1?"":"s"} open`;
  document.getElementById("lineageSlots").textContent = `${openCount} Friday slot${openCount===1?"":"s"} open`;
  const meter = document.getElementById("slotMeter");
  meter.innerHTML = "";
  for(let i=0;i<total;i++){ const s=document.createElement("span"); if(i<filledCount) s.className="filled"; meter.appendChild(s); }
  meter.setAttribute("aria-label", `${filledCount} of ${total} Friday slots filled`);
  const maxBoost = openCount * 900;
  document.getElementById("ctxBoost").textContent = campaign.boost.status==="active"
    ? `₹${campaign.boost.daily}/day · ${campaign.boost.days} days`
    : openCount ? `Not started · max ₹${maxBoost} if ${openCount} slot${openCount===1?"":"s"} remain` : "Paused · all slots filled";
  const preview = document.getElementById("boostPreview");
  if(preview) preview.textContent = openCount
    ? `Same audience: 8 km, ages 35–55. Max ₹${maxBoost} suggested for ${openCount} remaining slot${openCount===1?"":"s"}.`
    : "All slots filled — boost not recommended.";
  const fillDemo = document.getElementById("fillLastSlotDemo");
  if(fillDemo) fillDemo.style.display = openCount > 0 && campaign.resultsVisible ? "inline-flex" : "none";
}

function updateLifecycleUI(){
  const steps = ["draft","scheduled","publishing","live","gathering","completed"];
  const idx = steps.indexOf(campaign.lifecycle);
  const labels = { draft:"Draft", scheduled:"Scheduled", publishing:"Publishing", live:"Live", gathering:"Gathering results", completed:"Completed" };
  document.getElementById("campaignStatusLabel").textContent = (labels[campaign.lifecycle]||"Draft") + " ▾";
  document.getElementById("campaignDot").style.background = idx>=4 ? "var(--green)" : idx>=2 ? "var(--blue)" : "var(--amber)";
  ["reviewLifecycle","perfLifecycle"].forEach(id=>{
    const bar = document.getElementById(id); if(!bar) return;
    bar.querySelectorAll(".lifecycle-step").forEach(step=>{
      const si = steps.indexOf(step.dataset.step);
      step.classList.remove("done","active","pending");
      if(si < idx) step.classList.add("done");
      else if(si === idx) step.classList.add(step.dataset.step==="publishing"?"pending":"active");
    });
  });
  const perfEmpty = document.getElementById("perfEmpty");
  const perfContent = document.getElementById("perfContent");
  if(perfEmpty && perfContent){
    if(campaign.lifecycle === "gathering" && !campaign.resultsVisible){
      perfEmpty.style.display = "block"; perfContent.style.display = "none";
    } else if(campaign.resultsVisible || campaign.lifecycle==="completed"){
      perfEmpty.style.display = "none"; perfContent.style.display = "block";
    }
  }
  const addBoost = document.getElementById("addBoost");
  const note = document.getElementById("boostEligibilityNote");
  if(addBoost){ addBoost.disabled = !campaign.published; }
  if(note){ note.textContent = campaign.published
    ? (campaign.boost.metaPaymentVerified ? "Boost available after you confirm budget." : "Verify Meta ad account payment to enable boost.")
    : "Boost unlocks after the post is live and Meta ad account payment is verified."; }
  updateCloseoutUI();
  const statusLine = document.getElementById("boostStatusLine");
  const startBoost = document.getElementById("startBoost");
  if(statusLine && startBoost){
    if(!campaign.published){ statusLine.className="boost-status blocked"; statusLine.textContent="Blocked until post is live."; startBoost.disabled=true; }
    else if(!campaign.boost.metaPaymentVerified){ statusLine.className="boost-status blocked"; statusLine.textContent="Blocked — Meta payment method not verified."; startBoost.disabled=true; }
    else if(campaign.boost.status==="pending"){ statusLine.className="boost-status pending"; statusLine.textContent="Submitted to Meta · awaiting review (usually under 24h)."; startBoost.disabled=true; }
    else if(campaign.boost.status==="active"){ statusLine.className="boost-status active"; statusLine.textContent=`Active · ₹${campaign.boost.daily}/day for ${campaign.boost.days} days`; startBoost.disabled=true; }
    else if(campaign.capacity.open===0){ statusLine.className="boost-status blocked"; statusLine.textContent="Paused — all Friday slots filled."; startBoost.disabled=true; }
    else { statusLine.className="boost-status"; statusLine.textContent="Ready to start once you confirm budget and goal."; startBoost.disabled=false; }
  }
}

function updateCloseoutUI(){
  const card = document.getElementById("closeoutCard");
  if(!card) return;
  const open = campaign.capacity.open;
  const show = campaign.resultsVisible && open===0;
  card.style.display = show ? "block" : "none";
  if(!show) return;
  campaign.lifecycle = "completed";
  document.getElementById("closeoutTitle").textContent = campaign.goal==="More bookings"
    ? "All Friday slots filled"
    : "Campaign goal reached";
  document.getElementById("closeoutBody").textContent = campaign.goal==="More bookings"
    ? "Every open slot from this campaign window is booked. Archive this run or reuse the audience, offer, and creative that worked."
    : "This campaign hit its success metric. Archive it or duplicate the setup for the next push.";
  document.getElementById("campaignStatusLabel").textContent = "Completed ▾";
  document.getElementById("campaignDot").style.background = "var(--green)";
}

function syncToggleGroup(container, selector, activeBtn){
  container.querySelectorAll(selector).forEach(x=>x.classList.remove("on"));
  activeBtn.classList.add("on");
  syncPressed(container, selector, activeBtn);
}

function canSchedule(){
  if(!campaign.offerApproved) return "Approve the offer and clinical wording before scheduling.";
  if(campaign.approval.hasUnresolvedComment) return "Resolve review comments before scheduling.";
  if(!campaign.channels.instagram.connected) return "Connect Instagram before scheduling.";
  return null;
}

function updateApprovalUI(){
  const gate = document.getElementById("approvalGate");
  const blocked = canSchedule();
  if(gate){ gate.style.display = blocked ? "block" : "none"; gate.textContent = blocked || ""; }
  const icon = document.getElementById("checkOfferIcon");
  if(icon){
    icon.textContent = campaign.offerApproved ? "✓" : "!";
    icon.style.background = campaign.offerApproved ? "var(--green-soft)" : "var(--amber-soft)";
    icon.style.color = campaign.offerApproved ? "var(--green)" : "var(--amber)";
  }
  const btn = document.getElementById("scheduleBtn");
  if(btn) btn.disabled = !!blocked;
}

function showScreen(id){
  screens.forEach(s=>document.getElementById(s).classList.toggle("active",s===id));
  document.querySelectorAll(".flow-btn").forEach(b=>{
    const current=screens.indexOf(id), own=screens.indexOf(b.dataset.screen);
    b.classList.toggle("active",b.dataset.screen===id);
    b.classList.toggle("done", own<current || (campaign.lifecycle!=="draft" && own<=2));
  });
  const c=stateCopy[id];
  document.getElementById("contextTitle").textContent=c[0];
  document.getElementById("contextText").textContent=c[1];
  document.getElementById("dockStatus").textContent=c[2];
  setDockPrimary(c[3], id!=="performance" && id!=="review");
  const dock = document.getElementById("dockPrimary");
  if(id==="creative") dock.dataset.go="review";
  else if(id==="review") dock.dataset.go="performance";
  else if(id==="performance") dock.removeAttribute("data-go");
  else dock.dataset.go="creative";
  if(id==="performance") updateLifecycleUI();
  if(id==="review") updateApprovalUI();
  refreshIcons();
}

document.addEventListener("click",e=>{
  const go=e.target.closest("[data-go]");
  if(go && !go.disabled) showScreen(go.dataset.go);
  const flow=e.target.closest(".flow-btn");
  if(flow) showScreen(flow.dataset.screen);
});

function updatePerformanceGoal(goal){
  const d = perfByGoal[goal]; if(!d) return;
  document.getElementById("performanceHeading").textContent=d.heading;
  document.getElementById("performanceSub").textContent=d.sub;
  document.getElementById("heroMetricLabel").textContent=d.heroLabel;
  document.getElementById("heroMetricValue").textContent=d.heroVal;
  document.getElementById("heroMetricDelta").textContent=d.heroDelta;
  document.getElementById("kpiSecondaryLabel").textContent=d.secondaryLabel;
  document.getElementById("kpiSecondaryVal").textContent=d.secondaryVal;
  document.getElementById("kpiSecondaryDelta").textContent=d.secondaryDelta;
  document.getElementById("kpiWaVal").textContent=d.waVal;
  document.getElementById("kpiWaDelta").textContent=d.waDelta;
  document.getElementById("kpiSpendVal").textContent=d.spendVal;
  document.getElementById("kpiSpendDelta").textContent=d.spendDelta;
  document.getElementById("chartTitle").textContent=d.chartTitle;
  document.getElementById("funnelTitle").textContent=d.funnelTitle;
  document.getElementById("funnelPill").textContent=d.funnelPill;
  document.getElementById("recPrimaryTitle").textContent=d.recPrimaryTitle;
  document.getElementById("recPrimaryBody").textContent=d.recPrimaryBody;
  document.getElementById("recSecondaryTitle").textContent=d.recSecondaryTitle;
  document.getElementById("recSecondaryBody").textContent=d.recSecondaryBody;
  document.getElementById("measurementSuccess").textContent=d.measurement;
  document.getElementById("measurementDetail").textContent=d.measurementDetail;
  document.getElementById("lineageGoal").textContent = "Goal: " + goal;
  const max = d.funnel[0].v;
  document.getElementById("funnelRows").innerHTML = d.funnel.map(f=>`<div class="funnel-row"><span>${f.l}</span><div class="funnel-bar"><i style="width:${Math.max(.5,(f.v/max)*100)}%${f.l==="Booked"||f.l==="Phrase match"?";background:var(--green)":""}"></i></div><b>${f.v>=1000?(f.v/1000).toFixed(1)+"k":f.v}</b></div>`).join("");
}

document.querySelectorAll(".objective").forEach(b=>b.onclick=()=>{
  syncToggleGroup(document.querySelector(".objectives"), ".objective", b);
  campaign.goal = b.dataset.goal;
  document.getElementById("sumGoal").textContent=campaign.goal;
  document.getElementById("ctxGoal").textContent=campaign.goal;
  updatePerformanceGoal(campaign.goal);
  syncBoostGoal(campaign.goal);
  campaign.approval.status = "stale";
  updateApprovalUI();
});

function syncBoostGoal(goal){
  document.querySelectorAll("#boostGoals .radio-option").forEach(option=>{
    const selected=option.dataset.boostGoal===goal;
    option.classList.toggle("on",selected);
    option.querySelector("input").checked=selected;
  });
  campaign.boost.goal = goal;
  updateBoostGoalNotice();
}

function updateBoostGoalNotice(){
  const selected=document.querySelector("#boostGoals .radio-option.on")?.dataset.boostGoal;
  const notice=document.getElementById("boostGoalNotice");
  if(selected===campaign.goal){ notice.textContent=`Matches campaign goal: ${campaign.goal}.`; notice.style.color=""; }
  else { notice.textContent=`Boost optimizes for ${selected?.replace("More ","").toLowerCase()}, while campaign success remains ${campaign.goal.replace("More ","").toLowerCase()}. Confirmation required.`; notice.style.color="var(--amber)"; }
}

function bindToggle(parent,selector,callback){
  const root = typeof parent==="string" ? document.querySelector(parent) : parent;
  root.addEventListener("click",e=>{
    const c=e.target.closest(selector); if(!c) return;
    c.classList.toggle("on");
    syncPressed(root, selector, c.classList.contains("on") ? c : null);
    if(callback) callback();
  });
}
bindToggle("#keywordChips",".chip",()=>{document.getElementById("keywordCount").textContent=document.querySelectorAll("#keywordChips .on").length+" selected"});
bindToggle("#interestChips",".chip",updateAudience);
bindToggle(".demographics",".lang",updateAudience);
document.getElementById("addKeyword").onclick=()=>{const i=document.getElementById("keywordInput");if(!i.value.trim())return;const b=document.createElement("button");b.className="chip on";b.textContent=i.value.trim();document.getElementById("keywordChips").appendChild(b);i.value="";document.getElementById("keywordCount").textContent=document.querySelectorAll("#keywordChips .on").length+" selected"};
document.querySelectorAll("#genderSeg button").forEach(b=>b.onclick=()=>{ syncToggleGroup(document.getElementById("genderSeg"), "button", b); updateAudience(); });
document.querySelectorAll("#peopleSeg button").forEach(b=>b.onclick=()=>{ syncToggleGroup(document.getElementById("peopleSeg"), "button", b); updateAudience(); });

function updateAgeRange(from){
  const minEl=document.getElementById("ageMin"), maxEl=document.getElementById("ageMax");
  let min=+minEl.value, max=+maxEl.value;
  if(from==="min" && min > max-5){ max=min+5; maxEl.value=max; }
  if(from==="max" && max < min+5){ min=max-5; minEl.value=min; }
  min=+minEl.value; max=+maxEl.value;
  const fill=document.getElementById("ageRangeFill");
  const lo=((min-18)/(65-18))*100, hi=((max-18)/(65-18))*100;
  fill.style.left=lo+"%"; fill.style.right=(100-hi)+"%";
  document.getElementById("ageMinValue").textContent=min;
  document.getElementById("ageMaxValue").textContent=max;
  updateAudience();
}
document.getElementById("ageMin").oninput=()=>updateAgeRange("min");
document.getElementById("ageMax").oninput=()=>updateAgeRange("max");
document.getElementById("radiusSelect").onchange=updateAudience;
document.getElementById("useRecommended").onclick=()=>{
  document.getElementById("ageMin").value=35; document.getElementById("ageMax").value=55;
  document.getElementById("radiusSelect").value="8";
  document.querySelectorAll("#interestChips .chip").forEach(c=>c.classList.toggle("on",["Health & wellness","Yoga","Fitness"].includes(c.textContent.replace(" ×",""))));
  updateAgeRange("min"); toast("Recommended audience applied");
};
document.getElementById("toggleAdvanced").onclick=()=>{
  const p=document.getElementById("advancedPanel");
  const grid=document.getElementById("strategyGrid");
  const btn=document.getElementById("toggleAdvanced");
  p.classList.toggle("open");
  grid.classList.toggle("advanced-open", p.classList.contains("open"));
  btn.innerHTML = p.classList.contains("open")
    ? '<i data-lucide="chevron-up" class="icon-sm"></i> Hide advanced settings'
    : '<i data-lucide="sliders-horizontal" class="icon-sm"></i> Edit advanced settings';
  refreshIcons();
};
document.getElementById("applySmart").onclick=()=>document.getElementById("useRecommended").click();
document.getElementById("saveAudience").onclick=()=>toast("Inherited audience ready");

function updateAudience(){
  const min=+document.getElementById("ageMin").value, max=+document.getElementById("ageMax").value;
  const radius=+document.getElementById("radiusSelect").value;
  const interests=document.querySelectorAll("#interestChips .on").length;
  const gender=document.querySelector("#genderSeg .on").textContent;
  const factor=(max-min+12)*radius*(.8+interests*.12);
  const low=Math.round(factor*205/1000)*1000, high=Math.round(factor*328/1000)*1000;
  document.getElementById("reachNumber").textContent=low.toLocaleString("en-IN")+"–"+high.toLocaleString("en-IN");
  document.getElementById("reachDesc").textContent=`People aged ${min}–${max} within ${radius} km, matching ${interests} interests.`;
  document.getElementById("sumAge").textContent=`${min}–${max} · ${gender}`;
  document.getElementById("sumArea").textContent=`${radius} km · Kothrud`;
  document.getElementById("sumReach").textContent=`${Math.round(low/1000)}k–${Math.round(high/1000)}k`;
  document.getElementById("sumInterests").textContent=[...document.querySelectorAll("#interestChips .on")].map(x=>x.textContent.replace(" ×","")).slice(0,3).join(", ")||"Broad";
  document.getElementById("reviewAudience").textContent=`${min}–${max} · ${radius} km around Kothrud · ${gender} · based on recent bookings`;
  document.getElementById("lineageAudience").textContent=`${min}–${max} · ${radius} km Kothrud`;
}

const postArt=document.getElementById("postArt"), miniImage=document.getElementById("miniImage"), cropPreview=document.getElementById("cropPreview");
const undoBtn=document.getElementById("undoBtn"), redoBtn=document.getElementById("redoBtn");
const captionInput=document.getElementById("captionInput"), headlineInput=document.getElementById("headlineInput");
const channelCaptions={
  instagram:"Monsoon knee-care: 20% off physio assessments in August. Book via link in bio or WhatsApp us at +91 98765 43210.",
  facebook:"20% off physio assessments this August at ReFunction Rehab, Kothrud. Book: refunction.in/aug",
  linkedin:"ReFunction Rehab in Kothrud: 20% off physio assessments in August. Same-week Friday slots. refunction.in/aug",
  whatsapp:"Hi — ReFunction Rehab has 20% off knee assessments this August. Book here: refunction.in/aug?c=monsoon (Fri slots filling)."
};
const channelLimits={instagram:2200,facebook:63206,linkedin:3000,whatsapp:1000};
const channelLabels={instagram:"Instagram caption",facebook:"Facebook caption",linkedin:"LinkedIn caption",whatsapp:"WhatsApp message"};
let currentChannel="instagram", history=[], historyIndex=-1, currentFormat="4/5", zoom=100;

function syncPressed(container, selector, active){
  container.querySelectorAll(selector).forEach(el=>{
    const on = el===active || el.classList.contains("on");
    if(el.hasAttribute("aria-pressed")) el.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function updateChannelUI(){
  const isWa = currentChannel==="whatsapp";
  const waPanel = document.getElementById("waCopyPanel");
  const hashtagField = document.getElementById("hashtagChips")?.closest(".field");
  if(waPanel) waPanel.classList.toggle("visible", isWa);
  if(hashtagField) hashtagField.style.display = isWa ? "none" : "";
  document.getElementById("captionLabel").textContent = channelLabels[currentChannel];
  document.getElementById("captionLimit").textContent = (channelLimits[currentChannel]||2200).toLocaleString("en-IN");
  captionInput.rows = isWa ? 5 : 7;
}

document.getElementById("toggleEditorPanels").onclick=()=>{
  const creative=document.getElementById("creative");
  const btn=document.getElementById("toggleEditorPanels");
  creative.classList.toggle("editor-collapsed");
  btn.innerHTML = creative.classList.contains("editor-collapsed")
    ? '<i data-lucide="panel-left" class="icon-sm"></i> Customize layout'
    : '<i data-lucide="panel-left-close" class="icon-sm"></i> Hide panels';
  refreshIcons();
};

function snapshot(){
  return{ headline:headlineInput.value,caption:captionInput.value,image:postArt.style.backgroundImage,format:currentFormat,
    offer:document.getElementById("artOffer").textContent,showOffer:document.getElementById("artOffer").style.display!=="none",
    showBody:document.getElementById("artBody").style.display!=="none",layout:document.querySelector("[data-layout].on")?.dataset.layout||"overlay",
    accent:document.querySelector("#accentSwatches .on")?.dataset.accent||"#2563eb" };
}
function pushHistory(){
  const s=snapshot();
  if(historyIndex<history.length-1)history=history.slice(0,historyIndex+1);
  if(history.length&&JSON.stringify(history[history.length-1])===JSON.stringify(s))return;
  history.push(s);historyIndex=history.length-1;
  undoBtn.disabled=historyIndex<=0;redoBtn.disabled=historyIndex>=history.length-1;
}
function applySnapshot(s){
  headlineInput.value=s.headline;captionInput.value=s.caption;
  document.getElementById("artHeadline").textContent=s.headline;
  document.getElementById("miniHeadline").textContent=s.headline;
  postArt.style.backgroundImage=s.image;miniImage.style.backgroundImage=s.image;cropPreview.style.backgroundImage=s.image;
  document.getElementById("artOffer").textContent=s.offer;
  document.getElementById("artOffer").style.display=s.showOffer?"":"none";
  document.getElementById("artBody").style.display=s.showBody?"":"none";
  document.querySelectorAll("[data-layout]").forEach(x=>x.classList.toggle("on",x.dataset.layout===s.layout));
  postArt.classList.toggle("split-layout",s.layout==="split");
  document.querySelectorAll("#accentSwatches .swatch").forEach(x=>x.classList.toggle("on",x.dataset.accent===s.accent));
  document.querySelector(".art-logo b").style.background=s.accent;
  setFormat(s.format,false);
  document.getElementById("captionCount").textContent=s.caption.length;
  checkFormatOverflow();
}
function undo(){if(historyIndex<=0)return;historyIndex--;applySnapshot(history[historyIndex]);undoBtn.disabled=historyIndex<=0;redoBtn.disabled=false}
function redo(){if(historyIndex>=history.length-1)return;historyIndex++;applySnapshot(history[historyIndex]);redoBtn.disabled=historyIndex>=history.length-1;undoBtn.disabled=false}
undoBtn.onclick=undo; redoBtn.onclick=redo;

function checkFormatOverflow(){
  if(currentFormat==="9/16" && document.getElementById("artHeadline").textContent.length>42) toast("Story format: headline may clip — shorten or switch layout");
}
function setFormat(format,record=true){
  currentFormat=format;
  const preset={ "4/5":{width:"390px",label:"Instagram 4:5"},"1/1":{width:"390px",label:"Facebook 1:1"},"9/16":{width:"280px",label:"Story 9:16"} }[format];
  postArt.style.aspectRatio=format;postArt.style.width=preset.width;
  document.getElementById("formatHint").textContent=preset.label;
  document.querySelectorAll(".format-btn").forEach(b=>b.classList.toggle("on",b.dataset.format===format));
  document.querySelectorAll("[data-view=resize] .variant-card").forEach(b=>b.classList.toggle("on",b.dataset.format===format));
  syncPressed(document.querySelector(".format-row")||document, ".format-btn", document.querySelector(`.format-btn[data-format="${format}"]`));
  checkFormatOverflow(); if(record)pushHistory();
}
document.querySelectorAll(".format-btn,[data-view=resize] .variant-card").forEach(b=>{ b.onclick=()=>setFormat(b.dataset.format); });
document.getElementById("zoomIn").onclick=()=>{zoom=Math.min(120,zoom+8);document.getElementById("canvasArea").style.transform=`scale(${zoom/100})`;document.getElementById("zoomLabel").textContent=zoom+"%"};
document.getElementById("zoomOut").onclick=()=>{zoom=Math.max(70,zoom-8);document.getElementById("canvasArea").style.transform=`scale(${zoom/100})`;document.getElementById("zoomLabel").textContent=zoom+"%"};
document.getElementById("canvasArea").style.transform="scale(1)";

document.getElementById("propTabs").onclick=e=>{
  const t=e.target.closest("button[data-tab]");if(!t)return;
  document.querySelectorAll("#propTabs button").forEach(x=>x.classList.remove("on"));t.classList.add("on");
  document.querySelectorAll(".prop-panel").forEach(p=>p.classList.add("hidden"));
  document.getElementById("prop"+t.dataset.tab.charAt(0).toUpperCase()+t.dataset.tab.slice(1)).classList.remove("hidden");
};
document.querySelectorAll(".tool").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tool").forEach(x=>x.classList.remove("on"));b.classList.add("on");
  document.querySelectorAll(".asset-view").forEach(v=>v.classList.toggle("hidden",v.dataset.view!==b.dataset.tool));
});
function setImage(img){ postArt.style.backgroundImage=`url('${img}')`;miniImage.style.backgroundImage=`url('${img}')`;cropPreview.style.backgroundImage=`url('${img}')`;pushHistory(); }
document.querySelectorAll(".template").forEach(b=>b.onclick=()=>{ document.querySelectorAll(".template").forEach(x=>x.classList.remove("on"));b.classList.add("on");setImage(b.dataset.img); });
document.getElementById("uploadMedia").onclick=()=>toast("Upload opens your device library");
headlineInput.oninput=e=>{ document.getElementById("artHeadline").textContent=e.target.value; document.getElementById("miniHeadline").textContent=e.target.value; checkFormatOverflow(); campaign.approval.status="stale"; updateApprovalUI(); };
headlineInput.onblur=()=>pushHistory();
captionInput.oninput=e=>{ document.getElementById("captionCount").textContent=e.target.value.length; channelCaptions[currentChannel]=e.target.value; campaign.approval.status="stale"; updateApprovalUI(); };
captionInput.onblur=()=>pushHistory();
document.getElementById("captionCount").textContent=captionInput.value.length;
document.getElementById("channelTabs").onclick=e=>{
  const c=e.target.closest("button[data-channel]");if(!c)return;
  channelCaptions[currentChannel]=captionInput.value; currentChannel=c.dataset.channel;
  syncToggleGroup(document.getElementById("channelTabs"), "button[data-channel]", c);
  captionInput.value=channelCaptions[currentChannel];
  document.getElementById("captionCount").textContent=captionInput.value.length;
  updateChannelUI();
};
bindToggle("#hashtagChips",".chip:not(#addHashtag)");
document.getElementById("addHashtag").onclick=()=>toast("Add a keyword on Strategy to suggest hashtags");
let variantIndex=0;
document.querySelectorAll("#propVariants .variant-card").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#propVariants .variant-card").forEach(x=>x.classList.remove("on"));b.classList.add("on");
  headlineInput.value=b.dataset.headline;captionInput.value=b.dataset.caption;
  document.getElementById("artHeadline").textContent=b.dataset.headline;
  document.getElementById("miniHeadline").textContent=b.dataset.headline;
  channelCaptions[currentChannel]=b.dataset.caption;
  document.getElementById("captionCount").textContent=b.dataset.caption.length;
  variantIndex=[...document.querySelectorAll("#propVariants .variant-card")].indexOf(b);
  pushHistory(); campaign.approval.status="stale"; updateApprovalUI();
});
document.getElementById("regenerate").onclick=()=>{
  variantIndex=(variantIndex+1)%document.querySelectorAll("#propVariants .variant-card").length;
  document.querySelectorAll("#propVariants .variant-card")[variantIndex].click();
  toast("Switched to another angle");
};
document.querySelectorAll("[data-layout]").forEach(b=>b.onclick=()=>{ document.querySelectorAll("[data-layout]").forEach(x=>x.classList.remove("on"));b.classList.add("on"); postArt.classList.toggle("split-layout",b.dataset.layout==="split");pushHistory(); });
document.querySelectorAll("[data-overlay]").forEach(b=>b.onclick=()=>{ document.querySelectorAll("[data-overlay]").forEach(x=>x.classList.remove("on"));b.classList.add("on"); const minimal=b.dataset.overlay==="minimal"; document.getElementById("artOffer").style.display=minimal?"none":""; document.getElementById("artBody").style.display=minimal?"none":""; pushHistory(); });
document.getElementById("accentSwatches").onclick=e=>{ const s=e.target.closest(".swatch");if(!s)return; document.querySelectorAll("#accentSwatches .swatch").forEach(x=>x.classList.remove("on"));s.classList.add("on"); document.querySelector(".art-logo b").style.background=s.dataset.accent;pushHistory(); };
document.getElementById("offerBadgeInput").onblur=e=>{ document.getElementById("artOffer").textContent=e.target.value;pushHistory(); };
document.getElementById("offerBadgeInput").oninput=e=>{ document.getElementById("artOffer").textContent=e.target.value; };
document.getElementById("brandSwatches").onclick=e=>{ const s=e.target.closest(".swatch");if(!s)return; document.querySelectorAll("#brandSwatches .swatch").forEach(x=>x.classList.remove("on"));s.classList.add("on"); document.querySelector(".art-logo b").style.background=s.dataset.color; };
const focalDot=document.getElementById("focalDot"); let dragging=false;
focalDot.onmousedown=()=>dragging=true;
document.onmouseup=()=>{if(dragging){dragging=false;pushHistory()}};
document.getElementById("cropPreview").onmousemove=e=>{
  if(!dragging)return; const r=e.currentTarget.getBoundingClientRect();
  const x=Math.max(8,Math.min(r.width-8,e.clientX-r.left)), y=Math.max(8,Math.min(r.height-8,e.clientY-r.top));
  focalDot.style.left=x+"px"; focalDot.style.top=y+"px"; focalDot.style.transform="none";
  postArt.style.backgroundPosition=`${(x/r.width)*100}% ${(y/r.height)*100}%`; miniImage.style.backgroundPosition=postArt.style.backgroundPosition;
};
document.getElementById("copyWa").onclick=()=>{ navigator.clipboard?.writeText(channelCaptions.whatsapp); toast("WhatsApp message copied"); };

document.getElementById("shareReview").onclick=document.getElementById("inviteTop").onclick=()=>{
  campaign.approval.status="requested"; campaign.approval.hasUnresolvedComment=true;
  document.getElementById("reviewStatus").textContent="Raj reviewing";
  document.getElementById("commentExample").style.display="flex"; updateApprovalUI(); toast("Review link copied");
};
document.getElementById("resolveComment").onclick=()=>{
  campaign.approval.hasUnresolvedComment=false;
  document.getElementById("commentExample").querySelector("span").textContent="Resolved";
  document.getElementById("reviewStatus").textContent="Comments resolved"; updateApprovalUI(); toast("Comment marked resolved");
};
document.getElementById("copyLink").onclick=()=>toast("Review link copied");
document.getElementById("connectFb").onclick=e=>{ campaign.channels.facebook.connected=true; e.target.innerHTML='<i data-lucide="check" class="icon-sm"></i> Connected'; e.target.className="pill live right-action"; document.getElementById("fbStatus").textContent="Connected · will cross-post"; refreshIcons(); toast("Facebook connected"); };
document.getElementById("copyWaReview").onclick=()=>{ navigator.clipboard?.writeText(channelCaptions.whatsapp); toast("WhatsApp message copied"); };
document.getElementById("reviewChannelTabs").onclick=e=>{
  const t=e.target.closest("button[data-rchannel]");if(!t)return;
  syncToggleGroup(document.getElementById("reviewChannelTabs"), "button[data-rchannel]", t);
  const ch=t.dataset.rchannel;
  document.getElementById("reviewChannelNote").textContent = ch==="whatsapp" ? "WhatsApp: copy and send manually to opted-in contacts only."
    : ch==="facebook" && !campaign.channels.facebook.connected ? "Facebook: preview only — connect to publish."
    : `${ch.charAt(0).toUpperCase()+ch.slice(1)} will publish when scheduled.`;
};
document.getElementById("offerApproval").onchange=e=>{ campaign.offerApproved=e.target.checked; updateApprovalUI(); };
document.querySelectorAll(".schedule-choice").forEach(b=>b.onclick=()=>{
  syncToggleGroup(document.querySelector(".schedule-choices")||document, ".schedule-choice", b);
  campaign.schedule.mode=b.dataset.schedule;
  document.getElementById("customScheduleFields").style.display=b.dataset.schedule==="custom"?"grid":"none";
});
function getScheduleLabel(){
  if(campaign.schedule.mode==="now") return "Publish immediately";
  if(campaign.schedule.mode==="custom") return `${document.getElementById("scheduleDate").value} at ${document.getElementById("scheduleTime").value} IST`;
  return campaign.schedule.label;
}
document.getElementById("scheduleBtn").onclick=()=>{
  const err=canSchedule(); if(err){ toast(err); return; }
  document.getElementById("scheduleConfirmText").textContent=`Publish to Instagram on ${getScheduleLabel()}. WhatsApp remains manual send.`;
  document.getElementById("scheduleScrim").classList.add("open");
  document.getElementById("scheduleModal").classList.add("open");
};
function closeScheduleModal(){ document.getElementById("scheduleScrim").classList.remove("open"); document.getElementById("scheduleModal").classList.remove("open"); }
document.getElementById("cancelSchedule").onclick=closeScheduleModal;
document.getElementById("scheduleScrim").onclick=closeScheduleModal;
function advanceLifecycle(next){ campaign.lifecycle=next; updateLifecycleUI(); }
document.getElementById("confirmSchedule").onclick=()=>{
  closeScheduleModal(); advanceLifecycle("scheduled"); toast("Scheduled · " + getScheduleLabel());
  setTimeout(()=>{ advanceLifecycle("publishing"); toast("Publishing to Instagram…"); }, 900);
  setTimeout(()=>{ advanceLifecycle("live"); campaign.published=true; campaign.boost.metaPaymentVerified=true; toast("Post is live"); showScreen("performance"); advanceLifecycle("gathering"); }, 2200);
};
document.getElementById("simulateLive").onclick=()=>{ campaign.resultsVisible=true; campaign.capacity.bookedByCampaign=2; updateCapacityUI(); updateLifecycleUI(); updatePerformanceGoal(campaign.goal); toast("Demo results loaded"); };
document.getElementById("fillLastSlotDemo")?.addEventListener("click",()=>{
  campaign.resultsVisible=true;
  campaign.capacity.bookedByCampaign = campaign.capacity.total - campaign.capacity.filled;
  updateCapacityUI(); updateLifecycleUI(); updatePerformanceGoal(campaign.goal); toast("All slots filled (demo)");
});
document.getElementById("duplicateCampaign")?.addEventListener("click",()=>{
  campaign.lifecycle="draft"; campaign.resultsVisible=false; campaign.capacity.bookedByCampaign=0;
  campaign.published=false; campaign.boost.status="blocked";
  updateCapacityUI(); updateLifecycleUI(); showScreen("strategy");
  toast("New campaign started from winning setup");
});
document.getElementById("archiveCampaign")?.addEventListener("click",()=>{
  campaign.lifecycle="completed"; updateLifecycleUI(); toast("Campaign archived");
});
document.getElementById("addBoost").onchange=e=>{ document.getElementById("boostPreview").style.display=e.target.checked?"block":"none"; if(e.target.checked) openBoost(); };
document.getElementById("applyRecommendation").onclick=()=>{
  const max=Math.min(900, campaign.capacity.open*900);
  document.getElementById("boostDaily").value=300; document.getElementById("boostDays").value=3; updateBoost(); openBoost();
  toast(`Suggested max ₹${max} for ${campaign.capacity.open} remaining slot${campaign.capacity.open===1?"":"s"}`);
};
document.getElementById("boostTop").onclick=openBoost;
document.getElementById("makeWaReminder").onclick=()=>{ showScreen("creative"); toast("Reminder draft for 4 eligible contacts"); };
document.getElementById("showAttribution").onclick=e=>{ const detail=document.getElementById("attributionDetail"), open=detail.classList.toggle("open"); e.currentTarget.textContent=open?"Hide details":"How this is counted"; };

const drawer=document.getElementById("boostDrawer"), scrim=document.getElementById("drawerScrim");
function openBoost(){ if(!campaign.published){ toast("Publish the post before boosting"); return; } updateDrawerAudience(); updateBoost(); updateLifecycleUI(); drawer.classList.add("open"); scrim.classList.add("open"); }
function closeBoost(){ drawer.classList.remove("open"); scrim.classList.remove("open"); }
function updateBoost(){
  const daily=Math.max(200,+document.getElementById("boostDaily").value||200), days=+document.getElementById("boostDays").value;
  const maxTotal=Math.min(daily*days, campaign.capacity.open*900);
  campaign.boost.daily=daily; campaign.boost.days=days;
  document.getElementById("boostTotal").textContent="₹"+maxTotal.toLocaleString("en-IN");
  document.getElementById("startBoost").textContent="Start boost · ₹"+maxTotal.toLocaleString("en-IN");
  const base=Math.round(maxTotal*2.2/100)*100, high=Math.round(maxTotal*4/100)*100;
  document.getElementById("boostEstimate").textContent=base.toLocaleString("en-IN")+"–"+high.toLocaleString("en-IN")+" people";
  document.getElementById("clickEstimate").textContent=`About ${Math.round(base*.015)}–${Math.round(high*.018)} visits to refunction.in/aug`;
}
function updateDrawerAudience(){
  document.getElementById("drawerAudience").textContent=document.getElementById("sumArea").textContent+" · Ages "+document.getElementById("ageMinValue").textContent+"–"+document.getElementById("ageMaxValue").textContent;
  document.getElementById("drawerInterests").textContent=document.getElementById("sumInterests").textContent+" · English, Hindi, Marathi";
}
document.getElementById("closeBoost").onclick=closeBoost; scrim.onclick=closeBoost;
document.getElementById("boostDaily").oninput=updateBoost; document.getElementById("boostDays").onchange=updateBoost;
document.querySelectorAll("#boostGoals .radio-option").forEach(o=>o.onclick=()=>{
  document.querySelectorAll("#boostGoals .radio-option").forEach(x=>{x.classList.remove("on");x.querySelector("input").checked=false});
  o.classList.add("on"); o.querySelector("input").checked=true; campaign.boost.goal=o.dataset.boostGoal; updateBoostGoalNotice();
});
let pendingBoostStart=false;
document.getElementById("startBoost").onclick=()=>{
  if(document.querySelector("#boostGoals .radio-option.on")?.dataset.boostGoal !== campaign.goal){
    document.getElementById("boostMismatchText").textContent=`Campaign success is measured as ${campaign.goal.replace("More ","").toLowerCase()}, but this boost optimizes for ${campaign.boost.goal.replace("More ","").toLowerCase()}. Continue anyway?`;
    document.getElementById("boostMismatchScrim").classList.add("open");
    document.getElementById("boostMismatchModal").classList.add("open");
    pendingBoostStart=true; return;
  }
  submitBoost();
};
document.getElementById("cancelBoostMismatch").onclick=()=>{ document.getElementById("boostMismatchScrim").classList.remove("open"); document.getElementById("boostMismatchModal").classList.remove("open"); pendingBoostStart=false; };
document.getElementById("confirmBoostMismatch").onclick=()=>{ document.getElementById("boostMismatchScrim").classList.remove("open"); document.getElementById("boostMismatchModal").classList.remove("open"); if(pendingBoostStart) submitBoost(); };
function submitBoost(){ campaign.boost.status="pending"; closeBoost(); updateLifecycleUI(); toast("Boost submitted to Meta for review"); setTimeout(()=>{ campaign.boost.status="active"; updateLifecycleUI(); toast("Boost active"); }, 2500); }
document.getElementById("editDrawerAudience").onclick=()=>{ closeBoost(); showScreen("strategy"); document.getElementById("advancedPanel").classList.add("open"); document.getElementById("strategyGrid").classList.add("advanced-open"); };
document.getElementById("saveBoostDraft").onclick=()=>{ closeBoost(); toast("Boost settings saved for later"); };

pushHistory();
updateChannelUI();
updateAgeRange("min");
updateAudience();
updateBoost();
updateCapacityUI();
updatePerformanceGoal(campaign.goal);
updateLifecycleUI();
updateApprovalUI();
showScreen("strategy");
refreshIcons();
