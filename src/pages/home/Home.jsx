import { useContext, useState } from "react";
import AppContext from "../../feauters/context/AppContext";
import Calc from "../../widgets/calc/Calc";

export default function Home() {
    const {user} = useContext(AppContext);
    const [count, setCount] = useState(0);

    const onCountClick = () => {
        setCount(count + 1);
    }

    const onMinusClick = () => {
        if (count <= 0) return;
        setCount(count - 1);
    }

    return <div className="text-center">
        <h1 className="display-4">Крамниця</h1>
        
        <div className="row">
            <div className="col">
                <button className="btn btn-primary" onClick={onCountClick}>+1</button>
                &nbsp;
                <button className="btn btn-primary" onClick={onMinusClick}>-1</button>

                <h3>Пидсумок: {count}</h3>
                <hr />
                {!!user && <p>Приветствуем {user.name}</p>}

                <hr />
                <CountWidget count={count} setCount={setCount} /> {/* Prop Drilling */}
                <hr />
            </div>
            <div className="col">
                <Calc />

            </div>
        </div>
    </div>;
}

function CountWidget(props) { // Prop Drilling
    return <div className="border p-2 m-3">
        Ваш Пидсумок: {props.count}
        <br/>
        <br/>
        <button className="btn btn-danger" onClick={() => props.setCount(0)}>Скинуть</button>
    
    </div>
    
}