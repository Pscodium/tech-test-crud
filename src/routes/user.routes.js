import { Router } from "express"
import { getUsers } from '../controllers/user.controller.js'

const router = Router()
router.use('/user', defineRoutes(router));

/**
 * Initialize the user routes
 *
 * @param {import('express').Router} router
 */
function defineRoutes(router) {
    router.get('/', getUsers);

    return router;
}

export default router;