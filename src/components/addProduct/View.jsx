import React, { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";



const View = () => {

    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const reduxStoreData = useSelector(state => state.allProducts);
    const { id } = useParams();


    useEffect(() => {
        const product = reduxStoreData.find((product) => product._id === id);
        setProduct(product);
        console.log("product", product);
    })

    return (<><Navbar currentActive="view" /><div className="relative overflow-x-auto">
        <section className="bg-white dark:bg-gray-800">
            <h3 className="text-3xl text-center my-5 font-bold text-gray-700 dark:text-white">View Product</h3>
            <hr />
            <div className="container px-6 py-4 mx-auto lg:px-8 dark:text-white">
                <div className="row-4 mb-8 text-right"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate(-1)}>Back</button></div>
                <div className="row-4 mb-8 text-center ml-96"><img className="h-72 w-96" src={product.image ? `http://localhost:4000/storage/${product.image}` : `http://localhost:4000/storage/default.png`}></img></div>
                <div className="row-4 mb-8 text-center">Product Name:- <strong>{product.name}</strong></div>
                <div className="row-4 mb-8 text-center">Product category:- <strong>{product.category}</strong></div>
                <div className="row-4 mb-8 text-center">Product Weight:- <strong>{product.itemWeight} (grams)</strong></div>
                <div className="row-4 mb-8 text-center">Product Color:- <strong>{product.color}</strong></div>
                <div className="row-4 mb-8 text-center">Product description:- <strong>{product.description}</strong></div>
                <div className="row-4 mb-8 text-center">Product price:- <strong>₹ {product.price}/-</strong></div>

            </div>
        </section>
    </div></>)
}
export default View