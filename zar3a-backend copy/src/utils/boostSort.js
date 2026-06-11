/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BOOST SORTING UTILITY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ensures boosted products ALWAYS appear at the top across all endpoints.
 * This utility provides consistent sorting that respects boost expiry dates.
 */

import { literal } from 'sequelize';

/**
 * SQL ORDER clause for boost-aware sorting
 * 
 * Sorts by:
 * 1. Active boosted status (boosted products with valid expiry go first)
 * 2. Creation date (newest first)
 * 
 * Usage:
 *   const products = await Product.findAll({
 *     ...options,
 *     order: getBoostSortOrder()
 *   });
 */
export const getBoostSortOrder = () => {
  return [
    // Boosted products float to top (isBoosted = 1 AND expiry is null or in future)
    [
      literal(
        'CASE WHEN isBoosted = 1 AND (boostExpiryDate IS NULL OR boostExpiryDate > NOW()) THEN 0 ELSE 1 END'
      ),
      'ASC',
    ],
    // Then sort by creation date (newest first)
    ['createdAt', 'DESC'],
  ];
};

/**
 * Alternative sort with boost level priority
 * Use if you implement a boostLevel field
 * 
 * Sorts by:
 * 1. Active boost status
 * 2. Boost level (higher boost gets higher priority)
 * 3. Boost expiry date (sooner expiry shows first to prioritize)
 * 4. Creation date (newest first)
 */
export const getBoostSortOrderWithLevel = () => {
  return [
    // Active boosted status
    [
      literal(
        'CASE WHEN isBoosted = 1 AND (boostExpiryDate IS NULL OR boostExpiryDate > NOW()) THEN 0 ELSE 1 END'
      ),
      'ASC',
    ],
    // Boost level (if implemented, defaults to 0)
    ['boostLevel', 'DESC'],
    // Boost expiry (sooner expiry first)
    [literal('IF(boostExpiryDate IS NULL, "9999-12-31", boostExpiryDate)'), 'ASC'],
    // Creation date
    ['createdAt', 'DESC'],
  ];
};

/**
 * Alternative sort for specific marketplace
 * Adds marketplace type as secondary sort
 */
export const getBoostSortOrderByMarketplace = (marketplaceType) => {
  return [
    // Active boosted status
    [
      literal(
        'CASE WHEN isBoosted = 1 AND (boostExpiryDate IS NULL OR boostExpiryDate > NOW()) THEN 0 ELSE 1 END'
      ),
      'ASC',
    ],
    // Marketplace type (optional, keeps related items together)
    ...(marketplaceType ? [['marketplaceType', 'ASC']] : []),
    // Creation date
    ['createdAt', 'DESC'],
  ];
};

export default { getBoostSortOrder, getBoostSortOrderWithLevel, getBoostSortOrderByMarketplace };
