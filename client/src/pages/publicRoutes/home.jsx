import react from 'react';
import Footer from '../../components/footer/footer';
import ProductCard from '../../components/cards/productCards';
import Styles from '../publicRoutes/home.module.css'
import products from '../../mockData/products.json';



function Home() {
    return (
        <div>
            <div className={Styles.home}>
                <div className={Styles.productcontainer}>
                    {products[0].data.map((product) => {
                        return (

                            <ProductCard
                                key={product.id}
                                name={product.name}
                                description={product.description}
                                category={product.category_id}
                                price={product.price}
                                imageName={product.image_url}
                                className={Styles.productCard}
                            />
                        )})
                    }
                </div>

            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Home;