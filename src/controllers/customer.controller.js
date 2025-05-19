import * as customerRepository from '../repositories/customer.repository.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const create = async (req, res, next) => {
    try {
        const { cpf, name, contacts } = req.body;

        const formattedCpf = String(cpf).replace(/\D/g, '');

        const customer = await customerRepository.create({ cpf: formattedCpf, name, contacts });

        res.status(201).json({
            status: 'success',
            data: customer
        });
    } catch (err) {
        next(err);
    }
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const findAll = async (req, res, next) => {
    try {
        const { ddd, name } = req.query;
        let customers;

        if (ddd && name) {
            customers = await customerRepository.findAllByPhoneName(ddd, name);
        } else if (ddd) {
            customers = await customerRepository.findAllByPhone(ddd);
        } else if (name) {
            customers = await customerRepository.findAllByName(name);
        } else {
            customers = await customerRepository.findAll();
        }

        res.status(200).json({
            status: 'success',
            results: customers.length,
            data: customers
        });
    } catch (err) {
        next(err);
    }
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const findOne = async (req, res, next) => {
    try {
        const { id } = req.params;

        const customer = await customerRepository.findOne(id);

        res.status(200).json({
            status: 'success',
            data: customer
        });
    } catch (err) {
        next(err);
    }
};


/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, contacts } = req.body;

        const customer = await customerRepository.update(id, { name, contacts });

        res.status(200).json({
            status: 'success',
            data: customer
        });
    } catch (err) {
        next(err);
    }
};


/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        await customerRepository.deleteById(id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};