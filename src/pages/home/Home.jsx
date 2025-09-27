import { useContext, useEffect, useState } from "react";
import AppContext from "../../feauters/context/AppContext";
import Calc from "../../widgets/calc/Calc";
import "./ui/Home.css"
import { Link } from "react-router-dom";

export default function Home() {
    const {user} = useContext(AppContext);
    const [pageData, setPageData] = useState({productGroups:[]});

    useEffect(() => {
        fetch("https://localhost:7229/api/product-group")
        .then(r => r.json())
        .then(j => {
            if(j.status.isOk) {
                setPageData(j.data);
            }
            else {
                console.error(j);
            }
        })
    }, []);

    return <div>
        <div className="page-title">
            <img src={pageData.pageTitleImg} alt="pageTitleImg"/>
            <h1 className="display-4">{pageData.pageTitle}</h1>
        </div>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-4">

        {pageData.productGroups.map(grp => <div key={grp.slug} className="col">    
            <div className="card h-100">
                <Link to={"/" + grp.slug} className="nav-link">
                    <img src={grp.imageUrl} className="card-img-top" alt={grp.name}/>
                </Link>
                <div className="card-body">
                    <h5 className="card-title">{grp.name}</h5>
                    <p className="card-text">{grp.description}</p>
                </div>
            </div>
        </div>)}
        </div>
    </div>;
}