import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import './ui/Cart.css'
import { Link } from "react-router-dom";

export default function Cart() {
    const {cart} = useContext(AppContext);

     const isEmpty = cart.cartItems.length == 0;

    return<>
        <div className="row mb-3">
            <div className="col col-11 text-center"><b className="display-5">Моя корзина</b></div>
            
            {!isEmpty && <div className="col col-1">
                <i className="bi bi-x-lg"></i>
            </div>}

        </div>

        {isEmpty && <div className="alert alert-warning" role="alert">
            Нужно делать&nbsp;
            <Link to="/">базар</Link>
        </div>}
        
        {!isEmpty && <>
        <div className="row cart-table-header mb-2 text-body-secondary">
            <div className="col col-6 col-lg-5 offset-lg-1">Товар</div>
            <div className="col col-1">Цена</div>
            <div className="col col-3 col-lg-2 text-center">Кол-во</div>
            <div className="col col-1">Стоимость</div>
            <div className="col col-1"></div>
        </div>

        {cart.cartItems.map(ci => <CartItem cartItem={ci} key={ci.id}/>)}
    </>} </>
}

function CartItem({cartItem}) {
    const {alarm ,request, updateCart} = useContext(AppContext)

    const changeQuantity = (cnt) => {
        if(cnt + cartItem.quantity <= 0) {
            alarm();
        }
        else {
            request("/api/cart/" + cartItem.productId + "?increment=" + cnt ,{
                method: "PATCH"
            }).then(updateCart).catch(alert);
        }
    };

    return <div >
        <div className="row border-bottom pb-2 mb-2">
            <div className="col col-2 col-lg-1 offset-lg-1 v-center">
                <img src={cartItem.product.imageUrl}
                className="w-100" 
                alt={cartItem.product.name} />
            </div>
            <div className="col col-4 v-center">
                {cartItem.product.name}<br />
                <span className="text-body-secondary">{cartItem.product.description}</span>
            </div>
            <div className="col col-1 v-center">{cartItem.product.price.toFixed(2)}</div>
            <div className="col col-3 col-lg-2 text-center v-center">
                <div>
                    <button 
                    onClick={() => changeQuantity(-1)}
                    className="btn btn-outline-warning me-2">-</button>
                    {cartItem.quantity}

                    <button 
                    onClick={() => changeQuantity(1)}
                    className="btn btn-outline-success ms-2">+</button>
                </div>
            </div>
            <div className="col col-1 v-center">{cartItem.price.toFixed(2)}</div>
            <div className="col col-1 v-center">
                <div>
                    <button 
                        onClick={() => changeQuantity(-cartItem.quantity)}
                        className="btn btn-outline-danger"><i className="bi bi-x-lg"></i></button>
                </div>
            </div>
        </div>
    </div>;
}
