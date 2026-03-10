import styles from './Searchbar.module.css';

const Searchbar = ({ value, onChange }) => {
    return (
        <div className={styles.searchbar}>
            <div className={styles.title}>
                <h1>Search Your Movies Here :D</h1>
            </div>
            <input
                className={styles.input}
                type="text"
                placeholder="Search movies..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default Searchbar;