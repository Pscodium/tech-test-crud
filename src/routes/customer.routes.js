import { Router } from "express";
import { create, findAll, findOne, update, deleteById } from '../controllers/customer.controller.js';

const router = Router();
router.use('/customers', defineRoutes(router));

/**
 * Initialize the customer routes
 *
 * @param {import('express').Router} router
 */
function defineRoutes(router) {
    router.post('/create', create);
    router.get('/', findAll);
    router.get('/get/:id', findOne);
    router.put('/update/:id', update);
    router.delete('/delete/:id', deleteById);

    return router;
}

export default router;