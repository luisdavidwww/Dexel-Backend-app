const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');



const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
}

//Buscar Usuario
const usuarioGet = async (req, res = response) => {
    const { id } = req.params;

    const user = await Usuario.findById(id).populate('usuario', 'nombre');
    res.json(user);
  };




//crearUsuario
const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, rol, nombreReal, apellido, descripcion, fechaNac } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol, nombreReal, apellido, descripcion, fechaNac });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    });
}



//Actualizar Usuario Global
const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}


//Actualizar Nombre Real
const usuariosPutnombreRel = async(req, res = response) => {

    const { id } = req.params;
    const { _id, nombreReal } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, nombreReal );

    res.json(usuario);
}



//Actualizar Apellido
const usuariosPutApellido = async(req, res = response) => {

    const { id } = req.params;
    const { _id, apellido } = req.body;

    const usuario = await Usuario.findByIdAndUpdate( id, apellido );

    res.json(usuario);
}


//Actualizar Contraseña
const usuariosPutContraseña = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password } = req.body;

    const usuario = await Usuario.findByIdAndUpdate( id, password );

    res.json(usuario);
}





const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuarioGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    usuariosPutnombreRel,
    usuariosPutApellido
}