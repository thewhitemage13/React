import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../../features/context/AppContext";
import { useContext, useState } from "react";
import "./ProductCart.css";

export default function ProductCard({ product, isAssociation }) {
  const { cart, request, updateCart } = useContext(AppContext);
  const isInCart = cart.cartItems.some((ci) => ci.productId == product.id);
  const navigate = useNavigate();

  const [addedNotice, setAddedNotice] = useState(false);
  const [authNotice, setAuthNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState({ show: false, text: "" });

  const addToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    request("/api/cart/" + product.id, { method: "POST" })
      .then(() => {
        updateCart();
        setAddedNotice(true);           
        setAuthNotice(false);
        setErrorNotice({ show: false, text: "" });
      })
      .catch((err) => {
        const code =
          err?.status?.code ??
          err?.code ??
          err?.status ??
          (typeof err === "number" ? err : undefined);

        if (code === 401 || code === 403) {
          setAuthNotice(true);
          setAddedNotice(false);
          setErrorNotice({ show: false, text: "" });
        } else {
          const text =
            err?.status?.message ||
            err?.message ||
            "Сталася помилка під час додавання товару.";
          setErrorNotice({ show: true, text });
          setAddedNotice(false);
          setAuthNotice(false);
        }
      });
  };

  const goToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/cart");
  };

  const continueShoppingClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedNotice(false);
  };

  const closeErrorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorNotice({ show: false, text: "" });
  };

  const goToLoginClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/auth/login", { state: { from: `/product/${product.slug || product.id}` } });
  };

  return (
    <>
      <div className="col">
        <Link
          to={"/product/" + (product.slug || product.id)}
          className="nav-link h-100"
        >
          <div className={"card h-100" + (isAssociation ? " association" : "")}>
            <img
              src={product.imageUrl}
              className="card-img-top"
              alt={product.name}
            />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
            </div>
            <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
              <span>₴ {product.price.toFixed(2)}</span>
              <div data-in-cart={isInCart ? "1" : "0"}>
                <button
                  onClick={goToCartClick}
                  className="in-cart btn btn-success"
                  title="У кошику"
                >
                  <i className="bi bi-cart-check"></i>
                </button>
                <button
                  onClick={addToCartClick}
                  data-product-id={product.id}
                  className="not-in-cart btn btn-outline-success"
                  title="Додати до кошика"
                >
                  <i className="bi bi-cart"></i>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {addedNotice && (
        <div className="toast-fixed toast-success" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body">
            <div className="mb-2">Товар додано до кошику. Перейти до кошику?</div>
            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm" onClick={goToCartClick}>
                До кошику
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={continueShoppingClick}
              >
                Продовжити покупки
              </button>
            </div>
          </div>
        </div>
      )}

      {authNotice && (
        <div className="toast-fixed toast-warning" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body">
            <div className="mb-2">
              Потрібна автентифікація, щоб додати товар до кошику.
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={goToLoginClick}>
                Увійти
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setAuthNotice(false)}
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      {errorNotice.show && (
        <div className="toast-fixed toast-danger" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body">
            <div className="mb-2">{errorNotice.text}</div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-outline-light btn-sm" onClick={closeErrorClick}>
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}