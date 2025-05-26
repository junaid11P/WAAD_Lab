import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/products');
    onSearch(searchQuery);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
                        {/* Logo on the left */}
          <Link className="navbar-brand" to="/" title="Home">
            <img src="1.png" alt="Logo" width="70" height="70" className="d-inline-block align-text-top" />
          </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
             <span className="navbar-toggler-icon"></span>
        </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" to="/products">Product</Link>
        </li>
      </ul>
    </div>

            {/* Updated search bar */}
            <div className="mx-auto" style={{ width: '50%' }}>
              <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <input 
                  className="form-control me-2" 
                  type="search" 
                  placeholder="Search products..." 
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>


            {/* Profile/Login Icon on the right */}
            <ul className="navbar-nav mb-2 mb-lg-0">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile" title="Profile">
                      <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i><br />
                      <small>Profile</small>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className="nav-link" 
                      to="/" 
                      title="Logout"
                      onClick={() => {
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                        navigate('/');
                      }}
                    >
                      <i className="bi bi-box-arrow-right" style={{ fontSize: '1.5rem' }}></i><br />
                      <small>Logout</small>
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login" title="Login">
                    <i className="bi bi-person" style={{ fontSize: '1.5rem' }}></i><br />
                    <small>Login</small>
                  </Link>
                </li>
              )}
            </ul>
            {/* Cart Icon on the right */}
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/cart" title="Cart">
                  <i className="bi bi-cart4" style={{ fontSize: '1.5rem' }}></i><br />
    <small>Cart</small>
                </Link>
              </li>
            </ul>
          
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
