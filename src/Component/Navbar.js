import React from 'react';
import Amazon from '../image/Amazon logo.jpg';

const linkStyle = {
  color: '#ec0202',
  transition: '0.3s',
  cursor: 'pointer'
};

function Navbar() {
  return (
    <nav className="container navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid px-4">

        <a className="navbar-brand" href="#">
          <img src={Amazon} alt="Amazon" width="50" height="50" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto ms-4 gap-5">

            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = 'white')}
                onMouseOut={e => (e.target.style.color = 'black')}
              >
                Home
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = 'white')}
                onMouseOut={e => (e.target.style.color = 'black')}
              >
                About
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = 'white')}
                onMouseOut={e => (e.target.style.color = 'black')}
              >
                Contact us
              </a>
            </li>

          </ul>

          <div className="d-lg-flex">
            <button className="btn btn-primary ms-lg-auto">Order</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
