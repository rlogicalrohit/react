import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { storeProductCart } from '../../action';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'; // Import Elements
import StripeCheckout from 'react-stripe-checkout';


const stripePromise = loadStripe('YOUR_PUBLIC_KEY');

function Cart() {
    const reduxStoreData = useSelector(state => state);
    const dispatch = useDispatch();

    console.log("reduxStoreData.allProducts HERE", reduxStoreData.allProducts)
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0.00);
    const [product, setProduct] = useState({
        name: "React from FB",
        price: 10,
        productBy: "Facebook"
    });

    const makePayment = async token => {
        const body = {
            token,
            product
        };
        const headers = {
            "Content-Type": "application/json"
        };
        try {
            const response = await fetch("http://localhost:4000/payment", {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });
            const data = await response.json();
            console.log("Payment confirmation data:", data);
            // Handle payment success or failure
            if (data.success) {
                Swal.fire('Payment Successful!', 'Thank you for your purchase.', 'success');
                // Clear the cart after successful payment
                dispatch(storeProductCart([]));
                setProducts([]);
                setTotalPrice(0);
            } else {
                Swal.fire('Payment Failed!', data.message, 'error');
            }
        } catch (error) {
            console.error("Error making payment:", error);
            Swal.fire('Payment Error!', 'An error occurred while processing your payment.', 'error');
        }
    };

    useEffect(() => {
        console.log("useEffect");
        const cartIds = reduxStoreData.cart;
        const filteredProducts = reduxStoreData?.allProducts?.filter(product => cartIds?.includes(product._id));
        console.log("filteredProducts===>", filteredProducts);
        setProducts(filteredProducts);
        const total = filteredProducts?.reduce((acc, curr) => acc + curr.price, 0).toFixed(2) ?? 0;
        console.log("totaltotal", total)
        setTotalPrice(total);
    }, []);

    function removeFromCart(id) {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to remove this item from cart",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then(async function (result) {
            console.log("result", result.isConfirmed);
            if (result.isConfirmed) {
                console.log("removeFromCart CALLED", id);
                const filteredProducts = products.filter((product) => product._id !== id)
                setProducts(filteredProducts);
                const cartIds = reduxStoreData.cart
                const newCartIds = cartIds.filter((cartId) => cartId !== id)
                dispatch(storeProductCart(newCartIds));
                console.log(reduxStoreData.cart);
                const total = filteredProducts?.reduce((acc, curr) => acc + curr.price, 0).toFixed(2) ?? 0.00;
                console.log("totaltotal", total)
                setTotalPrice(total);
            }
        });
    }

    return (
        <>
            <Navbar currentActive="cart" />
            <div className="relative overflow-x-auto">
                <h3 className="text-3xl text-center my-5 font-bold text-gray-700">Your Cart</h3>
                {totalPrice > 0 && (
                    <>
                        <h3 className="text-1xl text-right my-5 font-bold text-red-700">Total:- Rs {totalPrice}/-</h3><br />
                        {/* Wrap StripeCheckout with Elements */}
                        <Elements stripe={stripePromise}>
                            <StripeCheckout
                                stripeKey='pk_test_51P8cMBSHJm8QTjfDmkbZFBZBPSlmNOx0sjttDMUiACUhlPl6ba1gjPTwQvY7Wnz6LwFktdcKCkBnWHZccByJqVBb00D4yO45lX'
                                token={makePayment}
                                name='My Store'
                                amount={totalPrice * 100}
                            />
                        </Elements>
                    </>
                )}
                {products?.length > 0 ? (
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
                            {products.map((product, index) => {
                                return (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product._id}>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"><img className="h-20 w-20" src={product.image ? `http://localhost:4000/storage/${product.image}` : `http://localhost:4000/storage/default.png`} alt="product" /></td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.name}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.price}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.brand}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.category}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.itemWeight}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <button onClick={() => removeFromCart(product._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">X</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                ) : (
                    <h1 className="text-3xl text-center my-5 font-bold text-gray-700">No Products Added To Cart</h1>
                )}
            </div>
        </>
    );
}

export default Cart;
