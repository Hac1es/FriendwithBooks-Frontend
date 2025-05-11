import { ref, computed, onUnmounted } from "vue";

export function useCountdown(initialSeconds) {
  const totalSeconds = ref(initialSeconds);
  const isRunning = ref(false);

  const hours = computed(() => Math.floor(totalSeconds.value / 3600));
  const minutes = computed(() => Math.floor((totalSeconds.value % 3600) / 60));
  const seconds = computed(() => totalSeconds.value % 60);

  const formatTime = (val) => String(val).padStart(2, "0");

  let intervalId;

  const start = () => {
    if (isRunning.value) return;
    isRunning.value = true;
    intervalId = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--;
      } else {
        stop();
      }
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalId);
    isRunning.value = false;
  };

  onUnmounted(() => {
    stop();
  });

  return {
    hours,
    minutes,
    seconds,
    formatTime,
    start,
    stop,
    isRunning,
    totalSeconds,
  };
}
