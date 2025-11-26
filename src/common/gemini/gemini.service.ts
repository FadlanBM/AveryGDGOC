import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly ai: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not defined in the environment variables',
      );
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateMenuDescription(
    name: string,
    category: string,
    ingredients: string[],
    calories?: number,
  ): Promise<string> {
    try {
      const prompt = `You are a professional food menu writer. Generate an appetizing, concise description (max 2-3 sentences) for a menu item with the following details:
      Name: ${name}
      Category: ${category}
      Ingredients: ${ingredients.join(', ')}
      ${calories ? `Calories: ${calories}` : ''}
      Write a description that highlights the key flavors, textures, and appeal of this dish. Be creative but professional.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text?.trim() as string;
    } catch (error) {
      this.logger.error('Failed to generate description', error);
      return `Delicious ${name} made with ${ingredients.slice(0, 3).join(', ')}${ingredients.length > 3 ? ', and more' : ''}.`;
    }
  }

  async getMenuRecommendations(
    menus: any[],
    preferences?: {
      maxCalories?: number;
      category?: string;
      dietaryRestrictions?: string[];
      mood?: string;
    },
  ): Promise<{
    recommendations: any[];
    reasoning: string;
  }> {
    try {
      const menuSummary = menus
        .map(
          (menu, idx) =>
            `${idx + 1}. ${menu.name} (${menu.category}) - ${menu.calories} cal, Rp${menu.price} - ${menu.description}`,
        )
        .join('\n');

      const prompt = `You are a helpful restaurant AI assistant. Based on the following menu items and user preferences, recommend the TOP 3 menu items and explain why.
      AVAILABLE MENU:
      ${menuSummary}
      USER PREFERENCES:
      ${preferences?.maxCalories ? `- Maximum calories: ${preferences.maxCalories}` : ''}
      ${preferences?.category ? `- Preferred category: ${preferences.category}` : ''}
      ${preferences?.dietaryRestrictions?.length ? `- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}` : ''}
      ${preferences?.mood ? `- Current mood/occasion: ${preferences.mood}` : ''}
      Please respond in JSON format:
      {
        "recommendations": [1, 5, 8],  // Array of menu indices (1-based)
        "reasoning": "Brief explanation of why these items were recommended"
      }`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // Parse JSON response
      const jsonMatch = response.text?.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }
      const result = JSON.parse(jsonMatch[0]);

      // Map indices back to actual menu items
      const recommendedMenus = result.recommendations
        .map((idx: number) => menus[idx - 1])
        .filter(Boolean);
      return {
        recommendations: recommendedMenus,
        reasoning: result.reasoning,
      };
    } catch (error) {
      this.logger.error('Failed to generate recommendations', error);
      return {
        recommendations: [],
        reasoning: 'Failed to generate recommendations',
      };
    }
  }
}
