// NSFW Detection Module using TensorFlow.js and NSFWJS
// Provides real-time content moderation for video streams

import * as nsfwjs from 'nsfwjs';

export interface NSFWPrediction {
  className: string;
  probability: number;
}

export interface NSFWResult {
  predictions: NSFWPrediction[];
  isNSFW: boolean;
  score: number;
  highestClass: string;
}

/**
 * NSFW Detection sensitivity levels
 */
export type SensitivityLevel = 'low' | 'medium' | 'high';

const THRESHOLDS = {
  low: 0.8,      // Only block highly explicit content
  medium: 0.6,   // Block moderate to explicit (recommended)
  high: 0.4,     // Strict filtering (may have false positives)
};

let model: nsfwjs.NSFWJS | null = null;
let isLoading = false;

/**
 * Load the NSFWJS model
 */
export async function loadNSFWModel(): Promise<void> {
  if (model || isLoading) return;
  
  try {
    isLoading = true;
    console.log('[NSFW] Loading model...');
    model = await nsfwjs.load();
    console.log('[NSFW] Model loaded successfully');
  } catch (error) {
    console.error('[NSFW] Failed to load model:', error);
    throw error;
  } finally {
    isLoading = false;
  }
}

/**
 * Analyze video element for NSFW content
 */
export async function analyzeVideo(
  videoElement: HTMLVideoElement,
  sensitivity: SensitivityLevel = 'medium'
): Promise<NSFWResult> {
  if (!model) {
    await loadNSFWModel();
  }

  if (!model) {
    throw new Error('NSFW model not loaded');
  }

  try {
    const predictions = await model.classify(videoElement);
    
    // Calculate NSFW score (sum of Porn, Hentai, Sexy probabilities)
    const nsfwScore = predictions.reduce((score, pred) => {
      if (['Porn', 'Hentai', 'Sexy'].includes(pred.className)) {
        return score + pred.probability;
      }
      return score;
    }, 0);

    // Find highest probability class
    const highest = predictions.reduce((max, pred) => 
      pred.probability > max.probability ? pred : max
    );

    const threshold = THRESHOLDS[sensitivity];
    const isNSFW = nsfwScore > threshold;

    return {
      predictions,
      isNSFW,
      score: nsfwScore,
      highestClass: highest.className,
    };
  } catch (error) {
    console.error('[NSFW] Analysis error:', error);
    throw error;
  }
}

/**
 * Clean up model from memory
 */
export function disposeNSFWModel(): void {
  if (model) {
    model.dispose();
    model = null;
    console.log('[NSFW] Model disposed');
  }
}

/**
 * Check if model is ready
 */
export function isModelLoaded(): boolean {
  return model !== null;
}
