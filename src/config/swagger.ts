import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyVocab API',
      version: '1.0.0',
      description: 'API documentation for MyVocab - Vocabulary Learning Application',
      contact: {
        name: 'API Support',
        email: 'support@myvocab.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.myvocab.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken'
        }
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized - Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              examples: {
                unauthorized: {
                  summary: 'Missing or invalid token',
                  value: {
                    message: 'Access token is required',
                    status: 401
                  }
                }
              }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              examples: {
                forbidden: {
                  summary: 'Insufficient permissions',
                  value: {
                    message: 'Access denied. Admin role required.',
                    status: 403
                  }
                }
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              examples: {
                notFound: {
                  summary: 'Resource not found',
                  value: {
                    message: 'Resource not found',
                    status: 404
                  }
                }
              }
            }
          }
        },
        BadRequest: {
          description: 'Bad request - Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              examples: {
                validationError: {
                  summary: 'Validation error',
                  value: {
                    message: 'Validation failed',
                    status: 400
                  }
                }
              }
            }
          }
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            status: {
              type: 'integer',
              description: 'HTTP status code'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            status: {
              type: 'string',
              enum: ['pending', 'active', 'inactive'],
              description: 'Account status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Category ID'
            },
            name: {
              type: 'string',
              description: 'Category name'
            },
            description: {
              type: 'string',
              description: 'Category description'
            },
            color: {
              type: 'string',
              pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
              description: 'Category color in hex format'
            },
            createdBy: {
              type: 'string',
              description: 'User ID who created this category'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Vocabulary: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Vocabulary ID'
            },
            word: {
              type: 'string',
              description: 'The vocabulary word'
            },
            phonetic: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Phonetic transcription'
                },
                audio: {
                  type: 'string',
                  description: 'Audio URL'
                }
              }
            },
            meanings: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Meaning'
              }
            },
            categories: {
              type: 'array',
              items: {
                oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/Category' }]
              }
            },
            createdBy: {
              type: 'string',
              description: 'User ID who created this vocabulary'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Meaning: {
          type: 'object',
          properties: {
            meaning: {
              type: 'string',
              description: 'Definition of the word'
            },
            context: {
              type: 'string',
              description: 'Context where this meaning is used'
            },
            partOfSpeech: {
              type: 'string',
              enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'],
              description: 'Part of speech'
            },
            note: {
              type: 'string',
              description: 'Additional notes'
            },
            examples: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Example'
              }
            },
            commonPhrases: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CommonPhrase'
              }
            }
          }
        },
        Example: {
          type: 'object',
          properties: {
            sentence: {
              type: 'string',
              description: 'Example sentence'
            },
            translation: {
              type: 'string',
              description: 'Translation of the example'
            }
          }
        },
        CommonPhrase: {
          type: 'object',
          properties: {
            phrase: {
              type: 'string',
              description: 'Common phrase'
            },
            meaning: {
              type: 'string',
              description: 'Meaning of the phrase'
            }
          }
        },
        CreateUserDto: {
          type: 'object',
          required: ['email', 'username', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: 'Username'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password'
            }
          }
        },
        LoginUserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            password: {
              type: 'string',
              description: 'Password'
            }
          }
        },
        CreateCategoryDto: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'Category name'
            },
            description: {
              type: 'string',
              description: 'Category description'
            },
            color: {
              type: 'string',
              pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
              description: 'Category color in hex format'
            }
          }
        },
        CreateVocabularyDto: {
          type: 'object',
          required: ['word', 'meanings'],
          properties: {
            word: {
              type: 'string',
              description: 'The vocabulary word'
            },
            phonetic: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Phonetic transcription'
                },
                audio: {
                  type: 'string',
                  description: 'Audio URL'
                }
              }
            },
            meanings: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['meaning'],
                properties: {
                  meaning: {
                    type: 'string',
                    description: 'Definition of the word'
                  },
                  context: {
                    type: 'string',
                    description: 'Context where this meaning is used'
                  },
                  partOfSpeech: {
                    type: 'string',
                    enum: [
                      'noun',
                      'verb',
                      'adjective',
                      'adverb',
                      'pronoun',
                      'preposition',
                      'conjunction',
                      'interjection'
                    ],
                    description: 'Part of speech'
                  },
                  note: {
                    type: 'string',
                    description: 'Additional notes'
                  },
                  examples: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        sentence: {
                          type: 'string',
                          description: 'Example sentence'
                        },
                        translation: {
                          type: 'string',
                          description: 'Translation of the example'
                        }
                      }
                    }
                  },
                  commonPhrases: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        phrase: {
                          type: 'string',
                          description: 'Common phrase'
                        },
                        meaning: {
                          type: 'string',
                          description: 'Meaning of the phrase'
                        }
                      }
                    }
                  }
                }
              }
            },
            categories: {
              type: 'array',
              items: {
                type: 'string',
                description: 'Category name'
              }
            }
          }
        },
        NlpTextInputDto: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              minLength: 1,
              description: 'Text to analyze for vocabulary extraction'
            }
          }
        },
        ForgotPasswordDto: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            }
          }
        },
        ResetPasswordDto: {
          type: 'object',
          required: ['password'],
          properties: {
            password: {
              type: 'string',
              minLength: 6,
              description: 'New password'
            }
          }
        },
        ChangePasswordDto: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: {
              type: 'string',
              description: 'Current password'
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              description: 'New password'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['src/docs/swagger/*.ts']
}

const specs = swaggerJSDoc(options)

export { specs, swaggerUi }
