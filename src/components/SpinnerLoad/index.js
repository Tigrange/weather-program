import spinner from "./spinner.gif";
import "./style.css";

export default function SpinnerLoad(){
    return (
      <div className='spinner-container'>
        <img src={spinner} alt="spinner" width="70" height="70" />
      </div>
    );
}