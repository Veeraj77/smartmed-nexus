/**
 * OpenAI Service - Stub for future AI integration
 *
 * When ready, this service will call OpenAI's API to enhance triage scoring
 * with natural language understanding and more nuanced analysis.
 *
 * Usage:
 *   const openaiService = require('./openaiService');
 *   const result = await openaiService.enhanceTriage(age, symptoms, history);
 *
 * Set OPENAI_API_KEY in .env to enable.
 */

const config = require('../config/index');

const enhanceTriage = async (age, symptoms, medicalHistory) => {
  if (!config.openai.apiKey) {
    return { enhanced: false, message: 'OpenAI API key not configured. Using local triage engine.' };
  }

  // TODO: Implement OpenAI API call
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4',
  //   messages: [
  //     { role: 'system', content: 'You are a medical triage assistant...' },
  //     { role: 'user', content: `Age: ${age}, Symptoms: ${symptoms.join(', ')}, History: ${medicalHistory}` }
  //   ]
  // });

  return { enhanced: false, message: 'OpenAI integration not yet implemented' };
};

module.exports = { enhanceTriage };
