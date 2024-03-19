import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { storeFetchedData } from "../../action";

const Add = () => {
  const { id } = useParams()
  const reduxStoreData = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [products, setProducts] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    itemWeight: "",
    description: "",
    color: [],
  });
  const [file, setFile] = useState(null);
  const [fields, setMoreFields] = useState(0);
  const [fieldsValue, setFieldsValue] = useState([]);

  console.log("location====>>", location);
  const handleFileChange = (event) => {
    console.log("event.targetvevent.targetevent.targetevent.targetevent.target", event.target.files);
    setFile(event.target.files[0]); // Update file state
  };

  useEffect(() => {
    console.log("useEffect");
    setCategoryOptions(["Electronics", "Clothing", "Accessories", "Books"]); // Populate categoryOptions with your actual options
    setColorOptions(["Red", "Blue", "Green", "Yellow"]); // Populate colorOptions with your actual options

    const fetchDataById = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/fetch/${id}`);
        if (response.data.length === 0) {
          toast.error(("No data Found"), { position: "top-right" })
          navigate("/");
        }
        const productDetails = response.data.map((productData) => {
          console.log("productData1111111111111111111111111111", productData);
          const colorValues = productData.color.map(item => item.split(','))
          const data = {
            _id: productData._id,
            name: productData.name,
            price: productData.price,
            brand: productData.brand,
            category: productData.category,
            itemWeight: productData.itemWeight,
            description: productData.description,
            color: colorValues[0]
          }
          return data;
        })
        setProducts(productDetails[0]);
        formik.setValues(productDetails[0]);
      } catch (err) {
        console.log("its an error ", err);
        toast.error((err.response.data?.message || err.response.data), { position: "top-right" })
        if (err.response.data?.message === "Invalid token") {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }

    }
    if (id && location.pathname === `/edit/${id}`) fetchDataById();
  }, []);

  const formik = useFormik({

    initialValues: {
      name: "",
      price: "",
      brand: "",
      category: "",
      itemWeight: "",
      description: "",
      color: [],
    },

    validationSchema: Yup.object().shape({
      name: Yup.string().trim().required("Please enter a product name"),
      price: Yup.number().required("Please enter a product price"),
      brand: Yup.string().trim().required("Please enter a product brand"),
      category: Yup.string().trim().required("Please select a product category"),
      itemWeight: Yup.string().trim().required("Please enter a product item weight"),
      description: Yup.string().trim().required("Please enter a product description"),
      color: Yup.array(),
    }),
    onSubmit: async (values) => {

      const formData = new FormData();
      if (file) {
        formData.append("image", file);
        console.log("formData here", formData);
      }
      Object.keys(values).forEach((key) => {
        console.log("key", key, values[key]);
        formData.append(key, values[key]);
      });

      if (id && location.pathname === `/edit/${id}`) {
        try {
          await axios.put(`http://localhost:4000/api/update/${id}`, formData);
          console.log("updateDetails===>", reduxStoreData);
          const allProducts = reduxStoreData.allProducts
          const updatedData = allProducts.map(obj => {
            if (obj._id === id) {
              return { ...obj, ...values };
            } else {
              return obj;
            }
          });
          console.log("updatedData===========>", updatedData);
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
          navigate("/");
        }
      }
      console.log("VALUES OF formData=============>s", formData);
      if (!id && location.pathname === `/add`) {
        try {
          const res = await axios.post("http://localhost:4000/api/create", formData);
          const allProducts = reduxStoreData.allProducts;
          if (allProducts && allProducts.length > 0) {
            allProducts.push(res.data);
          }
          dispatch(storeFetchedData(allProducts));
          console.log("allProducts", allProducts);
          toast.success("Product created successfully", { position: "top-right" });
          navigate("/");
        } catch (err) {
          console.log("err", err);
          toast.error(err.response?.data?.message || err.response?.data, {
            position: "top-right",
          });
          if (err.response?.data?.message === "Invalid token") {
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      }
    },

  });

  console.log("formikformik", formik);
  const handleAddField = () => {
    setMoreFields(prev => prev + 1);
    console.log("handleAddField CALLKED", fields);
  }
  const handleDynamicFieldChange = (event, index) => {
    const { name, value } = event.target;
    console.log(" name, value name, value ", { name, value, index });
    const updatedFields = [...fieldsValue];
    updatedFields[index] = value;
    setFieldsValue(updatedFields);
    console.log("updatedFields", fieldsValue);
  }
  return (
    <>
      <Navbar currentActive={location.pathname === `/edit/${id}` ? "Updateproduct" : "Addproduct"} />
      <section className="bg-white dark:bg-gray-800">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            {location.pathname === `/edit/${id}` ? "Update Product" : "Add Product"}
          </h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 mt-2 text-sm">{formik.errors.name}</p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  onChange={formik.handleChange}
                  value={formik.values.brand}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product brand"

                />
                {formik.touched.brand && formik.errors.brand && (
                  <p className="text-red-500 mt-2 text-sm">{formik.errors.brand}</p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product brand"

                />
                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-500 mt-2 text-sm">{formik.errors.price}</p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  onChange={formik.handleChange}
                  value={formik.values.category}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((category, index) => (
                    <option key={index} value={category} defaultValue={formik.values.category === category}>
                      {category}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 mt-2 text-sm">{formik.errors.category}</p>
                )}
              </div>

              {/* ----------------------------------------------------------------- */}


              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Color
                </label>

                {colorOptions.map((color, index) => (
                  <label key={index}
                    htmlFor={`color-${index}`}
                    className="m-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {formik.values.color.includes(color.toString()) ? <span className="bg-zinc-950">{color}</span> : color}
                    <input type="checkbox" id={`color-${index}`} name="color" checked={formik.values.color.includes(color.toString())} onChange={formik.handleChange} value={color} key={index} />
                  </label>
                ))}

                {formik.touched.color && formik.errors.color && (
                  <p className="text-red-500 mt-2 text-sm">{formik.errors.color}</p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Item-weight (gms)
                </label>
                <input
                  type="text"
                  id="itemWeight"
                  name="itemWeight"
                  onChange={formik.handleChange}
                  value={formik.values.itemWeight}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product brand"

                />
                {formik.touched.itemWeight && formik.errors.itemWeight && (
                  <p className="text-red-500 mt-2 text-sm">{formik.errors.itemWeight}</p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product brand"

                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 mt-2 text-sm">{formik.errors.description}</p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"

                />
                {formik.touched.image && formik.errors.image && (
                  <p className="text-red-500 mt-2 text-sm">{formik.errors.image}</p>
                )}
              </div>


              <div className="w-full">
                <button className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 bg-blue-500" type="button" onClick={handleAddField}>Add Field</button>

                {[...Array(fields)].map((_, index) => (
                  <input key={index} className="m-2" type="text" name={`field-${index}`} onChange={(e) => handleDynamicFieldChange(e, index)} placeholder={`Field ${index + 1}`} />
                ))}
              </div>


              {/* Repeat for other fields */}
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 bg-green-500"
            >
              {location.pathname === `/edit/${id}` ? "Update Product" : "Add Product"}
            </button>
            <Link to="/">
              <button
                type="button"
                className="ml-5 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 bg-cyan-300"
              >
                Back
              </button>
            </Link>
          </form>
        </div>
      </section>
    </>
  );
};

export default Add;
