import express from 'express';
import { 
  getStores, 
  getStore, 
  getFeaturedStores,
  getStoresByCategory,
  searchStores,
  trackStoreClick,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} from '../controllers/storeController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         logo:
 *           type: string
 *         banner:
 *           type: string
 *         website:
 *           type: string
 *         cashbackRate:
 *           type: number
 *         maxCashback:
 *           type: number
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         isFeatured:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Get all stores with pagination and filters
 *     tags: [Stores]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured stores
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of stores
 */
router.get('/', getStores);

/**
 * @swagger
 * /api/stores/featured:
 *   get:
 *     summary: Get featured stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: List of featured stores
 */
router.get('/featured', getFeaturedStores);

/**
 * @swagger
 * /api/stores/category/{category}:
 *   get:
 *     summary: Get stores by category
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of stores in category
 */
router.get('/category/:category', getStoresByCategory);

/**
 * @swagger
 * /api/stores/search:
 *   get:
 *     summary: Search stores
 *     tags: [Stores]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', searchStores);

/**
 * @swagger
 * /api/stores/favorites:
 *   get:
 *     summary: Get user's favorite stores
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's favorite stores
 */
router.get('/favorites', authenticate, getUserFavorites);

/**
 * @swagger
 * /api/stores/{slug}:
 *   get:
 *     summary: Get store by slug
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store details
 *       404:
 *         description: Store not found
 */
router.get('/:slug', getStore);

/**
 * @swagger
 * /api/stores/{id}/click:
 *   post:
 *     summary: Track store click
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Click tracked successfully
 */
router.post('/:id/click', trackStoreClick);

/**
 * @swagger
 * /api/stores/{id}/favorite:
 *   post:
 *     summary: Add store to favorites
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store added to favorites
 */
router.post('/:id/favorite', authenticate, addToFavorites);

/**
 * @swagger
 * /api/stores/{id}/favorite:
 *   delete:
 *     summary: Remove store from favorites
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store removed from favorites
 */
router.delete('/:id/favorite', authenticate, removeFromFavorites);

export default router;