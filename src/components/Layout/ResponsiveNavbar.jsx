const Navbar = () => {
    const sections = [
        { name: 'Home', icon: 'home' },
        { name: 'Movies', icon: 'movie' },
        { name: 'TV Shows', icon: 'tv' },
        { name: 'Search', icon: 'search' },
        { name: 'Favorites', icon: 'star' }
    ];

    return (
        <nav className="sidebar-container">
            <div className="logo">
                <h2>MoviesApp</h2>
            </div>
            <ul className="sidebar-list">
                {sections.map((section) => (
                    <li key={section.name} className="sidebar-item">
                        <span className="icon">{section.icon}</span>
                        <span className="name">{section.name}</span>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;