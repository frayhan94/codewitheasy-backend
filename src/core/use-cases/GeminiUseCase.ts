import { IGeminiRepository } from '../ports/IGeminiRepository';
import { GenerateDescriptionRequest, GenerateBenefitsRequest } from '../entities/Gemini';
import { COURSE_DESCRIPTION_PROMPT, COURSE_BENEFITS_PROMPT } from '../../utils/prompts';

export class GeminiUseCase {
  constructor(private geminiRepository: IGeminiRepository) {}

  async listModels() {
    const models = await this.geminiRepository.listModels();
    return {
      success: true,
      models: models || []
    };
  }

  async generateDescription(request: GenerateDescriptionRequest) {
    const { title, level, icon } = request;

    if (!title || !level) {
      throw new Error('Title and level are required');
    }

    const prompt = COURSE_DESCRIPTION_PROMPT(title, level, icon);
    const description = await this.geminiRepository.generateContent('gemini-2.5-flash', prompt);

    return {
      success: true,
      description: description.trim()
    };
  }

  async generateBenefits(request: GenerateBenefitsRequest) {
    const { title, level, description, icon } = request;

    if (!title || !level) {
      throw new Error('Title and level are required');
    }

    const prompt = COURSE_BENEFITS_PROMPT(title, level, description, icon);
    const benefitsText = await this.geminiRepository.generateContent('gemini-2.5-flash', prompt);

    // Parse the JSON response
    let benefits;
    try {
      benefits = JSON.parse(benefitsText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = benefitsText.match(/\[.*?\]/s);
      if (jsonMatch) {
        benefits = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from Gemini');
      }
    }

    return {
      success: true,
      benefits: benefits
    };
  }

  async checkBalance() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const usageMetadata = await this.geminiRepository.checkBalance('gemini-2.5-flash');
    
    if (!usageMetadata) {
      throw new Error('Usage metadata not available');
    }

    return {
      success: true,
      data: {
        requestsUsed: usageMetadata.totalTokenCount || 0,
        requestsRemaining: 'Check Google AI Studio for detailed usage',
        requestsLimit: 'Check Google AI Studio for quota limits',
        promptTokenCount: usageMetadata.promptTokenCount,
        candidatesTokenCount: usageMetadata.candidatesTokenCount,
        totalTokenCount: usageMetadata.totalTokenCount,
        lastChecked: new Date().toISOString()
      }
    };
  }
}