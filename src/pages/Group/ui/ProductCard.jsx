import {Link, useNavigate} from "react-router-dom"
import AppContext from "../../../features/context/AppContext"
import { useContext } from "react"
import './ProductCart.css';


export default function ProductCard({product, isAssociation}) {
    const {cart, request, updateCart} = useContext(AppContext)
    const isInCart = cart.cartItems.some(ci => ci.productId == product.id);
    const navigate = useNavigate();

    const addToCartClick = e => {
        e.preventDefault();
        console.log(product.id);
        request("/api/cart/" + product.id, {
            method: 'POST'
        }).then(() => {updateCart();})
        .catch(_ => {});
    };

    const goToCartClick = e => {
        e.preventDefault();
        navigate("/cart");
    };


    return <div className="col">
            <Link to={"/product/" + (product.slug || product.id)} className="nav-link h-100">
                <div className={"card h-100" + (isAssociation ? " association": "")}>   
                    <img src={product.imageUrl} className="card-img-top" alt={product.name}/>
                        <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                        </div>
                        <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
                            <span>₴ {product.price.toFixed(2)}</span>
                            <div data-in-cart={isInCart ? "1" : "0"}>
                                <button onClick={goToCartClick} className="in-cart btn btn-success" >
                                    <i className="bi bi-cart-check"></i>
                                </button>
                                <button onClick={addToCartClick} data-product-id={product.id} className="not-in-cart btn btn-outline-success">
                                    <i className="bi bi-cart"></i>
                                </button>
                            </div>
                        </div>
                </div>
            </Link>
        </div>
}