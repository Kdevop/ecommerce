import react from 'react';
import Footer from '../../components/footer/footer';
import ProductCard from '../../components/cards/productCards';
import products from '../../mockdata/product';

function Home() {
    return (
        <div>
            <div>
                <p>This is the home page</p>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Home;