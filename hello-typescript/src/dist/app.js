"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const mysql = require('serverless-mysql')({
    config: {
        host: 'host.docker.internal',
        database: 'ToDo',
        user: 'root',
        password: 'password',
        port: 3306
    }
});
let statusCode, body;
const lambdaHandler = async (event) => {
    const queries = JSON.stringify(event.queryStringParameters);
    let user;
    console.log(event.httpMethod, event.queryStringParameters);
    switch (event.httpMethod) {
        case 'POST':
            console.log('SE ESTÁ LLAMANDO AL CREAR');
            user = await createUser(event.body);
            break;
        case 'GET':
            console.log('SE ESTÁ LLAMANDO AL OBTENER');
            const id = event.queryStringParameters ? Number(event.queryStringParameters.id) : 0;
            user = await obtenerUser(id);
            break;
        case 'PUT':
            console.log('SE ESTÁ LLAMANDO AL ACTUALIZAR');
            actualizarUser(event.body);
            break;
        case 'DELETE':
            console.log('SE ESTÁ LLAMANDO A DELETE');
            borrarUser(1);
            break;
        default:
            statusCode = 400;
            body = `{message:'Metodo no permitido'}`;
            break;
    }
    return {
        statusCode,
        body
    };
};
exports.lambdaHandler = lambdaHandler;
const createUser = async (data) => {
    try {
        const user = {
            id: 0,
            name: data.name,
            surname: data.surname,
            age: data.age
        };
        const r = await mysql.query('INSERT INTO Users (name, surname, age) VALUES (?, ?, ?)', [user.name, user.surname, user.age]);
        user.id = r.insertId;
        statusCode = 200;
        body = `{message:'', data:{user:${JSON.stringify(user)}}}`;
        return user;
    }
    catch (err) {
        console.log(err);
        statusCode = 500;
        body = `{message:'Ha ocurrido un error al crear el usuario', data:{}}`;
    }
};
const obtenerUser = async (id) => {
    try {
        const r = await mysql.query('SELECT * FROM ToDo.Users WHERE id = ? LIMIT 0,1;', [id]);
        if (r.length > 0) {
            statusCode = 200;
            body = `{message:'', data:{user:${JSON.stringify(r[0])}}}`;
            return r[0];
        }
        else {
            statusCode = 404;
            body = `{message:'No se encontrado al usuario', data:{}}`;
        }
    }
    catch (err) {
        console.log(err);
        statusCode = 500;
        body = `{message:'Ha ocurrido un error al crear el usuario', data:{}}`;
    }
};
const actualizarUser = async (user) => {
    try {
        let r = await mysql.query('  UPDATE ToDo.Users SET name=? surname=?, age=? WHERE id=?', [user.name, user.surname, user.age, user.id]);
        console.log(r);
        statusCode = 200;
        body = `{message:'', data:{user:${JSON.stringify(r)}}}`;
        return user;
    }
    catch (err) {
        console.log(err);
        statusCode = 500;
        body = `{message:'Ha ocurrido un error al actualizar el usuario', data:{}}`;
    }
};
const borrarUser = async (id) => {
    try {
        const r = await mysql.query('DELETE FROM Users WHERE id=?', [id]);
        console.log(r);
        statusCode = 200;
        body = `{message:'', data:{user:${JSON.stringify(r)}}}`;
        return id;
    }
    catch (err) {
        console.log(err);
        statusCode = 500;
        body = `{message:'Ha ocurrido un error al eliminar el usuario', data:{}}`;
        return 0;
    }
};
