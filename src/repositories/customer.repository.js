import { db } from '../database/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new customer in the database.
 *
 * @param {Object} data - The data for the new customer.
 * @param {string} data.cpf - The CPF of the customer.
 * @param {string} data.name - The name of the customer.
 * @throws Will throw an error if the database transaction fails.
 */

export const create = async (data) => {
    const pool = await db.getConnection();
    try {
        await pool.beginTransaction();
        const customerId = uuidv4();

        await pool.query(
            'INSERT INTO customer (id, cpf, name) VALUES (?, ?, ?)',
            [customerId, data.cpf, data.name]
        );

        if (data.contacts && data.contacts.length > 0) {
            for (const contact of data.contacts) {
                await pool.execute(
                    'INSERT INTO customer_contacts (customer_id, type, value) VALUES (?, ?, ?)',
                    [customerId, contact.type, contact.value]
                );
            }
        }

        const result = await findOne(customerId, pool);

        await pool.commit();
        return result;
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        pool.release();
    }
};

export const update = async (customerId, data) => {
    const pool = await db.getConnection();
    try {
        await pool.beginTransaction();
        
        if (data.name) {
            await pool.execute(
                'UPDATE customer SET name = ? WHERE id = ?',
                [data.name, customerId]
            );
        }
        
        if (data.contacts) {
            await pool.execute(
                'DELETE FROM customer_contacts WHERE customer_id = ?',
                [customerId]
            );
            
            for (const contact of data.contacts) {
                await pool.execute(
                    'INSERT INTO customer_contacts (customer_id, type, value) VALUES (?, ?, ?)',
                    [customerId, contact.type, contact.value]
                );
            }
        }

        const customer = await findOne(customerId, pool);
        await pool.commit();
        return customer;
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        pool.release();
    }
};

export const deleteById = async (customerId) => {
    const pool = await db.getConnection();
    try {
        await pool.beginTransaction();
        await pool.execute('DELETE FROM customer_contacts WHERE customer_id = ?', [customerId]);
        await pool.execute('DELETE FROM customer WHERE id = ?', [customerId]);
        await pool.commit();
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        pool.release();
    }
};

export const findAll = async () => {
    const pool = await db.getConnection();
    try {
        await pool.beginTransaction();
        const [customers] = await pool.execute(`
            SELECT DISTINCT
                c.id, 
                c.cpf, 
                c.name, 
                CASE 
                    WHEN count(cc.id) = 0 THEN JSON_ARRAY() 
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'type', cc.type,
                                'value', cc.value
                            )
                        ), JSON_ARRAY()
                    )
                END AS contacts
            FROM customer c
            LEFT JOIN customer_contacts cc ON c.id = cc.customer_id
            GROUP BY 
                c.id,
                c.cpf,
                c.name
        `);

        await pool.commit();
        return customers;
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        pool.release();
    }
};


export const findAllByPhoneName = async (ddd, name) => {
    const pool = await db.getConnection();
    try {
        await pool.beginTransaction();
        const [customers] = await pool.execute(`
            SELECT DISTINCT
                c.id, 
                c.cpf, 
                c.name, 
                CASE 
                    WHEN count(cc.id) = 0 THEN JSON_ARRAY() 
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'type', cc.type,
                                'value', cc.value
                            )
                        ), JSON_ARRAY()
                    )
                END AS contacts
            FROM customer c
            LEFT JOIN customer_contacts cc ON c.id = cc.customer_id 
            WHERE c.id IN (
                SELECT cu.id
                FROM customer cu
                INNER JOIN customer_contacts ccu ON cu.id = ccu.customer_id 
                WHERE ccu.type = "PHONE" AND ccu.value LIKE ?
                AND cu.name LIKE ?
            )
            GROUP BY 
                c.id,
                c.cpf,
                c.name
        `, [`${ddd}%`, `${name}%`]);

        await pool.commit();
        return customers;
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        pool.release();
    }
};

export const findAllByPhone = async (ddd) => {
    const pool = await db.getConnection();
    try {
        await pool.beginTransaction();
        const [customers] = await pool.execute(`
            SELECT DISTINCT
                c.id, 
                c.cpf, 
                c.name, 
                CASE 
                    WHEN count(cc.id) = 0 THEN JSON_ARRAY() 
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'type', cc.type,
                                'value', cc.value
                            )
                        ), JSON_ARRAY()
                    )
                END AS contacts
            FROM customer c
            INNER JOIN customer_contacts cc ON c.id = cc.customer_id 
            WHERE c.id IN (
                SELECT cu.id
                FROM customer cu
                INNER JOIN customer_contacts ccu ON cu.id = ccu.customer_id 
                WHERE ccu.type = "PHONE" AND ccu.value LIKE ?
            )
            GROUP BY 
                c.id,
                c.cpf,
                c.name
        `, [`${ddd}%`]);

        await pool.commit();
        return customers;
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        pool.release();
    }
};

export const findAllByName = async (name) => {
    const pool = await db.getConnection();
    try {
        await pool.beginTransaction();
        const [customers] = await pool.execute(`
            SELECT DISTINCT
                c.id, 
                c.cpf, 
                c.name, 
                CASE 
                    WHEN count(cc.id) = 0 THEN JSON_ARRAY() 
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'type', cc.type,
                                'value', cc.value
                            )
                        ), JSON_ARRAY()
                    )
                END AS contacts
            FROM customer c
            LEFT JOIN customer_contacts cc ON c.id = cc.customer_id
            WHERE c.name LIKE ?
            GROUP BY 
                c.id,
                c.cpf,
                c.name
        `, [`${name}%`]);

        await pool.commit();
        return customers;
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        pool.release();
    }
};

export const findOne = async (customerId, pool) => {
    if (!pool) {
        pool = await db.getConnection();
        await pool.beginTransaction();
    }
    try {
        const [customer] = await pool.execute(
            `
            SELECT 
                c.id, 
                c.cpf, 
                c.name, 
                CASE 
                    WHEN count(cc.id) = 0 THEN JSON_ARRAY() 
                    ELSE COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'type', cc.type,
                                'value', cc.value
                            )
                        ), JSON_ARRAY()
                    )
                END AS contacts
            FROM customer c
            LEFT JOIN customer_contacts cc ON c.id = cc.customer_id
            WHERE c.id = ?
            GROUP BY 
                c.id,
                c.cpf,
                c.name
            LIMIT 1`,
            [customerId]
        );
        const result = customer[0];

        await pool.commit();
        return result;
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        pool.release();
    }
};
