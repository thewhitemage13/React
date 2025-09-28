import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppContext from "../../features/context/AppContext";
import "./ui/Group.css";

import ProductCard from "./ui/ProductCard";

export default function Group() {
    const {slug} = useParams();
    const {request, productGroups} = useContext(AppContext);
    const [pageData, setPageData] = useState( { products:[] } );

    useEffect(() => {
        request("/api/product-group/" + slug)
        .then(setPageData);
    }, [slug]);

    return <>
    <h1>Раздел {pageData.name}</h1>
    <h4>{pageData.description}</h4>

    <div className="border m-2 p-2 d-flex flex-wrap">
      <div className="group-container">
        {productGroups.map(group => (
          <div key={group.id} className="group-item position-relative">
            <Link className="nav-link" to={`/group/${group.slug}`}>
              {group.imageUrl && (
                <img
                  src={group.imageUrl}
                  alt={group.name}
                  className="group-image"
                />
              )}
              <span className="group-name">{group.name}</span>
            </Link>

            <div className="tooltip-content">
              {group.description}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
        {pageData.products.map(product => 
            <ProductCard product={product} key={product.id}/>
        )}
    </div>
    </>;
}
