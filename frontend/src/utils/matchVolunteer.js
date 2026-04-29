// 📏 Haversine Distance (REAL distance in KM)
export const calculateDistance = (loc1, loc2) => {
  if (!loc1 || !loc2) return Infinity;

  const R = 6371;

  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) *
    Math.cos(loc2.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};


// 🎯 Match Score Calculation
export const calculateMatchScore = (request, volunteer) => {
  let score = 0;

  // ─────────────────────────────────────────────
  // 🧠 1. Skill Match
  //    Request type "food" matches skill "food_distribution"
  //    because "food_distribution".includes("food") → true
  // ─────────────────────────────────────────────
  const reqType = request.type?.toLowerCase().trim() ?? "";

  const hasSkillMatch = volunteer.skills?.some((skill) => {
    const s = skill.toLowerCase().trim();
    return s.includes(reqType) || reqType.includes(s);
  });

  if (hasSkillMatch) score += 50;

  // ─────────────────────────────────────────────
  // 🟢 2. Availability
  //    Handles both shapes:
  //      Shape A: availability === true  (flat boolean)
  //      Shape B: availability.isAvailable === true  (Firestore map) ← your shape
  // ─────────────────────────────────────────────
  const isAvailable =
    volunteer.availability === true ||
    volunteer.availability?.isAvailable === true;

  if (isAvailable) score += 30;

  // ─────────────────────────────────────────────
  // 📍 3. Distance
  // ─────────────────────────────────────────────
  if (request.location && volunteer.location) {
    const distance = calculateDistance(request.location, volunteer.location);
    const preferred = volunteer.preferredDistance ?? 10;

    if (distance <= preferred) {
      score += 20;
    } else if (distance <= preferred * 2) {
      score += 10;
    }
  }

  // ─────────────────────────────────────────────
  // 📊 4. Experience Level
  // ─────────────────────────────────────────────
  const level = volunteer.experienceLevel?.toLowerCase();
  if (level === "expert") score += 10;
  else if (level === "intermediate") score += 5;

  // ─────────────────────────────────────────────
  // ⭐ 5. Rating
  // ─────────────────────────────────────────────
  if (volunteer.rating >= 4) score += 10;
  else if (volunteer.rating >= 3) score += 5;

  return score;
};


// 🏆 Get Best Volunteers (sorted by score)
export const getBestVolunteers = (request, volunteers) => {
  if (!request || !volunteers?.length) return [];

  return volunteers
    .map((vol) => ({
      ...vol,
      matchScore: calculateMatchScore(request, vol),
    }))
    .filter((vol) => vol.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};