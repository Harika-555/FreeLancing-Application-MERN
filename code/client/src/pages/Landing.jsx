import React, { useEffect } from 'react'
import '../styles/landing.css'
import {PiStudent} from 'react-icons/pi'
import {FaHandHoldingWater} from 'react-icons/fa'
import {MdHealthAndSafety} from 'react-icons/md'
import {useNavigate} from 'react-router-dom'

const Landing = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    if (localStorage.getItem("usertype") === 'freelancer'){
      navigate("/freelancer")
    } else if (localStorage.getItem("usertype") === 'client'){
      navigate("/client")
    } else if (localStorage.getItem("usertype") === 'admin'){
      navigate("/admin")
    }
  })


  return (
    <div className="landing-page">

        <div className="landing-hero">

            <div className='landing-nav'>
              <h3>SB Works</h3>
              <button onClick={()=> navigate('/authenticate')} >Sign In</button>
            </div>

            <div className="landing-hero-text">

                <h1>Empowering Freelancers. Connecting Clients. Building Futures.</h1>
                <p>Welcome to SB Works, the all-in-one platform where talent meets opportunity. Whether you're a freelancer ready to showcase your skills, or a client looking for expert help — we’ve got you covered. </p>
                <h5>🚀 Post Projects · 💼 Bid Seamlessly · 🛠️ Work Securely · 💬 Chat Instantly</h5>
                <button onClick={()=> navigate('/authenticate')}>Explore</button>
            </div>

        </div>

    </div>
  )
}

export default Landing;