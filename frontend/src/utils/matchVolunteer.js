export const calculateDistance = (loc1, loc2) => {
  const dx = loc1.lat - loc2.lat;
  const dy = loc1.lng - loc2.lng;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculateMatchScore = (request, volunteer) => {
  let score = 0;

  // 1. Skill match
  if (volunteer.skills?.includes(request.type)) {
    score += 50;
  }

  // 2. Availability
  if (volunteer.availability?.isAvailable) {
    score += 30;
  }

  // 3. Distance (NEW 🔥)
  if (request.location && volunteer.location) {
    const distance = calculateDistance(
      request.location,
      volunteer.location
    );

    if (distance <= volunteer.preferredDistance) {
      score += 20;
    }
  }

  // 4. Experience
  if (volunteer.experienceLevel === "expert") score += 10;
  else if (volunteer.experienceLevel === "intermediate") score += 5;

  // 5. Rating (NEW 🔥)
  if (volunteer.rating >= 4) score += 10;
  else if (volunteer.rating >= 3) score += 5;

  return score;
};

export const getBestVolunteers = (request, volunteers) => {
  return volunteers
    .map((vol) => ({
      ...vol,
      matchScore: calculateMatchScore(request, vol)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};