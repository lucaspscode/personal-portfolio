import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// Se você não tiver esta biblioteca, instale: npm install react-bootstrap-icons
import { Moon, Sun } from 'react-bootstrap-icons'; 
import logo from '../assets/img/logo.svg';
import navIcon1 from '../assets/img/whats-icon.svg';
import navIcon2 from '../assets/img/github-icon-white.svg';

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  
  // NOVO: Estado para controlar o tema
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Carrega a preferência salva no localStorage ou usa 'false' (light) como padrão
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Lógica de Scroll existente
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // NOVO: Efeito para aplicar a classe 'dark-theme' e salvar a preferência
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]); 

  // NOVO: Função para alternar o tema
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
    <Navbar expand="lg" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
            <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>
            <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Skills</Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a href="https://w.app/wxqich"><img src={navIcon1} alt="" /></a>
              <a href="https://github.com/lucaspscode"><img src={navIcon2} alt="" /></a>
            </div>
                        
            {/* Seu botão de Download CV existente */}
            <a href="https://www.linkedin.com/in/dos-passos/"><button className="vvd" onClick={() => console.log('connect')}><span>Let’s Connect</span></button></a>
         
            <button 
                className="vvd theme-toggle-btn" 
                onClick={toggleTheme}                
            >
                <span>
                    {/* Exibe o ícone e o texto corretos com base no tema atual */}
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
                    {isDarkMode}
                </span>
            </button>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}