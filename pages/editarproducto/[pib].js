import React from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!){
        obtenerProducto(id: $id){
            id
            nombre
            existencias
            precio
        }
    }

`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput){
        actualizarProducto(id: $id, input: $input){
            id
            nombre
            existencias
            precio
        }
    }

`;

const EditarProducto = () => {
    
    // obtener el ID actual
    const router = useRouter();
    const { query: { id } } = router;
    // console.log(id);

    // Consultar para obtener producto
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    // console.log(data);

    // Actualizar producto
    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO);

    // Schema de validación
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                    .required('El nombre del producto es obligatorio'),
        existencias: Yup.number()
                        .required('Agrega la cantidad disponible')
                        .positive('No se aceptan números negativos')
                        .integer('Las existencias deben ser números enteros'),
        precio: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('No se aceptan números negativos')
    });

    if(loading) return 'Cargando...';

    if(!data) {
        return 'Acción no permitida';
    }

    const { obtenerProducto } = data;

    // Modifica el producto en la BBDD
    const actulizarInfoProducto = async valores => {
        const { nombre, existencias, precio } = valores;

        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre, 
                        existencias, 
                        precio
                    }
                }
            });

            // console.log(data);

            // Mostrar alerta
            Swal.fire(
                'Actualizado',
                'El producto se actualizó correctamente',
                'success'
            )

            // Redireccionar
            router.push('/productos');

        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerProducto }
                        onSubmit={ (valores) => {
                            actulizarInfoProducto(valores);
                        }}
                    >
                        {props => {
                            // console.log(props);

                            return (
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 ,b-4"
                                onSubmit={props.handleSubmit}
                            >
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                    </label>
                                    <input 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="nombre"
                                        type="text"
                                        placeholder="Nombre Producto"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.nombre}
                                    />
                                </div>
        
                                {props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                ): null}
        
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencias">
                                    Cantidad Disponible
                                    </label>
                                    <input 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="existencias"
                                        type="number"
                                        placeholder="Cantidad Disponible"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.existencias}
                                    />
                                </div>   
        
                                {props.touched.existencias && props.errors.existencias ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.existencias}</p>
                                        </div>
                                ): null}
        
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio
                                    </label>
                                    <input 
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="precio"
                                        type="number"
                                        placeholder="Precio Producto"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.precio}
                                    />
                                </div>  
        
                                {props.touched.precio && props.errors.precio ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                ): null}
         
                                <input
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                    value="Editar Producto"
                                />               
                            </form>
                            );
                        }}

                        
                    </Formik>
                </div>
            </div>

        </Layout>
    );
}

export default EditarProducto;