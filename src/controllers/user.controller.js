

/**
 * Returns a list of all users.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getUsers = (req, res, next) => {
    try {
        res.status(200).json({ users: [] });
    } catch (err) {
        next(err);
    }
}