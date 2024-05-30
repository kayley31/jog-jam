import './Footer.css'
import facebook from '../images/facebook.svg'
import twitter from '../images/twitter.svg'
import instagram from '../images/instagram.svg'

function Footer() {
    return (
        <footer className='footer'>
            <ul className='footer-content'>
                <li><a className='footer-link' href="#">Terms and Conditions</a></li>
                <li><a className='footer-link' href="#">Privacy Policy</a></li>
                <li><a className='footer-link' href="#">Copyright</a></li>
            </ul>
            <div className='socials'>
                <img className='socials-icon' src={facebook} alt='facebook icon'/>
                <img className='socials-icon' src={twitter} alt='twitter icon'/>
                <img className='socials-icon' src={instagram} alt='instagram icon'/>
            </div>
        </footer>
    )
}

export default Footer;