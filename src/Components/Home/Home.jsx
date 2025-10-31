import React, {useEffect} from "react";
import './home.scss'
import backgroundImage from '../../Assets/iame.jpeg';

import Aos from 'aos'
import 'aos/dist/aos.css'

const Home = () => {

    useEffect(()=>{
        Aos.init({duration: 2000})
    }, [])

    return (
        <section className="home">
            <div className="overlay"></div>
            <img
                src={backgroundImage}
                alt="Background"
                className="background-image"
            />

            <div className="homeContent container">
                <div className="textDiv">

                  <span data-aos="fade-up" className="smallText">
                    1ère édition
                    </span>

                    <h1 data-aos="fade-up"  className="homeTitle">
                        Dakar Talent Show
                    </h1>
                </div>

            </div>


        </section>
    )
}

export  default Home