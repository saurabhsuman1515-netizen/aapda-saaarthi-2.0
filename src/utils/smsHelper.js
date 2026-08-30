/**
 * Helper to build standardized SOS Emergency SMS Messages & URIs
 */

export function generateSOSMessage({
  userName = "Citizen in Distress",
  phone = "",
  location = null,
  situation = "Severe Flood Emergency / Trapped",
  peopleCount = 1,
  bloodGroup = "Not Specified",
  specialNeeds = "None",
  batteryLevel = null
}) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
  
  let locStr = "Location unavailable (Enable GPS)";
  let mapUrl = "";
  if (location && location.lat && location.lng) {
    const lat = location.lat.toFixed(5);
    const lng = location.lng.toFixed(5);
    locStr = `GPS: ${lat}, ${lng} (Acc: ${Math.round(location.accuracy || 10)}m)`;
    mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
  }

  const batteryStr = batteryLevel !== null ? ` | Batt: ${batteryLevel}%` : "";

  const lines = [
    `🚨 [EMERGENCY FLOOD RESCUE NEEDED - AAPDA SAARTHI]`,
    `Name: ${userName || 'Citizen'} ${phone ? `(${phone})` : ''}`,
    `Situation: ${situation}`,
    `People Trapped: ${peopleCount} | Blood: ${bloodGroup}`,
    specialNeeds !== "None" && specialNeeds ? `Medical Needs: ${specialNeeds}` : null,
    `${locStr}${batteryStr}`,
    mapUrl ? `Map: ${mapUrl}` : null,
    `Time: ${timestamp}`,
    `Please dispatch NDRF/SDRF/Boat Rescue urgently!`
  ].filter(Boolean);

  return lines.join("\n");
}

export function generateIAmSafeMessage({
  userName = "I",
  location = null,
  customNote = "I am safe and have reached a secure high-ground area."
}) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
  let mapUrl = "";
  if (location && location.lat && location.lng) {
    mapUrl = `Location: https://maps.google.com/?q=${location.lat.toFixed(5)},${location.lng.toFixed(5)}`;
  }

  const lines = [
    `✅ [SAFE STATUS - AAPDA SAARTHI]`,
    `This is ${userName}.`,
    customNote,
    mapUrl || null,
    `Time: ${timestamp}`,
    `Sent via Aapda Saarthi Flood Disaster PWA.`
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * Creates cross-platform SMS URI
 * iOS uses &body= while Android/Desktop uses ?body=
 */
export function createSmsUri(targetPhone, message) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const separator = isIOS ? '&' : '?';
  const encodedBody = encodeURIComponent(message);
  return `sms:${targetPhone}${separator}body=${encodedBody}`;
}

export function createWhatsAppUri(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/?text=${encoded}`;
}
