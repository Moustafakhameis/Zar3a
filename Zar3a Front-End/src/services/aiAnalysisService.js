/**
 * AI Analysis Service (Mock Heuristic Engine - Expanded)
 * Generates dynamic, realistic AI recommendations, predictive metrics, and executive summaries.
 */

export const generateAIAnalysis = async (telemetry) => {
  try {
    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Random simulated network error (very low probability, just to prove error handling works)
    if (Math.random() < 0.02) {
      throw new Error("Network timeout: AI Engine unreachable");
    }

    const { moisture, ph, cropType, hardware, weather, isManualMode } = telemetry;
    
    // Inject the System Prompt based on Mode
    const systemPrompt = isManualMode 
      ? "System is in MANUAL mode. Act as a direct advisor to the farmer. Based on the data, explicitly tell the farmer exactly which button to click in the Hardware Control panel (PUMP, VENT, FERTILIZER, or PH MOD) to resolve critical statuses."
      : "System is in AUTO mode. Provide general analytical insights assuming the hardware will handle corrections automatically.";
    
    // In a real app, `systemPrompt` would be sent to the LLM backend.
    console.log("[AI Payload Context]:", systemPrompt);

    const recommendations = [];
    let healthScore = 100;
    
    let resourceEfficiency = 98;
    let yieldTrend = "+4.2%";
    let harvestWindow = "In 14 Days";

    // 1. Moisture Analysis
    if (moisture < 50) {
      healthScore -= 15;
      resourceEfficiency -= 12;
      yieldTrend = "-2.1%";
      recommendations.push({
        id: "ai-rec-1",
        title: "Moisture below optimal threshold",
        riskLevel: "High",
        confidence: 93,
        recommendation: isManualMode ? "Click the PUMP button immediately to activate deep root irrigation." : "Auto-irrigation systems are activating to correct low moisture.",
        expectedImpact: "Prevent yield reduction by 12%",
        predictedIssue: "Water stress leading to stunted growth.",
        iconType: "moisture_low",
      });
    } else if (moisture > 80) {
      healthScore -= 10;
      resourceEfficiency -= 5;
      yieldTrend = "-1.5%";
      recommendations.push({
        id: "ai-rec-2",
        title: "Soil saturation detected",
        riskLevel: "Medium",
        confidence: 85,
        recommendation: isManualMode ? "Click the VENT button to increase airflow and dry out the soil." : "Auto-ventilation is running to manage soil saturation.",
        expectedImpact: "Prevent root rot development.",
        predictedIssue: "Anaerobic soil conditions.",
        iconType: "moisture_high",
      });
    }

    // 2. pH Analysis
    if (ph < 6.0) {
      healthScore -= 10;
      resourceEfficiency -= 8;
      recommendations.push({
        id: "ai-rec-3",
        title: "Acidic soil trend detected",
        riskLevel: "Medium",
        confidence: 88,
        recommendation: isManualMode ? "Click the PH MOD button to apply agricultural lime." : "Automated pH correction in progress to neutralize acidity.",
        expectedImpact: "Optimize nutrient absorption by 20%",
        predictedIssue: "Phosphorus deficiency.",
        iconType: "ph",
      });
    } else if (ph > 7.5) {
      healthScore -= 10;
      resourceEfficiency -= 6;
      recommendations.push({
        id: "ai-rec-4",
        title: "Alkaline soil trend detected",
        riskLevel: "Low",
        confidence: 76,
        recommendation: isManualMode ? "Click the PH MOD button to apply acidifying agents." : "Automated pH correction in progress to reduce alkalinity.",
        expectedImpact: "Restore iron availability.",
        predictedIssue: "Iron chlorosis.",
        iconType: "ph",
      });
    }

    // 3. Hardware / System Optimization
    if (hardware?.vent && weather?.temperature < 20) {
      healthScore -= 5;
      resourceEfficiency -= 15;
      recommendations.push({
        id: "ai-rec-5",
        title: "Inefficient ventilation usage",
        riskLevel: "Low",
        confidence: 95,
        recommendation: isManualMode ? "Click the VENT button to turn it off. Ambient temp is optimal." : "System will disable ventilation shortly to save energy.",
        expectedImpact: "Save 4 kWh of energy today.",
        predictedIssue: "Unnecessary energy consumption.",
        iconType: "energy",
      });
    }

    // 4. Preventative / Baseline Recommendations (Always shown to provide value)
    if (healthScore > 85) {
      recommendations.push({
        id: "ai-rec-prev-1",
        title: "Upcoming Sensor Calibration",
        riskLevel: "None",
        confidence: 99,
        recommendation: "Schedule routine calibration for moisture sensors in Sector A.",
        expectedImpact: "Maintain 99.9% data accuracy.",
        predictedIssue: "None detected.",
        iconType: "success",
      });
      
      if (weather?.temperature > 30) {
        recommendations.push({
          id: "ai-rec-prev-2",
          title: "Heatwave Preparation",
          riskLevel: "Low",
          confidence: 82,
          recommendation: isManualMode ? "Click the PUMP button to pre-hydrate soil 12 hours before heatwave." : "Auto-irrigation scheduled for pre-heatwave deep soak.",
          expectedImpact: "Buffer against heat stress.",
          predictedIssue: "Potential midday wilting.",
          iconType: "moisture_low",
        });
      } else {
         recommendations.push({
          id: "ai-rec-prev-3",
          title: "Optimal Micro-nutrient Application",
          riskLevel: "None",
          confidence: 94,
          recommendation: isManualMode ? "Click the FERTILIZER button to foliar feed calcium mix." : "Auto-fertilization scheduled for next low-sunlight window.",
          expectedImpact: "Boost fruit firmness by 8%.",
          predictedIssue: "None detected.",
          iconType: "success",
        });
      }
    }

    // Generate Executive Summary based on health
    let executiveSummary = "";
    if (healthScore >= 90) {
      executiveSummary = `Based on the last 48 hours of telemetry, the sector is performing at peak efficiency (${resourceEfficiency}%). ${isManualMode ? "Keep monitoring hardware controls." : "Environmental controls are perfectly synced."} We project a ${yieldTrend} yield increase.`;
    } else if (healthScore >= 70) {
      executiveSummary = `The sector is stable but requires minor interventions. Resource efficiency has dropped to ${resourceEfficiency}%. ${isManualMode ? "Please action the hardware recommendations below." : "Addressing the active alerts will stabilize the yield trend."}`;
    } else {
      executiveSummary = `CRITICAL ATTENTION REQUIRED: Multiple compounding issues detected. Resource efficiency has severely degraded to ${resourceEfficiency}%. Immediate ${isManualMode ? "manual hardware intervention" : "system correction"} is necessary to prevent a projected ${yieldTrend} drop in overall yield.`;
    }

    return {
      assessment: getHealthAssessment(healthScore),
      healthScore,
      recommendations,
      metrics: {
        resourceEfficiency,
        yieldTrend,
        harvestWindow
      },
      executiveSummary
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Connection to AI interrupted. Please check network.");
  }
};

const getHealthAssessment = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Critical";
};
