<script>
import { onMount } from "svelte";

let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
let isWeddingPassed = false;

const weddingDate = new Date(2026, 0, 31, 15, 30); 
const year = weddingDate.getFullYear();
const month = weddingDate.getMonth();
const day = weddingDate.getDate();

  // 달력 만들기
    function generateCalendar() {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();

      const calendarDays = [];

      // 빈 칸
      for (let i = 0; i < startDayOfWeek; i++) {
          calendarDays.push({ date: "", type: "empty" });
      }

      // 날짜
      for (let d = 1; d <= daysInMonth; d++) {
          const dow = new Date(year, month, d).getDay();
          let type = "day";
          if (dow === 0) type = "sun";
          if (dow === 6) type = "sat";
          if (d === day) type = "wedding";
          calendarDays.push({ date: d, type });
      }

      return calendarDays;
    }

    let days = generateCalendar();

    onMount(() => {
    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate.getTime() - now.getTime();

        if (diff > 0) {
        timeLeft = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
        isWeddingPassed = false;
        } else {
        isWeddingPassed = true;
        }
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
    });
</script>

<section class="date-section">
    <h2 class="title kr">일정</h2>

    <div class="calendar-card">
        <div class="calendar-header">
            {year}년 {month + 1}월
        </div>

        <div class="calendar-grid">
            <div class="day-name sun">일</div>
            <div class="day-name">월</div>
            <div class="day-name">화</div>
            <div class="day-name">수</div>
            <div class="day-name">목</div>
            <div class="day-name">금</div>
            <div class="day-name sat">토</div>

            {#each days as d, i}
                {#if d.type === "empty"}
                    <div class="day empty"></div>
                {:else if d.type === "wedding"}
                    <div class="day wedding">{d.date}</div>
                {:else}
                    <div class="day {d.type}">{d.date}</div>
                {/if}
            {/each}
        </div>
    </div>


    <div class="countdown">
      <div class="countdown-wrapper">
        <div class="countdown-item kr">
          <span class="value kr">{timeLeft.days}</span>
          <span class="label">days</span>
        </div>
        <div class="countdown-item kr">
          <span class="value">{timeLeft.hours.toString().padStart(2, "0")}</span>
          <span class="label">hour</span>
        </div>
        <div class="countdown-item kr">
          <span class="value kr">{timeLeft.minutes.toString().padStart(2, "0")}</span>
          <span class="label">min</span>
        </div>
        <div class="countdown-item kr">
          <span class="value kr">{timeLeft.seconds.toString().padStart(2, "0")}</span>
          <span class="label">sec</span>
        </div>
      </div>
    </div>


  <p class="wedding-date">
    2026년 1월 31일(토) | 오후 3시 30분<br />
    <span style="color:#666">라온제나 강남 | 8층 플로렌스홀</span>
  </p>
</section>

<style>
  .date-section {
    padding: 3rem 1.5rem;
    text-align: center;
    background-color: #faeef2;
    font-family: 'Noto Sans KR', sans-serif;
    color: #444;
    max-width: 600px;
    margin: auto;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .calendar-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    max-width: 22rem;
    margin: 0 auto 2rem;
  }

  .calendar-header {
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
    text-align: center;
    font-size: 0.9rem;
  }

  .day-name {
    font-weight: 500;
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }

  .day-name.sun { color: #e57373; }
  .day-name.sat { color: #64b5f6; }

  .day {
    padding: 0.4rem;
    border-radius: 50%;
    font-size: 0.9rem;
    color: #555;
  }

  .day.sun { color: #e57373; }
  .day.sat { color: #64b5f6; }

  .day.wedding {
    background: #c2a97d;
    color: white;
    font-weight: bold;
  }

  .countdown {
    margin: 2rem 0;
  }

  .countdown h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .countdown-wrapper {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  .countdown-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #444;
  }

  .label {
    font-size: 0.8rem;
    color: #777;
  }

  .wedding-date {
    font-size: 1rem;
    margin-top: 1.5rem;
    color: #444;
  }
</style>
