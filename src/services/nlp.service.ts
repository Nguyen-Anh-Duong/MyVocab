import { GoogleGenAI, Type } from '@google/genai'

class NlpService {
  parseTextToVocabulary = async (rawText: string): Promise<any> => {
    const prompt = `The input text is: ${rawText}`
    const modelName = 'gemini-2.5-flash'

    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({})

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction:
          'You are a helpful assistant that extracts vocabulary information from raw text. I will give you a raw dictionary-style text containing information about an English word. Your task is to extract and return a JSON object that follows the structure of a vocabulary item as defined',
        thinkingConfig: {
          thinkingBudget: 0 // Disables thinking
        },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: {
              type: Type.STRING,
              description: 'The word itself'
            },
            phonetic: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING
                },
                audio: {
                  type: Type.STRING
                }
              },
              propertyOrdering: ['text', 'audio']
            },
            meanings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  meaning: {
                    type: Type.STRING
                  },
                  context: {
                    type: Type.STRING
                  },
                  partOfSpeech: {
                    type: Type.STRING,
                    enum: [
                      'noun',
                      'verb',
                      'adjective',
                      'adverb',
                      'pronoun',
                      'preposition',
                      'conjunction',
                      'interjection',
                      'determiner',
                      'exclamation',
                      'phrase'
                    ]
                  },
                  examples: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        sentence: {
                          type: Type.STRING
                        },
                        translation: {
                          type: Type.STRING
                        }
                      },
                      propertyOrdering: ['sentence', 'translation']
                    }
                  },
                  commonPhrases: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        phrase: {
                          type: Type.STRING
                        },
                        meaning: {
                          type: Type.STRING
                        }
                      },
                      propertyOrdering: ['phrase', 'meaning']
                    }
                  },
                  note: {
                    type: Type.STRING
                  }
                },
                propertyOrdering: ['meaning', 'context', 'partOfSpeech', 'examples', 'commonPhrases', 'note']
              }
            }
          },
          propertyOrdering: ['word', 'phonetic', 'meanings']
        }
      }
    })

    if (!response || !response.text) {
      throw new Error('No response from Gemini AI')
    }
    const vocabulary = JSON.parse(response.text)

    return vocabulary
  }
}

export default new NlpService()
