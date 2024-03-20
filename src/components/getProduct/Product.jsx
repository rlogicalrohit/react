import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../common/Navbar";
import Swal from "sweetalert2";
import { useDispatch } from 'react-redux';
import { storeFetchedData } from '../../action';
import { useSelector } from 'react-redux';

const User = () => {
    const dispatch = useDispatch();
    const [products, setUsers] = useState([]);
    const navigate = useNavigate();
    const reduxStoreData = useSelector(state => state);
    console.log("its a data", reduxStoreData);

    async function deleteUser(id) {

        console.log("deleteUser CALLED", id);
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Okay"
        }).then(async function (result) {
            console.log("result", result.isConfirmed);
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:4000/api/delete/${id}`).then((response) => {
                        console.log("AFTER DELETE RESPONSE ", response);
                        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

                        const allProducts = reduxStoreData.allProducts
                        const filteredProducts = allProducts.filter((product) => product._id !== id)
                        dispatch(storeFetchedData(filteredProducts));
                        // dispatch(setFetchedDataLength(filteredProducts.length));
                        // dispatch(storeFetchedData(response.data));
                        toast.success("Product Deleted Successfully", { position: "top-right" })
                    }).catch((error) => {
                        toast.error((error.response.data?.message || error.response.data), { position: "top-right" })
                        if (error.response.data?.message === "Invalid token") {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }
                    })
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
    useEffect(() => {
        console.log("useEffect");
        const fetchData = async () => {
            try {

                const response = await axios.get("http://localhost:4000/api/fetchAll");
                console.log("response===>", response);
                // dispatch(setFetchedDataLength(response.data.length));
                dispatch(storeFetchedData(response.data));
                console.log("reduxStoreData.allProducts===>", reduxStoreData.allProducts);
                setUsers(response.data);

            } catch (error) {
                console.error(error);
                toast.error((error.response.data?.message || error.response.data), { position: "top-right" })
                if (error.response.data?.message === "Invalid token") {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                navigate("/");

            }
        }

        if (!reduxStoreData?.allProducts?.length) {
            console.log(" FUNCTIon    callled");
            fetchData();
        }
        else if (reduxStoreData?.allProducts?.length) {
            setUsers(reduxStoreData?.allProducts);
        }
    }, [dispatch, navigate]);

    return <><Navbar currentActive="products" /><div className="relative overflow-x-auto">
        <h3 className="text-3xl text-center my-5 font-bold text-gray-700">Products</h3>

        <button type="button" className="m-2 text-white text-xs font-medium bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5"><Link to={"/add"}>Add Product</Link></button>

        <br />
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th className="px-6 py-3">S.No</th>
                    <th className="px-6 py-3"> Image</th>
                    <th className="px-6 py-3"> Name</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Brand</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Item Weight (gms)</th>
                    <th className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {

                    products.map((product, index) => {
                        return (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product._id}>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"><img src={"http://localhost:4000/storage/" + product.image} alt="ProductImage" height={100} width={100} /></td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.name}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.price}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.brand}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.category}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.itemWeight}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><Link to={`/edit/` + product._id}>Edit</Link></button>
                                    <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => deleteUser(product._id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })

                }
            </tbody>
        </table>
    </div></>;
};

export default User;