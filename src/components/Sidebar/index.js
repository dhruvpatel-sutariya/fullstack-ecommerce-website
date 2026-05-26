import { FaTimes } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ categories, activeCategory, onSelect, isOpen, onClose }) => (
    <aside className={`sidebar-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-head">
            <h4>Filters</h4>
            <button onClick={onClose}><FaTimes /></button>
        </div>
        <div className="sidebar-section">
            <h5>Category</h5>
            <ul>
                <li
                    className={!activeCategory ? 'active' : ''}
                    onClick={() => onSelect('')}
                >
                    All
                </li>
                {categories.map(c => (
                    <li
                        key={c}
                        className={activeCategory === c ? 'active' : ''}
                        onClick={() => onSelect(c)}
                    >
                        {c}
                    </li>
                ))}
            </ul>
        </div>
    </aside>
);

export default Sidebar;
