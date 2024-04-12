import './App.css';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import User from './components/getProduct/Product';
import Add from './components/addProduct/Add';
import AddUser from './components/registerUser/Add';
import Login from './components/loginUser/Login';
import axios from 'axios';
import FourOFour from './components/common/FourOFour';
import View from './components/addProduct/View';
import { useSelector } from 'react-redux';




const isPublicRoute = (pathname) => {
  return pathname === '/login' || pathname === '/register';
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (!isPublicRoute(config.url)) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {/*  */
    return Promise.reject(error);
  }
);

const PrivateRoute = ({ element, routeName }) => {
  const reduxStoreData = useSelector(state => state);

  console.log("routeName HERE ",routeName);
  const [resource, action] = routeName.split("-");

  // const hasPermission = reduxStoreData.permissions.some(obj => obj.hasOwnProperty(resource) && obj[resource][action]);
// Handle permission for route from here

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  console.log("reduxStoreData FROM APP", reduxStoreData.permissions);
  return (isAuthenticated ) ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element, path }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  return isAuthenticated && isPublicRoute(path) ? <Navigate to="/" /> : element;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute element={<Login />} path="/login" />} />
          <Route path="/register" element={<PublicRoute element={<AddUser />} path="/register" />} />
          <Route path="/" element={<PrivateRoute routeName={"products-read"} element={<User />} />} />
          <Route path="/add" element={<PrivateRoute routeName={"products-create"} element={<Add />} />} />
          <Route path="/edit/:id" element={<PrivateRoute routeName={"products-edit"} element={<Add />} />} />
          <Route path="/view/:id" element={<PrivateRoute routeName={"products-read"} element={<View />} />} />
          {/* Wildcard route for 404 page */}
          <Route path="*" element={<FourOFour />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
