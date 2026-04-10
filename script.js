/* =====================================================
   SCORECARD LOCALSTORAGE ENGINE
===================================================== */

const team1El   = document.getElementById("team1");
const team2El   = document.getElementById("team2");
const scoreEl   = document.getElementById("score");
const oversEl   = document.getElementById("overs");
const bat1El    = document.getElementById("bat1");
const bat1ScoreEl = document.getElementById("bat1Score");
const bat1BallsEl = document.getElementById("bat1Balls");
const bat2El    = document.getElementById("bat2");
const bat2ScoreEl = document.getElementById("bat2Score");
const bat2BallsEl = document.getElementById("bat2Balls");
const bowlerEl  = document.getElementById("bowler");
const bowlerFiguresEl = document.getElementById("bowlerFigures");
const overRunsEl = document.getElementById("over-runs");
const eventBannerEl = document.getElementById("event-banner");

// Initialize with default state if empty
const defaultState = {
  team1: "TEAM 1",
  team2: "TEAM 2",
  score: "0/0",
  overs: "0.0",
  bat1: "BATSMAN 1",
  bat1Score: "0",
  bat2: "BATSMAN 2",
  bat2Score: "0",
  bowler: "BOWLER",
  bowlerFigures: "0/0",
  overRuns: "0 0 0 0",
  event: ""
};

if (!localStorage.getItem("shc_match_state")) {
  localStorage.setItem("shc_match_state", JSON.stringify(defaultState));
}

function updateUI(d){
  if (!d) return;
  if (team1El) team1El.textContent = d.team1 || "TEAM 1";
  if (team2El) team2El.textContent = d.team2 || "TEAM 2";
  if (scoreEl) scoreEl.textContent = d.score || "0/0";
  if (oversEl) {
      const overPrefix = "OVERS ";
      oversEl.textContent = d.overs ? overPrefix + d.overs : overPrefix + "0.0";
  }
  if (bat1El) bat1El.textContent = d.bat1 || "";
  if (bat1ScoreEl) bat1ScoreEl.textContent = d.bat1Score || "0";
  if (bat1BallsEl) bat1BallsEl.textContent = `(${d.bat1Balls || "0"})`;
  if (bat2El) bat2El.textContent = d.bat2 || "";
  if (bat2ScoreEl) bat2ScoreEl.textContent = d.bat2Score || "0";
  if (bat2BallsEl) bat2BallsEl.textContent = `(${d.bat2Balls || "0"})`;
  if (bowlerEl) bowlerEl.textContent = d.bowler || "";
  if (bowlerFiguresEl) bowlerFiguresEl.textContent = d.bowlerFigures || "0/0";
  if (overRunsEl) overRunsEl.textContent = d.overRuns || "";
  
  if (eventBannerEl) {
    if (d.event && d.event.trim() !== "") {
      eventBannerEl.textContent = d.event;
      eventBannerEl.classList.add("active");
      
      // Optional styling based on event type
      if (d.event.includes("WICKET") || d.event.includes("NO BALL")) {
          eventBannerEl.style.backgroundColor = "var(--danger)";
          eventBannerEl.style.color = "white";
      } else if (d.event.includes("FOUR") || d.event.includes("SIXER")) {
          eventBannerEl.style.backgroundColor = "var(--success)";
          eventBannerEl.style.color = "white";
      } else {
          eventBannerEl.style.backgroundColor = "var(--warning)";
          eventBannerEl.style.color = "var(--bg-dark, #0f172a)";
      }
      
    } else {
      eventBannerEl.classList.remove("active");
    }
  }
}

const LOCAL_DEV = true;
const API_URL = LOCAL_DEV ? "http://localhost:3000" : "";

async function pollState(){
  try {
    const res = await fetch(`${API_URL}/state`);
    if (res.ok) {
      const data = await res.json();
      updateUI(data);
    }
  } catch (err) {
    console.error("Failed to fetch state from server.", err);
    
    // Fallback to localStorage exactly as before if no server is running
    try {
      const bData = localStorage.getItem("shc_match_state");
      if (bData) updateUI(JSON.parse(bData));
    } catch(e) {}
  }
}

// Poll server every 250ms
setInterval(pollState, 250);

// Run immediately once
pollState();
