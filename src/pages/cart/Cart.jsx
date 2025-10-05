import { useContext, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../features/context/AppContext";
import "./ui/Cart.css";

export default function Cart() {
  const { cart, request, updateCart } = useContext(AppContext);
  const navigate = useNavigate();

  const isEmpty = cart.cartItems.length === 0;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const itemsCount = cart.cartItems.length;

  const pickCartTotal = (c) => {
    if (!c || typeof c !== "object") return 0;

    const candidates = [
      "total",
      "totalPrice",
      "totalAmount",
      "totalSum",
      "grandTotal",
      "sum",
      "amount",
      "price",
      "totalUAH",
      "total_uah",
    ];

    for (const k of candidates) {
      if (typeof c[k] === "number") return c[k];
      if (typeof c[k] === "string" && !isNaN(parseFloat(c[k]))) {
        return parseFloat(c[k]);
      }
    }

    const nested =
      (c.summary && (c.summary.total ?? c.summary.amount ?? c.summary.sum)) ??
      (c.totals && (c.totals.total ?? c.totals.amount ?? c.totals.sum));

    if (typeof nested === "number") return nested;
    if (typeof nested === "string" && !isNaN(parseFloat(nested))) {
      return parseFloat(nested);
    }

    return 0;
  };

  const cartTotal = useMemo(() => pickCartTotal(cart), [cart]);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  const deleteAll = async () => {
    setDeleting(true);
    try {
      await request("/api/cart", { method: "DELETE" });
      await updateCart();          
      setConfirmOpen(false);       
      try {
        navigate(0);
      } catch {
        window.location.reload();
      }
    } catch (err) {
      const msg =
        err?.status?.message ||
        err?.message ||
        "Сталася помилка під час видалення кошика.";
      setErrorNotice(msg);
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col col-11 text-center">
          <b className="display-5">Моя корзина</b>
        </div>

        {!isEmpty && (
          <div className="col col-1 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-danger"
              title="Видалити весь кошик"
              onClick={openConfirm}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        )}
      </div>

      {isEmpty && (
        <div className="alert alert-warning" role="alert">
          Нужно делать&nbsp;
          <Link to="/">базар</Link>
        </div>
      )}

      {!isEmpty && (
        <>
          <div className="row cart-table-header mb-2 text-body-secondary">
            <div className="col col-6 col-lg-5 offset-lg-1">Товар</div>
            <div className="col col-1">Цена</div>
            <div className="col col-3 col-lg-2 text-center">Кол-во</div>
            <div className="col col-1">Стоимость</div>
            <div className="col col-1"></div>
          </div>

          {cart.cartItems.map((ci) => (
            <CartItem cartItem={ci} key={ci.id} />
          ))}
        </>
      )}

      {confirmOpen && (
        <div
          className="modal-mask"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmTitle"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card-body">
              <h5 id="confirmTitle" className="mb-3">
                Підтвердження
              </h5>
              <p className="mb-3">
                Ви підтверджуєте видалення кошику з <b>{itemsCount}</b>{" "}
                товарами на <b>{Number(cartTotal || 0).toFixed(2)}</b> грн?
              </p>

              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={closeConfirm}>
                  Скасувати
                </button>
                <button
                  className="btn btn-danger"
                  onClick={deleteAll}
                  disabled={deleting}
                >
                  {deleting ? "Видалення..." : "Видалити"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorNotice && (
        <div
          className="toast-fixed toast-danger"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body d-flex justify-content-between align-items-start gap-3">
            <span>{errorNotice}</span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setErrorNotice(null)}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CartItem({ cartItem }) {
  const { alarm, request, updateCart } = useContext(AppContext);

  const changeQuantity = (cnt) => {
    if (cnt + cartItem.quantity <= 0) {
      alarm();
    } else {
      request(
        "/api/cart/" + cartItem.productId + "?increment=" + cnt,
        {
          method: "PATCH",
        }
      )
        .then(updateCart)
        .catch(alert);
    }
  };

  return (
    <div>
      <div className="row border-bottom pb-2 mb-2">
        <div className="col col-2 col-lg-1 offset-lg-1 v-center">
          <img
            src={cartItem.product.imageUrl}
            className="w-100"
            alt={cartItem.product.name}
          />
        </div>
        <div className="col col-4 v-center">
          {cartItem.product.name}
          <br />
          <span className="text-body-secondary">
            {cartItem.product.description}
          </span>
        </div>
        <div className="col col-1 v-center">
          {cartItem.product.price.toFixed(2)}
        </div>
        <div className="col col-3 col-lg-2 text-center v-center">
          <div>
            <button
              onClick={() => changeQuantity(-1)}
              className="btn btn-outline-warning me-2"
            >
              -
            </button>
            {cartItem.quantity}
            <button
              onClick={() => changeQuantity(1)}
              className="btn btn-outline-success ms-2"
            >
              +
            </button>
          </div>
        </div>
        <div className="col col-1 v-center">{cartItem.price.toFixed(2)}</div>
        <div className="col col-1 v-center">
          <div>
            <button
              onClick={() => changeQuantity(-cartItem.quantity)}
              className="btn btn-outline-danger"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
