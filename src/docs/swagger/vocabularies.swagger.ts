/**
 * @swagger
 * tags:
 *   name: Vocabularies
 *   description: Vocabulary management endpoints
 */

/**
 * @swagger
 * /api/v1/vocabularies:
 *   get:
 *     summary: Get all vocabularies for the authenticated user
 *     tags: [Vocabularies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vocabularies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get all vocabulary successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vocabulary'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new vocabulary
 *     tags: [Vocabularies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVocabularyDto'
 *           examples:
 *             basicExample:
 *               summary: Basic vocabulary
 *               value:
 *                 word: "extraordinary"
 *                 meanings:
 *                   - meaning: "Very unusual or remarkable"
 *                     partOfSpeech: "adjective"
 *             detailedExample:
 *               summary: Detailed vocabulary with examples
 *               value:
 *                 word: "extraordinary"
 *                 phonetic:
 *                   text: "/ɪkˈstrɔːrdɪneri/"
 *                   audio: "https://example.com/audio/extraordinary.mp3"
 *                 meanings:
 *                   - meaning: "Very unusual or remarkable"
 *                     context: "Used to emphasize the extent of something"
 *                     partOfSpeech: "adjective"
 *                     note: "Often used for positive emphasis"
 *                     examples:
 *                       - sentence: "She has extraordinary talent."
 *                         translation: "Cô ấy có tài năng phi thường."
 *                     commonPhrases:
 *                       - phrase: "extraordinary circumstances"
 *                         meaning: "unusual or exceptional situations"
 *                 categories: ["Advanced English", "Adjectives"]
 *     responses:
 *       200:
 *         description: Vocabulary created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create new vocabulary successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Vocabulary'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/vocabularies/{vocabId}:
 *   get:
 *     summary: Get a vocabulary by ID
 *     tags: [Vocabularies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vocabId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vocabulary ID
 *         example: "64abc123def456789"
 *     responses:
 *       200:
 *         description: Vocabulary found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get one vocabulary successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Vocabulary'
 *       404:
 *         description: Vocabulary not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Update a vocabulary
 *     tags: [Vocabularies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vocabId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vocabulary ID
 *         example: "64abc123def456789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVocabularyDto'
 *           examples:
 *             updateWord:
 *               summary: Update word only
 *               value:
 *                 word: "updated word"
 *             updateMeanings:
 *               summary: Update meanings
 *               value:
 *                 meanings:
 *                   - meaning: "Updated meaning"
 *                     partOfSpeech: "noun"
 *     responses:
 *       200:
 *         description: Vocabulary updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update vocabulary successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Vocabulary'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vocabulary not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a vocabulary
 *     tags: [Vocabularies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vocabId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vocabulary ID
 *         example: "64abc123def456789"
 *     responses:
 *       200:
 *         description: Vocabulary deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete vocabulary successfully"
 *       404:
 *         description: Vocabulary not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/vocabularies/search:
 *   get:
 *     summary: Search vocabularies
 *     tags: [Vocabularies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: word
 *         required: true
 *         schema:
 *           type: string
 *         description: Word to search for
 *         example: "extraordinary"
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Search vocabularies successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vocabulary'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export default {}
