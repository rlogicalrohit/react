import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";
import Navbar from "../common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { storeFetchedData } from "../../action";


const Edit = () => {

    const { id } = useParams()
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    console.log("id===> UPDATE", id);
    const reduxStoreData = useSelector(state => state);
    const dispatch = useDispatch();

    const products = {
        name: "",
        price: "",
        brand:"",
        category:"",
        itemWeight:"",
        description:""
    }
    const [product, setProducts] = useState(products);

    const inputHandler = (e) => {
        const { name, value } = e.target;
        // console.log("name",name);
        // console.log("value",value);
        setProducts({ ...product, [name]: value })
        console.log("users", product);
        setErrors({ ...errors, [name]: "" })
    }

    useEffect(() => {
        console.log("useEffect");
        const fetchDataById = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/fetch/${id}`);
                const productDetails = response.data.map((productData)=>{
                     const data = {_id:productData._id,
                     name:productData.name,
                     price:productData.price,
                     brand:productData.brand,
                     category:productData.category,
                     itemWeight:productData.itemWeight,
                     description:productData.description
                    }
                     return data;
                })
                setProducts(productDetails[0]);
            } catch (err) {
                toast.error((err.response.data?.message || err.response.data), { position: "top-right" })
                if (err.response.data?.message === "Invalid token") {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }

        }

        fetchDataById();
    }, []);
    const validateForm = () => {
        console.log("validate form called",product);
        const newErrors = {};
        // Validation logic htmlFor each field
        if (product.name.trim() === "") {
          newErrors.name = "Please enter a product name";
        } 
        if (product.price.toString().trim() === "") {
            newErrors.price = "Please enter a product price";
          }
        if (product.brand.trim() === "") {
            newErrors.brand = "Please enter a product brand";
        }
        if (product.category.trim() === "") {
            newErrors.category = "Please select a product category";
        }
        if (product.itemWeight.trim() === "") {
            newErrors.itemWeight = "Please enter a product itemWeight";
        }
        if (product.description.trim() === "") {
            newErrors.description = "Please enter a product description";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    
      }
    const updateSubmitForm = async (e) => {
        // e.preventDefaut();
        e.preventDefault();
        if (!validateForm()) return;
        console.log("updates SUCCESS", product);
        try {
            const updateDetails = await axios.put(`http://localhost:4000/api/update/${id}`, product);
            console.log("updateDetails===>", updateDetails);
            const allProducts = reduxStoreData.allProducts
            const updatedData = allProducts.map(obj => {
                if (obj._id === id) {
                    return { ...obj, ...product };
                } else {
                    return obj;
                }
            });
            console.log("updatedData===========>",updatedData);
            dispatch(storeFetchedData(updatedData));
            navigate("/")
            toast.success("Product Updated Successfully", { position: "top-right" });

        } catch (err) {
            console.error("Error On Update", err);
            toast.error((err.response.data?.message || err.response.data), { position: "top-right" })
            if (err.response.data?.message === "Invalid token") {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    }
    return (
        <><Navbar/><section className="bg-white dark:bg-gray-800">
  <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update product</h2>
      <form  onSubmit={updateSubmitForm}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                  <input type="text" value={product.name} onChange={inputHandler} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required=""/>
                {errors.name && <p className="text-red-500 mt-2 text-sm">{errors.name}</p>}
              </div>
              <div className="w-full">
                  <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
                  <input type="text" value={product.brand} onChange={inputHandler} name="brand" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Product brand" required=""/>
                {errors.brand && <p className="text-red-500 mt-2 text-sm">{errors.brand}</p>}
              </div>
              <div className="w-full">
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                  <input type="number" value={product.price}  onChange={inputHandler} name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required=""/>
              {errors.price && <p className="text-red-500 mt-2 text-sm">{errors.price}</p>}
              </div>
              <div className="w-full">
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                  <input type="text" value={product.category}  onChange={inputHandler} name="category" id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Electronics" required=""/>
                {errors.category && <p className="text-red-500 mt-2 text-sm">{errors.category}</p>}
              </div>
              <div>
                  <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (gms)</label>
                  <input type="number"  value={product.itemWeight} onChange={inputHandler}  name="itemWeight" id="item-weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="12" required=""/>
              {errors.itemWeight && <p className="text-red-500 mt-2 text-sm">{errors.itemWeight}</p>}
              </div> 
              <div className="sm:col-span-2">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                  <textarea name="description" value={product.description} onChange={inputHandler} id="description" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here"></textarea>
             {errors.description && <p className="text-red-500 mt-2 text-sm">{errors.description}</p>}
              </div>
          </div>
          <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center  bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 bg-orange-300">
              Update product
          </button>
          <Link to="/"><button type="submit" className="ml-5 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center  bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 bg-cyan-300">
              Back
          </button></Link>
      </form>
  </div>
</section></>
        )
}

export default Edit;