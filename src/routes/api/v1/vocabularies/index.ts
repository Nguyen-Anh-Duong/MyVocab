import { Router } from 'express'
import vocabularyController from '~/controllers/vocabulary.controller.js'
import { IdDto } from '~/dtos/id.dto.js'
import { CreateVocabularyDto, UpdateVocabularyDto } from '~/dtos/vocabulary.dto.js'
import { SearchVocabularyDto } from '~/dtos/search.dto.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import { validateDto } from '~/middlewares/validate.js'

const vocabRouter = Router()

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
vocabRouter.get(
  '/search',
  validateDto(SearchVocabularyDto, 'query'),
  authenticateAccessToken,
  vocabularyController.searchVocabularies
)

/**
 * @swagger
 * /api/v1/vocabularies:
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
vocabRouter.post('/', validateDto(CreateVocabularyDto), authenticateAccessToken, vocabularyController.createNewVocab)

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
 */
vocabRouter.get(
  '/:vocabId',
  validateDto(IdDto, 'params'),
  authenticateAccessToken,
  vocabularyController.getOneVocabulary
)

/**
 * @swagger
 * /api/v1/vocabularies/{vocabId}:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVocabularyDto'
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
 */
vocabRouter.patch(
  '/:vocabId',
  validateDto(UpdateVocabularyDto),
  validateDto(IdDto, 'params'),
  authenticateAccessToken,
  vocabularyController.updateOneVocabulary
)

/**
 * @swagger
 * /api/v1/vocabularies/{vocabId}:
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
vocabRouter.delete(
  '/:vocabId',
  validateDto(IdDto, 'params'),
  authenticateAccessToken,
  vocabularyController.deleteOneVocabulary
)

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
 */
vocabRouter.get('/', authenticateAccessToken, vocabularyController.getVocabularies)

export default vocabRouter
