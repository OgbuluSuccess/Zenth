const express = require('express');
const router = express.Router();
const {
  createInvestmentPlan,
  getInvestmentPlans,
  getInvestmentPlanById,
  updateInvestmentPlan,
  deleteInvestmentPlan
} = require('../controllers/investmentPlanController');

// Placeholder for authentication and admin authorization middleware
// You'll need to replace these with your actual middleware
// e.g., const { protect, authorize } = require('../middleware/authMiddleware');

// GET all active investment plans
router.route('/').get(getInvestmentPlans);

// POST a new investment plan (Admin only)
// Example of how to protect the route:
// router.route('/').post(protect, authorize(['admin', 'superadmin']), createInvestmentPlan);
// For now, I'll leave it open for easier initial testing, but SECURE THIS LATER.
router.route('/').post(createInvestmentPlan);

// Routes for specific investment plan by ID
router.route('/:id')
  .get(getInvestmentPlanById)
  .put(updateInvestmentPlan)  // TODO: Add protect, authorize(['admin', 'superadmin']) middleware
  .delete(deleteInvestmentPlan);  // TODO: Add protect, authorize(['admin', 'superadmin']) middleware

module.exports = router;
