export default {
    openapi: '3.0.0',
    info: {
        title: 'Customer API',
        version: '1.0.0',
        description: 'API for customer management'
    },
    servers: [
        {
            url: '/api',
            description: 'API base URL'
        }
    ],
    tags: [
        {
            name: 'Customers',
            description: 'Customer management endpoints'
        }
    ],
    paths: {
        '/customers/create': {
            post: {
                tags: ['Customers'],
                summary: 'Create a new customer',
                description: 'Create a new customer with contacts',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CustomerInput'
                            },
                            example: {
                                cpf: '12345678901',
                                name: 'teste',
                                contacts: [
                                    {
                                        type: 'PHONE',
                                        value: '47912345678'
                                    },
                                    {
                                        type: 'EMAIL',
                                        value: 'test@example.com'
                                    }
                                ]
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Customer created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'success'
                                        },
                                        data: {
                                            $ref: '#/components/schemas/Customer'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    },
                    409: {
                        description: 'Customer already exists',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/customers': {
            get: {
                tags: ['Customers'],
                summary: 'Get all customers',
                description: 'Retrieve all customers, with optional filtering by DDD or name',
                parameters: [
                    {
                        in: 'query',
                        name: 'ddd',
                        schema: {
                            type: 'string'
                        },
                        description: 'Filter customers by phone DDD'
                    },
                    {
                        in: 'query',
                        name: 'name',
                        schema: {
                            type: 'string'
                        },
                        description: 'Filter customers by partial name match'
                    }
                ],
                responses: {
                    200: {
                        description: 'A list of customers',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'success'
                                        },
                                        results: {
                                            type: 'integer',
                                            example: 2
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Customer'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/customers/get/{id}': {
            get: {
                tags: ['Customers'],
                summary: 'Get a customer by ID',
                description: 'Retrieve a single customer by their ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        },
                        description: 'Customer ID'
                    }
                ],
                responses: {
                    200: {
                        description: 'Customer found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'success'
                                        },
                                        data: {
                                            $ref: '#/components/schemas/Customer'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Customer not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/customers/update/{id}': {
            put: {
                tags: ['Customers'],
                summary: 'Update a customer',
                description: 'Update a customer\'s details by ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        },
                        description: 'Customer ID'
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CustomerUpdateInput'
                            },
                            example: {
                                name: 'teste',
                                contacts: [
                                    {
                                        type: 'PHONE',
                                        value: '49987654321'
                                    },
                                    {
                                        type: 'EMAIL',
                                        value: 'test.updated@example.com'
                                    }
                                ]
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Customer updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'success'
                                        },
                                        data: {
                                            $ref: '#/components/schemas/Customer'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Customer not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/customers/delete/{id}': {
            delete: {
                tags: ['Customers'],
                summary: 'Delete a customer',
                description: 'Delete a customer by ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        },
                        description: 'Customer ID'
                    }
                ],
                responses: {
                    204: {
                        description: 'Customer deleted successfully'
                    },
                    404: {
                        description: 'Customer not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            CustomerInput: {
                type: 'object',
                required: ['cpf', 'name'],
                properties: {
                    cpf: {
                        type: 'string',
                        description: 'Customer CPF (Brazilian ID)',
                        example: '12345678901'
                    },
                    name: {
                        type: 'string',
                        description: 'Customer name',
                        example: 'Teste Atualizado'
                    },
                    contacts: {
                        type: 'array',
                        description: 'Customer contacts',
                        items: {
                            $ref: '#/components/schemas/Contact'
                        }
                    }
                }
            },
            CustomerUpdateInput: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'Customer name',
                        example: 'Teste da Silva'
                    },
                    contacts: {
                        type: 'array',
                        description: 'Customer contacts',
                        items: {
                            $ref: '#/components/schemas/Contact'
                        }
                    }
                }
            },
            Customer: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                        description: 'Customer ID',
                        example: '123e4567-e89b-12d3-a456-426614174000'
                    },
                    cpf: {
                        type: 'string',
                        description: 'Customer CPF (Brazilian ID)',
                        example: '12345678901'
                    },
                    name: {
                        type: 'string',
                        description: 'Customer name',
                        example: 'Teste da Silva'
                    },
                    contacts: {
                        type: 'array',
                        description: 'Customer contacts',
                        items: {
                            $ref: '#/components/schemas/Contact'
                        }
                    }
                }
            },
            Contact: {
                type: 'object',
                required: ['type', 'value'],
                properties: {
                    type: {
                        type: 'string',
                        enum: ['PHONE', 'EMAIL'],
                        description: 'Contact type',
                        example: 'PHONE'
                    },
                    value: {
                        type: 'string',
                        description: 'Contact value',
                        example: '47912345678'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'error'
                    },
                    message: {
                        type: 'string',
                        example: 'Error message'
                    },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        example: ['Error 1', 'Error 2']
                    }
                }
            }
        }
    }
};