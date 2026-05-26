import { Link } from 'react-router-dom';
import './notfound.css';

const NotFound = () => (
    <div className="notfound-page">
        <div className="container">
            <h2>404</h2>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="home-link">Back to Home</Link>
        </div>
    </div>
);

export default NotFound;
