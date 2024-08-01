import react from 'react';
import Styles from '../cards/productCards.module.css';
import { NavLink } from 'react-router-dom';



function ProductCard(props) {
    return (
        <div className={Styles.productcontainer}> 
            <div className={Styles.imagecontainer}>
            <img src={`/photos/${props.imageName}.jpg`} alt={`Image of ${props.name}`} width={300} height={300}/>
            </div>
            <div className={Styles.name}>
                <h3>{props.name}</h3>
            </div>
            <div className={Styles.detailscontainer}>
                <div className={Styles.moredeetsbtn}>
                    <NavLink to='/'> More Details</NavLink>
                </div>
                <div className={Styles.price}>
                    <h4>{`${props.price}`}</h4>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

{/* <div> */}

{/* {products.map((products) => {
    return (
        <div className={Styles.productcontainer}>
            <ProductCard
            key={products.data.id}
            name={products.data.name}
            description={products.data.description}
            category={products.data.category_id}
            price={products.data.price}
            imageName={products.data.image_url}
            className={Styles.productCard}
            />
        </div>
    )
})
}
<div>
    <Footer />
</div>
</div> */}