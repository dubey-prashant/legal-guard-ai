import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from user input or environment variable fallback
const getApiKey = (userApiKey) => {
  if (userApiKey && userApiKey.trim()) {
    return userApiKey.trim();
  }

  // Fallback to environment variable
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envApiKey && envApiKey !== 'your_gemini_api_key_here') {
    return envApiKey;
  }

  return null;
};

export const analyzeNotice = async (noticeText, userApiKey) => {
  try {
    const apiKey = getApiKey(userApiKey);

    if (!apiKey) {
      throw new Error(
        'No API key available. Please enter your Gemini API key in the settings or configure VITE_GEMINI_API_KEY in your environment.'
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a legal assistant specializing in government notice analysis. Analyze the following government notice and provide a structured analysis in JSON format.

Notice Text:
${noticeText}

Please analyze this notice and return a JSON object with the following structure:
{
  "summary": "Brief 2-3 sentence summary of the notice",
  "urgency": "low/medium/high - based on deadlines and consequences",
  "complianceRequired": "required/recommended/optional",
  "deadline": "Extract any specific deadlines mentioned",
  "keyPoints": ["Array of 3-5 most important points"],
  "requiredActions": ["Array of specific actions that must be taken"],
  "documentsNeeded": ["Array of documents that may be required"],
  "financialImplications": "true/false - whether there are financial penalties or costs",
  "noticeType": "Classification of the notice type",
  "issuingAuthority": "The government body that issued this notice",
  "legalBasis": "The legal authority or act under which this notice is issued",
  "recommendedResponseType": {
    "type": "acknowledgment/compliance/clarification/objection",
    "reasoning": "Detailed explanation of why this response type is recommended in favor of the recipient",
    "confidence": "high/medium/low - confidence level in this recommendation",
    "alternativeOptions": ["Array of other viable response types with brief reasons"]
  },
  "riskAssessment": {
    "level": "low/medium/high",
    "factors": ["Array of risk factors identified"],
    "mitigationStrategies": ["Array of strategies to minimize negative outcomes"]
  },
  "strategicAdvice": "Tactical advice on how to approach this notice to minimize negative impact and maximize positive outcomes for the recipient"
}

IMPORTANT: When recommending response type, prioritize what is most beneficial for the notice recipient. Consider:
- Legal consequences of different response approaches
- Time sensitivity and deadlines
- Potential for negotiation or mitigation
- Strength of the government's case
- Available defenses or explanations
- Cost-benefit analysis of different approaches

Focus on practical, actionable insights that favor the recipient while remaining legally compliant. Be precise and professional. If any information is not clearly stated in the notice, indicate "Not specified" for that field.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Try to parse JSON from the response
    try {
      // Remove any markdown code blocks if present
      const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
      const analysis = JSON.parse(cleanedText);

      // Validate required fields
      if (!analysis.summary) {
        throw new Error('Invalid response format: missing summary');
      }

      // Ensure recommendedResponseType has required structure
      if (
        !analysis.recommendedResponseType ||
        !analysis.recommendedResponseType.type
      ) {
        analysis.recommendedResponseType = {
          type: 'compliance',
          reasoning:
            'Default compliance response recommended due to incomplete analysis',
          confidence: 'low',
          alternativeOptions: ['acknowledgment', 'clarification'],
        };
      }

      return analysis;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', text);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  } catch (error) {
    console.error('Error analyzing notice:', error);
    if (
      error.message?.includes('API_KEY_INVALID') ||
      error.message?.includes('Invalid API key')
    ) {
      throw new Error(
        'Invalid API key. Please check your Gemini API key or contact support.'
      );
    } else if (
      error.message?.includes('quota') ||
      error.message?.includes('QUOTA_EXCEEDED')
    ) {
      throw new Error(
        'API quota exceeded. Please try again later or use your own API key.'
      );
    } else if (error.message?.includes('No API key available')) {
      throw error; // Re-throw the custom message
    } else {
      throw new Error(
        error.message || 'Failed to analyze notice. Please try again.'
      );
    }
  }
};

export const generateResponse = async (
  analysis,
  originalText,
  responseType,
  userApiKey
) => {
  try {
    const apiKey = getApiKey(userApiKey);

    if (!apiKey) {
      throw new Error(
        'No API key available. Please enter your Gemini API key in the settings or configure VITE_GEMINI_API_KEY in your environment.'
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const responseTypeInstructions = {
      acknowledgment:
        'Generate a formal acknowledgment letter that confirms receipt of the notice and understanding of the requirements. This should be professional but not commit to specific actions beyond acknowledgment.',
      compliance:
        'Generate a detailed compliance response that outlines specific steps being taken to meet the requirements. Include timelines, commitments, and demonstrate good faith effort to comply.',
      clarification:
        "Generate a professional letter requesting clarification on unclear aspects of the notice. This is a strategic approach to buy time and potentially identify weaknesses in the government's position.",
      objection:
        'Generate a formal objection letter that respectfully contests the notice with proper legal grounds. This should be used only when there are legitimate grounds for dispute.',
    };

    const strategicGuidance = {
      acknowledgment:
        'Use when you need time to prepare a more detailed response or when the notice is primarily informational.',
      compliance:
        'Use when compliance is clearly required and resistance would be futile or counterproductive.',
      clarification:
        'Use when the notice is unclear, contains errors, or when you need more time to prepare a defense.',
      objection:
        'Use only when you have strong legal grounds to contest the notice and the potential benefits outweigh the risks.',
    };

    const prompt = `
You are a legal assistant helping to draft a professional response to a government notice. 

Original Notice Analysis:
${JSON.stringify(analysis, null, 2)}

Response Type Selected: ${responseType}
Strategic Approach: ${responseTypeInstructions[responseType]}
When to Use: ${strategicGuidance[responseType]}

Please generate a professional, formal letter response that:

1. Uses proper business letter format with current date
2. Is addressed to the appropriate government authority (use actual details from the notice)
3. References the original notice appropriately (use actual notice number and date)
4. ${responseTypeInstructions[responseType]}
5. Maintains a respectful and professional tone throughout
6. Includes all necessary legal and procedural elements
7. Is strategically crafted to favor the recipient's interests while remaining compliant
8. Addresses the specific requirements and deadlines mentioned in the analysis
9. Incorporates relevant strategic advice from the analysis

Strategic considerations for this response:
- Risk Level: ${analysis.riskAssessment?.level || 'medium'}
- Key Risk Factors: ${
      analysis.riskAssessment?.factors?.join(', ') || 'Not specified'
    }
- Mitigation Strategies: ${
      analysis.riskAssessment?.mitigationStrategies?.join(', ') ||
      'Standard compliance approach'
    }

Format the response as a complete business letter with:
- Current date
- Recipient address (use actual authority details from notice)
- Subject line referencing the actual notice
- Salutation
- Body paragraphs that are strategically structured
- Professional closing
- Signature block with placeholder for sender details

Make the response comprehensive but concise. Ensure it addresses the specific requirements and deadlines mentioned in the analysis while protecting the recipient's interests.

Important: If this is a clarification request, include specific, intelligent questions that could potentially expose weaknesses in the government's position or buy valuable time.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Error generating response:', error);
    if (
      error.message?.includes('API_KEY_INVALID') ||
      error.message?.includes('Invalid API key')
    ) {
      throw new Error(
        'Invalid API key. Please check your Gemini API key or contact support.'
      );
    } else if (
      error.message?.includes('quota') ||
      error.message?.includes('QUOTA_EXCEEDED')
    ) {
      throw new Error(
        'API quota exceeded. Please try again later or use your own API key.'
      );
    } else if (error.message?.includes('No API key available')) {
      throw error; // Re-throw the custom message
    } else {
      throw new Error(
        error.message || 'Failed to generate response. Please try again.'
      );
    }
  }
};

// Helper function to validate API key format
export const validateApiKey = (apiKey) => {
  apiKey && typeof apiKey == 'string';
};

// Helper function to check if environment API key is available
export const hasEnvironmentApiKey = () => {
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return (
    envApiKey &&
    envApiKey !== 'your_gemini_api_key_here' &&
    validateApiKey(envApiKey)
  );
};

// Helper function to get effective API key (for display purposes)
export const getEffectiveApiKey = (userApiKey) => {
  return getApiKey(userApiKey);
};

// Helper function to get response type display information
export const getResponseTypeInfo = () => {
  return {
    acknowledgment: {
      label: 'Acknowledgment',
      description: 'Simple acknowledgment of receipt',
      icon: '📨',
      riskLevel: 'low',
      timeline: 'Quick response',
      whenToUse:
        'When you need time to prepare or when the notice is informational',
    },
    compliance: {
      label: 'Compliance Response',
      description: 'Detailed compliance commitment',
      icon: '✅',
      riskLevel: 'low',
      timeline: 'Immediate action',
      whenToUse:
        'When compliance is clearly required and resistance would be futile',
    },
    clarification: {
      label: 'Request Clarification',
      description: 'Ask for additional information',
      icon: '❓',
      riskLevel: 'medium',
      timeline: 'Buys time',
      whenToUse:
        'When the notice is unclear or when you need more time to prepare',
    },
    objection: {
      label: 'Formal Objection',
      description: 'Contest the notice (if applicable)',
      icon: '⚖️',
      riskLevel: 'high',
      timeline: 'Extended process',
      whenToUse:
        'Only when you have strong legal grounds and benefits outweigh risks',
    },
  };
};
