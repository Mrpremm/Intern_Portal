exports.generateReferralCode = function(name) {
  // e.g., "John Doe" -> "JOHNDOE2025"
  if (!name) return `REF${Math.floor(Math.random()*10000)}`;
  return (
    name
      .replace(/\s+/g, '')
      .toUpperCase()
      .slice(0, 8) +
    '2025'
  );
};
