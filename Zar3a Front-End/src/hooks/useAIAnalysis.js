import { useState, useEffect, useRef } from "react";
import { generateAIAnalysis } from "../services/aiAnalysisService";

export const useAIAnalysis = (telemetryContext, dataHistory = [], isManualMode) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const baselineTelemetry = useRef(null);
  const isFetching = useRef(false);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  useEffect(() => {

    // Helper: calculate moving average for smoothing out the data
    const getMovingAverage = (history, key) => {
      if (!history || history.length === 0) return 0;
      const recent = history.slice(-5); // Use a 5-reading window
      const sum = recent.reduce((acc, curr) => acc + (curr[key] || 0), 0);
      return sum / recent.length;
    };

    // Calculate current smoothed readings
    const avgMoisture = getMovingAverage(dataHistory, 'moisture');
    const avgPh = getMovingAverage(dataHistory, 'ph');

    // Combine with context to form the full payload
    const currentTelemetry = {
      ...telemetryContext,
      moisture: avgMoisture || telemetryContext.moisture,
      ph: avgPh || telemetryContext.ph,
      isManualMode
    };

    // Helper: check if a threshold change occurred requiring a new AI fetch
    const hasSignificantChange = (current, baseline) => {
      if (!baseline) return true; // Always fetch on initial mount
      if (current.cropType !== baseline.cropType) return true; // Always fetch if crop changes
      if (current.isManualMode !== baseline.isManualMode) return true; // Always fetch if mode toggled
      if (JSON.stringify(current.hardware) !== JSON.stringify(baseline.hardware)) return true; // Always fetch if hardware toggled

      // If in Manual mode, pause the automatic threshold-based AI triggers
      if (current.isManualMode) {
        return false;
      }

      // Auto Mode Threshold Logic (e.g. 5% difference)
      const moistureDiff = Math.abs((current.moisture - baseline.moisture) / baseline.moisture);
      const phDiff = Math.abs((current.ph - baseline.ph) / baseline.ph);

      return moistureDiff > 0.05 || phDiff > 0.05;
    };

    const fetchAnalysis = async () => {
      // Spam Prevention / Debouncing mechanism
      if (isFetching.current) return;
      
      isFetching.current = true;
      setIsLoading(true);
      setError(null);
      
      // Immediately capture the current state as the new baseline
      baselineTelemetry.current = currentTelemetry;

      try {
        const data = await generateAIAnalysis(currentTelemetry);
        if (isComponentMounted.current) {
          setAnalysisData(data);
        }
      } catch (err) {
        if (isComponentMounted.current) {
          // Robust Error Handling for dropped connections
          setError(err.message || "Connection to AI interrupted. Please check network.");
        }
      } finally {
        if (isComponentMounted.current) {
          setIsLoading(false);
          // Unlock after a small delay to debounce rapid UI spamming
          setTimeout(() => {
            if (isComponentMounted.current) isFetching.current = false;
          }, 600);
        } else {
          isFetching.current = false;
        }
      }
    };

    // Run if this is the initial mount or if the smoothed data crossed our decoupling threshold
    if (!baselineTelemetry.current || hasSignificantChange(currentTelemetry, baselineTelemetry.current)) {
      if (currentTelemetry.cropType && currentTelemetry.cropType !== 'Unknown') {
        fetchAnalysis();
      }
    }
  }, [JSON.stringify(telemetryContext), dataHistory, isManualMode]);

  return { analysisData, isLoading, error };
};

