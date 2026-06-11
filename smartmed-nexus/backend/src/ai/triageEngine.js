/**
 * AI Triage Engine - Emergency Priority Scoring
 *
 * Scores emergency cases based on:
 * - Age
 * - Symptoms
 * - Medical History
 * - Time Sensitivity
 *
 * Output: LOW (0-25), MEDIUM (26-50), HIGH (51-75), CRITICAL (76-100)
 *
 * Designed to be modular - OpenAI API can be integrated later via ai/openaiService.js
 * without changing the scoring interface.
 */

const CRITICAL_SYMPTOMS = [
  'chest pain', 'chest pressure', 'heart attack', 'cardiac arrest',
  'difficulty breathing', 'not breathing', 'choking', 'unconscious',
  'severe bleeding', 'hemorrhage', 'stroke', 'paralysis',
  'seizure', 'anaphylaxis', 'severe allergic reaction',
  'head injury', 'trauma', 'gunshot', 'stab',
  'poisoning', 'overdose', 'burn severe', 'electrocution',
  'drowning', 'suffocation',
];

const HIGH_SYMPTOMS = [
  'shortness of breath', 'wheezing', 'severe pain', 'broken bone', 'fracture',
  'high fever', 'vomiting blood', 'blood in stool', 'deep cut', 'laceration',
  'dislocation', 'severe headache', 'vision loss', 'confusion',
  'pregnancy complication', 'contractions', 'premature labor',
  'diabetic emergency', 'hypoglycemia', 'hyperglycemia',
  'severe dehydration', 'heat stroke',
];

const MEDIUM_SYMPTOMS = [
  'moderate pain', 'sprain', 'strain', 'fever', 'cough', 'vomiting',
  'diarrhea', 'rash', 'infection', 'urinary problem', 'ear pain',
  'migraine', 'back pain', 'dizziness', 'mild burn', 'allergic reaction mild',
];

const CRITICAL_HISTORY_KEYWORDS = [
  'heart disease', 'coronary', 'cardiac', 'stroke', 'aneurysm',
  'diabetes type 1', 'severe asthma', 'epilepsy', 'kidney failure',
  'liver failure', 'cancer metastatic', 'immunocompromised',
  'organ transplant', 'blood disorder', 'hemophilia',
];

const HIGH_HISTORY_KEYWORDS = [
  'diabetes', 'hypertension', 'high blood pressure', 'copd',
  'asthma', 'thyroid disorder', 'heart murmur', 'arrhythmia',
  'chronic kidney disease', 'hiv', 'hepatitis',
];

const scoreSymptoms = (symptoms) => {
  const joined = symptoms.join(' ').toLowerCase();
  let score = 0;

  const criticalMatch = CRITICAL_SYMPTOMS.filter((s) => joined.includes(s));
  score += criticalMatch.length * 30;

  const highMatch = HIGH_SYMPTOMS.filter((s) => joined.includes(s));
  score += highMatch.length * 15;

  const mediumMatch = MEDIUM_SYMPTOMS.filter((s) => joined.includes(s));
  score += mediumMatch.length * 5;

  return { score, matchedCritical: criticalMatch, matchedHigh: highMatch };
};

const scoreAge = (age) => {
  if (age < 2) return 15;
  if (age > 75) return 25;
  if (age > 60) return 15;
  if (age < 12) return 5;
  return 0;
};

const scoreMedicalHistory = (history) => {
  if (!history) return 0;
  const joined = history.toLowerCase();
  let score = 0;

  const criticalMatch = CRITICAL_HISTORY_KEYWORDS.filter((h) => joined.includes(h));
  score += criticalMatch.length * 15;

  const highMatch = HIGH_HISTORY_KEYWORDS.filter((h) => joined.includes(h));
  score += highMatch.length * 8;

  return score;
};

const scoreTimeSensitivity = (sensitivity) => {
  const scores = { critical: 25, high: 15, medium: 8, low: 0 };
  return scores[sensitivity] || 0;
};

const calculatePriority = (age, symptoms, medicalHistory, timeSensitivity) => {
  const symptomResult = scoreSymptoms(symptoms);
  const ageScore = scoreAge(age);
  const historyScore = scoreMedicalHistory(medicalHistory);
  const timeScore = scoreTimeSensitivity(timeSensitivity);

  let totalScore = symptomResult.score + ageScore + historyScore + timeScore;

  if (symptomResult.matchedCritical.length > 0) {
    totalScore = Math.max(totalScore, 76);
  }

  totalScore = Math.min(100, Math.max(0, totalScore));

  let priority;
  if (totalScore >= 76) priority = 'critical';
  else if (totalScore >= 51) priority = 'high';
  else if (totalScore >= 26) priority = 'medium';
  else priority = 'low';

  return {
    score: Math.round(totalScore),
    priority,
    breakdown: {
      symptomScore: Math.round(symptomResult.score),
      ageScore,
      historyScore,
      timeScore,
      matchedCritical: symptomResult.matchedCritical,
      matchedHigh: symptomResult.matchedHigh,
    },
  };
};

module.exports = { calculatePriority };
