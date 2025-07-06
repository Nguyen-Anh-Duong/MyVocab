/**
 * @swagger
 * tags:
 *   name: NLP
 *   description: Natural Language Processing and AI-powered endpoints
 */

/**
 * @swagger
 * /api/v1/nlp/text-to-vocabulary:
 *   post:
 *     summary: Parse text to extract vocabulary using AI
 *     description: Uses Google Gemini AI to analyze text and extract vocabulary words with definitions, examples, and meanings
 *     tags: [NLP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to analyze and extract vocabulary from
 *                 example: "The extraordinary performance captivated the audience with its unprecedented creativity and remarkable innovation."
 *           examples:
 *             simpleText:
 *               summary: Simple text example
 *               value:
 *                 text: "The extraordinary performance was absolutely phenomenal."
 *             complexText:
 *               summary: Complex text with academic vocabulary
 *               value:
 *                 text: "The unprecedented economic downturn has necessitated innovative approaches to mitigate the deleterious effects on employment."
 *     responses:
 *       200:
 *         description: Text analyzed successfully and vocabulary extracted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Text parsed to vocabulary successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       word:
 *                         type: string
 *                         example: "extraordinary"
 *                       phonetic:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                             example: "/ɪkˈstrɔːrdɪneri/"
 *                           audio:
 *                             type: string
 *                             example: ""
 *                       meanings:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             meaning:
 *                               type: string
 *                               example: "Very unusual or remarkable"
 *                             context:
 *                               type: string
 *                               example: "Used to emphasize the extent of something"
 *                             partOfSpeech:
 *                               type: string
 *                               enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection']
 *                               example: "adjective"
 *                             note:
 *                               type: string
 *                               example: "Often used for positive emphasis"
 *                             examples:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   sentence:
 *                                     type: string
 *                                     example: "She has extraordinary talent."
 *                                   translation:
 *                                     type: string
 *                                     example: "Cô ấy có tài năng phi thường."
 *                             commonPhrases:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   phrase:
 *                                     type: string
 *                                     example: "extraordinary circumstances"
 *                                   meaning:
 *                                     type: string
 *                                     example: "unusual or exceptional situations"
 *             examples:
 *               successResponse:
 *                 summary: Successful vocabulary extraction
 *                 value:
 *                   message: "Text parsed to vocabulary successfully."
 *                   data:
 *                     - word: "extraordinary"
 *                       phonetic:
 *                         text: "/ɪkˈstrɔːrdɪneri/"
 *                         audio: ""
 *                       meanings:
 *                         - meaning: "Very unusual or remarkable"
 *                           context: "Used to emphasize the extent of something"
 *                           partOfSpeech: "adjective"
 *                           note: "Often used for positive emphasis"
 *                           examples:
 *                             - sentence: "She has extraordinary talent."
 *                               translation: "Cô ấy có tài năng phi thường."
 *                           commonPhrases:
 *                             - phrase: "extraordinary circumstances"
 *                               meaning: "unusual or exceptional situations"
 *                     - word: "phenomenal"
 *                       phonetic:
 *                         text: "/fəˈnɒmɪnəl/"
 *                         audio: ""
 *                       meanings:
 *                         - meaning: "Very remarkable; extraordinary"
 *                           context: "Used to express something impressive"
 *                           partOfSpeech: "adjective"
 *                           examples:
 *                             - sentence: "The team's performance was phenomenal."
 *                               translation: "Hiệu suất của đội là phi thường."
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidInput:
 *                 summary: Invalid or missing text
 *                 value:
 *                   message: "Invalid input. Please provide a valid text."
 *                   status: 400
 *               emptyText:
 *                 summary: Empty text provided
 *                 value:
 *                   message: "Invalid input. Please provide a valid text."
 *                   status: 400
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 summary: Missing or invalid token
 *                 value:
 *                   message: "Access token is required"
 *                   status: 401
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               rateLimitExceeded:
 *                 summary: AI API rate limit exceeded
 *                 value:
 *                   message: "AI service rate limit exceeded. Please try again later."
 *                   status: 429
 *       503:
 *         description: Service unavailable - AI service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               aiServiceError:
 *                 summary: AI service temporarily unavailable
 *                 value:
 *                   message: "AI service is temporarily unavailable. Please try again later."
 *                   status: 503
 */

export default {}
