import { db } from '../database/index.js';
import { v4 as uuidv4 } from 'uuid';
import { ConflictError, NotFoundError } from '../utils/errors.js';


/**
 * 
 * @param {string} customerId
 * @param {object} connection
 * @returns {Promise<boolean>}
 */
export const customerExists = async (customerId, connection) => {
    const pool = connection || await db.getConnection();
    try {
        const [rows] = await pool.execute(
            'SELECT 1 FROM customer WHERE id = ? LIMIT 1',
            [customerId]
        );
        return rows.length > 0;
    } finally {
        if (!connection) pool.release();
    }
};

/**
 * 
 * @param {string} cpf
 * @param {object} connection
 * @returns {Promise<boolean>}
 */
export const cpfExists = async (cpf, connection) => {
    const pool = connection || await db.getConnection();
    try {
        const [rows] = await pool.execute(
            'SELECT 1 FROM customer WHERE cpf = ? LIMIT 1',
            [cpf]
        );
        return rows.length > 0;
    } finally {
        if (!connection) pool.release();
    }
};

/**
 *
 * @param {Object} data
 * @param {string} data.cpf
 * @param {string} data.name
 * @throws {ConflictError}
 * @returns {Promise<Object>}
 */
export const create = async (data) => {
    const pool = await db.getConnection();
    try {
        await pool.beginTransaction();
        
        const cpfAlreadyExists = await cpfExists(data.cpf, pool);
        if (cpfAlreadyExists) {
            throw new ConflictError(`Customer with CPF ${data.cpf} already exists`);
        }
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
        
        const exists = await customerExists(customerId, pool);
        if (!exists) {
            throw new NotFoundError('Customer', customerId);
        }

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
        const exists = await customerExists(customerId, pool);
        if (!exists) {
            throw new NotFoundError('Customer', customerId);
        }

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

export const findOne = async (customerId, connection) => {
    const pool = connection || await db.getConnection();
    let needToRelease = !connection;
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

        if (customer.length === 0) {
            throw new NotFoundError('Customer', customerId);
        }

        await pool.commit();
        return customer[0];
    } catch (err) {
        await pool.rollback();
        throw err;
    } finally {
        if (needToRelease) pool.release();
    }
};
