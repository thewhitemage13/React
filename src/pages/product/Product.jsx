import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../features/context/AppContext";
import ProductCard from "../Group/ui/ProductCard";

export default function Product() {
  const { slug } = useParams();
  const { request, cart } = useContext(AppContext);

  const [info, setInfo] = useState({
    slug: "",
    product: null,
    associations: []
  });

  const excludeQuery = useMemo(() => {
    const ids = new Set(cart.cartItems.map(ci => ci.productId));
    return Array.from(ids).join(",");
  }, [cart]);

  useEffect(() => {
    request(`/api/product/${slug}?excludeIds=${encodeURIComponent(excludeQuery)}`)
      .then(setInfo)
      .catch(console.error);
  }, [slug, excludeQuery]);

  if (!info.product) return <i>Нету такого товара</i>;

  return (
    <>
      <h1>Страница товара </h1>

      <div className="row">
        <div className="col col-5">
          <img src={info.product.imageUrl} alt={info.product.name} />
        </div>

        <div className="col col-6">
          <h2>{info.product.name}</h2>
          <p>{info.product.description}</p>
          <h3>{info.product.price.toFixed(2)}</h3>
          <button className="btn btn-success">В корзину</button>
        </div>
        <div className="col col-1">Тут может быть ваша реклама</div>
      </div>

      <h3 className="mt-4">Вас также может заинтересовать</h3>

      <div className="row row-cols-6 g-2 mt-4">
        {info.associations.map(product => (
          <ProductCard product={product} key={product.id} isAssociation={true} />
        ))}
      </div>
    </>
  );
}
