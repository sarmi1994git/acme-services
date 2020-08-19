const Router = require('express');
const { createApplication, getApplications, getApplicationById, updateApplication,deleteApplication } = require('../controllers/application.controller');
const router = Router();

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
