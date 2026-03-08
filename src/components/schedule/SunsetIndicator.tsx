export function SunsetIndicator() {
  const now = new Date();
  const sunsetTime = new Date(now);
  sunsetTime.setHours(18, 0, 0, 0);

  const isNearSunset = now.getHours() >= 17 && now.getHours() < 19;

  if (!isNearSunset) {
    return null;
  }

  const minutesUntilSunset = Math.floor((sunsetTime.getTime() - now.getTime()) / 60000);

  return (
    <div className="mt-4">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-sm">
        <span>🌅</span>
        <span className="font-medium">
          {minutesUntilSunset > 0 
            ? `${minutesUntilSunset} мин до заката` 
            : 'Закат сейчас!'}
        </span>
      </div>
    </div>
  );
}
